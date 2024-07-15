import { StudentColumns } from "../_components/StudentsColumns";

import { db } from "@/lib/db";
import { DataTable } from "../../courses/_components/DataTable";
import { getUserId } from "@/lib/utils";

async function page() {
  const userId = await getUserId();

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
