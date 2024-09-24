"use client";

import { formatPrice } from "@/lib/format";
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
import { useRef, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";

interface AddTeacherModalProps {
  children: React.ReactNode;
}
function AddTeacherModal({ children }: AddTeacherModalProps) {
  const [teacherMail, setTeacherMail] = useState("");
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState({
    success: false,
    message: "",
  });

  const confirmRef = useRef<HTMLButtonElement>(null);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTeacherMail(e.target.value);
  };

  const hadnleAddingTeacher = async (email: string) => {
    try {
      setLoading(true);
      const request = await axios.post("/api/admin", { email });
      const response = request.data;
      setResponse(response);
      confirmRef.current && confirmRef.current.click();
      location.reload();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
      setTeacherMail("");
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-xs md:max-w-2xl " dir="rtl">
        <AlertDialogHeader>
          <AlertDialogTitle className="md:text-2xl text-right">
            أضف مدرس جديد؟{" "}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-slate-800 md:text-lg text-right">
            <Input
              value={teacherMail}
              onChange={handleInput}
              placeholder="البريد الالكتروني الخاص بالمدرس"
            />
            {response.success && (
              <p className="text-green-500 text-sm">{response.message}</p>
            )}
            {!response.success && (
              <p className="text-red-500 text-sm">{response.message}</p>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex gap-2">
          <AlertDialogCancel disabled={loading}>إلغاء</AlertDialogCancel>
          <AlertDialogAction
            ref={confirmRef}
            onClick={() => {}}
            className="hidden"
          ></AlertDialogAction>
          <Button
            disabled={loading}
            onClick={(e) => {
              hadnleAddingTeacher(teacherMail);
            }}
          >
            أضف المدرس
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default AddTeacherModal;
