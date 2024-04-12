"use client";

import { useState } from "react";
import Question from "./Question";
import toast from "react-hot-toast";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
interface QuestionGroupProps {
  examId: string;
  questions: {
    id: string;
    questionHead: string;
    answers: string[];
  }[];
}
function QuestionGroup({ questions, examId }: QuestionGroupProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [answers, setAnswers] = useState(
    questions.map((question) => ({
      id: question.id,
      questionHead: question.questionHead,
      answers: question.answers,
      choosenAnswer: "",
    }))
  );
  const onClick = (id: string, choosenAnswer: string) => {
    setAnswers((prev) =>
      answers.map((answer) => {
        if (answer.id === id) {
          return { ...answer, choosenAnswer };
        } else {
          return answer;
        }
      })
    );
  };

  const router = useRouter();
  const onSubmit = async () => {
    try {
      setIsLoading(true);
      if (questions.length !== answers.length) {
        toast.error("Complete All questions");
      } else {
        await axios.post(`/api/exams/${examId}/grade`, {
          questions: answers.map((answer) => ({
            id: answer.id,
            questionHead: answer.questionHead,
            choosenAnswer: answer.choosenAnswer,
          })),
        });
        router.refresh();
      }
    } catch (error) {
      toast.error("Something Has Occured");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="py-4">
      {answers.map((question) => (
        <Question
          key={question.id}
          setChoosenAnswer={onClick}
          {...question}
          choosenAnswer={question.choosenAnswer}
        />
      ))}
      <Button
        disabled={isLoading}
        onClick={onSubmit}
        className="px-8 mx-auto text-lg block"
      >
        Finish Exam
      </Button>
    </div>
  );
}

export default QuestionGroup;
