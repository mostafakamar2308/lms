import Link from "next/link";
import TeacherDetailsForm from "./_components/TeacherDetailsForm";
import {
  ArrowRight,
  Book,
  BookA,
  BookUser,
  Computer,
  User,
} from "lucide-react";
import { clerkClient } from "@clerk/nextjs/server";
import { IconBadge } from "@/components/IconBadge";
import { db } from "@/lib/db";
import CourseCardForAdmin from "./_components/CourseCardForAdmin";
async function page({ params }: { params: { teacherId: string } }) {
  const teacher = await clerkClient.users.getUser(params.teacherId);
  const teacherSubject = teacher.publicMetadata.subject as string;
  const teacherDetails = {
    id: params.teacherId,
    imageUrl: teacher.imageUrl,
    name: `${teacher.firstName} ${teacher.lastName || ""}`,
    subject: teacherSubject || "",
  };

  const courses = await db.course.findMany({
    where: {
      userId: teacher.id,
      isPublished: true,
    },
    include: {
      chapters: {
        include: {
          exam: {},
        },
      },
      purchases: {},
    },
  });
  const teacherCourses = courses.map((course) => ({
    id: course.id,
    name: course.title,
    chaptersNum: course.chapters.length,
    examsNum: course.chapters.filter((chapter) => chapter.exam).length,
    imageUrl: course.imageUrl,
    published: course.isPublished,
    studentNum: course.purchases.length,
  }));

  return (
    <div className="p-6">
      <div className="flex gap-2">
        <ArrowRight className="w-4" />
        <Link href={"/dashboard/admin"} className="text-lg">
          إلي صفحة المدرسين
        </Link>
      </div>
      <div className="mt-4">
        <div className="flex gap-2 text-xl items-center ">
          <IconBadge icon={User} />
          تفاصيل المدرس{" "}
        </div>
        <TeacherDetailsForm initialData={teacherDetails} />
      </div>
      <div className="mt-4">
        <div className="flex gap-2 mb-2 text-xl items-center ">
          <IconBadge icon={Computer} />
          الكورسات الخاصة بالمدرس{" "}
        </div>
        <div className="flex gap-2 flex-wrap">
          {teacherCourses.map((course) => (
            <CourseCardForAdmin key={course.id} {...course} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default page;
