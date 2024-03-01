"use client";

import { Button } from "@/components/ui/button";
import { useConfettiStore } from "@/hooks/use-confetti-store";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  chapterId: string;
  courseId: string;
  nextChapterId?: string;
  isCompleted?: boolean;
}
function CourseProgressButton({
  chapterId,
  courseId,
  nextChapterId,
  isCompleted,
}: CourseProgressButtonProps) {
  const router = useRouter();
  const confetti = useConfettiStore();
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.put(
        `/api/course/${courseId}/chapters/${chapterId}/progress`,
        { isCompleted: !isCompleted }
      );
      if (!isCompleted && !nextChapterId) {
        confetti.onOpen();
      }
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapters/${nextChapterId}/`);
      }
      toast.success("Progress Updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const Icon = isCompleted ? XCircle : CheckCircle;
  return (
    <Button
      onClick={onClick}
      disabled={isLoading}
      className="w-full md:w-auto"
      type="button"
      variant={isCompleted ? "outline" : "success"}
    >
      {isCompleted ? "Not Completed" : "Mark as Complete"}
      <Icon className="h-4 ml-2 w-4" />
    </Button>
  );
}

export default CourseProgressButton;
