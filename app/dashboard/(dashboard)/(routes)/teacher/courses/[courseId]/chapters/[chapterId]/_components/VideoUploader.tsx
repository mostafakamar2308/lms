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
}

function VideoUploader({
  initialData,
  courseId,
  chapterId,
}: VideoUploaderProps) {
  const [file, setFile] = useState<File | null>(null);

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const onSubmit = async (e: any) => {
    e.preventDefault();
    const formData = new FormData();

    if (file) {
      formData.append("chapterVideo", file);
      const response = await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data);
      if (response.data.success === true) {
        setFile(null);
        toast.success("تم رفع الحصة بنجاح");
      }
    } else {
      toast.error("من فضلك اختر فيديو الحصة");
    }
  };
  return (
    <form onSubmit={onSubmit}>
      <input type="file" name="chapter" accept="video/*" onChange={onChange} />
      <Button>رفع الفيديو</Button>
    </form>
  );
}

export default VideoUploader;
