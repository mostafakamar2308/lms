import { Suspense } from "react";

import Loading from "./loading";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import Navbar from "@/app/dashboard/(dashboard)/_components/Navbar";
import Sidebar from "@/app/dashboard/(dashboard)/_components/Sidebar";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const clerk = auth();

  const { userId } = clerk;
  if (!userId) return redirect("/");

  return (
    <div className="h-full" dir="rtl">
      <div className="h-[80px] md:pr-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </div>
      <div className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </div>
      <main className="md:pr-56 h-full pt-[80px]">
        <Suspense fallback={<Loading />}>{children}</Suspense>
      </main>
    </div>
  );
};

export default DashboardLayout;
