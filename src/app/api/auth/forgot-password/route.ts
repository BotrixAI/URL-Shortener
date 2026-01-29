import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { sendResetEmail } from "@/lib/email";
import { isValidEmail, normalizeEmail } from "@/lib/validators";

export async function POST(req: Request) {
  const { email: rawEmail } = await req.json();
  const email = typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";

  if (!email || !isValidEmail(email)) {
    return NextResponse.json({ ok: true });
  }

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

  try {
    await sendResetEmail(email, token);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Failed to send reset email:", error);
    }
  }

  return NextResponse.json({ success: true });
}
