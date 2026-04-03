import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound, redirect } from "next/navigation";
import ToolForm from "@/components/ToolForm";

export default async function EditToolPage({ params }: { params: { id: string } }) {
  const session = await auth();
  if (!session?.user?.id) redirect("/tools");

  const tool = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!tool) notFound();
  if (tool.authorId !== session.user.id) redirect("/tools");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">툴 수정하기</h1>
      </div>
      <ToolForm
        toolId={tool.id}
        initialData={{
          title: tool.title,
          url: tool.url,
          description: tool.description,
          githubUrl: tool.githubUrl,
          helpRequest: tool.helpRequest,
          tags: tool.tags,
        }}
      />
    </div>
  );
}
