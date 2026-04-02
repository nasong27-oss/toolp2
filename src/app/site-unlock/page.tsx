"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SiteUnlockPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/site-unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        router.push("/tools");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "비밀번호가 틀렸습니다.");
      }
    } catch {
      setError("오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
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
                onChange={(e) => setPassword(e.target.value)}
                placeholder="비밀번호"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-500 focus:border-transparent text-gray-900 placeholder-gray-400"
                autoFocus
                required
              />
              {error && (
                <p className="mt-2 text-sm text-red-600">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-slate-900 text-white py-3 px-4 rounded-xl font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "확인 중..." : "입장하기"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
