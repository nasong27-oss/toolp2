import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (password !== process.env.SITE_PASSWORD) {
    return NextResponse.json({ error: "비밀번호가 틀렸습니다." }, { status: 401 });
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set("site_unlocked", process.env.SITE_PASSWORD_TOKEN!, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    // 30 days
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
}
