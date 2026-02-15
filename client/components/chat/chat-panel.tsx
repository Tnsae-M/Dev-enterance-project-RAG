"use client";

import React, { useState, useRef, useEffect } from "react";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { getApiBase } from "@/lib/api";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/auth-context";

export type ChatMessage = { role: "user" | "ai"; content: string };

const STORAGE_PREFIX = "chat_history_";

export function ChatPanel() {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [streamingContent, setStreamingContent] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.email) return;
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + user.email);
      if (raw) {
        const parsed = JSON.parse(raw) as ChatMessage[];
        if (Array.isArray(parsed)) setMessages(parsed);
      }
    } catch {
      // ignore invalid stored data
    }
  }, [user?.email]);

  useEffect(() => {
    if (typeof window === "undefined" || !user?.email || messages.length === 0) return;
    try {
      localStorage.setItem(STORAGE_PREFIX + user.email, JSON.stringify(messages));
    } catch {
      // ignore quota errors
    }
  }, [user?.email, messages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, streamingContent]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setStreamingContent("");
    setLoading(true);

    const history = messages.map((m) => ({
      role: m.role === "ai" ? "model" as const : "user" as const,
      parts: [{ text: m.content }],
    }));

    try {
      const res = await fetch(`${getApiBase()}/api/chat`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history }),
      });

      if (!res.ok || !res.body) {
        setMessages((prev) => [
          ...prev,
          { role: "ai", content: "Sorry, something went wrong. Please try again." },
        ]);
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let full = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        full += chunk;
        setStreamingContent(full);
      }

      setMessages((prev) => [...prev, { role: "ai", content: full }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: "ai", content: "Network error. Please try again." },
      ]);
    } finally {
      setStreamingContent("");
      setLoading(false);
    }
  }

  const displayMessages = [...messages];
  if (streamingContent) {
    displayMessages.push({ role: "ai", content: streamingContent });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
        <div className="flex items-center gap-2 border-b border-border/40 bg-secondary/50 px-4 py-3">
          <div className="flex gap-1.5">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
            <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
            <div className="h-3 w-3 rounded-full bg-muted-foreground/20" />
          </div>
          <span className="ml-2 text-xs font-medium text-muted-foreground font-mono">
            devarcai.ai/chat
          </span>

        </div>

        <div className="flex max-h-[60vh] flex-col gap-4 overflow-y-auto p-4 sm:p-5">
          {displayMessages.length === 0 && (
            <p className="text-center text-sm text-muted-foreground py-8">
              Ask about system design...
            </p>
          )}
          {displayMessages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn(
                "flex gap-3",
                msg.role === "user" ? "flex-row-reverse" : ""
              )}
            >
              <div
                className={cn(
                  "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                  msg.role === "ai"
                    ? "bg-primary/15 text-primary"
                    : "bg-accent/15 text-accent"
                )}
              >
                {msg.role === "ai" ? (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                ) : (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}

              </div>
              <div
                className={cn(
                  "rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                  msg.role === "ai"
                    ? "bg-secondary/70 text-foreground"
                    : "bg-primary/10 text-foreground"
                )}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-border/40 p-3 sm:p-4"
        >
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
            <input
              type="text"
              value={input}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}

              placeholder="Ask about system design..."
              className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none"
              disabled={loading}
            />
            <Button
              type="submit"
              size="icon"
              className="h-8 w-8 shrink-0"
              disabled={loading || !input.trim()}
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>

            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
