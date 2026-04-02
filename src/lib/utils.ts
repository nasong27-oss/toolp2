import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Category } from "@prisma/client";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CATEGORY_LABELS: Record<Category, string> = {
  WORK: "업무 활용",
  RESEARCH: "리서치, 학습",
  GENERAL: "일반",
  FAILED: "망했어요",
};

export const CATEGORY_COLORS: Record<
  Category,
  { bg: string; text: string; border: string }
> = {
  WORK: {
    bg: "bg-blue-100",
    text: "text-blue-800",
    border: "border-blue-200",
  },
  RESEARCH: {
    bg: "bg-purple-100",
    text: "text-purple-800",
    border: "border-purple-200",
  },
  GENERAL: {
    bg: "bg-gray-100",
    text: "text-gray-700",
    border: "border-gray-200",
  },
  FAILED: {
    bg: "bg-red-100",
    text: "text-red-800",
    border: "border-red-200",
  },
};

export function formatDate(date: Date | string): string {
  return new Date(date).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
