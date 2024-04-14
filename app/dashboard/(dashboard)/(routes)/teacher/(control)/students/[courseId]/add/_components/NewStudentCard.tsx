"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import axios from "axios";
import { ArrowDownLeftFromCircle, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";

interface NewStudentCardProps {
  id: string;
  email: string;
  name: string;
  imageUrl: string;
  courseId: string;
}
function NewStudentCard({
  email,
  id,
  imageUrl,
  name,
  courseId,
}: NewStudentCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onAccept = async () => {
    try {
      setIsLoading(true);
      await axios.post(`/api/courses/${courseId}/students`, {
        studentId: id,
      });
      toast.success("Student enrolled and activated!");
    } catch (error) {
      toast.error("An error Has happened!");
    } finally {
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <Card className="max-w-md flex shadow">
      <CardHeader>
        <Image
          height={100}
          width={100}
          src={imageUrl}
          className="rounded-full overflow-hidden"
          alt={name}
        />
      </CardHeader>
      <CardContent className="py-8 ">
        <h1 className="text-xl md:text-base font-medium transition line-clamp-2">
          {name}
        </h1>
        <p className="text-xs text-slate-700">{email}</p>
        <div className="flex gap-2 mt-4">
          <Button
            disabled={isLoading}
            onClick={onAccept}
            className="flex gap-2 items-center text-xs"
          >
            <PlusCircle className="w-4 h-4 text-slate-200" />
            أضف الي الكورس
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default NewStudentCard;
