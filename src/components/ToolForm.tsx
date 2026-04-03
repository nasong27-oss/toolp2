"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";

const PRESET_TAGS = ["업무활용", "리서치/학습", "망했어요", "자동화", "AI", "디자인", "데이터"];

const schema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요. (https://...)"),
  description: z.string().min(1, "설명을 입력해주세요."),
  githubUrl: z.string().url("올바른 URL을 입력해주세요.").optional().or(z.literal("")),
  helpRequest: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface ToolFormProps {
  initialData?: {
    title: string;
    url: string;
    description: string;
    githubUrl?: string | null;
    helpRequest?: string | null;
    tags?: string;
  };
  toolId?: string;
}

export default function ToolForm({ initialData, toolId }: ToolFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [tags, setTags] = useState<string[]>(
    initialData?.tags ? initialData.tags.split(",").filter(Boolean) : []
  );
  const [tagInput, setTagInput] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: initialData?.title ?? "",
      url: initialData?.url ?? "",
      description: initialData?.description ?? "",
      githubUrl: initialData?.githubUrl ?? "",
      helpRequest: initialData?.helpRequest ?? "",
    },
  });

  function addTag(tag: string) {
    const clean = tag.replace(/^#/, "").trim();
    if (clean && !tags.includes(clean)) {
      setTags([...tags, clean]);
    }
    setTagInput("");
  }

  function removeTag(tag: string) {
    setTags(tags.filter((t) => t !== tag));
  }

  function handleTagKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === " " || e.key === ",") {
      e.preventDefault();
      if (tagInput.trim()) addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) {
      setTags(tags.slice(0, -1));
    }
  }

  async function onSubmit(data: FormData) {
    setSubmitting(true);
    setServerError("");

    const isEdit = !!toolId;
    const url = isEdit ? `/api/tools/${toolId}` : "/api/tools";
    const method = isEdit ? "PATCH" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, tags: tags.join(",") }),
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
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
        {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>}
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
        {errors.url && <p className="mt-1 text-sm text-red-600">{errors.url.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          설명 <span className="text-red-500">*</span>
        </label>
        <textarea
          {...register("description")}
          placeholder="어떤 툴인지, 어떻게 만들었는지 설명해주세요."
          rows={3}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 resize-none"
        />
        {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>}
      </div>

      {/* 해시태그 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          태그 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <div className="w-full min-h-[44px] px-3 py-2 border border-gray-200 rounded-lg focus-within:ring-2 focus-within:ring-slate-500 flex flex-wrap gap-1.5 items-center">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-full">
              #{tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-slate-400 hover:text-slate-700">
                <X size={11} />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            onBlur={() => { if (tagInput.trim()) addTag(tagInput); }}
            placeholder={tags.length === 0 ? "#태그 입력 후 Enter" : ""}
            className="flex-1 min-w-[100px] outline-none text-sm text-gray-900 bg-transparent"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {PRESET_TAGS.filter((t) => !tags.includes(t)).map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => addTag(tag)}
              className="text-xs text-gray-500 border border-gray-200 px-2 py-0.5 rounded-full hover:border-slate-400 hover:text-slate-700 transition-colors"
            >
              #{tag}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          GitHub Repo <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <input
          {...register("githubUrl")}
          placeholder="https://github.com/..."
          type="url"
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900"
        />
        {errors.githubUrl && <p className="mt-1 text-sm text-red-600">{errors.githubUrl.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          🙋 도와주세요 <span className="text-gray-400 font-normal">(선택)</span>
        </label>
        <textarea
          {...register("helpRequest")}
          placeholder="원하는 피드백, 구현하고 싶은데 못한 것, 팀원들에게 부탁하고 싶은 것"
          rows={2}
          className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 resize-none"
        />
      </div>

      <div className="flex gap-3 pt-1">
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
          {submitting ? "저장 중..." : toolId ? "수정하기" : "등록하기"}
        </button>
      </div>
    </form>
  );
}
