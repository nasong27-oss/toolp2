import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import LikeButton from "@/components/LikeButton";
import CommentSection from "@/components/CommentSection";
import DeleteButton from "@/components/DeleteButton";

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
          where: { toolId_userId: { toolId: params.id, userId: session.user.id } },
        })
      : null,
  ]);

  if (!tool) notFound();

  const liked = !!likeData;
  const isAuthor = session?.user?.id === tool.authorId;
  const tags = tool.tags ? tool.tags.split(",").filter(Boolean) : [];

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-5">
        <Link href="/tools" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={15} />
          목록으로
        </Link>
        {isAuthor && (
          <div className="flex items-center gap-2">
            <Link
              href={`/tools/${tool.id}/edit`}
              className="text-xs text-gray-500 border border-gray-200 px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
            >
              수정
            </Link>
            <DeleteButton toolId={tool.id} />
          </div>
        )}
      </div>

      <article>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {tags.map((tag) => (
              <Link
                key={tag}
                href={`/tools?tag=${encodeURIComponent(tag)}`}
                className="text-xs text-slate-600 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full hover:bg-slate-100 transition-colors"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-3">{tool.title}</h1>

        <div className="flex flex-wrap items-center gap-3 mb-5">
          <a href={tool.url} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm text-blue-600 hover:text-blue-800 font-medium max-w-full">
            <ExternalLink size={14} className="flex-shrink-0" />
            <span className="truncate">{tool.url}</span>
          </a>
          {tool.githubUrl && (
            <a href={tool.githubUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-800 flex-shrink-0">
              <ExternalLink size={14} />
              GitHub
            </a>
          )}
        </div>

        <div className="flex items-center gap-3 mb-5 pb-5 border-b border-gray-100">
          <Link href={`/tools?authorId=${tool.author.id}`} className="flex items-center gap-2 hover:opacity-70 transition-opacity">
            {tool.author.image ? (
              <Image src={tool.author.image} alt={tool.author.name ?? ""} width={32} height={32} className="rounded-full" />
            ) : (
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-600">
                {tool.author.name?.charAt(0) ?? "?"}
              </div>
            )}
            <div>
              <p className="text-sm font-medium text-gray-900">{tool.author.name}</p>
              <p className="text-xs text-gray-400">{formatDate(tool.createdAt)}</p>
            </div>
          </Link>
          <div className="ml-auto">
            <LikeButton toolId={tool.id} initialCount={tool._count.likes} initialLiked={liked} isLoggedIn={!!session?.user} />
          </div>
        </div>

        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap mb-6">{tool.description}</p>

        {tool.helpRequest && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-8">
            <h3 className="text-sm font-semibold text-amber-900 mb-1.5">🙋 도와주세요</h3>
            <p className="text-sm text-amber-800 whitespace-pre-wrap">{tool.helpRequest}</p>
          </div>
        )}

        <div className="border-t border-gray-100 pt-6">
          <CommentSection
            toolId={tool.id}
            initialComments={comments.map((c) => ({ ...c, createdAt: c.createdAt.toISOString() }))}
            isLoggedIn={!!session?.user}
            currentUserId={session?.user?.id}
          />
        </div>
      </article>
    </div>
  );
}
