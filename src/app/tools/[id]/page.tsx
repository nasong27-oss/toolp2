import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import CategoryBadge from "@/components/CategoryBadge";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";

interface ToolDetailPageProps {
  params: { id: string };
}

export default async function ToolDetailPage({ params }: ToolDetailPageProps) {
  const session = await auth();

  const [tool, comments, likeData] = await Promise.all([
    prisma.tool.findUnique({
      where: { id: params.id },
      include: {
        author: { select: { id: true, name: true, image: true } },
        _count: { select: { likes: true, comments: true } },
      },
    }),
    prisma.comment.findMany({
      where: { toolId: params.id },
      include: { author: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "asc" },
    }),
    session?.user?.id
      ? prisma.like.findUnique({
          where: {
            toolId_userId: { toolId: params.id, userId: session.user.id },
          },
        })
      : null,
  ]);

  if (!tool) notFound();

  const liked = !!likeData;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Link
        href="/tools"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 mb-6 transition-colors"
      >
        <ArrowLeft size={16} />
        목록으로
      </Link>

      <article>
        <div className="flex items-start justify-between gap-4 mb-4">
          <CategoryBadge category={tool.category} />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h1>

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium max-w-full truncate"
          >
            <ExternalLink size={14} className="flex-shrink-0" />
            <span className="truncate">{tool.url}</span>
          </a>
          {tool.githubUrl && (
            <a
              href={tool.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 flex-shrink-0"
            >
              <ExternalLink size={14} />
              GitHub
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-100">
          {tool.author.image ? (
            <Image
              src={tool.author.image}
              alt={tool.author.name ?? ""}
              width={36}
              height={36}
              className="rounded-full"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
              {tool.author.name?.charAt(0) ?? "?"}
            </div>
          )}
          <div>
            <p className="text-sm font-medium text-gray-900">{tool.author.name}</p>
            <p className="text-xs text-gray-400">{formatDate(tool.createdAt)}</p>
          </div>
          <div className="ml-auto">
            <LikeButton
              toolId={tool.id}
              initialCount={tool._count.likes}
              initialLiked={liked}
              isLoggedIn={!!session?.user}
            />
          </div>
        </div>

        <div className="prose prose-gray max-w-none mb-6">
          <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{tool.description}</p>
        </div>

        {tool.helpRequest && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8">
            <h3 className="text-sm font-semibold text-amber-900 mb-2 flex items-center gap-2">
              🙋 도와주세요
            </h3>
            <p className="text-sm text-amber-800 whitespace-pre-wrap">{tool.helpRequest}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-8">
          <CommentSection
            toolId={tool.id}
            initialComments={comments.map((c) => ({
              ...c,
              createdAt: c.createdAt.toISOString(),
            }))}
            isLoggedIn={!!session?.user}
            currentUserId={session?.user?.id}
          />
        </div>
      </article>
    </div>
  );
}
