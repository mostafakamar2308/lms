"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { PostCategory } from "@prisma/client";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";

const formSchema = z.object({
  title: z.string(),
  description: z.string(),
  imageUrl: z.string().optional(),
  categoryId: z.string(),
});

function PostCreatorForm({
  postCategories,
}: {
  postCategories: PostCategory[];
}) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post("/api/posts", values);
      toast.success("تم نشر البوست بنجاح");
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="border p-2 w-[80%] font-serif rounded-md mx-auto mb-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <h2 className="font-semibold ">نشر سؤال جديد</h2>
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="mt-2"
                    disabled={isSubmitting}
                    placeholder="عنوان السؤال"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <textarea
                    disabled={isSubmitting}
                    placeholder="وصف السؤال"
                    {...field}
                    value={field.value ?? ""}
                    className="border p-1 rounded-md w-full px-2 resize-none mt-1"
                  />
                </FormControl>
              </FormItem>
            )}
          ></FormField>
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => {
              return (
                <FormItem>
                  <FormControl>
                    <div className="flex gap-4">
                      {postCategories.map((category) => (
                        <Button
                          type="button"
                          key={category.id}
                          onClick={() => {
                            field.onChange(category.id);
                          }}
                          variant={"outline"}
                          className={`p-2 text-base px-4 ${
                            field.value === category.id &&
                            "bg-slate-400 text-white"
                          }`}
                        >
                          {category.name}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                </FormItem>
              );
            }}
          ></FormField>
          <div className="flex justify-end mt-2">
            <Button
              className="px-6"
              type="submit"
              disabled={!isValid || isSubmitting}
            >
              نشر
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default PostCreatorForm;
