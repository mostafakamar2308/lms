import QuestionActions from "./QuestionActions";

interface QuestionProps {
  id: string;
  questionHead: string;
  answers: string[];
  correctAnswer: string;
  examId: string;
  courseId: string;
  chapterId: string;
}
function Question({
  answers,
  correctAnswer,
  examId,
  courseId,
  id,
  chapterId,
  questionHead,
}: QuestionProps) {
  return (
    <div className="border p-2 pl-4 rounded-lg space-y-2 mt-4">
      <div className="flex">
        <h4 className="text-lg grow font-medium">{questionHead}</h4>
        <QuestionActions
          question={{
            answers,
            correctAnswer,
            id,
            questionHead,
          }}
          examId={examId}
          courseId={courseId}
          chapterId={chapterId}
          questionId={id}
        />
      </div>
      <div className="pl-1">
        {answers.map((answer) => (
          <h5
            key={answer}
            className={`border p-1 mt-2 indent-2 rounded-md ${
              answer === correctAnswer && "bg-green-700 text-white"
            }`}
          >
            {answer}
          </h5>
        ))}
      </div>
    </div>
  );
}

export default Question;
