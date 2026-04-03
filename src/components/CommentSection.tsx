"use client";

import { useState } from "react";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { formatDate } from "@/lib/utils";

interface Comment {
  id: string;
  body: string;
  createdAt: string;
  author: {
    id: string;
    name: string | null;
    image: string | null;
  };
}

interface CommentSectionProps {
  toolId: string;
  initialComments: Comment[];
  isLoggedIn: boolean;
  currentUserId?: string;
}

export default function CommentSection({
  toolId,
  initialComments,
  isLoggedIn,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] = useState(initialComments);
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim() || submitting) return;

    setSubmitting(true);
    try {
      const res = await fetch(`/api/tools/${toolId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: body.trim() }),
      });

      if (res.ok) {
        const newComment = await res.json();
        setComments([...comments, newComment]);
        setBody("");
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        댓글 {comments.length > 0 && <span className="text-gray-400 font-normal text-base">({comments.length})</span>}
      </h2>

      {comments.length === 0 ? (
        <p className="text-gray-400 text-sm mb-6">아직 댓글이 없어요. 첫 댓글을 남겨보세요!</p>
      ) : (
        <div className="space-y-4 mb-6">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              {comment.author.image ? (
                <Image
                  src={comment.author.image}
                  alt={comment.author.name ?? ""}
                  width={32}
                  height={32}
                  className="rounded-full flex-shrink-0"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-sm text-slate-600 flex-shrink-0">
                  {comment.author.name?.charAt(0) ?? "?"}
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-900">
                    {comment.author.name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDate(comment.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.body}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {isLoggedIn ? (
        <form onSubmit={handleSubmit} className="flex gap-3">
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="댓글을 입력하세요... (로그인 필요)"
            rows={2}
            className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-500 text-gray-900 text-sm resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !body.trim()}
            className="px-4 py-2.5 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-end"
          >
            {submitting ? "..." : "등록"}
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => signIn("google", { callbackUrl: window.location.pathname })}
          className="w-full text-sm text-gray-500 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg px-4 py-3 transition-colors text-left"
        >
          💬 댓글을 남기려면 <span className="font-medium text-slate-700">Google 로그인</span>이 필요합니다
        </button>
      )}
    </div>
  );
}
