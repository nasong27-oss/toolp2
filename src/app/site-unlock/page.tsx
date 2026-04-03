"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const PASSWORD = "davv"; // 길이 기준으로 자동 제출

export default function SiteUnlockPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (password.length === PASSWORD.length) {
      handleSubmitPassword(password);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [password]);

  async function handleSubmitPassword(pw: string) {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/site-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pw }),
      });
      if (res.ok) {
        router.push("/tools");
        router.refresh();
      } else {
        setError("비밀번호가 틀렸습니다.");
        setPassword("");
      }
    } catch {
      setError("오류가 발생했습니다.");
      setPassword("");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!password) return;
    await handleSubmitPassword(password);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="text-center mb-8">
            <div className="text-4xl mb-3">🧰</div>
            <h1 className="text-2xl font-bold text-gray-900">Product2 Toolbox</h1>
            <p className="text-gray-500 mt-2 text-sm">팀 전용 공간입니다. 비밀번호를 입력해주세요.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => { setError(""); setPassword(e.target.value); }}
                placeholder="비밀번호"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 placeholder-gray-400 text-center text-lg tracking-widest"
                autoFocus
                disabled={loading}
                maxLength={20}
              />
              {error && <p className="mt-2 text-sm text-red-600 text-center">{error}</p>}
              {loading && <p className="mt-2 text-sm text-gray-400 text-center">확인 중...</p>}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              입장하기
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
