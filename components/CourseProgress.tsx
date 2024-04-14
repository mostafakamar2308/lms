import { cn } from "@/lib/utils";
import { Progress } from "./ui/progress";

interface CourseProgressProps {
  variant?: "default" | "success";
  size?: "sm" | "default";
  value: number;
}

const colorByVariant = {
  default: "text-sky-700",
  success: "text-emerald-700",
};

const sizeByVariant = {
  default: "text-sm",
  sm: "text-xs",
};

function CourseProgress({ value, variant, size }: CourseProgressProps) {
  return (
    <div>
      <Progress className="h-2 " variant={variant} value={value} />
      <p
        className={cn(
          "font-medium mt-2 text-sky-700",
          colorByVariant[variant || "default"],
          sizeByVariant[size || "default"]
        )}
      >
        اكتمل {Math.round(value)}%{" "}
      </p>
    </div>
  );
}

export default CourseProgress;
