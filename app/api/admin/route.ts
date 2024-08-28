import { NextResponse } from "next/server";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";

// ADD new Teacher
export async function POST(req: Request) {
  const { userId } = auth();
  if (!userId || (await isAdmin(userId))) {
    return NextResponse.json({ success: false });
  }
  const { teacherId } = await req.json();
  await clerkClient.users.updateUserMetadata(teacherId, {
    privateMetadata: {
      role: "teacher",
    },
  });
  return NextResponse.json({ success: true });
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
