import { Category } from "@prisma/client";
import { CATEGORY_LABELS, CATEGORY_COLORS, cn } from "@/lib/utils";

interface CategoryBadgeProps {
  category: Category;
  className?: string;
}

export default function CategoryBadge({ category, className }: CategoryBadgeProps) {
  const colors = CATEGORY_COLORS[category];
  const label = CATEGORY_LABELS[category];

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {category === "FAILED" && "💥 "}
      {label}
    </span>
  );
}
