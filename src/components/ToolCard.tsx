"use client";

import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Heart, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { useRouter, useSearchParams } from "next/navigation";

interface ToolCardProps {
  tool: {
    id: string;
    title: string;
    url: string;
    description: string;
    githubUrl: string | null;
    helpRequest: string | null;
    tags: string;
    createdAt: Date | string;
    author: {
      id: string;
      name: string | null;
      image: string | null;
    };
    _count: {
      likes: number;
      comments: number;
    };
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tags = tool.tags ? tool.tags.split(",").filter(Boolean) : [];

  function handleAuthorClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const params = new URLSearchParams(searchParams.toString());
    params.set("authorId", tool.author.id);
    params.delete("tag");
    router.push(`/tools?${params.toString()}`);
  }

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-md active:scale-[0.98] transition-all flex flex-col cursor-pointer">
      <Link href={`/tools/${tool.id}`} className="absolute inset-0 z-0" prefetch aria-label={tool.title} />

      <div className="relative z-10 p-4 flex-1 pointer-events-none">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {tags.slice(0, 3).map((tag) => (
              <span key={tag} className="text-xs text-slate-500 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full">
                #{tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-gray-400">+{tags.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 line-clamp-1 text-sm flex-1">
            {tool.title}
          </h3>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto text-gray-400 hover:text-slate-600 transition-colors flex-shrink-0 mt-0.5"
          >
            <ExternalLink size={14} />
          </a>
        </div>

        <p className="text-xs text-gray-500 line-clamp-2 mb-2">
          {tool.description}
        </p>

        {tool.helpRequest && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-2">
            <p className="text-xs text-amber-700 line-clamp-1">🙋 {tool.helpRequest}</p>
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
        <button
          onClick={handleAuthorClick}
          className="flex items-center gap-1.5 hover:opacity-70 transition-opacity"
        >
          {tool.author.image ? (
            <Image src={tool.author.image} alt={tool.author.name ?? ""} width={18} height={18} className="rounded-full" />
          ) : (
            <div className="w-4.5 h-4.5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
              {tool.author.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="text-xs text-gray-500 truncate max-w-[72px]">{tool.author.name}</span>
        </button>

        <div className="flex items-center gap-2 text-gray-400 text-xs">
          <span className="flex items-center gap-0.5"><Heart size={11} />{tool._count.likes}</span>
          <span className="flex items-center gap-0.5"><MessageSquare size={11} />{tool._count.comments}</span>
          <span>{formatDate(tool.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
