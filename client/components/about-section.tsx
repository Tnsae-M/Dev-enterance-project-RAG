"use client"
import { motion } from "framer-motion"
export function AboutSection() {
  return (
    <section className="relative py-20 px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="flex flex-col items-center gap-6"
        >
          {/* Icon */}
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
            </svg>
          </div>
          {/* Heading */}
          <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            About DevArcAi
          </h2>

          {/* Description */}
          <p className="text-lg leading-relaxed text-slate-300">
            DevArcAi is an intelligent System Design assistant. It provides tailored 
            explanations and architecture insights based specifically on the technical 
            documentation and system design content it is fed.
          </p>

          {/* Feature highlights */}
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/15 text-accent">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-foreground">
                Documentation-Based
              </h3>

              <p className="text-sm text-slate-400 text-center">
                Answers grounded in your specific technical docs and resources
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col items-center gap-3 rounded-xl border border-border/40 bg-card/50 p-6"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary">
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-foreground">
                Architecture Insights
              </h3>

              <p className="text-sm text-slate-400 text-center">
                Deep system design knowledge tailored to your learning needs
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
