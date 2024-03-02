import { db } from "@/lib/db";
import { columns } from "./_components/Columns";
import DataTable from "./_components/DataTable";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

async function page() {
  const { userId } = auth();

  if (!userId) {
    return redirect("/");
  }
  const courses = await db.course.findMany({
    where: {
      userId,
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
      <div>
        <h1 className="text-2xl">New Enrollment</h1>
      </div>
      <div>
        <DataTable columns={columns} data={coursesWithPurchases} />
      </div>
    </div>
  );
}

export default page;
