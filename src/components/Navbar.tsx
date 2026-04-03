"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { LogOut, Plus } from "lucide-react";

export default function Navbar() {
  const { data: session, status } = useSession();

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/tools" className="flex items-center gap-2 font-bold text-gray-900 min-w-0">
          <span className="text-xl flex-shrink-0">🧰</span>
          <span className="truncate">Product2 Toolbox</span>
        </Link>

        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="w-8 h-8 rounded-full bg-gray-100 animate-pulse" />
          ) : session?.user ? (
            <>
              <Link
                href="/tools/new"
                className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
              >
                <Plus size={15} />
                <span>등록하기</span>
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
              </div>
              <button
                onClick={() => signOut()}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                title="로그아웃"
              >
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <Link
              href="/tools/new"
              className="flex items-center gap-1.5 bg-slate-900 text-white text-sm px-3 py-2 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <Plus size={15} />
              <span>등록하기</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
