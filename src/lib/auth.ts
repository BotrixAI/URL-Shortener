import type { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";

import dbConnect from "@/lib/mongodb";
import User from "@/models/User";
import { normalizeEmail } from "@/lib/validators";

export const authOptions: AuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
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

        const email = normalizeEmail(credentials.email);
        await dbConnect();
        const dbUser = await User.findOne({ email });

        if (!dbUser || !dbUser.password) return null;

        const ok = await bcrypt.compare(credentials.password, dbUser.password);
        if (!ok) return null;

        return {
          id: dbUser._id.toString(),
          email: dbUser.email,
        };
      },

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

      const email = normalizeEmail(user.email);
      let dbUser = await User.findOne({ email });

      if (!dbUser) {
        await User.create({
          email,
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
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = String(user.id);
        return token;
      }

      const rawSub = token.sub;
      if (rawSub && /^[0-9a-fA-F]{24}$/.test(String(rawSub))) {
        return token;
      }

      if (!token.email) return token;

      await dbConnect();
      const dbUser = await User.findOne({ email: token.email });
      if (dbUser?._id) {
        token.sub = dbUser._id.toString();
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
};
