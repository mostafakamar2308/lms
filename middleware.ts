import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { ApiRoutePatterns, Route } from "./types/routes";
import { decodeJwt } from "./auth/server/jwt";
import { bad } from "./lib/serverErrors";
import { db } from "./lib/db";
import axios from "axios";
import { IAuth } from "./types";

export const config = {
  matcher: ["/dashboard/**", "/api/**"],
};

const JWTSecret = process.env.JWT_SECRET;

export async function middleware(request: NextRequest) {
  if (!JWTSecret) return bad();

  if (request.nextUrl.pathname.startsWith("/api/auth"))
    return NextResponse.next();

  const cookieStore = await cookies();
  const now = new Date();

  const sessionId = cookieStore.get("sessionId")?.value;
  const deviceId = cookieStore.get("deviceId")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;

  if (!sessionId || !deviceId || !refreshToken)
    return NextResponse.redirect(new URL(Route.login, request.url));

  const payload = decodeJwt(refreshToken, JWTSecret);

  if (!payload) return NextResponse.redirect(new URL(Route.login, request.url));

  const session = await db.session.findUnique({
    where: {
      id: payload.sessionId,
    },
  });

  if (!session || session.state !== IAuth.SessionState.Active)
    return NextResponse.redirect(new URL(Route.login, request.url));

  if (session.expiresAt < new Date(now.getTime() + 1000 * 60 * 5)) {
    const response = await axios.get(ApiRoutePatterns.revalidate);
    if (response.data.success) return NextResponse.next();
    return NextResponse.redirect(new URL(Route.login, request.url));
  }

  return NextResponse.next();
}
