"use client";
import { UserButton, useAuth } from "@clerk/nextjs";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./SearchInput";

const NavbarRoutes = ({
  isAdmin,
  isTeacher,
}: {
  isAdmin: boolean;
  isTeacher: boolean;
}) => {
  const { userId } = useAuth();

  const pathname = usePathname();
  const router = useRouter();
  const isTeacherPage = pathname?.startsWith("/dashboard/teacher");
  const isCoursesPage = pathname?.startsWith("/dashboard/courses");
  const isAdminPage = pathname?.startsWith("/dashboard/admin");
  const isSearchPage = pathname === "/dashboard/search";
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:block">
          <SearchInput />
        </div>
      )}
      <div className="flex gap-x-2 mr-auto">
        {isTeacherPage || isCoursesPage || isAdminPage ? (
          <Link href={"/dashboard"}>
            <Button size={"sm"} variant={"ghost"}>
              اخرج
              <LogOut className="h-4 mr-2 w-4" />
            </Button>
          </Link>
        ) : isAdmin ? (
          <Link href={"/dashboard/admin"}>
            <Button size={"sm"} variant={"outline"}>
              لوحة تحكم الأدمن{" "}
            </Button>
          </Link>
        ) : (
          isTeacher && (
            <Link href={"/dashboard/teacher/courses"}>
              <Button size={"sm"} variant={"outline"}>
                لوحة تحكم المدرس{" "}
              </Button>
            </Link>
          )
        )}
        <UserButton afterSignOutUrl="/" />{" "}
      </div>
    </>
  );
};

export default NavbarRoutes;
