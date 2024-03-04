import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs";
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
      isActivated: true,
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
  console.log(users);
  return <div>page</div>;
}

export default page;
