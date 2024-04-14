"use client";
import axios from "axios";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";

interface EditQuestionModalProps {
  children: React.ReactNode;
  examId: string;
  question: {
    id: string;
    questionHead: string;
    answers: string[];
    correctAnswer: string;
  };
  courseId: string;
  chapterId: string;
}

function EditQuestionModal({
  children,
  examId,
  question: questionInitialData,
  courseId,
  chapterId,
}: EditQuestionModalProps) {
  const router = useRouter();
  const initialCorrectAnswer = useMemo(() => {
    return questionInitialData.answers.findIndex(
      (answer) => answer === questionInitialData.correctAnswer
    );
  }, [questionInitialData]);
  const [question, setQuestion] = useState({
    ...questionInitialData,
    correctAnswer: String(initialCorrectAnswer),
  });
  const onSubmit = async () => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}/exam/${examId}/question/${question.id}`,
        {
          question: {
            ...question,
            correctAnswer: question.answers[+question.correctAnswer],
          },
        }
      );
      toast.success("Question Edited Successfully");
      router.refresh();
    } catch (error) {
      setQuestion(questionInitialData);
      toast.error("Something went Wrong");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-right">عدل السؤال</AlertDialogTitle>
          <div className="text-right">
            <div>
              <h3 className="text-slate-500 font-medium text-sm">السؤال</h3>
              <Input
                className="text-right"
                placeholder="e.g. What is the answer for this?"
                value={question.questionHead}
                onChange={(e) => {
                  setQuestion((prev) => ({
                    ...prev,
                    questionHead: e.target.value,
                  }));
                }}
              />
            </div>
            <div className="flex flex-col space-y-2 mt-6">
              <h3 className="text-slate-500 font-medium text-sm">الاجابات</h3>
              <RadioGroup
                defaultValue={`${initialCorrectAnswer}`}
                onValueChange={(value) => {
                  setQuestion((prev) => ({
                    ...prev,
                    correctAnswer: value,
                  }));
                }}
              >
                <div className="flex items-center space-x-2">
                  <Input
                    className="text-right"
                    placeholder="e.g. Answer 1"
                    value={question.answers[0]}
                    onChange={(e) => {
                      setQuestion((prev) => {
                        const answers = prev.answers;
                        answers.splice(0, 1, e.target.value);
                        return {
                          ...prev,
                          answers: [...answers],
                        };
                      });
                    }}
                  />
                  <RadioGroupItem value="0"></RadioGroupItem>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    className="text-right"
                    placeholder="e.g. Answer 2"
                    value={question.answers[1]}
                    onChange={(e) => {
                      setQuestion((prev) => {
                        const answers = prev.answers;
                        answers.splice(1, 1, e.target.value);
                        return {
                          ...prev,
                          answers: [...answers],
                        };
                      });
                    }}
                  />
                  <RadioGroupItem value="1"></RadioGroupItem>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    className="text-right"
                    placeholder="e.g. Answer 3"
                    value={question.answers[2]}
                    onChange={(e) => {
                      setQuestion((prev) => {
                        const answers = prev.answers;
                        answers.splice(2, 1, e.target.value);
                        return {
                          ...prev,
                          answers: [...answers],
                        };
                      });
                    }}
                  />
                  <RadioGroupItem value="2"></RadioGroupItem>
                </div>
                <div className="flex items-center space-x-2">
                  <Input
                    className="text-right"
                    placeholder="e.g. Answer 4"
                    value={question.answers[3]}
                    onChange={(e) => {
                      setQuestion((prev) => {
                        const answers = prev.answers;
                        answers.splice(3, 1, e.target.value);
                        return {
                          ...prev,
                          answers: [...answers],
                        };
                      });
                    }}
                  />
                  <RadioGroupItem value="3"></RadioGroupItem>
                </div>
              </RadioGroup>
            </div>
          </div>
        </AlertDialogHeader>
        <AlertDialogFooter className="">
          <AlertDialogCancel className="ml-2 ">ألغ</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>عدل السؤال</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default EditQuestionModal;
