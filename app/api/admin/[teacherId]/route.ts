import { isAdmin } from "@/lib/admin";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { teacherId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({
        success: false,
        message: "ليس لديك الصلاحية",
      });
    }
    const teacherId = params.teacherId;
    const { name, subject } = await req.json();
    console.log(teacherId);

    const user = await clerkClient.users.getUser(teacherId);
    if (!user) {
      return NextResponse.json({
        success: false,
        message: "لا يوجد مستخدم بهذا الرقم التعريفي",
      });
    }
    await clerkClient.users.updateUser(teacherId, {
      firstName: name,
      lastName: "",
      publicMetadata: {
        subject: subject,
      },
    });
    return NextResponse.json({
      success: true,
      message: "تمت تعديل المستخدم بنجاح",
    });
  } catch (error) {
    console.log("[TEACHER_UPDATE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
