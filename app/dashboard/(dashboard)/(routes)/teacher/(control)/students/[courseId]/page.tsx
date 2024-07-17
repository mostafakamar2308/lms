import ActivatedUserCard from "@/components/ActivatedUserCard";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { ArrowRight, PlusCircle } from "lucide-react";
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
      name: `${user.firstName} ${user.lastName || ""}`,
      email: user.emailAddresses[0].emailAddress,
      updatedAt: purchase.updatedAt,
    });
  }
  return (
    <div className="p-6">
      <Link
        href={`/dashboard/teacher/students`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6 "
      >
        <ArrowRight className="h-4 w-4 ml-2" />
        إلي صفحة الطلاب
      </Link>
      <div className="flex justify-between flex-wrap md:flex-nowrap gap-1 mb-4">
        <h1 className="text-xl font-medium ">
          الطلاب في كورس <span className="">{courseOwner.title}</span>
        </h1>
        <Link href={`/dashboard/teacher/students/${params.courseId}/add`}>
          <Button className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4 text-white" /> أضف طالب جديد
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((user) => (
          <ActivatedUserCard
            key={user.id}
            {...user}
            courseId={params.courseId}
          />
        ))}
      </div>
      {users.length === 0 && (
        <h2 className="text-slate-700 text-center">
          لا يوجد طلاب لهذا الكورس !
        </h2>
      )}
    </div>
  );
}

export default page;
