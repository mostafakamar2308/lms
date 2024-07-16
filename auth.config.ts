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
        try {
          if (!email || !password) {
            throw new Error("Please enter your credentials");
          }

          const user = await db.user.findUnique({
            where: {
              email,
            },
          });

          if (!user) {
            throw new Error("لا يوجد حساب لهذا البريد الالكترونى");
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
            throw new Error("الرقم السرى خاطىء");
          }
        } catch (error) {
          console.log(error);
          return null;
        }
      },
    }),
  ],
} satisfies NextAuthConfig;
