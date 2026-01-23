import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const { token, password } = await req.json();
  await dbConnect();

  const hashed = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    resetToken: hashed,
    resetTokenExpiry: { $gt: new Date() },
  });

  if (!user)
    return NextResponse.json({ error: "Invalid or expired token" }, { status: 400 });

  user.password = await bcrypt.hash(password, 10);
  user.resetToken = undefined;
  user.resetTokenExpiry = undefined;

  await user.save();
  return NextResponse.json({ success: true });
}
