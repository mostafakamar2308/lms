import { getChapter } from "@/actions/getChapter";
import { Banner } from "@/components/Banner";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import VideoPlayer from "./VideoPlayer";
import CourseEnrollButton from "./_components/CourseEnrollButton";
import { Separator } from "@/components/ui/separator";
import { Preview } from "@/components/Preview";
import { File } from "lucide-react";
import CourseProgressButton from "./_components/CourseProgressButton";
import { Button } from "@/components/ui/button";

async function Page({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const {
    chapter,
    course,
    muxData,
    attachements,
    nextChapter,
    userProgress,
    purchase,
  } = await getChapter({
    userId,
    chapterId: params.chapterId,
    courseId: params.courseId,
  });
  console.log(chapter?.videoUrl);

  if (!course || !chapter) {
    return redirect("/");
  }

  const isPurchased = purchase;
  const isActivated = !!purchase?.isActivated;

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

  return (
    <div className="pt-20">
      {userProgress?.isCompleted && (
        <Banner
          label="You already completed this chapter"
          variant={"success"}
        />
      )}
      {!isPurchased && (
        <Banner
          label="You need to purchase this course to watch this chapter"
          variant={"warning"}
        />
      )}
      {isPurchased && !isActivated && (
        <Banner
          label="Wait for Activating this course from the admins"
          variant={"warning"}
        />
      )}
      <div className="flex flex-col max-w-4xl mx-auto pb-20">
        <div className="p-4">
          <VideoPlayer
            videoUrl={chapter.videoUrl!}
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            playbackId={muxData?.playbackId!}
            isLocked={!isActivated && !chapter.isFree}
            completeOnEnd={completeOnEnd}
          />
        </div>
        <div className="p-4 flex flex-col md:flex-row items-center justify-between">
          <h2 className="text-2xl font-semibold mb-2">{chapter.title}</h2>
          {!isPurchased ? (
            <CourseEnrollButton
              courseId={params.courseId}
              price={course.price!}
            />
          ) : purchase?.isActivated ? (
            <>
              <CourseProgressButton
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
