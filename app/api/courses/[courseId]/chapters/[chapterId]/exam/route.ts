import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
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
    const exam = await db.exam.upsert({
      where: {
        chapterId: params.chapterId,
      },
      create: {
        chapterId: params.chapterId,
      },
      update: {},
    });

    return NextResponse.json(exam);
  } catch (error) {
    console.log("Exam POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
