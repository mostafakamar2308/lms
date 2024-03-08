"use client";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Calendar, Check, X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface UserCardProps {
  id: string;
  imageUrl: string;
  name: string;
  email: string;
  createdAt: Date;
  courseId: string;
}
function UserCard({
  id: userId,
  imageUrl,
  name,
  createdAt,
  email,
  courseId,
}: UserCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const onActivate = async () => {
    try {
      setIsLoading(true);
      await axios.patch(`/api/courses/${courseId}/enroll/${userId}`, {
        accept: true,
      });
      toast.success("Student Enrolled Successfully");
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };
  const onReject = async () => {
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
          {new Date(createdAt).toDateString()}
        </p>
      </CardHeader>
      <CardContent className="py-8 ">
        <h1 className="text-xl md:text-base font-medium transition line-clamp-2">
          {name}
        </h1>
        <p className="text-xs text-slate-700">{email}</p>
        <div className="flex gap-2 mt-4">
          {/* <Button
            disabled={isLoading}
            onClick={onReject}
            className="flex gap-2 items-center text-xs"
          >
            <X className="w-4 h-4 text-slate-200" />
            Reject
          </Button> */}
          <Button
            disabled={isLoading}
            variant={"success"}
            onClick={onActivate}
            className="flex gap-2 items-center text-xs"
          >
            <Check className="w-4 h-4 text-slate-200" />
            Activate
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default UserCard;
