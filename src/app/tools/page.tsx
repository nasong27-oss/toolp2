import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Category } from "@prisma/client";
import Link from "next/link";
import { Plus } from "lucide-react";
import ToolCard from "@/components/ToolCard";
import CategoryFilter from "@/components/CategoryFilter";
import { Suspense } from "react";

interface ToolsPageProps {
  searchParams: { category?: string };
}

export default async function ToolsPage({ searchParams }: ToolsPageProps) {
  const session = await auth();
  const category = searchParams.category as Category | undefined;

  const validCategories = Object.values(Category);
  const safeCategory =
    category && validCategories.includes(category) ? category : undefined;

  const tools = await prisma.tool.findMany({
    where: safeCategory ? { category: safeCategory } : {},
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Toolbox</h1>
          <p className="text-gray-500 text-sm mt-1">
            팀원들이 바이코딩으로 만든 툴과 컨텐츠 모음
          </p>
        </div>
        {session?.user ? (
          <Link
            href="/tools/new"
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors"
          >
            <Plus size={16} />
            등록하기
          </Link>
        ) : (
          <p className="text-sm text-gray-400">등록하려면 로그인하세요</p>
        )}
      </div>

      <div className="mb-6">
        <Suspense fallback={<div className="h-10" />}>
          <CategoryFilter />
        </Suspense>
      </div>

      {tools.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <div className="text-5xl mb-4">🧰</div>
          <p className="text-lg font-medium">아직 등록된 툴이 없어요</p>
          {session?.user && (
            <p className="text-sm mt-2">
              첫 번째로{" "}
              <Link href="/tools/new" className="text-slate-700 underline">
                툴을 등록
              </Link>
              해보세요!
            </p>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {tools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      )}
    </div>
  );
}
