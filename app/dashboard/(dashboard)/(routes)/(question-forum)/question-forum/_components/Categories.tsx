"use client";

import { Category } from "@prisma/client";
import {
  FcEngineering,
  FcMultipleDevices,
  FcOldTimeCamera,
  FcPicture,
  FcSalesPerformance,
  FcSportsMode,
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import CategoryItem from "./CategoryItem";

interface CategoriesProps {
  items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
  Accounting: FcSalesPerformance,
  "Computer Science": FcMultipleDevices,
  Engineering: FcEngineering,
  "Fitness Science": FcSportsMode,
  Photography: FcOldTimeCamera,
  "Art Science": FcPicture,
};

function Categories({ items }: CategoriesProps) {
  return (
    <div className="flex items-center  gap-x-2 overflow-x-auto pb-2">
      {items.map((item) => (
        <CategoryItem
          key={item.id}
          label={item.name}
          icon={iconMap[item.name]}
          value={item.id}
        />
      ))}
    </div>
  );
}

export default Categories;
