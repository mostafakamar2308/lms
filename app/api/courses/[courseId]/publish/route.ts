import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const course = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
      include: {
        chapters: {
          include: { muxData: true },
        },
      },
    });
    if (!course) {
      return new NextResponse("Not found", { status: 401 });
    }
    const hasPublishedChpaters = course.chapters.some(
      (chapter) => chapter.isPublished
    );
    if (
      !course ||
      !course.title ||
      !course.description ||
      !course.imageUrl ||
      !hasPublishedChpaters ||
      !course.categoryId
    ) {
      return new NextResponse("Missing required Field", { status: 400 });
    }
    const publishedCourse = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    return NextResponse.json(publishedCourse);
  } catch (error) {
    console.log("Course Publish", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
