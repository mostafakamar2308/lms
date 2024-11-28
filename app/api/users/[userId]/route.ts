import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = auth();
    const { name, email, password, image, phoneNumber } = await req.json();

    if (!userId || userId !== params.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const teacher = await db.user.update({
      where: { id: params.userId },
      data: {
        name,
        email,
        password,
        image,
        phoneNumber,
      },
    });
    return NextResponse.json(teacher);
  } catch (error) {
    console.log("[POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
