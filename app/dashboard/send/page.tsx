"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { SendMoneyForm } from "@/components/send-money/send-money-form"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function SendMoneyPage() {
  return (
    <AuthGuard>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Navigation Back Button */}
          <div className="mb-6">
            <Link href="/dashboard">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Send Money</h1>
            <p className="text-muted-foreground">
              Transfer money securely to your children studying in the UK or South Africa
            </p>
          </div>

          <SendMoneyForm />
        </div>
      </div>
    </AuthGuard>
  )
}
