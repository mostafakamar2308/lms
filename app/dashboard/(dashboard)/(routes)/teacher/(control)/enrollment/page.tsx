import { db } from "@/lib/db";
import { columns } from "../_components/Columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
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
