import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const session = await auth();
  const searchParams = request.nextUrl.searchParams;
  const redirect = searchParams.get("redirect") || "/tools";

  // Sanitize redirect path (must be relative, not external)
  const safePath = redirect.startsWith("/") && !redirect.startsWith("//") ? redirect : "/tools";

  if (session?.user) {
    // Authenticated via Google → automatically grant site access
    const response = NextResponse.redirect(new URL(safePath, request.url));
    response.cookies.set("site_unlocked", process.env.SITE_PASSWORD_TOKEN!, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    return response;
  }

  return NextResponse.redirect(new URL("/site-unlock", request.url));
}
