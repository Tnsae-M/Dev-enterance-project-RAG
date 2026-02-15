"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { BrainCircuit, LogOut, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LoginForm } from "@/components/auth/login-form"
import { SignUpForm } from "@/components/auth/signup-form"
import { useAuth } from "@/contexts/auth-context"

type NavbarProps = {
  autoOpenLogin?: boolean;
};

export function Navbar({ autoOpenLogin = false }: NavbarProps) {
  const { user, loading, setUser, signOut } = useAuth()
  const [loginOpen, setLoginOpen] = useState(false)
  const [signUpOpen, setSignUpOpen] = useState(false)

  useEffect(() => {
    if (autoOpenLogin && !user && !loading) {
      setLoginOpen(true)
    }
  }, [autoOpenLogin, user, loading])


  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="sticky top-0 z-50 border-b border-border/40 bg-background/60 backdrop-blur-md"
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 py-4">
          <a href="/" className="flex items-center gap-2.5" aria-label="DevArcAi Home">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <BrainCircuit className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight text-foreground">
              DevArcAi
            </span>
          </a>

          <div className="flex items-center gap-3">
            {!loading && (
              user ? (
                <>
                  {user.role === "admin" && (
                    <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
                      <Link href="/admin" className="inline-flex items-center gap-1.5">
                        <LayoutDashboard className="h-4 w-4" />
                        Admin
                      </Link>
                    </Button>
                  )}
                  <span className="text-sm text-muted-foreground">{user.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => signOut()}
                    aria-label="Sign out"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </>
              ) : (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground hover:text-foreground"
                    onClick={() => setLoginOpen(true)}
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="border border-border/60 text-muted-foreground hover:text-foreground hover:border-primary/50"
                    onClick={() => setSignUpOpen(true)}
                  >
                    Sign Up
                  </Button>
                </>
              )
            )}
          </div>
        </nav>
      </motion.header>

      <LoginForm
        open={loginOpen}
        onOpenChange={setLoginOpen}
        onSuccess={(u) => u && setUser(u)}
      />
      <SignUpForm
        open={signUpOpen}
        onOpenChange={setSignUpOpen}
        onSuccess={(u) => u && setUser(u)}
      />
    </>
  )
}
