"use client";

import {
  BarChart,
  Compass,
  Handshake,
  Layout,
  List,
  SquareUserRound,
} from "lucide-react";
import SidebarItem from "./SidebarItem";
import { usePathname } from "next/navigation";

const guestRoutes = [
  { icon: Layout, label: "كورساتى", href: "/dashboard" },
  { icon: Compass, label: "تصفح الكورسات", href: "/dashboard/search" },
];

const teacherRoutes = [
  { icon: List, label: "الكورسات", href: "/dashboard/teacher/courses" },
  {
    icon: BarChart,
    label: "تحليل البيانات",
    href: "/dashboard/teacher/analytics",
  },
  {
    icon: Handshake,
    label: "طلبات الانضمام",
    href: "/dashboard/teacher/enrollment",
  },
  {
    icon: SquareUserRound,
    label: "الطلاب",
    href: "/dashboard/teacher/students",
  },
];

const SidebarRoutes = () => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.includes("/teacher");
  const routes = isTeacherPage ? teacherRoutes : guestRoutes;
  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem key={route.href} {...route} />
      ))}
    </div>
  );
};

export default SidebarRoutes;
