import Link from "next/link";
import Logo from "../dashboard/(dashboard)/_components/Logo";

function HomeHeader() {
  return (
    <header className="p-6 flex gap-4 justify-between items-center">
      <Logo />

      <Link
        href="/dashboard"
        className="md:w-60 w-20 hover:bg-sky-700 duration-300 bg-black text-white py-2 text-center"
      >
        Sign In
      </Link>
    </header>
  );
}

export default HomeHeader;
