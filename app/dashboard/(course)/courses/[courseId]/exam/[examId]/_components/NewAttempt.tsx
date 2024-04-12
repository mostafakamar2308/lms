"use client";
import { Button } from "@/components/ui/button";
import { ExamProgress } from "@prisma/client";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
interface NewAttemptProps {
  userProgress: ExamProgress;
}
function NewAttempt({ userProgress }: NewAttemptProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onClick = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/exams/${userProgress.examId}/reattempt`, {
        userProgressId: userProgress.id,
      });
      router.refresh();
    } catch (error) {
      console.log(error);

      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <Button
      disabled={isLoading}
      onClick={onClick}
      variant={"secondary"}
      className="px-8 py-6 text-lg"
    >
      Attempt Again
    </Button>
  );
}

export default NewAttempt;
