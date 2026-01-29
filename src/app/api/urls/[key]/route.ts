import { NextResponse, NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import { isValidShortKey, normalizeShortKey } from "@/lib/validators";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key: rawKey } = await ctx.params;
  const key = normalizeShortKey(rawKey);

  const token = await getToken({ req });

  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!isValidShortKey(key)) {
    return NextResponse.json({ error: "Invalid short key" }, { status: 400 });
  }

  await dbConnect();

  if (!mongoose.isValidObjectId(token.sub)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userObjectId = new mongoose.Types.ObjectId(token.sub);

  const result = await Url.deleteOne({
    shortKey: key,
    userId: userObjectId, // ✅ correct type
  });

  if (result.deletedCount === 0) {
    return NextResponse.json(
      { error: "URL not found or not owned by user" },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
