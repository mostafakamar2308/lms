"use client";

import { Button } from "@/components/ui/button";
import { Chapter } from "@prisma/client";
import axios from "axios";
import { ChangeEvent, FormEventHandler, useState } from "react";
import toast from "react-hot-toast";

interface VideoUploaderProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  finishEditing: () => void;
}

function VideoUploader({
  finishEditing,
  initialData,
  courseId,
  chapterId,
}: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    setIsDisabled(true);
    const formData = new FormData();

    if (!file) {
      toast.error("من فضلك اختر فيديو الحصة");
      return;
    }
    formData.append("chapterVideo", file);
    const response = await axios.post(
      `/api/courses/${courseId}/chapters/${chapterId}/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          const progress = (progressEvent.loaded / progressEvent.total!) * 100;
          setProgress(+progress.toFixed(2));
        },
        onDownloadProgress: (progressEvent) => {
          const progress =
            50 + (progressEvent.loaded / progressEvent.total!) * 100;
          console.log(progress);
          setProgress(progress);
        },
      }
    );
    if (response.data.success === true) {
      setFile(null);
      toast.success("تم رفع الحصة بنجاح");
      finishEditing();
    } else {
      setFile(null);
      toast.error("حدث خطا أثناء عملية الرفع");
    }
    setIsDisabled(false);
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          name="chapter"
          accept="video/*"
          onChange={onChange}
        />
        <Button disabled={isDisabled}>رفع الفيديو</Button>
      </form>
      {progress > 0 && progress !== 100 && <div>{progress}/100%</div>}
      {progress === 100 && <div>Processing The video...</div>}
    </>
  );
}

export default VideoUploader;
