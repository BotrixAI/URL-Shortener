import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
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
