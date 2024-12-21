import { from } from "@/prisma/schemaUtils";
import { IUser } from "@/types";
import { User } from "@prisma/client";
import jwt from "jsonwebtoken";
import z from "zod";

const jwtPayload = z.object({
  userId: z.string(),
});

export function encodeJwt(data: any, secret: string) {
  const token = jwt.sign({ data }, secret, {
    expiresIn: "7d",
  });
  return token;
}

export function decodeJwt(token: string, secret: string): string {
  const decoded = jwt.verify(token, secret);
  const { userId } = jwtPayload.parse(decoded);
  return userId;
}

export function generateRefreshToken({
  userId,
  sessionId,
  deviceId,
  secret,
}: {
  userId: string;
  sessionId: string;
  deviceId: string;
  secret: string;
}) {
  return encodeJwt({ userId, sessionId, deviceId }, secret);
}
