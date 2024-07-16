import { StudentColumns } from "../_components/StudentsColumns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { DataTable } from "../../courses/_components/DataTable";

async function page() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    where: {
      userId,
      isPublished: true,
    },
    include: {
      purchases: {
        where: {
          isActivated: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const coursesWithStudents = courses.map((course) => ({
    ...course,
    students: course.purchases.length,
  }));
  return (
    <div className="p-6">
      <DataTable data={coursesWithStudents} columns={StudentColumns} />
    </div>
  );
}

export default page;
