import NavbarRoutes from "@/components/NavbarRoutes";
import {
  Chapter,
  Course,
  Exam,
  ExamProgress,
  Question,
  UserProgress,
} from "@prisma/client";
import CourseMobileSidebar from "./CourseMobileSidebar";

interface CourseNavBarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
      exam:
        | (Exam & {
            questions: Question[];
            examProgress: ExamProgress[];
          })
        | null;
    })[];
  };
  progressCount: number;
}
function CourseNavBar({ course, progressCount }: CourseNavBarProps) {
  return (
    <div className="p-4 border-p h-full flex items-center bg-white shadow-sm ">
      <CourseMobileSidebar course={course} progressCount={progressCount} />
      <NavbarRoutes />
    </div>
  );
}

export default CourseNavBar;
