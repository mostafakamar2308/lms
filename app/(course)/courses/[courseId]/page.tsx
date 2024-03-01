import { db } from "@/lib/db";
import { redirect } from "next/navigation";

async function CoursePage({ params }: { params: { courseId: string } }) {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
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
  if (!course) redirect("/");
  return redirect(
    `/courses/${params.courseId}/chapters/${course.chapters[0].id}`
  );
}

export default CoursePage;
