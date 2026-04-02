"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Category } from "@prisma/client";
import { CATEGORY_LABELS } from "@/lib/utils";
import { cn } from "@/lib/utils";

const ALL_CATEGORIES = [
  { value: null, label: "전체" },
  { value: Category.WORK, label: CATEGORY_LABELS.WORK },
  { value: Category.RESEARCH, label: CATEGORY_LABELS.RESEARCH },
  { value: Category.GENERAL, label: CATEGORY_LABELS.GENERAL },
  { value: Category.FAILED, label: "💥 " + CATEGORY_LABELS.FAILED },
] as const;

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");

  function handleSelect(value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set("category", value);
    } else {
      params.delete("category");
    }
    router.push(`/tools?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {ALL_CATEGORIES.map((cat) => {
        const isActive = currentCategory === cat.value || (!currentCategory && cat.value === null);
        return (
          <button
            key={cat.value ?? "all"}
            onClick={() => handleSelect(cat.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-slate-900 text-white"
                : "bg-white text-gray-600 border border-gray-200 hover:border-slate-400"
            )}
          >
            {cat.label}
          </button>
        );
      })}
    </div>
  );
}
