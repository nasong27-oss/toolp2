"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Plus, LogOut, LogIn } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-12 flex items-center justify-between gap-2">
        <Link href="/tools" className="flex items-center gap-1.5 font-bold text-gray-900 min-w-0 flex-shrink-0">
          <span className="text-lg">🧰</span>
          <span className="text-sm truncate hidden xs:block">Product2 Toolbox</span>
        </Link>

        <div className="flex items-center gap-1.5">
          {status === "loading" ? (
            <div className="w-7 h-7 rounded-full bg-gray-100 animate-pulse" />
          ) : session?.user ? (
            <>
              <Link
                href="/tools/new"
                className="flex items-center gap-1 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus size={13} />
                등록하기
              </Link>
              <div className="flex items-center gap-1.5 ml-1">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={26}
                    height={26}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                    {session.user.name?.charAt(0) ?? "?"}
                  </div>
                )}
                <span className="text-xs text-gray-600 hidden sm:block max-w-[80px] truncate">
                  {session.user.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-gray-600 p-1 transition-colors"
                title="로그아웃"
              >
                <LogOut size={14} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => signIn("google", { callbackUrl: "/tools" })}
                className="flex items-center gap-1 text-gray-600 border border-gray-200 text-xs px-2.5 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <LogIn size={13} />
                로그인
              </button>
              <Link
                href="/tools/new"
                className="flex items-center gap-1 bg-slate-900 text-white text-xs px-2.5 py-1.5 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus size={13} />
                등록하기
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
