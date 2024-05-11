import { Suspense } from "react";
import Navbar from "./_components/Navbar";
import Sidebar from "./_components/Sidebar";
import Loading from "./loading";
import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import limitSession from "@/actions/limitSession";

const DashboardLayout = async ({ children }: { children: React.ReactNode }) => {
  const clerk = auth();

  const { userId, sessionId } = clerk;
  if (!userId) return redirect("/");
  const isAllowed = await limitSession(userId, sessionId);
  if (!isAllowed) return redirect("/");
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
