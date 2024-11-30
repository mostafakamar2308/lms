import { from } from "@/prisma/schemaUtils";
import { IUser } from "@/types";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import z from "zod";

const jwtPayload = z.object({
  userId: z.string(),
});

export function encodeJwt(userId: string, secret: string) {
  const token = jwt.sign({ userId }, secret, {
    expiresIn: "7d",
  });
  return token;
}

export function decodeJwt(token: string, secret: string): string {
  const decoded = jwt.verify(token, secret);
  const { userId } = jwtPayload.parse(decoded);
  return userId;
}

export function encodeUser({
  user,
  secret,
}: {
  user: User;
  secret: string;
}): IUser.LoginWithPasswordResponse {
  const token = encodeJwt(user.id, secret);
  const sanitizedUser = from.user(user);
  return { user: sanitizedUser, token };
}
