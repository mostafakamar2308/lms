"use client";
import { Input } from "@/components/ui/input";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import NewStudentCard from "./NewStudentCard";

type Student = {
  id: string;
  imageUrl: string;
  name: string;
  email: string;
};

function SearchStudent({ courseId }: { courseId: string }) {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);
  const [isLoading, setIsLoading] = useState(false);

  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    const searchStudents = async () => {
      try {
        setIsLoading(true);
        if (debouncedValue !== "") {
          const response = await axios.get(
            `/api/courses/${courseId}/students/${debouncedValue}`
          );
          return response.data;
        }
        return [];
      } catch (error) {
        toast.error("An error has happened");
      } finally {
        setIsLoading(false);
      }
    };
    searchStudents().then((res) => {
      setStudents(res);
    });
  }, [debouncedValue, courseId]);
  return (
    <>
      <Input
        className="max-w-sm"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        placeholder="ابحث عن طريق الميل ..."
      />
      <div className="grid p-4 grid-cols-1 md:grid-cols-2 gap-4">
        {students.map((student) => (
          <NewStudentCard
            courseId={courseId}
            {...student}
            key={student.id}
          ></NewStudentCard>
        ))}
      </div>
      {isLoading && (
        <Loader2 className="w-10 h-10 text-black animate-spin mx-auto" />
      )}
      {!isLoading && students.length === 0 && value.trim() === "" && (
        <h1 className="text-center mt-2 opacity-80">
          برجاء كتابة ايميل الطالب الذي تود إضافته
        </h1>
      )}
      {!isLoading && students.length === 0 && value.trim() !== "" && (
        <h1 className="text-center mt-2 opacity-80">
          لا يوجد طالب بهذا الايميل
        </h1>
      )}
    </>
  );
}

export default SearchStudent;
