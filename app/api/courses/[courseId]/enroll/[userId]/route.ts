import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; userId: string } }
) {
  try {
    const { accept } = await req.json();
    const { userId: courseOwnerId } = auth();

    if (!courseOwnerId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: courseOwnerId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("No course", { status: 404 });
    }

    const purchase = await db.purchase.update({
      where: {
        userId_courseId: { userId: params.userId, courseId: params.courseId },
      },
      data: {
        isActivated: accept,
      },
    });
    if (!purchase) {
      throw new Error("There was no Enrollment");
    }
    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[COURSE done]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
