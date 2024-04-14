import Image from "next/image";
import Link from "next/link";
import { IconBadge } from "./IconBadge";
import { BookOpen } from "lucide-react";
import { formatPrice } from "@/lib/format";
import CourseProgress from "./CourseProgress";

interface CourseCardProps {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  chaptersLength: number;
  progress: number | null;
  category?: string;
  isPurchased?: boolean;
  isActivated?: boolean;
}

function CourseCard({
  id,
  title,
  imageUrl,
  price,
  chaptersLength,
  progress,
  category,
  isActivated,
  isPurchased,
}: CourseCardProps) {
  return (
    <Link href={`/dashboard/courses/${id}`}>
      <div className="group duration-300">
        <div className="relative w-full duration-300 group-hover:scale-105 aspect-video rounded-md overflow-hidden">
          <Image
            fill
            className="object-cover"
            src={imageUrl}
            alt="Course Image"
          />
        </div>
        <div className="flex flex-col shadow-md group-hover:shadow-lg group-hover:scale-105 duration-300 pl-2 bg-white -translate-y-12 mx-4 rounded-md py-2 px-4">
          <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
            {title}
          </div>
          <p className="text-xs text-muted-foreground">{category}</p>
          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
            <div className="flex items-center gap-x-1 text-slate-500">
              <IconBadge size={"sm"} icon={BookOpen} />
              <span>
                {chaptersLength} {chaptersLength === 1 ? "حصة" : "حصص"}
              </span>
            </div>
          </div>
          {!isPurchased ? (
            <p className="text-md text-right md:text-sm font-medium text-slate-700">
              {formatPrice(price)}
            </p>
          ) : progress !== null && isActivated ? (
            <CourseProgress
              size="sm"
              value={progress}
              variant={progress == 100 ? "success" : "default"}
            />
          ) : (
            <p className="text-sm text-right md:text-xs font-medium text-slate-700">
              منتظر التفعيل{" "}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
}

export default CourseCard;
