"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { BookA, LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { isTeacher } from "@/lib/teacher";
import { signOutFn } from "@/actions/logout";

function NavbarRoutes({ userId }: { userId: string }) {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
  const isCoursesPage = pathname?.startsWith("/dashboard/courses");
  const isSearchPage = pathname === "/dashboard/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 ml-4 mr-auto">
        {isTeacherPage || isCoursesPage ? (
          <Link href={"/dashboard"}>
            <Button size={"sm"} variant={"ghost"}>
              <BookA className="h-4 ml-2 w-4" />
              قائمة الكورسات
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/dashboard/teacher/courses"}>
            <Button size={"sm"} variant={"outline"}>
              لوحة تحكم المدرس{" "}
            </Button>
          </Link>
        ) : null}
      </div>
      <form action={signOutFn}>
        <Button type="submit" variant={"secondary"}>
          <LogOut className="h-4 ml-2 w-4" />
          تسجيل الخروج
        </Button>
      </form>
    </>
  );
}

export default NavbarRoutes;
