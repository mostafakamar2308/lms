import { Category, Course } from "@prisma/client";
import CourseCard from "@/components/CourseCard";

type CoursesProps = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
  isActivated?: boolean;
  isPurchased?: boolean;
};

interface CourseProps {
  items: CoursesProps[];
}
function CoursesList({ items }: CourseProps) {
  return (
    <div>
      {items.length === 0 && (
        <div className="text-center mt-2 text-sm text-muted-foreground">
          No courses Were found
        </div>
      )}
      <div className="grid sm:grid-cols-2 md:grid-cols2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {items.map((course) => (
          <CourseCard
            isPurchased={course.isPurchased}
            isActivated={course.isActivated}
            key={course.id}
            id={course.id}
            title={course.title}
            imageUrl={course.imageUrl!}
            price={course.price!}
            chaptersLength={course.chapters.length}
            progress={course.progress}
            category={course?.category?.name!}
          ></CourseCard>
        ))}
      </div>
    </div>
  );
}

export default CoursesList;
