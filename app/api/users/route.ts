import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { name, email, password } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const teacher = await db.user.create({
      data: {
        name,
        email,
        password,
        role: "student",
      },
    });
    return NextResponse.json(teacher);
  } catch (error) {
    console.log("[User Creation]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
