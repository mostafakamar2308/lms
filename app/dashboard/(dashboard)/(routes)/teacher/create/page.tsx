"use client";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import toast from "react-hot-toast";

const formSchema = z.object({
  title: z.string().min(1, { message: "Title is Required" }),
});

const CreateCourse = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { title: "" },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post("/api/courses", values);
      router.push(`/dashboard/teacher/courses/${response.data.id}`);
      toast.success("Course Created Successfully");
    } catch {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="max-w-5xl  mx-auto flex md:items-center md:justify-center h-full p-6">
      <div>
        <h1 className="text-3xl">اسم الكورس</h1>
        <p className="text-base text-slate-600">
          ما اسم الكورس؟ لا تقلق، يمكنك تغييره فيما بعد.
        </p>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 mt-8"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-xl">عنوان الكورس</FormLabel>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="الانجليزي للصف الأول الثانوي"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>ما الذي ستشرحه في الكورس</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-end gap-x-2">
              <Link href={"/"}>
                <Button variant={"ghost"} type="button">
                  ألغ
                </Button>
              </Link>
              <Button type="submit" disabled={!isValid || isSubmitting}>
                أكمل
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default CreateCourse;
