import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import Question from "./_components/Question";
import QuestionGroup from "./_components/QuestionGroup";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import NewAttempt from "./_components/NewAttempt";

async function Page({
  params,
}: {
  params: { courseId: string; examId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const course = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
  });

  if (!course) {
    return redirect("/");
  }
  const exam = await db.exam.findUnique({
    where: {
      id: params.examId,
    },
    include: {
      questions: true,
      examProgress: {
        where: {
          userId,
        },
        include: {
          grades: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      },
    },
  });
  if (!exam || exam.questions.length === 0) {
    return redirect("/dashboard");
  }
  const highestGrade = exam.examProgress[0]?.isCompleted
    ? exam.examProgress[0].grades
        .map((grade) => grade)
        .sort((a, b) => b.grade - a.grade)[0].grade
    : 0;
  const currentChapter = await db.chapter.findUnique({
    where: {
      id: exam.chapterId,
      isPublished: true,
    },
  });
  const nextChapter = await db.chapter.findFirst({
    where: {
      courseId: currentChapter?.courseId,
      isPublished: true,
      position: {
        gt: currentChapter?.position,
      },
    },
    orderBy: {
      position: "asc",
    },
  });

  return (
    <div className="pt-20">
      {exam.examProgress[0]?.isCompleted && (
        <div className="p-8 grid space-y-8">
          <div className="flex items-center gap-10 justify-between px-8">
            <h3 className="text-4xl text-emerald-700 font-semibold">درجتك </h3>
            <div
              data-progress={exam.examProgress[0].grades[0].grade}
              id="circle-grade"
              data-total-score={exam.questions.length}
              style={
                {
                  "--progress": `${
                    (exam.examProgress[0].grades[0].grade /
                      exam.questions.length) *
                    360
                  }deg`,
                } as React.CSSProperties
              }
            >
              {" "}
              {exam.examProgress[0].grades[0].grade} / {exam.questions.length}
            </div>
          </div>
          <div className="flex items-center gap-10 justify-between px-8">
            <h3 className="text-4xl text-emerald-700 font-semibold">
              أعلي درجاتك
            </h3>
            <div
              data-progress={highestGrade}
              id="circle-grade"
              data-total-score={exam.questions.length}
              style={
                {
                  "--progress": `${
                    (highestGrade / exam.questions.length) * 360
                  }deg`,
                } as React.CSSProperties
              }
            >
              {" "}
              {highestGrade} / {exam.questions.length}
            </div>
          </div>
          <div className="flex justify-center space-x-4 gap-4">
            <NewAttempt userProgress={exam.examProgress[0]} />{" "}
            {nextChapter && (
              <Button className="px-8 py-6 text-lg">
                <Link
                  href={`/dashboard/courses/${nextChapter?.courseId}/chapters/${nextChapter?.id}`}
                >
                  اذهب الي الحصة التالية
                </Link>
              </Button>
            )}
          </div>
        </div>
      )}
      {!exam.examProgress[0]?.isCompleted && (
        <QuestionGroup
          examId={exam.id}
          questions={exam.questions.map((question) => ({
            questionHead: question.questionHead,
            answers: question.answers,
            id: question.id,
          }))}
        />
      )}
    </div>
  );
}

export default Page;
