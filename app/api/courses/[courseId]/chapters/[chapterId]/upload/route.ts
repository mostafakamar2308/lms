import { NextResponse } from "next/server";

import ffmpegStatic from "ffmpeg-static";
import { v2 as cloudinary } from "cloudinary";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/lib/db";
import { unlinkSync } from "fs";

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const data = await req.formData();
    const chapterVideo: File | null = data.get(
      "chapterVideo"
    ) as unknown as File;
    if (!chapterVideo) {
      return NextResponse.json({ success: false });
    }

    const bytes = await chapterVideo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const outputPath = `./uploads/${params.chapterId}-raw${path.extname(
      chapterVideo.name
    )}`;
    await writeFile(outputPath, buffer);
    // ----------------------------------------------------------------
    // Cloudinary upload
    const file = await cloudinary.uploader
      .upload(outputPath, {
        resource_type: "video",
        public_id: params.chapterId,
      })
      .then((result) => {
        console.log(result);
        return result;
      })
      .catch((error) => {
        console.log("Some thing Has Happened");
        console.log(error);
      });
    if (file && file.secure_url) {
      const chapter = await db.chapter.update({
        where: {
          id: params.chapterId,
        },
        data: {
          videoUrl: file.secure_url,
          videoSize: file.bytes.toString(),
        },
      });
      unlinkSync(outputPath);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Chapter VIDEO UPLOAD", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

async function transcode({
  rawFilePath,
  chapterId,
}: {
  rawFilePath: string;
  chapterId: string;
}) {
  const ffmpeg = require("fluent-ffmpeg");
  console.log(ffmpegStatic);

  ffmpeg.setFfmpegPath(ffmpegStatic);
  const scaleOptions = ["scale=1280:720", "scale=640:320"];
  const videoCodec = "libx264";
  const x264Options = "keyint=24:min-keyint=24:no-scenecut";
  const videoBitrates = ["1000k", "2000k", "4000k"];

  if (!rawFilePath) {
    return NextResponse.json({ success: false });
  }

  const outputPath = `./uploads/${chapterId}-360.mp4`;

  ffmpeg()
    .input(rawFilePath)
    .videoFilters(scaleOptions)
    .videoCodec(videoCodec)
    .addOption("-x264opts", x264Options)
    .outputOptions("-b:v", videoBitrates[0])
    .format("hls")
    .output(outputPath)
    .on("end", () => {
      console.log("hls encoding complete.");
    })
    .on("error", (err: any) => {
      console.error("Error:", err.message);
    })
    .run();
}
