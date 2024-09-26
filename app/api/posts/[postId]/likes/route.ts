import { db } from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    const { action } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (action === "increment") {
      await db.like.create({
        data: {
          postId: params.postId,
          userId,
        },
      });
    } else {
      await db.like.delete({
        where: { userId_postId: { userId, postId: params.postId } },
      });
    }
    return NextResponse.json({ sucess: true });
  } catch (error) {
    console.log("[POST LIKE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
