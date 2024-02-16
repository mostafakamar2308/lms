import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
export default function Home() {
  return (
    <div className="text-2xl text-sky-700 font-bold">
      <UserButton afterSignOutUrl="/" />
    </div>
  );
}
