"use client";

import NewQuestionModal from "@/components/modals/NewQuestionModal";
import { Button } from "@/components/ui/button";

function ExamActions({
  examId,
  chapterId,
  courseId,
}: {
  examId: string;
  courseId: string;
  chapterId: string;
}) {
  return (
    <NewQuestionModal examId={examId} courseId={courseId} chapterId={chapterId}>
      <Button className="mt-8">أضف سؤال</Button>
    </NewQuestionModal>
  );
}

export default ExamActions;
