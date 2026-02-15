"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ChatMockup } from "@/components/chat-mockup"


export function Hero() {
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pt-20 pb-16">
      {/* Gradient background */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 50% 0%, hsla(210, 80%, 32%, 0.35), transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Subtle grid overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(hsla(210, 40%, 60%, 0.4) 1px, transparent 1px), linear-gradient(90deg, hsla(210, 40%, 60%, 0.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
        aria-hidden="true"
      />

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5">
            <svg className="h-3.5 w-3.5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
            </svg>
            <span className="text-xs font-medium text-primary">
              AI-Powered Learning
            </span>
          </div>

        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-balance text-4xl font-bold leading-tight tracking-tight text-foreground sm:text-5xl md:text-6xl lg:text-7xl"
        >
          Master System Design{" "}
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            with Your AI Mentor
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="max-w-xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg"
        >
          Stop guessing, start building. Get personalized guidance on
          distributed systems, scalability patterns, and real-world
          architecture — tailored for junior developers ready to level up.
        </motion.p>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
        >
          <Button
            size="lg"
            asChild
            className="gap-3 rounded-xl bg-primary px-8 py-4 text-lg font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/30 animate-pulse-glow"
          >
            <Link href="/chat" className="inline-flex items-center gap-3">
              <MessageSquare className="h-6 w-6" />
              Chat Now
            </Link>
          </Button>
        </motion.div>


        {/* Trust indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground"
        >
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Free to start
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            No credit card required
          </span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Powered by Gemini 2.5 Flash
          </span>

        </motion.div>
      </div>

      {/* Chat Mockup */}
      <div className="relative z-10 mt-12 w-full max-w-3xl px-4 sm:mt-16">
        <ChatMockup />
      </div>
    </section>
  )
}
