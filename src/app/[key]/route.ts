import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function GET(
  req: Request,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params; // ✅ IMPORTANT FIX

  console.log("REDIRECT ROUTE HIT:", key);

  await dbConnect();

  const url = await Url.findOne({ shortKey: key });

  console.log("URL FOUND:", url?.originalUrl);

  if (!url) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (url.expiresAt && new Date(url.expiresAt) < new Date()) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.redirect(url.originalUrl);
}
