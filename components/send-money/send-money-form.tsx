"use client"

import type React from "react"

import { useState, useEffect, useMemo } from "react"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { fetchFXRates } from "@/store/slices/fxRatesSlice"
import { addTransaction } from "@/store/slices/transactionsSlice"
import { sendMoneySchema } from "@/lib/validations"
import type { Transaction } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Loader2, DollarSign, Users, ArrowRight, RefreshCw, AlertCircle, CheckCircle, Home, Plus } from "lucide-react"
import Link from "next/link"

export function SendMoneyForm() {
  const [formData, setFormData] = useState({
    amount: "",
    currency: "",
    recipientName: "",
    recipientEmail: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)

  const dispatch = useAppDispatch()
  const { rates, isLoading: ratesLoading, error: ratesError, lastUpdated } = useAppSelector((state) => state.fxRates)
  const { user } = useAppSelector((state) => state.auth)

  // Fetch FX rates on component mount
  useEffect(() => {
    dispatch(fetchFXRates())
  }, [dispatch])

  // Auto-refresh rates every 5 minutes
  useEffect(() => {
    const interval = setInterval(
      () => {
        dispatch(fetchFXRates())
      },
      5 * 60 * 1000,
    )

    return () => clearInterval(interval)
  }, [dispatch])

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    
    // Real-time validation for amount field to easily coummunicate with user
    if (field === "amount") {
      const amount = Number.parseFloat(value) || 0
      try {
        // Validate amount using Zod schema
        sendMoneySchema.pick({ amount: true }).parse({ amount })
        // Clear amount error if validation passes
        if (errors.amount) {
          setErrors((prev) => ({ ...prev, amount: "" }))
        }
      } catch (error: any) {
        // Set amount error if validation fails
        const fieldErrors: Record<string, string> = {}
        error.errors?.forEach((err: any) => {
          if (err.path[0] === "amount") {
            fieldErrors.amount = err.message
          }
        })
        setErrors((prev) => ({ ...prev, ...fieldErrors }))
      }
    } else {
      // Clear field error when user starts typing for other fields
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }))
      }
    }
    
    // Clear success message when user starts editing
    if (showSuccess) {
      setShowSuccess(false)
    }
  }

  // Calculate transaction details in real-time
  const transactionDetails = useMemo(() => {
    const amount = Number.parseFloat(formData.amount) || 0
    const currency = formData.currency as "GBP" | "ZAR"

    if (!amount || !currency || !rates) {
      return null
    }

    // Fee calculation: 10% for GBP, 20% for ZAR
    const feePercentage = currency === "GBP" ? 0.1 : 0.2
    const fee = Math.ceil(amount * feePercentage) // Round UP
    const amountAfterFee = amount - fee

    // Exchange rate conversion
    const exchangeRate = rates[currency]
    const finalAmount = Math.ceil(amountAfterFee * exchangeRate) // Round UP

    return {
      originalAmount: amount,
      fee,
      feePercentage: feePercentage * 100,
      amountAfterFee,
      exchangeRate,
      finalAmount,
      currency,
    }
  }, [formData.amount, formData.currency, rates])

  const validateForm = () => {
    try {
      const numericData = {
        ...formData,
        amount: Number.parseFloat(formData.amount) || 0,
      }
      sendMoneySchema.parse(numericData)
      setErrors({})
      return true
    } catch (error: any) {
      const fieldErrors: Record<string, string> = {}
      error.errors?.forEach((err: any) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message
        }
      })
      setErrors(fieldErrors)
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm() || !transactionDetails || !user) return

    setIsSubmitting(true)

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create transaction
      const transaction: Transaction = {
        id: `tx_${Date.now()}`,
        userId: user.id,
        amount: transactionDetails.originalAmount,
        currency: transactionDetails.currency,
        recipientName: formData.recipientName,
        recipientEmail: formData.recipientEmail,
        fee: transactionDetails.fee,
        exchangeRate: transactionDetails.exchangeRate,
        finalAmount: transactionDetails.finalAmount,
        status: "pending",
        createdAt: new Date().toISOString(),
      }

      dispatch(addTransaction(transaction))

      // Reset form and show success
      setFormData({
        amount: "",
        currency: "",
        recipientName: "",
        recipientEmail: "",
      })
      setShowSuccess(true)

      // Auto-hide success message after 10 seconds (increased since we now have navigation options)
      setTimeout(() => setShowSuccess(false), 10000)
    } catch (error) {
      console.error("Transaction failed:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const refreshRates = () => {
    dispatch(fetchFXRates())
  }

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {showSuccess && (
        <Alert className="border-accent bg-accent/10">
          <CheckCircle className="h-4 w-4 text-accent" />
          <AlertDescription>
            Transaction submitted successfully! Your money transfer is being processed.
          </AlertDescription>
          <div className="flex flex-col sm:flex-row gap-3 mt-4">
            <Link href="/dashboard">
              <Button variant="outline" className="w-full sm:w-auto">
                <Home className="h-4 w-4 mr-2" />
                Go to Dashboard
              </Button>
            </Link>
            <Button 
              variant="default" 
              className="w-full sm:w-auto"
              onClick={() => {
                setShowSuccess(false)
                setFormData({
                  amount: "",
                  currency: "",
                  recipientName: "",
                  recipientEmail: "",
                })
                setErrors({})
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              Make Another Transaction
            </Button>
          </div>
        </Alert>
      )}

      {/* FX Rates Error */}
      {ratesError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription className="text-sm">
            Unable to fetch current exchange rates. Please try again.
            <Button variant="outline" size="sm" onClick={refreshRates} className="ml-2 bg-transparent h-8">
              <RefreshCw className="h-3 w-3 mr-1" />
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Send Money Form */}
        <Card className="order-1">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
              <DollarSign className="h-5 w-5 text-primary" />
              Send Money
            </CardTitle>
            <CardDescription className="text-sm">Enter the details for your money transfer</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 sm:space-y-5">
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              {/* Amount Input */}
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-sm font-medium">
                  Amount (USD)
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    min="1"
                    max="10000"
                    step="0.01"
                    value={formData.amount}
                    onChange={(e) => handleInputChange("amount", e.target.value)}
                    className={`pl-10 h-11 sm:h-10 text-base sm:text-sm ${errors.amount ? "border-destructive focus-visible:ring-destructive" : ""}`}
                    disabled={isSubmitting}
                    inputMode="decimal"
                  />
                </div>
                {errors.amount && (
                  <p className="text-sm text-destructive flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.amount}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">Minimum: $1 • Maximum: $10,000</p>
              </div>

              {/* Currency Selection */}
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-sm font-medium">
                  Destination Currency
                </Label>
                <Select
                  value={formData.currency}
                  onValueChange={(value) => handleInputChange("currency", value)}
                  disabled={isSubmitting}
                >
                  <SelectTrigger className={`h-11 sm:h-10 ${errors.currency ? "border-destructive" : ""}`}>
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GBP">
                      <div className="flex items-center justify-between w-full">
                        <span>British Pound (GBP)</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          UK
                        </Badge>
                      </div>
                    </SelectItem>
                    <SelectItem value="ZAR">
                      <div className="flex items-center justify-between w-full">
                        <span>South African Rand (ZAR)</span>
                        <Badge variant="secondary" className="ml-2 text-xs">
                          SA
                        </Badge>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {errors.currency && <p className="text-sm text-destructive">{errors.currency}</p>}
              </div>

              {/* Recipient Details */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 pt-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-sm font-medium">Recipient Details</Label>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientName" className="text-sm font-medium">
                    Recipient Name
                  </Label>
                  <Input
                    id="recipientName"
                    type="text"
                    placeholder="Enter recipient's full name"
                    value={formData.recipientName}
                    onChange={(e) => handleInputChange("recipientName", e.target.value)}
                    className={`h-11 sm:h-10 text-base sm:text-sm ${errors.recipientName ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                  {errors.recipientName && <p className="text-sm text-destructive">{errors.recipientName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="recipientEmail" className="text-sm font-medium">
                    Recipient Email
                  </Label>
                  <Input
                    id="recipientEmail"
                    type="email"
                    placeholder="Enter recipient's email address"
                    value={formData.recipientEmail}
                    onChange={(e) => handleInputChange("recipientEmail", e.target.value)}
                    className={`h-11 sm:h-10 text-base sm:text-sm ${errors.recipientEmail ? "border-destructive" : ""}`}
                    disabled={isSubmitting}
                    autoComplete="email"
                    inputMode="email"
                  />
                  {errors.recipientEmail && <p className="text-sm text-destructive">{errors.recipientEmail}</p>}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-12 sm:h-10 text-base sm:text-sm font-medium"
                disabled={isSubmitting || ratesLoading || !rates}
              >
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Processing..." : "Send Money"}
                {!isSubmitting && <ArrowRight className="ml-2 h-4 w-4" />}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Transaction Summary */}
        <Card className="order-2 xl:order-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg sm:text-xl">Transaction Summary</CardTitle>
            <CardDescription className="text-sm">
              Review the details before sending
              {lastUpdated && (
                <div className="flex items-center gap-1 mt-2 text-xs">
                  <RefreshCw className="h-3 w-3" />
                  Rates updated: {new Date(lastUpdated).toLocaleTimeString()}
                </div>
              )}
            </CardDescription>
          </CardHeader>

          <CardContent>
            {transactionDetails ? (
              <div className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">You send</span>
                    <span className="font-medium text-base sm:text-sm">
                      ${transactionDetails.originalAmount.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Transfer fee ({transactionDetails.feePercentage}%)
                    </span>
                    <span className="font-medium text-destructive text-base sm:text-sm">
                      -${transactionDetails.fee.toFixed(2)} USD
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Amount after fee</span>
                    <span className="font-medium text-base sm:text-sm">
                      ${transactionDetails.amountAfterFee.toFixed(2)} USD
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Exchange rate</span>
                    <span className="font-medium text-base sm:text-sm">
                      1 USD = {transactionDetails.exchangeRate.toFixed(4)} {transactionDetails.currency}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center text-lg sm:text-base bg-primary/5 p-3 rounded-lg">
                    <span className="font-semibold">Recipient gets</span>
                    <span className="font-bold text-primary">
                      {transactionDetails.finalAmount.toLocaleString()} {transactionDetails.currency}
                    </span>
                  </div>
                </div>

                <div className="bg-secondary/50 p-3 rounded-lg">
                  <p className="text-xs text-muted-foreground">
                    <strong>Note:</strong> All amounts are rounded up to ensure accuracy. Exchange rates are updated
                    every 5 minutes and may fluctuate.
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground text-sm">Enter amount and currency to see transaction details</p>
              </div>
            )}

            {ratesLoading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                <span className="text-sm text-muted-foreground">Updating exchange rates...</span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
