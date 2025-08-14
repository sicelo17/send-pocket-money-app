"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginStart, loginSuccess, loginFailure } from "@/store/slices/authSlice"
import { authService } from "@/lib/auth"
import { signUpSchema, signInSchema, type SignUpData, type SignInData } from "@/lib/validations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Shield, Lock, Mail, User } from "lucide-react"

interface AuthFormProps {
  mode: "signin" | "signup"
  onToggleMode: () => void
}

export function AuthForm({ mode, onToggleMode }: AuthFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const dispatch = useAppDispatch()
  const { isLoading, error } = useAppSelector((state) => state.auth)
  const router = useRouter()

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  const validateForm = () => {
    const schema = mode === "signup" ? signUpSchema : signInSchema
    const result = schema.safeParse(formData)

    if (!result.success) {
      const fieldErrors: Record<string, string> = {}
      result.error.errors.forEach((error) => {
        if (error.path[0]) {
          fieldErrors[error.path[0] as string] = error.message
        }
      })
      setErrors(fieldErrors)
      return false
    }

    setErrors({})
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    dispatch(loginStart())

    try {
      let user
      if (mode === "signup") {
        user = await authService.signUp(formData as SignUpData)
      } else {
        user = await authService.signIn(formData as SignInData)
      }

      dispatch(loginSuccess(user))
      router.push("/dashboard")
    } catch (error: any) {
      dispatch(loginFailure(error.message))
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="space-y-1 text-center px-4 sm:px-6">
        <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-primary/10 rounded-full">
          <Shield className="w-6 h-6 text-primary" />
        </div>
        <CardTitle className="text-xl sm:text-2xl font-bold">
          {mode === "signup" ? "Create Account" : "Welcome Back"}
        </CardTitle>
        <CardDescription className="text-sm sm:text-base">
          {mode === "signup"
            ? "Start sending money to your children abroad securely"
            : "Sign in to your Send Pocket Money account"}
        </CardDescription>
      </CardHeader>

      <CardContent className="px-4 sm:px-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
          {mode === "signup" && (
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Full Name
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className={`pl-10 h-11 sm:h-10 text-base sm:text-sm ${errors.name ? "border-destructive" : ""}`}
                  disabled={isLoading}
                />
              </div>
              {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`pl-10 h-11 sm:h-10 text-base sm:text-sm ${errors.email ? "border-destructive" : ""}`}
                disabled={isLoading}
                autoComplete="email"
              />
            </div>
            {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium">
              Password
            </Label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                placeholder={mode === "signup" ? "Create a password" : "Enter your password"}
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                className={`pl-10 h-11 sm:h-10 text-base sm:text-sm ${errors.password ? "border-destructive" : ""}`}
                disabled={isLoading}
                autoComplete={mode === "signup" ? "new-password" : "current-password"}
              />
            </div>
            {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription className="text-sm">{error}</AlertDescription>
            </Alert>
          )}

          <Button type="submit" className="w-full h-11 sm:h-10 text-base sm:text-sm font-medium" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {mode === "signup" ? "Create Account" : "Sign In"}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === "signup" ? "Already have an account?" : "Don't have an account?"}
            <Button
              variant="link"
              className="p-0 ml-1 h-auto font-medium text-primary text-sm"
              onClick={onToggleMode}
              disabled={isLoading}
            >
              {mode === "signup" ? "Sign in" : "Sign up"}
            </Button>
          </p>
        </div>

        {mode === "signup" && (
          <div className="mt-4 p-3 bg-secondary/50 rounded-lg">
            <div className="flex items-start space-x-2">
              <Shield className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
              <div className="text-xs text-muted-foreground">
                <p className="font-medium text-foreground mb-1">Your security is our priority</p>
                <p>We use industry-standard encryption to protect your personal and financial information.</p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
