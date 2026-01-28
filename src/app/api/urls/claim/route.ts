import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function POST(req: NextRequest) {
  await dbConnect();

  const token = await getToken({ req });
  const rawSub = token?.sub;
  const userId =
    rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub)) ? rawSub : null;

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const shortKeys = Array.isArray(body?.shortKeys) ? body.shortKeys : [];

  if (shortKeys.length === 0) {
    return NextResponse.json({ updated: 0 });
  }

  const result = await Url.updateMany(
    { shortKey: { $in: shortKeys }, userId: null },
    { $set: { userId } }
  );

  return NextResponse.json({ updated: result.modifiedCount || 0 });
}

