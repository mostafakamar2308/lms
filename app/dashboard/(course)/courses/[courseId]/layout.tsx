import { getProgress } from "@/actions/getProgress";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { ReactNode, Suspense } from "react";
import CourseSidebar from "./_components/CourseSidebar";
import CourseNavBar from "./_components/CourseNavBar";
import Loading from "./loading";
import { clerkClient } from "@clerk/nextjs/server";
import limitSession from "@/actions/limitSession";

async function CourseLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { courseId: string };
}) {
  const clerk = auth();

  const { userId, sessionId } = clerk;
  if (!userId) return redirect("/");
  const isAllowed = await limitSession(userId, sessionId);
  if (!isAllowed) return redirect("/");

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          exam: {
            include: {
              questions: true,
              examProgress: {
                where: {
                  userId,
                },
              },
            },
          },
          userProgress: {
            where: {
              userId,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) redirect("/");
  const progressCount = await getProgress(userId, course.id);
  return (
    <div className="h-full" dir="rtl">
      <div className="h-[80px] md:pr-80 w-full fixed inset-y-0 z-50 ">
        <CourseNavBar course={course} progressCount={progressCount} />
      </div>
      <div className="hidden md:flex h-full w-80 flex-col fixed inset-y-0 z-50">
        <CourseSidebar course={course} progressCount={progressCount} />
      </div>
      <main className="md:pr-80 h-full">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
}

export default CourseLayout;
