import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import crypto from "crypto";
import {
  isValidShortKey,
  isValidUrl,
  normalizeShortKey,
  parseExpiryDate,
} from "@/lib/validators";

// Create new short URL
export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req });
  const body = await req.json().catch(() => null);
  if (!body || typeof body.originalUrl !== "string") {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  const originalUrl = body.originalUrl.trim();
  if (!isValidUrl(originalUrl)) {
    return NextResponse.json({ error: "Invalid URL" }, { status: 400 });
  }

  // Ensure we only pass a valid Mongo ObjectId to userId
  const rawSub = token?.sub;
  const userId =
    rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub)) ? rawSub : null;

  const customKey =
    typeof body.customKey === "string" ? normalizeShortKey(body.customKey) : "";
  if (customKey && !isValidShortKey(customKey)) {
    return NextResponse.json({ error: "Invalid custom key" }, { status: 400 });
  }

  const shortKey = customKey || crypto.randomBytes(4).toString("hex");

  const exists = await Url.findOne({ shortKey });
  if (exists)
    return NextResponse.json({ error: "Short key exists" }, { status: 409 });

  let expiresAt: Date | undefined;
  if (userId && body.expiresAt) {
    const parsed = parseExpiryDate(body.expiresAt);
    if (!parsed) {
      return NextResponse.json(
        { error: "Invalid expiry date" },
        { status: 400 }
      );
    }
    expiresAt = parsed;
  } else if (!userId) {
    expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  }

  const url = await Url.create({
    originalUrl,
    shortKey,
    expiresAt,
    userId,
  });

  return NextResponse.json(url);
}

// Fetch URLs (supports user history via ?mine=true&page=&size=)
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "true";
  const rawPage = Number.parseInt(searchParams.get("page") || "0", 10);
  const rawSize = Number.parseInt(searchParams.get("size") || "10", 10);
  const page = Number.isFinite(rawPage) ? Math.max(rawPage, 0) : 0;
  const size = Number.isFinite(rawSize)
    ? Math.min(Math.max(rawSize, 1), 50)
    : 10;

  const filter: Record<string, unknown> = {};

  if (mine) {
    const token = await getToken({ req });
    const rawSub = token?.sub;
    const userId =
      rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub)) ? rawSub : null;

    if (!userId) {
      return NextResponse.json(
        { urls: [], totalPages: 1 },
        { status: 200 }
      );
    }

    filter.userId = userId;
  }

  const total = await Url.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(total / size));

  const urls = await Url.find(filter)
    .sort({ createdAt: -1 })
    .skip(page * size)
    .limit(size)
    .lean();

  return NextResponse.json({
    content: urls,
    totalPages,
  });
}
