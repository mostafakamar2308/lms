import { IconBadge } from "@/components/IconBadge";
import { LucideIcon } from "lucide-react";

interface InfoCardProps {
  icon: LucideIcon;
  variant?: "default" | "success";
  label: string;
  numberOfItems: number;
}

function InfoCard({
  variant,
  icon: Icon,
  label,
  numberOfItems,
}: InfoCardProps) {
  return (
    <div className="border rounded-md flex items-center gap-x-2 p-3">
      <IconBadge icon={Icon} variant={variant} />
      <div className="">
        <p className="font-medium">{label}</p>
        <p className="text-gray-500 text-sm">
          {numberOfItems} {numberOfItems === 1 ? "Course" : "Courses"}
        </p>
      </div>
    </div>
  );
}

export default InfoCard;
