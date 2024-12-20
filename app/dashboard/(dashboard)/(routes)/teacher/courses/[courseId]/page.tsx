import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  CircleDollarSign,
  File,
  LayoutDashboard,
  ListChecks,
} from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttachmentForm from "./_components/AttachmentForm";
import ChaptersForm from "./_components/ChaptersForm";
import CourseActions from "./_components/CourseActions";
import { Banner } from "@/components/Banner";
import CourseGradualForm from "./_components/CourseGradualForm";

const CoursePage = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      userId,
    },
    include: {
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
      attachments: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });
  if (!course) {
    return redirect("/");
  }
  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const requiredFields = [
    course.title,
    course.description,
    course.imageUrl,
    course.categoryId,
    course.chapters.some((chapter) => chapter.isPublished),
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const isComplete = requiredFields.every(Boolean);
  return (
    <>
      {!course.isPublished && (
        <Banner
          variant={"warning"}
          label="لم يتم نشر هذا الكورس بعد، بالتالى لن يظهر لطلابك"
        />
      )}
      <div className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-y-2 ">
            <h1 className="text-2xl font-medium">تفاصيل الكورس</h1>
            {completedFields < totalFields && (
              <span className="text-sm text-slate-700">
                ينقصك اكمال {totalFields - completedFields} من أصل {totalFields}{" "}
                حقول اجبارية
              </span>
            )}
            {completedFields === totalFields && (
              <span className="text-sm text-slate-700">
                أكملت جميع تفاصيل الكورس يمكنك ان تنشره لطلابك الان ❤️
              </span>
            )}
          </div>
          <CourseActions
            disabled={!isComplete}
            courseId={params.courseId}
            isPublished={course.isPublished}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={LayoutDashboard} />
              <h2 className="text-xl">عدل تفاصيل الكورس</h2>
            </div>
            <TitleForm initialData={course} courseId={course.id} />
            <DescriptionForm initialData={course} courseId={course.id} />
            <ImageForm initialData={course} courseId={course.id} />
            <CategoryForm
              initialData={course}
              courseId={course.id}
              options={categories.map((category) => ({
                label: category.name,
                value: category.id,
              }))}
            />
          </div>
          <div className="space-y-6">
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">حصص الكورس</h2>
              </div>
              <ChaptersForm initialData={course} courseId={course.id} />
            </div>
            <div className="">
              <div className="flex items-center gap-x-2">
                <IconBadge icon={ListChecks} />
                <h2 className="text-xl">نظام الكورس</h2>
              </div>
              <CourseGradualForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={CircleDollarSign} />
                <h2 className="text-xl">سعر الكورس</h2>
              </div>
              <PriceForm initialData={course} courseId={course.id} />
            </div>
            <div>
              <div className="flex items-center gap-x-2">
                <IconBadge icon={File} />
                <h2 className="text-xl">المصادر والملفات</h2>
              </div>
              <AttachmentForm initialData={course} courseId={course.id} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default CoursePage;
