"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";
import { useEffect, useState } from "react";
import { useDebounce } from "@/hooks/useDebounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import qs from "query-string";

function SearchInput() {
  const [value, setValue] = useState("");
  const debouncedValue = useDebounce(value, 500);

  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log(debouncedValue);
  }, [debouncedValue, router, pathname]);

  return (
    <div className="relative ">
      <Search className="h-4 w-4 absolute top-3 left-3 text-slate-600" />
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full md:w-[300px] pl-9 rounded-full bg-slate-100 focus-visible:ring-slate-200"
        placeholder="Search for a Student..."
      />
    </div>
  );
}

export default SearchInput;
