import { isAdmin } from "@/lib/admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./_components/DataTable";
import { columns } from "./_components/Columns";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import { db } from "@/lib/db";
import AddTeacherButton from "./_components/AddTeacherButton";

async function page() {
  const { userId } = auth();
  const isUserAdmin = await isAdmin(userId || "");
  if (!isUserAdmin) {
    redirect("/dashboard");
  }

  const users = await clerkClient().users.getUserList();
  const adminUsers = users.data.filter(
    (user) => user.privateMetadata.role === "teacher"
  );

  const adminUsersData = [];
  for (let i = 0; i < adminUsers.length; i++) {
    const user = adminUsers[i];
    const courses = await db.course.findMany({
      where: {
        isPublished: true,
        userId: user.id,
      },
      include: {
        purchases: {},
      },
    });
    const numOfStudents = courses.reduce(
      (prevValue, currValue) => prevValue + currValue.purchases.length,
      0
    );
    adminUsersData.push({
      id: user.id,
      emailAddress: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName ? user.lastName : ""}`,
      createdAt: user.createdAt,
      numOfStudents,
      numOfCourses: courses.length,
    });
  }

  return (
    <div className="p-6">
      <div className="flex justify-end mb-4 ml-4">
        <AddTeacherButton />
      </div>
      <div>
        <DataTable columns={columns} data={adminUsersData} />
      </div>
    </div>
  );
}

export default page;
