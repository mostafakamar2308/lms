import { db } from "@/lib/db";
import { getUserId } from "@/lib/utils";
import { NextResponse } from "next/server";
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = await getUserId();
    const { userProgressId } = await req.json();
    const userProgress = await db.examProgress.update({
      where: {
        id: userProgressId,
      },
      data: {
        isCompleted: false,
      },
    });
    console.log(userProgress);

    return NextResponse.json({ userProgress });
  } catch (error) {
    console.log("ReAttempt", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
