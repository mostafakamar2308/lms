"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import Image from "next/image";
import FileUploader from "@/components/FileUploader";

const formSchema = z.object({
  imageUrl: z.string().min(1, { message: "Image is Required" }),
});

interface ImageFormProps {
  initialData: Course;
  courseId: string;
}

function ImageForm({ initialData, courseId }: ImageFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Image Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        صورة الكورس{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ التعديل"}{" "}
          {!isEditing && !initialData.imageUrl && (
            <>
              <PlusCircle className="h-4 w-4 ml-2" />
              أضف صورة
            </>
          )}{" "}
          {!isEditing && initialData.imageUrl && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              <>غير الصورة</>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        !initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-slate-500" />
          </div>
        ) : (
          <div className="relative aspect-video mt-2">
            <Image
              src={initialData.imageUrl}
              alt="upload"
              fill
              className="object-cover rounded-md"
            ></Image>
          </div>
        )
      ) : (
        <div>
          <FileUploader
            endpoint="courseImage"
            onChange={(url) => {
              if (url) {
                onSubmit({ imageUrl: url });
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default ImageForm;
