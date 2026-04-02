import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const toolId = params.id;
  const userId = session.user.id;

  const existing = await prisma.like.findUnique({
    where: { toolId_userId: { toolId, userId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    const count = await prisma.like.count({ where: { toolId } });
    return NextResponse.json({ liked: false, count });
  } else {
    await prisma.like.create({ data: { toolId, userId } });
    const count = await prisma.like.count({ where: { toolId } });
    return NextResponse.json({ liked: true, count });
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const session = await auth();
  const toolId = params.id;

  const count = await prisma.like.count({ where: { toolId } });

  if (session?.user?.id) {
    const existing = await prisma.like.findUnique({
      where: { toolId_userId: { toolId, userId: session.user.id } },
    });
    return NextResponse.json({ count, liked: !!existing });
  }

  return NextResponse.json({ count, liked: false });
}
