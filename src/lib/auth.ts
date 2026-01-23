import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    // 🔐 Credentials
    Credentials({
      name: "Credentials",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "Email",
        },
        password: {
          label: "Password",
          type: "password",
        },
      },
      async authorize(credentials) {
  if (!credentials?.email || !credentials?.password) return null;

  await dbConnect();
  const dbUser = await User.findOne({ email: credentials.email });

  if (!dbUser || !dbUser.password) return null;

  const ok = await bcrypt.compare(credentials.password, dbUser.password);
  if (!ok) return null;

  return {
    id: dbUser._id.toString(),
    email: dbUser.email,
  };
}

    }),

    // 🌐 Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // 🌐 GitHub OAuth
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],

callbacks: {
  async signIn({ user, account }) {
    if (!user.email || !account) return false;
    await dbConnect();

    let dbUser = await User.findOne({ email: user.email });

    if (!dbUser) {
      await User.create({
        email: user.email,
        providers: [account.provider],
      });
    } else {
      if (!dbUser.providers) dbUser.providers = [];

      if (!dbUser.providers.includes(account.provider)) {
        dbUser.providers.push(account.provider);
        await dbUser.save();
      }
    }

    return true;
  },
}



};
