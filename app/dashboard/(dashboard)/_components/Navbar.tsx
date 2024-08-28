import NavbarRoutes from "@/components/NavbarRoutes";
import MobileSidebar from "./MobileSidebar";
import { auth } from "@clerk/nextjs/server";
import { isAdmin } from "@/lib/admin";
import { isTeacher } from "@/lib/teacher";

const Navbar = async () => {
  const { userId } = auth();
  const isUserAdmin = await isAdmin(userId);
  const isUserTeacher = await isTeacher(userId);
  return (
    <div className="p-4 border-b- h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes isAdmin={isUserAdmin} isTeacher={isUserTeacher} />
    </div>
  );
};

export default Navbar;
