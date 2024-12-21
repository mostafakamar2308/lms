import { generateRefreshToken } from "@/auth/server/jwt";
import { isSamePassword } from "@/auth/server/password";
import { db } from "@/lib/db";
import {
  bad,
  internalError,
  multipleDevices,
  userNotFound,
  wrongPassword,
} from "@/lib/serverErrors";
import { IAuth, IUser } from "@/types";
import { NextResponse } from "next/server";
import z from "zod";
import { cookies } from "next/headers";
import { randomUUID } from "crypto";
import { from } from "@/prisma/schemaUtils";

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const JWTSecret = process.env.JWT_SECRET;

export async function POST(req: Request) {
  try {
    if (!JWTSecret) return internalError();
    const { email, password } = credentials.parse(await req.json());
    const cookieStore = await cookies();
    const now = new Date();

    const user = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        device: {
          include: {
            session: {
              where: {
                expiresAt: {
                  lt: now,
                },
                state: IAuth.SessionState.Active,
              },
            },
          },
        },
      },
    });

    if (!user) return userNotFound();

    const isValidPassword = isSamePassword(password, user.password);

    if (!isValidPassword) return wrongPassword();

    // Checking if there is other devices than current device logged in
    /**
     * if no devices => continue
     * if devices + have same Device id => continue
     * else error
     */
    const deviceId: string | undefined = cookieStore.get("deviceId")?.value;
    let device = deviceId
      ? await db.device.findFirst({
          where: {
            id: deviceId,
          },
        })
      : null;
    if (!device && deviceId) return bad();
    if (user.device.length > 0 && user.device.some((d) => d.id !== device?.id))
      return multipleDevices();

    /**
     * revoking all active sessions on the current device to generate new one
     */
    const activeSessionsId = device
      ? user.device[0].session
          .filter((s) => s.state === IAuth.SessionState.Active)
          .map((s) => s.id)
      : [];

    if (activeSessionsId.length > 0) {
      await db.session.updateMany({
        where: {
          id: {
            in: activeSessionsId,
          },
        },
        data: {
          state: IAuth.SessionState.Revoked,
        },
      });
    }

    if (!device) {
      device = await createDevice({ userId: user.id });
    }

    const session = await db.session.create({
      data: {
        deviceId: device.id,
        userId: user.id,
        expiresAt: new Date(now.getTime() + 60 * 60 * 1000), // 60 minutes
        state: IAuth.SessionState.Active,
      },
    });

    const refreshToken = generateRefreshToken({
      sessionId: session.id,
      userId: user.id,
      deviceId: device.id,
      secret: JWTSecret,
    });

    cookieStore.set("deviceId", device.id, {
      expires: new Date().getTime() + 30 * 24 * 60 * 60 * 1000, // 30 days,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    cookieStore.set("refreshToken", refreshToken, {
      expires: new Date().getTime() + 7 * 24 * 60 * 60 * 1000, // 7 days,
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    cookieStore.set("sessionId", session.id, {
      expires: new Date().getTime() + 60 * 60 * 1000, // 60 minutes
      httpOnly: true,
      sameSite: "strict",
      secure: true,
    });

    const response: IUser.LoginWithPasswordResponse = from.user(user);

    return NextResponse.json(response);
  } catch (error) {
    console.log("[User Login]", error);
    return internalError();
  }
}

async function createDevice({ userId }: { userId: string }) {
  return await db.device.create({
    data: {
      userId,
    },
  });
}
