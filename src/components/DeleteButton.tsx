"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ toolId }: { toolId: string }) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/tools/${toolId}`, { method: "DELETE" });
      if (res.ok) {
        router.push("/tools");
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-gray-500">정말 삭제할까요?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-white bg-red-500 px-2.5 py-1.5 rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? "..." : "삭제"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-gray-500 border border-gray-200 px-2.5 py-1.5 rounded-lg hover:bg-gray-50"
        >
          취소
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-500 border border-red-200 px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
    >
      삭제
    </button>
  );
}
