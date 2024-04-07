"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Pencil, PlusCircle, Video } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Question, Exam } from "@prisma/client";

const formSchema = z.object({
  videoUrl: z.string().min(1),
  questionHead: z.string().min(1),
  answers: z.array(z.string()).min(2),
  correctAnswer: z.string(),
});

interface ChapterQuestionFormProps {
  courseId: string;
  chapterId: string;
}

function ChapterQuestionForm({
  chapterId,
  courseId,
}: ChapterQuestionFormProps) {
  const router = useRouter();

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("Chapter Updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return <div className="mt-6 bg-slate-100 rounded-md p-4"></div>;
}

export default ChapterQuestionForm;
