import NavbarRoutes from "@/components/NavbarRoutes";
import MobileSidebar from "./MobileSidebar";
import { getUserId } from "@/lib/utils";

async function Navbar() {
  const userId = await getUserId();

  return (
    <div className="p-4 border-b- h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes userId={userId} />
    </div>
  );
}

export default Navbar;
