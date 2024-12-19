import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { isTeacher } from "@/lib/teacher";

export async function DELETE(
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
        chapters: {},
      },
    });
    if (!course) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const deletedCourse = await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json(deletedCourse);
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const values = await req.json();
    if (!userId || !isTeacher(userId)) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    let isFreeProp = null;
    if (values.price || values.price === 0) {
      values.price === 0 ? (isFreeProp = true) : (isFreeProp = false);
      const course = await db.course.update({
        where: {
          id: courseId,
          userId,
        },
        data: {
          ...values,
          isFree: isFreeProp,
        },
      });
    } else {
      const course = await db.course.update({
        where: {
          id: courseId,
          userId,
        },
        data: {
          ...values,
        },
      });
    }

    return NextResponse.json({ message: "Course updated successfully" });
  } catch (error) {
    console.log("[COURSE_ID]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
