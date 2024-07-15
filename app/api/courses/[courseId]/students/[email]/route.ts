import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getUserId } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; email: string } }
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
      return NextResponse.json([]);
    }

    const users = await db.user.findMany({
      where: {
        email: {
          contains: params.email,
          mode: "insensitive",
        },
      },
    });

    if (users.length === 0) {
      return NextResponse.json([]);
    }

    const availableUsers = [];
    for (let user of users) {
      const purchase = await db.purchase.findUnique({
        where: {
          userId_courseId: {
            userId: user.id,
            courseId: params.courseId,
          },
          isActivated: true,
        },
      });
      if (!purchase) {
        availableUsers.push({
          id: user.id,
          imageUrl: "",
          name: user.name,
          email: user.email,
        });
      }
    }
    return NextResponse.json(availableUsers);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
