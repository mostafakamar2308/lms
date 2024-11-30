import { encodeUser } from "@/auth/server/jwt";
import { isSamePassword } from "@/auth/server/password";
import { db } from "@/lib/db";
import { internalError, userNotFound, wrongPassword } from "@/lib/serverErrors";
import { IUser } from "@/types";
import { NextResponse } from "next/server";
import z from "zod";
const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const JWTSecret = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    if (!JWTSecret) return NextResponse.next(internalError());
    const { email, password } = credentials.parse(await req.json());

    const user = await db.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) return NextResponse.next(userNotFound());

    const isValidPassword = isSamePassword(password, user.password);

    if (!isValidPassword) return NextResponse.next(wrongPassword());

    const response: IUser.LoginWithPasswordResponse = encodeUser({
      user,
      secret: JWTSecret,
    });

    return NextResponse.json(response);
  } catch (error) {
    console.log("[User Login]", error);
    return NextResponse.next(internalError());
  }
}
