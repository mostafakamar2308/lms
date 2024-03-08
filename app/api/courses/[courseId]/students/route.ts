import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const { studentId } = await req.json();

    if (!studentId) {
      return new NextResponse("Please enter a student Id", { status: 400 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId: studentId,
          courseId: params.courseId,
        },
      },
    });

    if (purchase && !purchase?.isActivated) {
      const newPurchase = await db.purchase.update({
        where: {
          userId_courseId: {
            userId: studentId,
            courseId: params.courseId,
          },
        },
        data: {
          isActivated: true,
        },
      });
      return NextResponse.json(newPurchase);
    }
    const newPurchase = await db.purchase.create({
      data: {
        userId: studentId,
        courseId: params.courseId,
        isActivated: true,
      },
    });
    return NextResponse.json(newPurchase);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
