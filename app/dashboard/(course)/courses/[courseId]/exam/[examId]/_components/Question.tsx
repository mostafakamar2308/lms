"use client";
import { useState } from "react";
interface QuestionProps {
  questionHead: string;
  answers: string[];
  id: string;
  choosenAnswer: string;
  setChoosenAnswer: (id: string, answer: string) => void;
}
function Question({
  questionHead,
  id,
  answers,
  choosenAnswer,
  setChoosenAnswer,
}: QuestionProps) {
  const onClick = (answer: string) => {
    setChoosenAnswer(id, answer);
  };
  return (
    <div key={id} className="p-4">
      <h3 className="text-3xl text-slate-700"> {questionHead}</h3>
      <div className="flex flex-col gap-2 mt-4">
        {answers.map((answer, index) => (
          <button
            onClick={() => onClick(answer)}
            key={index}
            className={`border hover:bg-green-200 rounded-md p-2 ${
              answer === choosenAnswer && "bg-green-300 hover:bg-green-300"
            }`}
          >
            {answer}
          </button>
        ))}
      </div>
    </div>
  );
}

export default Question;
