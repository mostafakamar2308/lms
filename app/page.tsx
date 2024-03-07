import Link from "next/link";

function page() {
  return (
    <div>
      <Link href={"/dashboard"}>Dashboard</Link>
    </div>
  );
}

export default page;
