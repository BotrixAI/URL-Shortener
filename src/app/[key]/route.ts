import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";
import { isValidShortKey, isValidUrl, normalizeShortKey } from "@/lib/validators";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key: rawKey } = await ctx.params;
  const key = normalizeShortKey(rawKey);

  await dbConnect();

  if (!isValidShortKey(key)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const url = await Url.findOne({ shortKey: key });

  if (!url) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isValidUrl(url.originalUrl)) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(url.originalUrl);
}
