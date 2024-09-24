import { IconBadge } from "@/components/IconBadge";
import { BookOpenCheck, Users, Video } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

type CourseCardForAdminProps = {
  id: string;
  name: string;
  chaptersNum: number;
  examsNum: number;
  imageUrl: string | null;
  published: boolean;
  studentNum: number;
};
function CourseCardForAdmin({
  id,
  name,
  chaptersNum,
  examsNum,
  imageUrl,
  published,
  studentNum,
}: CourseCardForAdminProps) {
  return (
    <Link
      href={`/dashboard/teacher/courses/${id}`}
      className="w-fit shadow-sm hover:shadow-md transition-all duration-200 rounded-lg overflow-hidden bg-slate-100 items-center justify-center flex flex-col"
    >
      <Image
        src={imageUrl!}
        alt={name}
        className="aspect-video"
        width={400}
        height={400}
      />
      <div className="w-full p-2">
        <h3 className="text-slate-700 mb-2 text-xl font-semibold">{name}</h3>
        <div className=" grid grid-cols-2 gap-2">
          <div className="flex items-center gap-4 justify-start  text-lg">
            <IconBadge icon={Video} />
            {chaptersNum} حصة
          </div>
          <div className="flex items-center gap-4 justify-start  text-lg">
            <IconBadge icon={BookOpenCheck} />
            {examsNum} امتحان
          </div>
          <div className="flex items-center gap-4 justify-start  text-lg">
            <IconBadge icon={Users} />
            {studentNum} طالب
          </div>
        </div>
      </div>
    </Link>
  );
}

export default CourseCardForAdmin;
