export interface User {
  id: string
  name: string
  email: string
  createdAt: string
}

export interface FXRate {
  USD: number
  GBP: number
  ZAR: number
  USDT: number
}

export interface Transaction {
  id: string
  userId: string
  amount: number
  currency: "GBP" | "ZAR"
  recipientName: string
  recipientEmail: string
  fee: number
  exchangeRate: number
  finalAmount: number
  status: "pending" | "completed" | "failed"
  createdAt: string
}

export interface Advertisement {
  id: string
  title: string
  description: string
  imageUrl: string
  link: string
}
