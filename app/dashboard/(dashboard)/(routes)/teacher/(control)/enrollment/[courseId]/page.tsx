import UserCard from "@/components/UserCard";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";

async function page({ params }: { params: { courseId: string } }) {
  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const courseOwner = await db.course.findUnique({
    where: {
      userId: userId,
      id: params.courseId,
    },
  });
  if (!courseOwner) {
    return redirect("/");
  }

  const purchases = await db.purchase.findMany({
    where: {
      isActivated: false,
      courseId: params.courseId,
    },
  });
  const users = [];

  for (let purchase of purchases) {
    const user = await clerkClient.users.getUser(purchase.userId);
    users.push({
      id: user.id,
      imageUrl: user.imageUrl,
      name: `${user.firstName} ${user.lastName || ""}`,
      email: user.emailAddresses[0].emailAddress,
      createdAt: purchase.createdAt,
    });
  }

  return (
    <div className="p-6">
      <Link
        href={`/dashboard/teacher/enrollment`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6 "
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Enrollment page
      </Link>
      <div className=" grid md:grid-cols-2 grid-cols-1 gap-3">
        {users.map((user) => (
          <UserCard key={user.id} courseId={params.courseId} {...user} />
        ))}
      </div>
      <div>
        {users.length === 0 && (
          <div className="text-xl text-center text-slate-700 ">
            No New enrollments Right now!
          </div>
        )}
      </div>
    </div>
  );
}

export default page;
