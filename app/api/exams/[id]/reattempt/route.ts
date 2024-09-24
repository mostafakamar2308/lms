import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await auth();
    const { userProgressId } = await req.json();
    const userProgress = await db.examProgress.update({
      where: {
        id: userProgressId,
      },
      data: {
        isCompleted: false,
      },
    });

    return NextResponse.json({ userProgress });
  } catch (error) {
    console.log("ReAttempt", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
