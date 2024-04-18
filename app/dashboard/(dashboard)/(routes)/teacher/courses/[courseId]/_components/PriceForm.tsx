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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Pencil } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Course } from "@prisma/client";
import { formatPrice } from "@/lib/format";

const formSchema = z.object({
  price: z.coerce.number().min(0, { message: "Price is Required" }),
});

interface PriceFormProps {
  initialData: Course;
  courseId: string;
}

function PriceForm({ initialData, courseId }: PriceFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: initialData?.price || undefined,
    },
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/courses/${courseId}`, values);
      toast.success("Course Price Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="mt-6 bg-slate-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        سعر الكورس{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ"}{" "}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              <>عدل السعر</>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          <p className="text-sm mt-2 ">
            {initialData.price && formatPrice(initialData.price)}
          </p>
          <p className="text-xs text-slate-500">
            {initialData.isFree && "هذا الكورس مجانى"}
          </p>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      type="number"
                      step={"0.01"}
                      disabled={isSubmitting}
                      placeholder="e.g. '5000EGP'"
                      {...field}
                    />
                  </FormControl>
                  <p className="text-xs text-slate-500">
                    اكتب 0 ان اردت ان يكون الكورس مجانى
                  </p>
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

export default PriceForm;
