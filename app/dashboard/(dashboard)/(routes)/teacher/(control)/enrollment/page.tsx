import { db } from "@/lib/db";
import { columns } from "../_components/Columns";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
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
          isActivated: false,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  const coursesWithPurchases = courses.map((course) => ({
    ...course,
    purchases: course.purchases.length,
  }));

  return (
    <div className="max-w-5xl mx-auto flex flex-col h-full p-6">
      <DataTable columns={columns} data={coursesWithPurchases} />
    </div>
  );
}

export default page;
