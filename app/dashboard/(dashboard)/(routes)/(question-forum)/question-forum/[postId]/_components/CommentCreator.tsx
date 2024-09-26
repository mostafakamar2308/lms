"use client";
import { Button } from "@/components/ui/button";
import { SendHorizonal } from "lucide-react";
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

const formSchema = z.object({
  content: z.string().min(1),
});

interface CommentCreatorProps {
  postId: string;
}
function CommentCreator({ postId }: CommentCreatorProps) {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values);
      await axios.post(`/api/posts/${postId}/comments`, values);
      form.reset();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex gap-3 border bg-gray-100 rounded-md p-2 pb-1"
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem className="grow">
              <FormControl className="w-full">
                <textarea
                  {...field}
                  value={field.value ?? ""}
                  disabled={isSubmitting}
                  placeholder="اكتب تعليق ..."
                  className="resize-none w-full h-20 grow border-none bg-gray-100 focus-visible:outline-none focus-visible:border-none"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={!isValid || isSubmitting}
          className="self-center"
        >
          <SendHorizonal className="rotate-180" />
        </Button>
      </form>
    </Form>
  );
}

export default CommentCreator;
