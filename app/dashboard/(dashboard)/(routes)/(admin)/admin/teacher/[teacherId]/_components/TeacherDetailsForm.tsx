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
import Image from "next/image";
import { Combobox } from "@/components/ui/Combobox";

const options = [
  { label: "اللغة العربية", value: "arabic" },
  { label: "اللغة الإنجليزية", value: "english" },
  { label: "اللغة الفرنسية", value: "french" },
  { label: "الرياضيات", value: "mathematics" },
  { label: "الفيزياء", value: "physics" },
  { label: "الكيمياء", value: "chemistry" },
  { label: "الأحياء", value: "biology" },
  { label: "التاريخ", value: "history" },
  { label: "الجغرافيا", value: "geography" },
  { label: "الفلسفة والمنطق", value: "philosophy_logic" },
  { label: "علم النفس والاجتماع", value: "psychology_sociology" },
  { label: "الاقتصاد والإحصاء", value: "economics_statistics" },
  {
    label: "الجيولوجيا والعلوم البيئية",
    value: "geology_environmental_sciences",
  },
  { label: "التربية الدينية", value: "religious_education" },
  { label: "التربية الوطنية", value: "national_education" },
  { label: "اللغة الألمانية", value: "german" },
  { label: "اللغة الإسبانية", value: "spanish" },
  { label: "اللغة الإيطالية", value: "italian" },
];

const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, { message: "Teacher Name is Required" }),
  subject: z.string().min(1, { message: "Teacher Subject is Required" }),
  imageUrl: z.string().min(1, { message: "Teacher Image url is Required" }),
});

interface TeacherDetailsFormProps {
  initialData: {
    id: string;
    name: string;
    subject: string;
    imageUrl: string;
  };
}

function TeacherDetailsForm({ initialData }: TeacherDetailsFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });
  const { isSubmitting, isValid } = form.formState;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/admin/${initialData.id}`, form.getValues());
      toast.success("TeacherDetails Updated");
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong");
    }
  };
  return (
    <div className="bg-slate-100 mt-2 rounded-md p-4 sm:w-1/2 ">
      <div className="font-medium flex items-center justify-between">
        تفاصيل المدرس{" "}
        <Button onClick={toggleEdit} variant={"ghost"}>
          {isEditing && "ألغ التعديل"}{" "}
          {!isEditing && (
            <>
              <Pencil className="h-4 w-4 ml-2" />
              <>عدل التفاصيل</>
            </>
          )}
        </Button>
      </div>
      {!isEditing ? (
        <>
          <div className="flex gap-6 items-center">
            <Image
              width={100}
              height={100}
              className="rounded-full object-cover aspect-square"
              alt={initialData.name}
              src={initialData.imageUrl}
            />
            <div>
              <h3 className="text-2xl">{initialData.name}</h3>
              <p className="text-lg">
                {options.find((opt) => opt.value === initialData.subject)
                  ?.label || "لم يتم اختيار التخصص..."}
              </p>
            </div>
          </div>
        </>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      disabled={isSubmitting}
                      placeholder="مصطفى قمر..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage></FormMessage>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox {...field} options={options} />
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

export default TeacherDetailsForm;
