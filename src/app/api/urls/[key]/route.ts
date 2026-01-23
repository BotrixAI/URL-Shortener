import { NextResponse,NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import Url from "@/models/Url";

export async function DELETE(
  req: NextRequest,
  ctx: { params: Promise<{ key: string }> }
) {
  const { key } = await ctx.params;

  const token = await getToken({ req });

  if (!token?.sub) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await dbConnect();

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
