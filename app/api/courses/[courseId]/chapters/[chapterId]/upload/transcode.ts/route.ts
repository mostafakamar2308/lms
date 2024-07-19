import { NextResponse } from "next/server";

import { readFile, writeFile } from "fs/promises";
import path from "path";
import ffmpeg from "fluent-ffmpeg";
import ffmpegStatic from "ffmpeg-static";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { rawFilePath } = await req.json();
    console.log({ rawFilePath });

    ffmpeg.setFfmpegPath(ffmpegStatic!);
    const scaleOptions = ["scale=1280:720", "scale=640:320"];
    const videoCodec = "libx264";
    const x264Options = "keyint=24:min-keyint=24:no-scenecut";
    const videoBitrates = ["1000k", "2000k", "4000k"];

    if (!rawFilePath) {
      return NextResponse.json({ success: false });
    }

    const outputPath = `./uploads/${params.chapterId}-360.mp4`;

    ffmpeg()
      .input(rawFilePath)
      .videoFilters(scaleOptions)
      .videoCodec(videoCodec)
      .addOption("-x264opts", x264Options)
      .outputOptions("-b:v", videoBitrates[0])
      .format("hls")
      .output(outputPath)
      .on("end", () => {
        console.log("DASH encoding complete.");
      })
      .on("error", (err) => {
        console.error("Error:", err.message);
      })
      .run();
    // TODO: change file url on the db itself

    return NextResponse.json({ success: true });
  } catch (error) {
    console.log("Chapter VIDEO UPLOAD", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
