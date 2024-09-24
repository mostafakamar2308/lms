"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
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
import { Chapter, Course } from "@prisma/client";
import { Checkbox } from "@/components/ui/checkbox";

const formSchema = z.object({
  isGradual: z.boolean().default(false),
});

interface CourseGradualFormProps {
  initialData: Course;
  courseId: string;
}

function CourseGradualForm({ initialData, courseId }: CourseGradualFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { isGradual: !!initialData?.isGradual },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Graduality Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        نظام الكورس{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ"}{" "}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              <>عدل نظام الكورس</>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <div
          className={cn(
            "text-sm mt-2 text-center",
            !initialData.isGradual && "text-slate-500 italic"
          )}
        >
          {initialData.isGradual && <>هذا الكورس يجب أن يتدرج فيه الطالب</>}
          {!initialData.isGradual && (
            <>هذا الكورس لا يجب أن يتدرج فيه الطالب.</>
          )}
        </div>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="isGradual"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 gap-2 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>

                  <div className="space-y-1 mr-2 leading-none ">
                    <FormDescription>
                      اضغط علي الزر حتي يكون الكورس بالتدريج (لا يستطيع الطالب
                      أن ينتقل للحصة القادمة حتي يشاهد ما قبلها){" "}
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            <div className="flex justify-end items-center gap-x-2">
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

export default CourseGradualForm;
