"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { loginSuccess } from "@/store/slices/authSlice"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Globe, Zap, ArrowRight } from "lucide-react"

export default function HomePage() {
  const dispatch = useAppDispatch()
  const { isAuthenticated } = useAppSelector((state) => state.auth)
  const router = useRouter()

  useEffect(() => {
    // Check for existing user session
    const currentUser = authService.getCurrentUser()
    if (currentUser) {
      dispatch(loginSuccess(currentUser))
      router.push("/dashboard")
    }
  }, [dispatch, router])

  const handleGetStarted = () => {
    router.push("/auth")
  }

  if (isAuthenticated) {
    return null // Will redirect to dashboard
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary/30 to-background">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Shield className="w-8 h-8 text-primary" />
            <span className="text-2xl font-bold text-primary">Send Pocket Money</span>
          </div>
          <Button variant="outline" onClick={handleGetStarted}>
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-12">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            Send Money to Your Children
            <span className="text-primary block">Studying Abroad</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Secure, fast, and reliable money transfers from Zimbabwe to the UK and South Africa. Support your children's
            education with confidence.
          </p>
          <Button size="lg" onClick={handleGetStarted} className="text-lg px-8 py-3">
            Get Started
            <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <Card className="text-center">
            <CardHeader>
              <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Bank-Level Security</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Your money and personal information are protected with industry-standard encryption and security
                measures.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>UK & South Africa</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Send money directly to your children studying in the United Kingdom or South Africa with competitive
                exchange rates.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <CardTitle>Fast Transfers</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Quick processing times ensure your children receive the money when they need it most for their studies
                and living expenses.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
