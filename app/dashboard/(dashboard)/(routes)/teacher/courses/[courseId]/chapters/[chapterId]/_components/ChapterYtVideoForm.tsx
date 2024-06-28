"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import { Chapter, Course } from "@prisma/client";
import { Input } from "@/components/ui/input";
import VideoPlayer from "@/app/dashboard/(course)/courses/[courseId]/(course-content)/chapters/[chapterId]/VideoPlayer";
import VideoPlayerTeacher from "./VideoPlayerTeacher";

const formSchema = z.object({
  videoUrl: z.string().min(1),
});

interface ChapterYtVideoFormProps {
  initialData: Chapter;
  courseId: string;
  chapterId: string;
  ytUrls: any[];
}

function ChapterYtVideoForm({
  initialData,
  courseId,
  chapterId,
  ytUrls,
}: ChapterYtVideoFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { videoUrl: initialData?.videoUrl || "" },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(
        `/api/courses/${courseId}/chapters/${chapterId}`,
        values
      );
      toast.success("تم تغيير لينك الحصة");
      toggleEdit();
      window.location.reload();
    } catch (error) {
      toast.error("حدث خطأ، برجاء المحاولة مرة أخري");
    }
  };
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        لينك الحصة{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ التعديل"}{" "}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              <>عدل اللينك</>
            </>
          )}
        </Button>
      </div>
      {!isEditing && initialData.videoUrl ? (
        <VideoPlayerTeacher ytUrl={ytUrls} />
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="videoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="https://www.youtube.com/watch?v=UGFrLwPzDFM&t=785s"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                حفظ
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}

export default ChapterYtVideoForm;
