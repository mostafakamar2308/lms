"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { ArrowDownLeftFromCircle, Calendar, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ActivatedUserCardProps {
  id: string;
  imageUrl: string;
  name: string;
  email: string;
  updatedAt: Date;
  courseId: string;
}
function ActivatedUserCard({
  id: userId,
  imageUrl,
  name,
  updatedAt,
  email,
  courseId,
}: ActivatedUserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const deactivate = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/enroll/${userId}`, {
        accept: false,
      });
      toast.success("Student Removed Successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
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
        <p className="text-xs text-center flex items-center gap-1 text-emerald-700">
          {new Date(updatedAt).toDateString()}
        </p>
      </CardHeader>
      <CardContent className="py-8 ">
        <h1 className="text-xl md:text-base font-medium transition line-clamp-2">
          {name}
        </h1>
        <p className="text-xs text-slate-700">{email}</p>
        <div className="flex gap-2 mt-4">
          <Button
            disabled={isLoading}
            onClick={deactivate}
            className="flex gap-2 items-center text-xs"
          >
            <ArrowDownLeftFromCircle className="w-4 h-4 text-slate-200" />
            Deactivate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default ActivatedUserCard;
