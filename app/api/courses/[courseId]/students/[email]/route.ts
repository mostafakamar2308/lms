import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth, clerkClient } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { courseId: string; email: string } }
) {
  try {
    const { userId } = auth();
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

    const users = await clerkClient.users.getUserList({
      query: params.email,
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
          imageUrl: user.imageUrl,
          name: `${user.firstName} ${user.lastName || ""}`,
          email: user.emailAddresses[0].emailAddress,
        });
      }
    }
    return NextResponse.json(availableUsers);
  } catch (error) {
    console.log("[STUDENTS_GET]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
