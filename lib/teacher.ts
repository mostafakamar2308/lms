// export const isTeacher = (userId?: string | null) => {
//   return userId === process.env.NEXT_PUBLIC_TEACHER_ID;
// };

import { clerkClient } from "@clerk/nextjs/server";

export const isTeacher = async (userId?: string | null) => {
  if (!userId) {
    return false;
  }
  const user = await clerkClient.users.getUser(userId);
  const { role } = user.privateMetadata;
  return role === "teacher";
};
