import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const examId = params.id;
    const { userId } = auth();
    const { questions: answers } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const exam = await db.exam.findUnique({
      where: {
        id: examId,
      },
      include: {
        questions: true,
        examProgress: {
          where: {
            userId: userId,
            examId: examId,
          },
          include: {
            grades: true,
          },
        },
      },
    });

    let grade = 0;
    exam?.questions.sort((a, b) => {
      if (a.id < b.id) {
        return -1;
      }
      if (a.id > b.id) {
        return 1;
      }
      return 0;
    });
    const answersSorted = answers.sort(
      (a: { id: string }, b: { id: string }) => {
        if (a.id < b.id) {
          return -1;
        }
        if (a.id > b.id) {
          return 1;
        }
        return 0;
      }
    );
    for (let i = 0; i < exam?.questions.length!; i++) {
      if (
        exam?.questions[i].correctAnswer! === answersSorted[i].choosenAnswer
      ) {
        grade++;
      }
    }

    if (exam?.examProgress[0]) {
      const examProgress = await db.examProgress.update({
        where: { id: exam.examProgress[0].id, examId: exam.id },
        data: {
          isCompleted: true,
        },
      });
      const newGrade = await db.grade.create({
        data: {
          examProgressId: exam.examProgress[0].id,
          grade,
          userId,
        },
      });
      return NextResponse.json({ examProgress: newGrade });
    } else {
      const examProgress = await db.examProgress.create({
        data: {
          userId,
          examId,
          isCompleted: true,
        },
      });
      const newGrade = await db.grade.create({
        data: {
          examProgressId: examProgress.id,
          grade,
          userId,
        },
      });
      return NextResponse.json({ examProgress });
    }
  } catch (error) {
    console.log("GRADE", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
