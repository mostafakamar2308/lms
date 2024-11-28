"use client";

import { cn } from "@/lib/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { IconType } from "react-icons/lib";
import qs from "query-string";
interface CategoryItemProps {
  label: string;
  icon: IconType;
  value: string;
}
function CategoryItem({ label, icon: Icon, value }: CategoryItemProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategoryId = searchParams.get("categoryId");
  const currentTitle = searchParams.get("query");
  const isSelected = currentCategoryId === value;
  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: {
          query: currentTitle,
          categoryId: isSelected ? null : value,
        },
      },
      { skipNull: true, skipEmptyString: true }
    );
    router.push(url);
  };
  return (
    <button
      onClick={onClick}
      className={cn(
        "py-2 px-3 text-sm border border-slate-200 rounded-full flex items-center gap-x-1 transition hover:border-sky-700",
        isSelected && "border-sky-700 bg-sky-200/20 text-sky-800"
      )}
      type="button"
    >
      {/* {Icon && <Icon size={20} />} */}
      <div className="truncate">{label}</div>
    </button>
  );
}

export default CategoryItem;