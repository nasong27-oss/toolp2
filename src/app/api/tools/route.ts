import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Category } from "@prisma/client";
import { z } from "zod";

const createToolSchema = z.object({
  title: z.string().min(1, "제목을 입력해주세요."),
  url: z.string().url("올바른 URL을 입력해주세요."),
  description: z.string().min(1, "설명을 입력해주세요."),
  githubUrl: z.string().url("올바른 URL을 입력해주세요.").optional().or(z.literal("")),
  helpRequest: z.string().optional(),
  category: z.nativeEnum(Category),
});

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") as Category | null;

  const tools = await prisma.tool.findMany({
    where: category ? { category } : {},
    include: {
      author: { select: { id: true, name: true, image: true } },
      _count: { select: { likes: true, comments: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(tools);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }

  const body = await request.json();
  const parsed = createToolSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { title, url, description, githubUrl, helpRequest, category } = parsed.data;

  const tool = await prisma.tool.create({
    data: {
      title,
      url,
      description,
      githubUrl: githubUrl || null,
      helpRequest: helpRequest || null,
      category,
      authorId: session.user.id,
    },
    include: {
      author: { select: { id: true, name: true, image: true } },
    },
  });

  return NextResponse.json(tool, { status: 201 });
}
