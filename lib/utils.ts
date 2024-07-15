import { auth } from "@/auth";
import { type ClassValue, clsx } from "clsx";
import { redirect } from "next/navigation";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function getUserId() {
  const session: any = await auth();

  if (!session) {
    redirect("/sign-in");
  }
  return session.user.userId;
}
