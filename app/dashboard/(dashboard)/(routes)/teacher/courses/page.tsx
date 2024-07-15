import { db } from "@/lib/db";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";

import { getUserId } from "@/lib/utils";

const CoursesPage = async () => {
  const userId = await getUserId();

  const courses = await db.course.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="p-6">
      <div>
        <DataTable columns={columns} data={courses} />
      </div>
    </div>
  );
};

export default CoursesPage;
