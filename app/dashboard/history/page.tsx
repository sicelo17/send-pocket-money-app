"use client"

import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { TransactionHistory } from "@/components/dashboard/transaction-history"

export default function TransactionHistoryPage() {
  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="container mx-auto px-4 py-8">
          <div className="max-w-6xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-foreground mb-2">Transaction History</h1>
              <p className="text-muted-foreground">View and manage all your money transfers in one place</p>
            </div>

            <TransactionHistory />
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
