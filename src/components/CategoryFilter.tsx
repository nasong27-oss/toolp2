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

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "likes", label: "좋아요순" },
  { value: "comments", label: "댓글순" },
  { value: "author", label: "사람순" },
] as const;

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const currentSort = searchParams.get("sort") ?? "latest";

  function updateParams(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/tools?${params.toString()}`);
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {ALL_CATEGORIES.map((cat) => {
          const isActive = currentCategory === cat.value || (!currentCategory && cat.value === null);
          return (
            <button
              key={cat.value ?? "all"}
              onClick={() => updateParams("category", cat.value)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-colors",
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

      <div className="flex gap-1.5">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParams("sort", opt.value === "latest" ? null : opt.value)}
            className={cn(
              "px-3 py-1 rounded-full text-xs font-medium transition-colors",
              currentSort === opt.value
                ? "bg-slate-700 text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-slate-300"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
