import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    const { content } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const comment = await db.comment.create({
      data: {
        postId: params.postId,
        userId,
        content,
      },
    });

    return NextResponse.json({ comment });
  } catch (error) {
    console.log("[POST Comment]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
