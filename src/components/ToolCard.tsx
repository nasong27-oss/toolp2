import Link from "next/link";
import Image from "next/image";
import { MessageSquare, Heart, ExternalLink } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "./CategoryBadge";
import { Category } from "@prisma/client";

interface ToolCardProps {
  tool: {
    id: string;
    title: string;
    url: string;
    description: string;
    githubUrl: string | null;
    helpRequest: string | null;
    category: Category;
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
  return (
    <div className="relative bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col">
      {/* 전체 카드 클릭 영역 */}
      <Link href={`/tools/${tool.id}`} className="absolute inset-0 z-0" aria-label={tool.title} />

      <div className="relative z-10 p-4 flex-1 pointer-events-none">
        <div className="flex items-center justify-between gap-2 mb-2">
          <CategoryBadge category={tool.category} />
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="pointer-events-auto text-gray-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <ExternalLink size={15} />
          </a>
        </div>

        <h3 className="font-semibold text-gray-900 line-clamp-1 mb-1 text-sm">
          {tool.title}
        </h3>

        <p className="text-xs text-gray-500 line-clamp-2 mb-3">
          {tool.description}
        </p>

        {tool.helpRequest && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 mb-3">
            <p className="text-xs font-medium text-amber-800 mb-0.5">🙋 도와주세요</p>
            <p className="text-xs text-amber-700 line-clamp-1">{tool.helpRequest}</p>
          </div>
        )}
      </div>

      <div className="relative z-10 px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {tool.author.image ? (
            <Image
              src={tool.author.image}
              alt={tool.author.name ?? ""}
              width={20}
              height={20}
              className="rounded-full"
            />
          ) : (
            <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
              {tool.author.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="text-xs text-gray-500 truncate max-w-[80px]">{tool.author.name}</span>
        </div>

        <div className="flex items-center gap-2.5 text-gray-400 text-xs">
          <span className="flex items-center gap-0.5">
            <Heart size={12} />
            {tool._count.likes}
          </span>
          <span className="flex items-center gap-0.5">
            <MessageSquare size={12} />
            {tool._count.comments}
          </span>
          <span>{formatDate(tool.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
