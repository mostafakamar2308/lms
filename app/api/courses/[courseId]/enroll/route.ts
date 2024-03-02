import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const purchase = await db.purchase.create({
      data: {
        courseId: params.courseId,
        userId: userId,
      },
    });
    return NextResponse.json(purchase);
  } catch (error) {
    console.log("[COURSE ENROLL]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
