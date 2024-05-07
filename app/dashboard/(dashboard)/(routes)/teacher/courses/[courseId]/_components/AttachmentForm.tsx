"use client";
import * as z from "zod";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { File, ImageIcon, Loader2, Pencil, PlusCircle, X } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Attachemnt, Course } from "@prisma/client";
import FileUploader from "@/components/FileUploader";

const formSchema = z.object({
  url: z.string().min(1),
});

interface AttachmentFormProps {
  initialData: Course & { attachments: Attachemnt[] };
  courseId: string;
}

function AttachmentForm({ initialData, courseId }: AttachmentFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const onDelete = async (id: string) => {
    try {
      setDeletingId(id);
      await axios.delete(`/api/courses/${courseId}/attachments/${id}`);
      toast.success("Course Image Updated");
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    } finally {
      setDeletingId(null);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post(`/api/courses/${courseId}/attachments`, values);
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
        ملفات الكورس{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ"}{" "}
          {!isEditing && (
            <>
              <PlusCircle className="h-4 w-4 ml-2" />
              أضف ملف
            </>
          )}{" "}
        </Button>
      </div>
      {!isEditing && (
        <>
          {initialData.attachments.length === 0 && (
            <p className="text-sm text-slate-500 mt-2 italic">
              لا يوجد ملفات لهذا الكورس
            </p>
          )}
          {initialData.attachments.length > 0 && (
            <div>
              {initialData.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center p-3 w-full bg-sky-100 border-sky-200 border text-sky-700 roundend-md"
                >
                  <File className="h-4 w-4 mr-2 flex-shrink-0" />
                  <p className="line-clamp-1 text-sm">{attachment.name}</p>
                  {deletingId === attachment.id && (
                    <div className="ml-auto">
                      <Loader2 className="h-4 w-4 animate-spin " />
                    </div>
                  )}
                  {deletingId !== attachment.id && (
                    <button
                      onClick={() => onDelete(attachment.id)}
                      className="mr-auto hover:opacit-75 transition"
                    >
                      <X className="h-5 w-5 " />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}
      {isEditing && (
        <div>
          <FileUploader
            endpoint="courseAttachment"
            onChange={(url) => {
              if (url) {
                onSubmit({ url });
              }
            }}
          />
          <div className="text-xs text-muted-foreground mt-4">
            أضف أي شيء قد يحتاجه طلابك لإكمال الكورس
          </div>
        </div>
      )}
    </div>
  );
}

export default AttachmentForm;
