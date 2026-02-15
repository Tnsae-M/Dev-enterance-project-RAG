"use client"

import { motion } from "framer-motion"


const messages = [
  {
    role: "user" as const,
    content: "How would you design a URL shortener like bit.ly?",
  },
  {
    role: "ai" as const,
    content:
      "Great question! Let's break it down step by step. First, we need to think about the core requirements: generating short URLs, redirecting users, and handling high traffic. I'd start with a hashing approach...",
  },
  {
    role: "user" as const,
    content: "What database would you use for this?",
  },
  {
    role: "ai" as const,
    content:
      "For a URL shortener, I'd recommend a NoSQL database like DynamoDB or Cassandra for the key-value lookups. The access pattern is simple: given a short code, return the original URL. This is a perfect fit for...",
  },
]

export function ChatMockup() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
      className="mx-auto w-full max-w-2xl"
    >
      <div className="overflow-hidden rounded-xl border border-border/60 bg-card shadow-2xl shadow-primary/5">
        {/* Window chrome */}
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

        {/* Messages */}
        <div className="flex flex-col gap-4 p-4 sm:p-5">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.6 + i * 0.15 }}
              className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                  msg.role === "ai"
                    ? "bg-primary/15 text-primary"
                    : "bg-accent/15 text-accent"
                }`}
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
                className={`rounded-xl px-4 py-2.5 text-sm leading-relaxed ${
                  msg.role === "ai"
                    ? "bg-secondary/70 text-foreground"
                    : "bg-primary/10 text-foreground"
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Input bar */}
        <div className="border-t border-border/40 p-3 sm:p-4">
          <div className="flex items-center gap-2 rounded-lg border border-border/60 bg-muted/40 px-3 py-2.5">
            <span className="flex-1 text-sm text-muted-foreground">
              Ask about system design...
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </div>

          </div>
        </div>
      </div>
    </motion.div>
  )
}
