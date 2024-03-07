import { redirect } from "next/navigation";
import SearchStudent from "./_components/SearchStudent";
import { auth } from "@clerk/nextjs";
import { db } from "@/lib/db";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

async function Page({ params }: { params: { courseId: string } }) {
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
  return (
    <div className="p-6">
      <Link
        href={`/dashboard/teacher/students/${params.courseId}`}
        className="flex items-center text-sm hover:opacity-75 transition mb-6 "
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Course Students
      </Link>
      <h1 className="text-xl mb-4 font-medium">Add New Students</h1>
      <div>
        <SearchStudent courseId={params.courseId} />
      </div>
    </div>
  );
}

export default Page;
