"use client"

import { useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Navbar } from "@/components/navbar"
import { Hero } from "@/components/hero"
import { AboutSection } from "@/components/about-section"

export default function Page() {
  const searchParams = useSearchParams()
  const [autoOpenLogin, setAutoOpenLogin] = useState(false)

  useEffect(() => {
    const shouldLogin = searchParams.get("login") === "true"
    if (shouldLogin) {
      setAutoOpenLogin(true)
      // Clean up the URL
      window.history.replaceState({}, "", "/")
    }
  }, [searchParams])

  return (
    <main className="min-h-screen bg-background">
      <Navbar autoOpenLogin={autoOpenLogin} />
      <Hero />
      <AboutSection />
    </main>
  )
}
