import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { isValidEmail, normalizeEmail } from "@/lib/validators";

export async function POST(req: Request) {
  const { email: rawEmail, password } = await req.json();

  const email = typeof rawEmail === "string" ? normalizeEmail(rawEmail) : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 }
    );
  }

  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }

  if (typeof password !== "string" || password.length < 6) {
    return NextResponse.json(
      { error: "Password must be at least 6 characters" },
      { status: 400 }
    );
  }

  await dbConnect();

  const exists = await User.findOne({ email });
  if (exists) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 409 }
    );
  }

  const hashed = await bcrypt.hash(password, 10);

  await User.create({
    email,
    password: hashed,
    providers: ["credentials"],
  });

  return NextResponse.json({ success: true }, { status: 201 });
}
