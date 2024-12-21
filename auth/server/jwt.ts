import jwt from "jsonwebtoken";
import z from "zod";

const jwtPayload = z.object({
  userId: z.string(),
  sessionId: z.string(),
  deviceId: z.string(),
});

export function encodeJwt(data: any, secret: string) {
  const token = jwt.sign({ data }, secret, {
    expiresIn: "7d",
  });
  return token;
}

export function decodeJwt(token: string, secret: string) {
  try {
    const decoded = jwt.verify(token, secret);
    const payload = jwtPayload.parse(decoded);
    return payload;
  } catch (error) {
    return null;
  }
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
