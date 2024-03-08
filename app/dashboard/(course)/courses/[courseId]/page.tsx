import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: { isPublished: true },
        orderBy: {
          position: "asc",
        },
      },
    },
  });
  if (!course) return redirect("/dashboard");
  return redirect(
    `/dashboard/courses/${params.courseId}/chapters/${course.chapters[0].id}`
  );
}

export default CoursePage;
