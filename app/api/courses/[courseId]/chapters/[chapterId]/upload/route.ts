import { NextResponse } from "next/server";

import { writeFile } from "fs/promises";
import path from "path";
import ffmpegStatic from "ffmpeg-static";
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
    // Make it on a seperate API
    transcode({ rawFilePath: outputPath, chapterId: params.chapterId });

    // TODO: change file url on the db itself

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
