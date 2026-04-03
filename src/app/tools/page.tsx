import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import ToolCard from "@/components/ToolCard";
import TagFilter from "@/components/TagFilter";
import { Suspense } from "react";

export const dynamic = "force-dynamic";

interface ToolsPageProps {
  searchParams: { tag?: string; sort?: string; authorId?: string };
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const session = await auth();
  const { tag, sort = "latest", authorId } = searchParams;

  const orderBy =
    sort === "likes"
      ? { likes: { _count: "desc" as const } }
      : sort === "comments"
      ? { comments: { _count: "desc" as const } }
      : sort === "author"
      ? { author: { name: "asc" as const } }
      : { createdAt: "desc" as const };

  const tools = await prisma.tool.findMany({
    where: {
      ...(tag ? { tags: { contains: tag } } : {}),
      ...(authorId ? { authorId } : {}),
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy,
  });

  // 전체 툴에서 모든 태그 수집
  const allTools = await prisma.tool.findMany({
    select: { tags: true },
    where: { tags: { not: "" } },
  });
  const tagSet = new Set<string>();
  allTools.forEach((t) => t.tags.split(",").filter(Boolean).forEach((tg) => tagSet.add(tg)));
  const allTags = Array.from(tagSet).sort();

  // 작성자 필터 중일 때 이름 가져오기
  let authorName: string | undefined;
  if (authorId) {
    const user = await prisma.user.findUnique({ where: { id: authorId }, select: { name: true } });
    authorName = user?.name ?? undefined;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-5">
      <div className="mb-5">
        <Suspense fallback={<div className="h-16" />}>
          <TagFilter allTags={allTags} authorName={authorName} />
        </Suspense>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-4xl mb-3">🧰</div>
          <p className="font-medium">등록된 툴이 없어요</p>
          {session?.user && (
            <p className="text-sm mt-2">
              <Link href="/tools/new" className="text-slate-700 underline">첫 번째로 등록</Link>해보세요!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
