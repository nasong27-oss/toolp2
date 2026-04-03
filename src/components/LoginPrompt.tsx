"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

interface LoginPromptProps {
  message: string;
}

export default function LoginPrompt({ message }: LoginPromptProps) {
  const router = useRouter();

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-8 max-w-sm w-full text-center">
        <div className="text-4xl mb-4">🔐</div>
        <h2 className="text-lg font-semibold text-gray-900 mb-2">로그인이 필요해요</h2>
        <p className="text-sm text-gray-500 mb-6">{message}</p>
        <button
          onClick={() => signIn("google", { callbackUrl: "/tools" })}
          className="w-full flex items-center justify-center gap-2 bg-slate-900 text-white py-3 rounded-xl font-medium hover:bg-slate-700 transition-colors"
        >
          Google로 로그인
        </button>
        <button
          onClick={() => router.back()}
          className="w-full mt-3 text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
}
