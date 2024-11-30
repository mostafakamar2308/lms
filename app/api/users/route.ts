import { encodeUser } from "@/auth/server/jwt";
import { hashPassword } from "@/auth/server/password";
import { db } from "@/lib/db";
import { apiError, internalError, passwordMisMatch } from "@/lib/serverErrors";
import { IUser } from "@/types";
import { NextResponse } from "next/server";
import z from "zod";

const credentials = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8).max(255),
  confirmPassword: z.string().min(8).max(255),
});
const JWTSecret = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    if (!JWTSecret) return NextResponse.next(internalError());
    const { name, email, password, confirmPassword } = credentials.parse(
      await req.json()
    );

    if (password !== confirmPassword) NextResponse.next(passwordMisMatch());

    const hasedPassword = hashPassword(password);

    const student = await db.user.create({
      data: {
        name,
        email,
        password: hasedPassword,
        role: IUser.Roles.Student,
      },
    });

    const response: IUser.LoginWithPasswordResponse = encodeUser({
      user: student,
      secret: JWTSecret,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log("[User Creation]", error);
    return NextResponse.next(internalError());
  }
}
