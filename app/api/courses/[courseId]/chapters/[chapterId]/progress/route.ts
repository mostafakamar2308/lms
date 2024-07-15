import { db } from "@/lib/db";
import { getUserId } from "@/lib/utils";
import { NextResponse } from "next/server";

export async function PUT(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const userId = await getUserId();
    const { isCompleted } = await req.json();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const userProgress = await db.userProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: params.chapterId,
        },
      },
      update: {
        isCompleted,
      },
      create: {
        userId,
        chapterId: params.chapterId,
        isCompleted,
      },
    });
    return NextResponse.json(userProgress);
  } catch (error) {
    console.log("Chapter_Progress_PUT", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
