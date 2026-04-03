"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

const SORT_OPTIONS = [
  { value: "latest", label: "최신순" },
  { value: "likes", label: "좋아요순" },
  { value: "comments", label: "댓글순" },
  { value: "author", label: "작성자순" },
] as const;

interface TagFilterProps {
  allTags: string[];
  authorName?: string;
}

export default function TagFilter({ allTags, authorName }: TagFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentTag = searchParams.get("tag");
  const currentSort = searchParams.get("sort") ?? "latest";
  const currentAuthorId = searchParams.get("authorId");

  function updateParam(key: string, value: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.push(`/tools?${params.toString()}`);
  }

  function clearAll() {
    router.push("/tools");
  }

  const hasActiveFilter = currentTag || currentAuthorId;

  return (
    <div className="space-y-2">
      {/* 활성 필터 표시 */}
      {hasActiveFilter && (
        <div className="flex items-center gap-2 flex-wrap">
          {currentTag && (
            <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-xs px-2.5 py-1 rounded-full">
              #{currentTag}
              <button onClick={() => updateParam("tag", null)}><X size={11} /></button>
            </span>
          )}
          {currentAuthorId && authorName && (
            <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-xs px-2.5 py-1 rounded-full">
              👤 {authorName}
              <button onClick={() => updateParam("authorId", null)}><X size={11} /></button>
            </span>
          )}
          <button onClick={clearAll} className="text-xs text-gray-400 hover:text-gray-600">
            전체보기
          </button>
        </div>
      )}

      {/* 태그 목록 */}
      {allTags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => updateParam("tag", currentTag === tag ? null : tag)}
              className={cn(
                "text-xs px-2.5 py-1 rounded-full transition-colors border",
                currentTag === tag
                  ? "bg-slate-800 text-white border-slate-800"
                  : "bg-white text-gray-600 border-gray-200 hover:border-slate-400"
              )}
            >
              #{tag}
            </button>
          ))}
        </div>
      )}

      {/* 정렬 */}
      <div className="flex gap-1.5 pt-0.5">
        {SORT_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => updateParam("sort", opt.value === "latest" ? null : opt.value)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border transition-colors",
              currentSort === opt.value
                ? "bg-slate-700 text-white border-slate-700"
                : "bg-white text-gray-500 border-gray-200 hover:border-slate-300"
            )}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
