import { getChapter } from "@/actions/getChapter";
import { Banner } from "@/components/Banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/Preview";
import { File, Lock } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";
import { Button } from "@/components/ui/button";
import ytdl from "ytdl-core";

async function Page({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const clerk = auth();
  const { userId } = clerk;
  if (!userId) redirect("/");

  const { chapter, course, attachements, nextChapter, userProgress, purchase } =
    await getChapter({
      userId,
      chapterId: params.chapterId,
      courseId: params.courseId,
    });

  if (!course || !chapter) {
    return redirect("/");
  }

  const isPurchased = purchase;
  const isActivated = !!purchase?.isActivated;
  const ytVideo = await ytdl.getInfo(chapter.videoUrl!);

  const ytUrl = ytVideo.formats
    .filter((format) => format.audioCodec && format.videoCodec)
    .map((video) => ({ url: video.url, quality: video.qualityLabel }));

  const isLocked = !isActivated && !chapter.isFree;

  return (
    <div className="pt-20">
      {userProgress?.isCompleted && (
        <Banner label="لقد أنهيت بالفعل مشاهدة الحصة" variant={"success"} />
      )}
      {!isPurchased && (
        <Banner
          label="يجب أن تشتري الكورس حتي تستطيع مشاهدة الحصة"
          variant={"warning"}
        />
      )}
      {isPurchased && !isActivated && (
        <Banner
          label="ننتظر تفعيل اشتراكك من الادمنز، برجاء الانتظار"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          {isLocked ? (
            <div className="relative aspect-video">
              {isLocked && (
                <div className=" absolute inset-0 flex items-center justify-center bg-slate-800 flex-col gap-y-2 text-secondary">
                  <Lock className="h-8 w-8" />
                  <p className="text-sm">This chapter is locked</p>
                </div>
              )}
            </div>
          ) : (
            <VideoPlayer
              examId={chapter.exam?.id || null}
              chapterId={params.chapterId}
              courseId={params.courseId}
              nextChapterId={nextChapter?.id}
              isLocked={isLocked}
              ytUrl={ytUrl}
            />
          )}
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {!isPurchased ? (
            <CourseEnrollButton
              title={course.title}
              courseId={params.courseId}
              price={course.price!}
            />
          ) : purchase?.isActivated ? (
            <>
              <CourseProgressButton
                examId={chapter.exam?.id || null}
                chapterId={params.chapterId}
                courseId={params.courseId}
                nextChapterId={nextChapter?.id}
                isCompleted={!!userProgress?.isCompleted}
              />
            </>
          ) : (
            <Button disabled={true}>Waiting for activation</Button>
          )}
        </div>
        <Separator />
        <div>
          <Preview value={chapter.description!} />
        </div>
        {isPurchased && isActivated && !!attachements?.length && (
          <>
            <Separator />
            <div className="p-4">
              {attachements.map((attachment) => (
                <a
                  className="flex items-center p-3 w-full bg-sky-200 border text-sky-700 rounded-md hover:underline"
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                >
                  <File />
                  <p className="line-clamp-1 ">{attachment.name}</p>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Page;
