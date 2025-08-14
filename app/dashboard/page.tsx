"use client"

import { useEffect } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchFXRates } from "@/store/slices/fxRatesSlice"
import { AuthGuard } from "@/components/auth/auth-guard"
import { DashboardNav } from "@/components/dashboard/dashboard-nav"
import { AdsCarousel } from "@/components/dashboard/ads-carousel"
import { TransactionHistory } from "@/components/dashboard/transaction-history"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight, DollarSign, TrendingUp, Users, Send } from "lucide-react"
import { useRouter } from "next/navigation"

export default function DashboardPage() {
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { user } = useAppSelector((state) => state.auth)
  const { transactions } = useAppSelector((state) => state.transactions)
  const { rates, lastUpdated } = useAppSelector((state) => state.fxRates)

  useEffect(() => {
    dispatch(fetchFXRates())
  }, [dispatch])

  // Calculate dashboard stats
  const completedTransactions = transactions.filter((t) => t.status === "completed")
  const totalSent = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
  const totalFees = completedTransactions.reduce((sum, t) => sum + t.fee, 0)
  const recentTransactions = transactions.slice(0, 3)

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background">
        <DashboardNav />

        <main className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
            {/* Welcome Section */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Welcome back, {user?.name}!</h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Manage your money transfers and support your children's education abroad.
                </p>
              </div>
              <Button
                onClick={() => router.push("/dashboard/send")}
                className="flex items-center gap-2 h-11 sm:h-10 px-6 sm:px-4 text-base sm:text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Send Money
              </Button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Sent</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">${totalSent.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">USD sent to date</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Transactions</CardTitle>
                  <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">{transactions.length}</div>
                  <p className="text-xs text-muted-foreground">{completedTransactions.length} completed</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Recipients</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">
                    {new Set(transactions.map((t) => t.recipientEmail)).size}
                  </div>
                  <p className="text-xs text-muted-foreground">Unique recipients</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-xs sm:text-sm font-medium">Total Fees</CardTitle>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-lg sm:text-2xl font-bold">${totalFees.toFixed(2)}</div>
                  <p className="text-xs text-muted-foreground">Transfer fees paid</p>
                </CardContent>
              </Card>
            </div>

            {/* Current Exchange Rates */}
            {rates && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl">Current Exchange Rates</CardTitle>
                  <CardDescription className="text-sm">
                    Live rates updated {lastUpdated ? new Date(lastUpdated).toLocaleTimeString() : "recently"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-blue-100 text-blue-800 text-xs">GBP</Badge>
                        <span className="font-medium text-sm sm:text-base">British Pound</span>
                      </div>
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold">£{rates.GBP.toFixed(4)}</p>
                        <p className="text-xs text-muted-foreground">per USD</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge className="bg-green-100 text-green-800 text-xs">ZAR</Badge>
                        <span className="font-medium text-sm sm:text-base">South African Rand</span>
                      </div>
                      <div className="text-right">
                        <p className="text-base sm:text-lg font-bold">R{rates.ZAR.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground">per USD</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Ads Carousel */}
            <div>
              <h2 className="text-lg sm:text-xl font-semibold mb-4">Recommended for You</h2>
              <AdsCarousel />
            </div>

            {/* Recent Transactions */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-semibold">Recent Transactions</h2>
                <Button
                  variant="outline"
                  onClick={() => router.push("/dashboard/history")}
                  className="h-9 px-3 text-sm"
                >
                  View All
                  <ArrowUpRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              <TransactionHistory />
            </div>
          </div>
        </main>
      </div>
    </AuthGuard>
  )
}
