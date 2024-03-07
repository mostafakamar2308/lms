import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import Link from "next/link";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

const CoursesPage = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
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
