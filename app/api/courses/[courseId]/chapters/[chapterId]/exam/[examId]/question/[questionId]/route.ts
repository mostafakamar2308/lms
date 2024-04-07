import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; questionId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const question = await db.question.delete({
      where: {
        id: params.questionId,
      },
    });
    return NextResponse.json(question);
  } catch (error) {
    console.log("Question Delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: { params: { courseId: string; chapterId: string; questionId: string } }
) {
  try {
    const { userId } = auth();
    const { question } = await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const editedQuestion = await db.question.update({
      where: {
        id: params.questionId,
      },
      data: {
        ...question,
      },
    });
    return NextResponse.json(editedQuestion);
  } catch (error) {
    console.log("Question Delete", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
