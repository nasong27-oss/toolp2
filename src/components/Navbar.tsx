"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signIn, signOut } from "next-auth/react";
import { Plus, LogIn, LogOut } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/tools" className="flex items-center gap-2 font-bold text-gray-900">
          <span className="text-xl">🧰</span>
          <span>Product2 Toolbox</span>
        </Link>

        <div className="flex items-center gap-3">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : session?.user ? (
            <>
              <Link
                href="/tools/new"
                className="hidden sm:flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 px-3 py-1.5 rounded-lg hover:border-gray-300 transition-colors"
              >
                <Plus size={15} />
                등록하기
              </Link>
              <div className="flex items-center gap-2">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name ?? ""}
                    width={30}
                    height={30}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs text-slate-600">
                    {session.user.name?.charAt(0) ?? "?"}
                  </div>
                )}
                <span className="text-sm text-gray-700 hidden sm:block">
                  {session.user.name}
                </span>
              </div>
              <button
                onClick={() => signOut()}
                className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("google")}
              className="flex items-center gap-2 bg-slate-900 text-white text-sm px-4 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <LogIn size={15} />
              Google 로그인
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
