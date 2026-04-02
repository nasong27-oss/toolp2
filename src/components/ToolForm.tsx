"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Category } from "@prisma/client";
import { CATEGORY_LABELS } from "@/lib/utils";

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요. (https://...)"),
  description: z.string().min(1, "설명을 입력해주세요."),
  githubUrl: z
    .string()
    .url("올바른 URL을 입력해주세요.")
    .optional()
    .or(z.literal("")),
  helpRequest: z.string().optional(),
  category: z.nativeEnum(Category),
});

type FormData = z.infer<typeof schema>;

export default function ToolForm() {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { category: Category.GENERAL },
  });

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setServerError("");

    try {
      const res = await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        router.push("/tools");
        router.refresh();
      } else {
        const err = await res.json();
        setServerError(err.error?.message || "오류가 발생했습니다.");
      }
    } catch {
      setServerError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {serverError}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          제목 <span className="text-red-500">*</span>
        </label>
        <input
          {...register("title")}
          placeholder="만든 툴/컨텐츠의 이름"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          URL <span className="text-red-500">*</span>
        </label>
        <input
          {...register("url")}
          placeholder="https://..."
          type="url"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
        />
        {errors.url && (
          <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="어떤 툴인지, 어떻게 만들었는지 설명해주세요."
          rows={4}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 resize-none"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          카테고리 <span className="text-red-500">*</span>
        </label>
        <select
          {...register("category")}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 bg-white"
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {value === "FAILED" ? "💥 " : ""}{label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          GitHub Repo
          <span className="text-gray-400 font-normal ml-1">(선택)</span>
        </label>
        <input
          {...register("githubUrl")}
          placeholder="https://github.com/..."
          type="url"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
        />
        {errors.githubUrl && (
          <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          🙋 도와주세요
          <span className="text-gray-400 font-normal ml-1">(선택)</span>
        </label>
        <textarea
          {...register("helpRequest")}
          placeholder="원하는 피드백, 구현하고 싶은데 못한 것, 팀원들에게 부탁하고 싶은 것을 적어주세요."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex-1 px-6 py-3 border border-gray-200 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
        >
          취소
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="flex-1 px-6 py-3 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {submitting ? "등록 중..." : "등록하기"}
        </button>
      </div>
    </form>
  );
}
