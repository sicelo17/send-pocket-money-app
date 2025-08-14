"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginSuccess } from "@/store/slices/authSlice"
import { authService } from "@/lib/auth"
import { Loader2 } from "lucide-react"

interface AuthGuardProps {
  children: React.ReactNode
}

export function AuthGuard({ children }: AuthGuardProps) {
  const dispatch = useAppDispatch()
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      dispatch(loginSuccess(currentUser))
    } else if (!isAuthenticated && !isLoading) {
      router.push("/auth")
    }
  }, [dispatch, isAuthenticated, isLoading, router])

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}
