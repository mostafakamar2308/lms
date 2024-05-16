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
import { clerkClient } from "@clerk/nextjs/server";

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

  const completeOnEnd = !!purchase && !userProgress?.isCompleted;

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
          <VideoPlayer
            examId={chapter.exam?.id || null}
            videoUrl={chapter.videoUrl!}
            chapterId={params.chapterId}
            title={chapter.title}
            courseId={params.courseId}
            nextChapterId={nextChapter?.id}
            isLocked={!isActivated && !chapter.isFree}
            completeOnEnd={completeOnEnd}
          />
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
