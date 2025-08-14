import type { User, SignUpData, SignInData } from "@/lib/types"

const USERS_STORAGE_KEY = "send_pocket_money_users"
const CURRENT_USER_KEY = "send_pocket_money_current_user"

// Mock user storage using localStorage for demo purposes
// In production, this would be handled by a secure backend with proper encryption
export const authService = {
  // Get all users from localStorage
  getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(USERS_STORAGE_KEY)
    return users ? JSON.parse(users) : []
  },

  // Save users to localStorage
  saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users))
  },

  // Sign up a new user
  signUp(data: SignUpData): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers()

        // Check if user already exists
        if (users.find((user) => user.email === data.email)) {
          reject(new Error("User with this email already exists"))
          return
        }

        // Create new user
        const newUser: User = {
          id: `user_${Date.now()}`,
          name: data.name,
          email: data.email,
          createdAt: new Date().toISOString(),
        }

        // Save user (password would be hashed in production)
        users.push(newUser)
        this.saveUsers(users)

        // Store password separately (in production, this would be hashed and stored securely)
        const passwords = JSON.parse(localStorage.getItem("send_pocket_money_passwords") || "{}")
        passwords[newUser.email] = data.password
        localStorage.setItem("send_pocket_money_passwords", JSON.stringify(passwords))

        resolve(newUser)
      }, 1000) // Simulate network delay
    })
  },

  // Sign in user
  signIn(data: SignInData): Promise<User> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const users = this.getUsers()
        const user = users.find((u) => u.email === data.email)

        if (!user) {
          reject(new Error("Invalid email or password"))
          return
        }

        // Check password (in production, this would be properly hashed and verified)
        const passwords = JSON.parse(localStorage.getItem("send_pocket_money_passwords") || "{}")
        if (passwords[data.email] !== data.password) {
          reject(new Error("Invalid email or password"))
          return
        }

        // Store current user session
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
        resolve(user)
      }, 1000) // Simulate network delay
    })
  },

  // Get current user session
  getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  },

  // Sign out user
  signOut(): void {
    if (typeof window === "undefined") return
    localStorage.removeItem(CURRENT_USER_KEY)
  },
}
