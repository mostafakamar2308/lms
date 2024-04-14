"use client";
import ConfirmModal from "@/components/modals/ConfirmModal";
import EditQuestionModal from "@/components/modals/EditQuestionModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Pencil, Trash2, TrashIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

interface QuestionActionsProps {
  examId: string;
  questionId: string;
  courseId: string;
  chapterId: string;
  question: {
    id: string;
    questionHead: string;
    answers: string[];
    correctAnswer: string;
  };
}

function QuestionActions({
  question,
  chapterId,
  courseId,
  examId,
  questionId,
}: QuestionActionsProps) {
  const router = useRouter();
  const onDelete = async () => {
    try {
      await axios.delete(
        `/api/courses/${courseId}/chapters/${chapterId}/exam/${examId}/question/${questionId}`
      );
      toast.success("Question Deleted Successfully");
      router.refresh();
    } catch (error) {
      toast.success("Something went wrong");
    }
  };
  return (
    <div className="space-x-2">
      <EditQuestionModal
        question={question}
        examId={examId}
        courseId={courseId}
        chapterId={chapterId}
      >
        <Button className="ml-2" variant={"outline"} size={"xs"}>
          <Pencil className="w-4 h-4" />
        </Button>
      </EditQuestionModal>
      <ConfirmModal onConfirm={onDelete}>
        <Button size={"xs"}>
          <TrashIcon className="w-4 h-4" />
        </Button>
      </ConfirmModal>
    </div>
  );
}

export default QuestionActions;
