"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle,
  FileCheck,
  FileQuestion,
  Lock,
  PlayCircle,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

interface CourseSidebarExamProps {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}
function CourseSidebarExam({
  id,
  label,
  isCompleted,
  courseId,
}: CourseSidebarExamProps) {
  const pathname = usePathname();
  const router = useRouter();
  const Icon = isCompleted ? FileCheck : FileQuestion;

  const isActive = pathname?.includes(`exam/${id}`);
  const onClick = () => {
    router.push(`/dashboard/courses/${courseId}/exam/${id}`);
  };

  return (
    <button
      onClick={onClick}
      type="button"
      className={cn(
        "flex items-center gap-x-2 font-[500] pl-6 sm:pl-0 sm:pr-6 transition-all text-slate-500 hover:text-slate-600 text-sm hover:bg-slate-300/20 ",
        isCompleted && "text-emerald-700 bg-slate-200 hover:text-emerald-700",
        isActive &&
          "text-slate-700 bg-slate-200/20 hover:bg-slate-200/20 hover:text-slate-700",
        isCompleted && isActive && "bg-emerald-200/20"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon
          size="22"
          className={cn(
            "text-slate-500",
            isActive && "text-slate-700",
            isCompleted && "text-emerald-700"
          )}
        />
        {label}
      </div>
      <div
        className={cn(
          "sm:mr-auto ml-auto sm:ml-0 opacity-0 border-2 border-slate-700 h-full transition-all ",
          isActive && "opacity-100",
          isCompleted && "border-emerald-700"
        )}
      ></div>
    </button>
  );
}

export default CourseSidebarExam;
