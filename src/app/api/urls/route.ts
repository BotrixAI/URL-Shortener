import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import crypto from "crypto";

// Create new short URL
export async function POST(req: NextRequest) {
  await dbConnect();
  const token = await getToken({ req });
  const body = await req.json();

  // Ensure we only pass a valid Mongo ObjectId to userId
  const rawSub = token?.sub;
  const userId =
    rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub)) ? rawSub : null;

  const shortKey =
    token && body.customKey
      ? body.customKey
      : crypto.randomBytes(4).toString("hex");

  const exists = await Url.findOne({ shortKey });
  if (exists)
    return NextResponse.json({ error: "Short key exists" }, { status: 409 });

  const url = await Url.create({
    originalUrl: body.originalUrl,
    shortKey,
    expiresAt: body.expiresAt,
    userId,
  });

  return NextResponse.json(url);
}

// Fetch URLs (supports user history via ?mine=true&page=&size=)
export async function GET(req: NextRequest) {
  await dbConnect();

  const { searchParams } = new URL(req.url);
  const mine = searchParams.get("mine") === "true";
  const page = parseInt(searchParams.get("page") || "0", 10) || 0;
  const size = parseInt(searchParams.get("size") || "10", 10) || 10;

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
