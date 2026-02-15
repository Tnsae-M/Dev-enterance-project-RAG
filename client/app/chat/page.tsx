"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { ChatPanel } from "@/components/chat/chat-panel"
import { useAuth } from "@/contexts/auth-context"

export default function ChatPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/?login=true")
    }
  }, [loading, user, router])


  if (loading || !user) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="pt-24 flex justify-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <div className="pt-20 pb-8 px-4">
        <ChatPanel />
      </div>
    </main>
  )
}
