import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  BookCheck,
  Eye,
  LayoutDashboard,
  Video,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import ChapterTitleForm from "./_components/ChapterTitleForm";
import ChapterDescriptionForm from "./_components/ChapterDescriptionForm";
import ChapterAccessForm from "./_components/ChapterAccessForm";
import { Banner } from "@/components/Banner";
import { ChapterActions } from "./_components/ChapterActions";
import ExamActions from "./_components/ExamActions";
import Question from "./_components/Question";
import ChapterYtVideoForm from "./_components/ChapterYtVideoForm";
import ytdl from "@distube/ytdl-core";

const ChapterPage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }
  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      muxData: true,
      exam: {
        include: {
          questions: true,
        },
      },
    },
  });
  let ytUrl: any;
  if (chapter?.videoUrl) {
    const ytVideo = await ytdl.getInfo(chapter.videoUrl);
    ytUrl = ytVideo.formats
      .filter((format) => format.hasAudio && format.hasVideo)
      .map((video) => ({ url: video.url, quality: video.qualityLabel }));
  }

  if (!chapter) {
    redirect("/");
  }
  const requiredField = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredField.length;
  const completedFields = requiredField.filter(Boolean).length;
  const completionText = `${completedFields}/${totalFields}`;
  const isCompelete = requiredField.every(Boolean);
  const hasExam = !!chapter.exam;

  return (
    <>
      {!chapter.isPublished && (
        <Banner
          variant={"warning"}
          label="هذه الحصة لم يتم نشرها، ولن تظهر لطلاب الكورس"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="w-full">
            <Link
              href={`/dashboard/teacher/courses/${params.courseId}`}
              className="flex items-center text-sm hover:opacity-75 transition mb-6 "
            >
              <ArrowLeft className="h-4 w-4 ml-2" />
              ارجع الي الكورس
            </Link>
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-y-2">
                <h1 className="text-2xl font-medium"></h1>
                {completionText !== "3/3" && (
                  <span className="text-sm text-slate-700">
                    أكمل تفاصيل الحصة {completionText}
                  </span>
                )}
                {completionText === "3/3" && (
                  <span className="text-sm text-slate-700">
                    أكملت جميع تفاصيل الحصة، ويمكنك الان نشرها
                  </span>
                )}
              </div>
              <ChapterActions
                hasExam={hasExam}
                disabled={!isCompelete}
                courseId={params.courseId}
                chapterId={params.chapterId}
                isPublished={chapter.isPublished}
              />
            </div>
          </div>
        </div>
        <div className="grid grid-col-2 md:grid-cols-2 gap-6 mt-16 ">
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-x-2 ">
                <IconBadge icon={LayoutDashboard} />
                <h2 className="text-xl">عدل تفاصيل الحصة</h2>
              </div>
              <ChapterTitleForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
              <ChapterDescriptionForm
                initialData={chapter}
                courseId={params.courseId}
                chapterId={params.chapterId}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Eye} />
              <h2 className="text-xl">صلاحيات الحصة</h2>
            </div>
            <ChapterAccessForm
              initialData={chapter}
              courseId={params.courseId}
              chapterId={params.chapterId}
            />
          </div>
          <div>
            <div className="flex items-center gap-x-2 ">
              <IconBadge icon={Video} />
              <h2 className="text-xl">أضف فيديو الحصة</h2>
            </div>
            <ChapterYtVideoForm
              ytUrls={ytUrl}
              initialData={chapter}
              chapterId={params.chapterId}
              courseId={params.courseId}
            />
          </div>
        </div>
        {hasExam && (
          <>
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-x-2 mt-4 ">
                <IconBadge icon={BookCheck} />
                <h2 className="text-xl">عدل الامتحان</h2>
              </div>
              <ExamActions
                courseId={params.courseId}
                chapterId={params.chapterId}
                examId={chapter.exam?.id!}
              />
            </div>
            {chapter.exam?.questions.map((question) => (
              <Question
                key={question.id}
                chapterId={params.chapterId}
                courseId={params.courseId}
                {...question}
              />
            ))}
          </>
        )}
      </div>
    </>
  );
};

export default ChapterPage;
