import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip gate for these paths
  if (
    pathname.startsWith("/site-unlock") ||
    pathname.startsWith("/api/site-unlock") ||
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname === "/favicon.ico"
  ) {
    return NextResponse.next();
  }

  const cookie = request.cookies.get("site_unlocked");
  const isUnlocked =
    cookie?.value === process.env.SITE_PASSWORD_TOKEN;

  if (!isUnlocked) {
    return NextResponse.redirect(new URL("/site-unlock", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
