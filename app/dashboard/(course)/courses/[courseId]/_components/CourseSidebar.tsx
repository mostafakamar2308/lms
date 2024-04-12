import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import {
  Chapter,
  Course,
  Exam,
  ExamProgress,
  Question,
  UserProgress,
} from "@prisma/client";
import { redirect } from "next/navigation";
import CourseSidebarItem from "./CourseSidebarItem";
import CourseProgress from "@/components/CourseProgress";
import CourseSidebarExam from "./CourseSidebarExam";

interface CourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
      exam:
        | (Exam & {
            questions: Question[];
            examProgress: ExamProgress[];
          })
        | null;
    })[];
  };
  progressCount: number;
}
async function CourseSidebar({ course, progressCount }: CourseSidebarProps) {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto shadow-sm ">
      <div className="p-8 flex flex-col border-b ">
        <h1 className="font-semibold">{course.title}</h1>
        <div className="mt-10">
          <CourseProgress variant="success" value={progressCount} />
        </div>
      </div>
      <div className="flex flex-col w-full">
        {course.chapters.map((chapter) => (
          <>
            <CourseSidebarItem
              key={chapter.id}
              id={chapter.id}
              label={chapter.title}
              isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
              courseId={course.id}
              isLocked={!chapter.isFree && !purchase?.isActivated}
            />
            {chapter.exam && chapter.exam.questions.length > 0 && (
              <CourseSidebarExam
                key={chapter.exam.id}
                id={chapter.exam.id}
                label={`${chapter.title} exam`}
                isCompleted={chapter.exam.examProgress[0].isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase?.isActivated}
              />
            )}
          </>
        ))}
      </div>
    </div>
  );
}

export default CourseSidebar;
