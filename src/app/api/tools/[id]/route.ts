import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const tool = await prisma.tool.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
  });

  if (!tool) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }

  return NextResponse.json(tool);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const tool = await prisma.tool.findUnique({ where: { id: params.id } });
  if (!tool) {
    return NextResponse.json({ error: "찾을 수 없습니다." }, { status: 404 });
  }
  if (tool.authorId !== session.user.id) {
    return NextResponse.json({ error: "권한이 없습니다." }, { status: 403 });
  }

  await prisma.tool.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
