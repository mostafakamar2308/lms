import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

// ADD new Teacher
export async function POST(req: Request) {
  try {
    const { userId } = auth();
    console.log(userId);

    if (!userId || !(await isAdmin(userId))) {
      return NextResponse.json({
        success: false,
        message: "ليس لديك الصلاحية",
      });
    }

    const { email } = await req.json();
    console.log(email);

    const user = await clerkClient.users.getUserList({
      query: email,
    });
    if (user.data.length === 0 || user.data.length > 1) {
      return NextResponse.json({
        success: false,
        message: "لا يوجد مستخدم بهذا البريد",
      });
    }
    await clerkClient.users.updateUserMetadata(user.data[0].id, {
      privateMetadata: {
        role: "teacher",
      },
    });
    return NextResponse.json({
      success: true,
      message: "تمت إضافة المستخدم بنجاح",
    });
  } catch (error) {
    console.log("[TEACHER_ADD]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

// Remove new Teacher
export async function DELETE(req: Request) {
  const { userId } = auth();
  if (!userId || (await isAdmin(userId))) {
    return NextResponse.json({ success: false });
  }
  const { teacherId } = await req.json();
  await clerkClient.users.updateUserMetadata(teacherId, {
    privateMetadata: {
      role: "",
    },
  });
  return NextResponse.json({ success: true });
}
