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
    <div className="bg-white rounded-xl border border-gray-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col">
      <div className="p-5 flex-1">
        <div className="flex items-start justify-between gap-2 mb-3">
          <CategoryBadge category={tool.category} />
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-slate-600 transition-colors flex-shrink-0"
          >
            <ExternalLink size={16} />
          </a>
        </div>

        <Link href={`/tools/${tool.id}`}>
          <h3 className="font-semibold text-gray-900 hover:text-slate-700 transition-colors line-clamp-2 mb-2">
            {tool.title}
          </h3>
        </Link>

        <p className="text-sm text-gray-500 line-clamp-3 mb-4">
          {tool.description}
        </p>

        {tool.helpRequest && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-2.5 mb-4">
            <p className="text-xs font-medium text-amber-800 mb-1">🙋 도와주세요</p>
            <p className="text-xs text-amber-700 line-clamp-2">{tool.helpRequest}</p>
          </div>
        )}
      </div>

      <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {tool.author.image ? (
            <Image
              src={tool.author.image}
              alt={tool.author.name ?? ""}
              width={24}
              height={24}
              className="rounded-full"
            />
          ) : (
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
              {tool.author.name?.charAt(0) ?? "?"}
            </div>
          )}
          <span className="text-xs text-gray-500">{tool.author.name}</span>
        </div>

        <div className="flex items-center gap-3 text-gray-400 text-xs">
          <span className="flex items-center gap-1">
            <Heart size={13} />
            {tool._count.likes}
          </span>
          <span className="flex items-center gap-1">
            <MessageSquare size={13} />
            {tool._count.comments}
          </span>
          <span>{formatDate(tool.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
