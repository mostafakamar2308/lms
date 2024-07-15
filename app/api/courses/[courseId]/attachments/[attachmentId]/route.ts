import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getUserId } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { courseId: string; attachmentId: string } }
) {
  try {
    const userId = await getUserId();
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
    const attachemnt = await db.attachemnt.delete({
      where: {
        courseId: params.courseId,
        id: params.attachmentId,
      },
    });
    return NextResponse.json(attachemnt);
  } catch (error) {
    console.log("COURSE_ID_ATTACHMENT DELETE", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
