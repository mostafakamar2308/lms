"use client";

import axios from "axios";
import FileUploader from "../FileUploader";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { Input } from "../ui/input";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { RadioGroupItem, RadioGroup } from "../ui/radio-group";
import { Button } from "../ui/button";

interface NewQuestionModalProps {
  children: React.ReactNode;
  examId: string;
  courseId: string;
  chapterId: string;
}
const initialData = {
  questionHead: "",
  answers: ["", "", "", ""],
  correctAnswer: "0",
};

function NewQuestionModal({
  children,
  examId,
  courseId,
  chapterId,
}: NewQuestionModalProps) {
  const router = useRouter();
  const [question, setQuestion] = useState(initialData);
  const onSubmit = async () => {
    try {
      await axios.post(
        `/api/courses/${courseId}/chapters/${chapterId}/exam/${examId}`,
        {
          question: {
            ...question,
            correctAnswer: question.answers[+question.correctAnswer],
          },
        }
      );
      setQuestion(initialData);
      toast.success("Question Added Successfully");
      router.refresh();
    } catch (error) {
      setQuestion(initialData);
      toast.error("Something went Wrong");
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent dir="rtl" className="text-right">
        <AlertDialogHeader dir="rtl">
          <AlertDialogTitle className="text-right">سؤال جديد</AlertDialogTitle>
          <div>
            <div>
              <h3 className="text-slate-500 font-medium text-sm text-right">
                السؤال
              </h3>
              <Input
                placeholder="مثال: ما هي عاصمة مصر"
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
              <h3 className="text-slate-500 font-medium text-sm text-right">
                الاجابات
              </h3>
              <RadioGroup
                defaultValue={"0"}
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
                    placeholder="مثال: الاجابة 1"
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
                    placeholder="مثال: الاجابة 2"
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
                    placeholder="مثال: الاجابة 3"
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
                    placeholder="مثال: الاجابة 4"
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
        <AlertDialogFooter>
          <AlertDialogCancel className="ml-2">ألغ</AlertDialogCancel>
          <AlertDialogAction onClick={onSubmit}>أضف السؤال</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default NewQuestionModal;
