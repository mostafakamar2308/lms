import { clerkClient } from "@clerk/nextjs/server";
export const isAdmin = async (userId?: string | null) => {
  if (!userId) {
    return false;
  }
  const user = await clerkClient().users.getUser(userId);
  const { role } = user.privateMetadata;
  return role === "admin";
};
