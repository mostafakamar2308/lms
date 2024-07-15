import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CourseEnrollButton from "../(course-content)/chapters/[chapterId]/_components/CourseEnrollButton";
import { BookCheck, File, MonitorPlay, Video } from "lucide-react";
import { getUserId } from "@/lib/utils";

async function CoursePage({ params }: { params: { courseId: string } }) {
  const userId = await getUserId();

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: params.courseId,
      },
    },
    include: {
      course: {
        include: {
          chapters: {
            where: {
              isPublished: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
      },
    },
  });
  if (purchase?.course) {
    return redirect(
      `/dashboard/courses/${params.courseId}/chapters/${purchase.course.chapters[0].id}`
    );
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      category: {},
      attachments: {},
      chapters: {
        where: { isPublished: true },

        include: {
          exam: {
            include: {
              questions: true,
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/dashboard");
  }

  return (
    <div dir="rtl">
      <div className="w-full px-8">
        <img
          src={course?.imageUrl!}
          alt={course?.title!}
          className="aspect-video md:h-[50vh] mx-auto"
        />
      </div>
      <div className="px-12 mt-8 text-slate-700 flex justify-between flex-wrap">
        <div>
          <h1 className="text-3xl font-semibold">{course?.title}</h1>
          <Badge className="mt-2 text-lg">{course?.category?.name}</Badge>
          <p className="mt-2">{course?.description}</p>
        </div>
        <div className="border p-3 pl-10 pr-3 mt-4 md:mt-0">
          <h3 className="text-2xl">سعر الكورس:</h3>
          <div className="flex justify-center mr-7 mt-2">
            <CourseEnrollButton
              courseId={course.id!}
              price={course?.price!}
              title={course?.title!}
            />
          </div>
          <h4 className="font-medium mt-4">هذا الكورس يحتوي علي:</h4>
          <div className="flex gap-2 items-center mt-1">
            <MonitorPlay className="w-4 h-4 text-slate-700" />
            <h3>{course.chapters.length} حصة</h3>
          </div>
          <div className="flex gap-2 items-center mt-1">
            <BookCheck className="w-4 h-4 text-slate-700" />
            <h3>
              {
                course.chapters.filter(
                  (chapter) => chapter.exam && chapter.exam.questions.length > 0
                ).length
              }{" "}
              امتحان
            </h3>
          </div>
          <div className="flex gap-2 items-center mt-1">
            <File className="w-4 h-4 text-slate-700" />
            <h3>{course.attachments.length} ملف</h3>
          </div>
        </div>
      </div>
      <h2 className="text-2xl font-bold  mt-4 mr-8 text-slate-700">
        حصص الكورس:
      </h2>
      <div className="m-2 mx-8 pb-4">
        {course.chapters.map((chapter) => (
          <div
            key={chapter.id}
            className="bg-slate-100 py-4 px-2 md:w-1/2 flex items-center gap-4 rounded-lg"
          >
            <Video className="w-10 h-10 text-slate-500" />
            <div>
              <h3 className="text-2xl font-medium">{chapter.title}</h3>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CoursePage;
