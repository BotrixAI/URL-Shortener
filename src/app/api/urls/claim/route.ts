import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import { isValidShortKey, normalizeShortKey } from "@/lib/validators";

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  const rawSub = token?.sub;
  const userId =
    rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub)) ? rawSub : null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => null);
  const shortKeys: unknown[] = Array.isArray(body?.shortKeys)
    ? body.shortKeys
    : [];
  const normalized = shortKeys
    .filter((key): key is string => typeof key === "string")
    .map((key) => normalizeShortKey(key))
    .filter((key) => isValidShortKey(key));

  if (normalized.length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  const result = await Url.updateMany(
    { shortKey: { $in: normalized }, userId: null },
    { $set: { userId } }
  );

  return NextResponse.json({ updated: result.modifiedCount || 0 });
}

