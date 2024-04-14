"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";
import { isTeacher } from "@/lib/teacher";

const NavbarRoutes = () => {
  const { userId } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
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
      <div className="flex gap-x-2 mr-auto">
        {isTeacherPage || isCoursesPage ? (
          <Link href={"/dashboard"}>
            <Button size={"sm"} variant={"ghost"}>
              اخرج
              <LogOut className="h-4 mr-2 w-4" />
            </Button>
          </Link>
        ) : isTeacher(userId) ? (
          <Link href={"/dashboard/teacher/courses"}>
            <Button size={"sm"} variant={"outline"}>
              لوحة تحكم المدرس{" "}
            </Button>
          </Link>
        ) : null}
        <UserButton afterSignOutUrl="/" />{" "}
      </div>
    </>
  );
};

export default NavbarRoutes;
