import NextAuth from "next-auth";

import { PrismaAdapter } from "@auth/prisma-adapter";
import { db } from "./lib/db";
import authConfig from "@/auth.config";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    // maxAge: 24 * 60 * 60, // 24 hours
    // updateAge: 15 * 60, // 15 min
  },

  callbacks: {
    jwt({ token }) {
      return token;
    },
    session({ session, token }) {
      if (token.sub && session.user) {
        session.user.userId = token.sub;
      }
      return session;
    },
  },
  ...authConfig,
});
