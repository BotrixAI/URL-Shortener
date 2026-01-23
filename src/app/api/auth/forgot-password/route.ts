import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const { email } = await req.json();
  await dbConnect();

  const user = await User.findOne({
  email,
  providers: { $in: ["credentials"] },
});


  // Avoid email probing
  if (!user) {
    console.log(`Password reset requested for non-existing user: ${email}`);
    return NextResponse.json({ ok: true });
  }

  const token = crypto.randomBytes(32).toString("hex");

  user.resetToken = crypto.createHash("sha256").update(token).digest("hex");
  user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000);
  await user.save();

  // ✅ DEV ONLY: log reset link
  console.log(
    `RESET LINK → ${process.env.NEXTAUTH_URL}/reset-password?token=${token}`
  );

  return NextResponse.json({ success: true });
}
