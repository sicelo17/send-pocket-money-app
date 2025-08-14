import { createSlice, type PayloadAction } from "@reduxjs/toolkit"
import type { Transaction } from "@/lib/types"

interface TransactionsState {
  transactions: Transaction[]
  isLoading: boolean
  error: string | null
}

const generateMockTransactions = (): Transaction[] => {
  const transactions: Transaction[] = []
  const recipients = [
    "John Smith",
    "Sarah Johnson",
    "Michael Brown",
    "Emma Wilson",
    "David Lee",
    "Lisa Davis",
    "James Miller",
    "Anna Taylor",
    "Robert Anderson",
    "Maria Garcia",
    "William Jones",
    "Jennifer White",
    "Christopher Martin",
    "Jessica Thompson",
    "Daniel Rodriguez",
  ]

  for (let i = 0; i < 15; i++) {
    const currency = Math.random() > 0.5 ? "GBP" : "ZAR"
    const amount = Math.floor(Math.random() * 2000) + 100
    const fee = currency === "GBP" ? amount * 0.1 : amount * 0.2
    const exchangeRate = currency === "GBP" ? 0.74 : 17.75
    const finalAmount = Math.ceil((amount - fee) * exchangeRate)

    transactions.push({
      id: `tx_${i + 1}`,
      userId: "user_1",
      amount,
      currency,
      recipientName: recipients[i],
      recipientEmail: `${recipients[i].toLowerCase().replace(" ", ".")}@email.com`,
      fee: Math.ceil(fee),
      exchangeRate,
      finalAmount,
      status: Math.random() > 0.1 ? "completed" : "pending",
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
    })
  }

  return transactions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

const initialState: TransactionsState = {
  transactions: generateMockTransactions(),
  isLoading: false,
  error: null,
}

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.transactions.unshift(action.payload)
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: Transaction["status"] }>) => {
      const transaction = state.transactions.find((t) => t.id === action.payload.id)
      if (transaction) {
        transaction.status = action.payload.status
      }
    },
    clearError: (state) => {
      state.error = null
    },
  },
})

export const { addTransaction, updateTransactionStatus, clearError } = transactionsSlice.actions
export default transactionsSlice.reducer
