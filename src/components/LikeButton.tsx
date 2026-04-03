"use client";

import { useState } from "react";
import { Heart } from "lucide-react";
import { signIn } from "next-auth/react";
import { cn } from "@/lib/utils";

interface LikeButtonProps {
  toolId: string;
  initialCount: number;
  initialLiked: boolean;
  isLoggedIn: boolean;
}

export default function LikeButton({
  toolId,
  initialCount,
  initialLiked,
  isLoggedIn,
}: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (!isLoggedIn) {
      window.location.href = `/api/auth/signin/google?callbackUrl=${encodeURIComponent(window.location.pathname)}`;
      return;
    }
    if (loading) return;

    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    setLoading(true);

    try {
      const res = await fetch(`/api/tools/${toolId}/like`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        setLiked(data.liked);
        setCount(data.count);
      } else {
        setLiked(liked);
        setCount(count);
      }
    } catch {
      setLiked(liked);
      setCount(count);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={cn(
        "flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all",
        liked
          ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700"
      )}
    >
      <Heart size={16} className={cn(liked ? "fill-red-500 text-red-500" : "")} />
      <span>{count}</span>
    </button>
  );
}
