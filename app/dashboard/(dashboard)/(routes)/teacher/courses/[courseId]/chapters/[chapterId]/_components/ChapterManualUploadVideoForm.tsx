"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Chapter, Course, MuxData } from "@prisma/client";
import FileUploader from "@/components/FileUploader";
import { ReplayPlayerWrapper } from "@/app/dashboard/(course)/courses/[courseId]/(course-content)/chapters/[chapterId]/_components/ReplayPlayerWrapper";
import VideoUploader from "./VideoUploader";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterManualUploadVideoFormProps {
  initialData: Chapter & { muxData?: MuxData | null };
  courseId: string;
  chapterId: string;
}

function ChapterManualUploadVideoForm({
  initialData,
  chapterId,
  courseId,
}: ChapterManualUploadVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        فيديو الحصة{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ"}{" "}
          {!isEditing && !initialData.videoUrl && (
            <>
              <PlusCircle className="h-4 w-4 ml-2" />
              أضف فيديو
            </>
          )}{" "}
          {!isEditing && initialData.videoUrl && (
            <>
              <Pencil className="h-4 w-4 mr-2" />
              <>عدل الفيديو</>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.videoUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <Video className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <ReplayPlayerWrapper
              src={`/api/courses/${courseId}/chapters/${chapterId}/watch`}
              onEnd={() => {}}
            />{" "}
          </div>
        )
      ) : (
        <div>
          <VideoUploader
            initialData={initialData}
            chapterId={chapterId}
            courseId={courseId}
            finishEditing={() => {
              setIsEditing(false);
              router.refresh();
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            ارفع فيديو الحصة
          </div>
        </div>
      )}
      {initialData.videoUrl && !isEditing && (
        <div className="text-xs text-muted-foreground mt-2">
          قد يستغرق رفع الفيديو بعض الوقت، لا تعد تحميل الصفحة وانتظر قليلا
        </div>
      )}
    </div>
  );
}

export default ChapterManualUploadVideoForm;
