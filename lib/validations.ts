import { z } from "zod"

export const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const sendMoneySchema = z.object({
  amount: z.number().min(1, "Amount must be at least $1").max(10000, "Amount cannot exceed $10,000"),
  currency: z.enum(["GBP", "ZAR"], { required_error: "Please select a currency" }),
  recipientName: z.string().min(2, "Recipient name is required"),
  recipientEmail: z.string().email("Invalid recipient email"),
})

export type SignUpData = z.infer<typeof signUpSchema>
export type SignInData = z.infer<typeof signInSchema>
export type SendMoneyData = z.infer<typeof sendMoneySchema>
