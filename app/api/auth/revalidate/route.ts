import { decodeJwt, generateRefreshToken } from "@/auth/server/jwt";
import { clearAuthCookies, cookieSetter } from "@/lib/cookiesHandler";
import { db } from "@/lib/db";
import { bad, internalError, invalidToken } from "@/lib/serverErrors";
import { IAuth } from "@/types";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

const JWTSecret = process.env.JWT_SECRET;

// Regenerate new session from the token
export async function GET(req: NextRequest) {
  try {
    if (!JWTSecret) return internalError();
    const cookieStore = await cookies();

    const sessionId = cookieStore.get("sessionId")?.value;
    const deviceId = cookieStore.get("deviceId")?.value;
    const refreshToken = cookieStore.get("refreshToken")?.value;

    if (!sessionId || !refreshToken || !deviceId) return bad();

    const payload = decodeJwt(refreshToken, JWTSecret);
    if (!payload) {
      clearAuthCookies(cookieStore);
      return invalidToken();
    }

    if (sessionId !== payload.sessionId || deviceId !== payload.deviceId)
      return bad();

    const session = await db.session.update({
      where: {
        id: sessionId,
      },
      data: {
        state: IAuth.SessionState.Revoked,
      },
    });

    if (!session) return bad();

    const newSession = await db.session.create({
      data: {
        deviceId: session.deviceId,
        userId: session.userId,
        expiresAt: new Date(new Date().getTime() + 60 * 60 * 1000), // 60 minutes
        state: IAuth.SessionState.Active,
      },
    });
    const newRefreshToken = generateRefreshToken({
      sessionId: newSession.id,
      userId: newSession.id,
      deviceId: deviceId,
      secret: JWTSecret,
    });

    cookieSetter({
      store: cookieStore,
      key: "sessionId",
      value: newSession.id,
      expiresAt: new Date().getTime() + 60 * 60 * 1000, // 60 minutes
    });

    cookieSetter({
      store: cookieStore,
      key: "refreshToken",
      value: newRefreshToken,
      expiresAt: new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // 7 days,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("[Revalidate Token]", error);
    return internalError();
  }
}
