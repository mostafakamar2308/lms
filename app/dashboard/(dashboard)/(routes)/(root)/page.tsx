import { getDashboardCourses } from "@/actions/getDashboardCourses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CoursesList from "../search/_components/CoursesList";
import limitSession from "@/actions/limitSession";
import axios from "axios";

export default async function Dashboard() {
  const clerk = auth();

  const { userId, sessionId } = clerk;
  if (!userId) return redirect("/");

  const { coursesInProgress, completedCourses } = await getDashboardCourses(
    userId
  );
  return (
    <div className="p-6 space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* <InfoCard
          icon={Clock}
          label="In Progress"
          numberOfItems={coursesInProgress.length}
        />
        <InfoCard
          icon={CheckCheck}
          variant="success"
          label="Compeletd"
          numberOfItems={completedCourses.length}
        /> */}
      </div>
      <CoursesList items={[...coursesInProgress, ...completedCourses]} />
    </div>
  );
}
