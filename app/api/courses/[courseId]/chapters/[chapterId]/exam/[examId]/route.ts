import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

export async function POST(
  req: Request,
  {
    params,
  }: { params: { examId: string; courseId: string; chapterId: string } }
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
        userId: userId,
      },
    });
    if (!courseOwner) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newQuestion = await db.question.create({
      data: {
        examId: params.examId,
        questionHead: question.questionHead,
        correctAnswer: question.correctAnswer,
        answers: question.answers,
      },
    });
    return NextResponse.json(newQuestion);
  } catch (error) {
    console.log("Exam POST", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
