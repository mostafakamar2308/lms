import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { db } from "./lib/db";

// Notice this is only an object, not a full Auth.js instance
export default {
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials: any, request) {
        const { email, password } = credentials;

        const user = await db.user.findUnique({
          where: {
            email,
          },
        });

        if (!user) {
          return null;
        }
        const bcrypt = require("bcryptjs");
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (isValidPassword) {
          return {
            userId: user.id,
            email: user.email,
            name: user.name,
          };
        } else {
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
