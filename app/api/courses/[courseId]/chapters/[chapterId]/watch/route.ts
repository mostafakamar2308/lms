import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

// Beware that there is a problem due to cache that if you changed the video URL it will still show the old one for sometime

export async function GET(
  req: Request,
  { params }: { params: { chapterId: string; courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      throw new Error("userId is required");
    }
    const range = req.headers.get("range");
    if (!range) {
      throw new Error("No range specified");
    }
    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
      },
    });
    if (!chapter) {
      throw new Error("chapter not Found");
    }

    const videoPath = chapter?.videoUrl;
    const videoSize = chapter?.videoSize && +chapter?.videoSize;
    if (!videoPath || !videoSize) {
      throw new Error("chapter isn't published");
    }

    const CHUNK_SIZE = 10 ** 6;
    const start = Number(range.replace(/\D/g, "")) || 0;
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);
    const contentLength = end - start + 1;

    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength.toString(),
      "Content-Type": "video/mp4",
    };

    const videoStream = await fetch(videoPath, {
      headers: {
        Range: `bytes=${start}-${end}`,
      },
    });

    if (!videoStream.ok) {
      return new NextResponse("Failed to fetch video stream", { status: 500 });
    }

    const readableStream = videoStream.body;

    const response = new NextResponse(readableStream, {
      headers: headers,
      status: 206,
    });

    return response;
  } catch (error) {
    console.log(error);
    return new NextResponse("An error has occurred", { status: 500 });
  }
}
