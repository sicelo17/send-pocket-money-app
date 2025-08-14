"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppSelector } from "@/store/hooks"
import { AuthForm } from "@/components/auth/auth-form"

export default function AuthPage() {
  const [mode, setMode] = useState<"signin" | "signup">("signin")
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard")
    }
  }, [isAuthenticated, router])

  const toggleMode = () => {
    setMode((prev) => (prev === "signin" ? "signup" : "signin"))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary mb-2">Send Pocket Money</h1>
          <p className="text-muted-foreground text-sm sm:text-base">Secure money transfers for your children abroad</p>
        </div>

        <AuthForm mode={mode} onToggleMode={toggleMode} />
      </div>
    </div>
  )
}
