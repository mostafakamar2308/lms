import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { userId } = auth();
    const { title, description, imageUrl, categoryId } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    const post = await db.post.create({
      data: {
        userId,
        title,
        description,
        imageUrl,
        postCategoryId: categoryId,
      },
    });
    return NextResponse.json(post);
  } catch (error) {
    console.log("[POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
