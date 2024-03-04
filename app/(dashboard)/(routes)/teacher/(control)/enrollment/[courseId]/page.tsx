import UserCard from "@/components/UserCard";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs";
import { clerkClient } from "@clerk/nextjs/server";
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
      name: `${user.firstName} ${user.lastName}`,
      email: user.emailAddresses[0].emailAddress,
      createdAt: purchase.createdAt,
    });
  }

  return (
    <>
      <div className="p-6 grid md:grid-cols-2 grid-cols-1 gap-3">
        {users.map((user) => (
          <UserCard key={user.id} courseId={params.courseId} {...user} />
        ))}
      </div>
      <div>
        {users.length === 0 && (
          <div className="text-xl text-center text-slate-700 ">
            No New enrollments
          </div>
        )}
      </div>
    </>
  );
}

export default page;
