"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAppDispatch, useAppSelector } from "@/store/hooks"
import { logout } from "@/store/slices/authSlice"
import { authService } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Home, Send, History, Menu, Shield, User, LogOut, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "Send Money", href: "/dashboard/send", icon: Send },
  { name: "Transaction History", href: "/dashboard/history", icon: History },
]

export function DashboardNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const dispatch = useAppDispatch()
  const { user } = useAppSelector((state) => state.auth)

  const handleLogout = () => {
    authService.signOut()
    dispatch(logout())
    router.push("/")
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Shield className="w-8 h-8 text-primary" />
              <span className="text-xl font-bold text-primary">Send Pocket Money</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigation.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              return (
                <Button
                  key={item.name}
                  variant={isActive ? "default" : "ghost"}
                  className={cn("flex items-center space-x-2", isActive && "bg-primary text-primary-foreground")}
                  onClick={() => router.push(item.href)}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.name}</span>
                </Button>
              )
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center space-x-2 px-3">
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:block text-sm font-medium">{user?.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="flex items-center space-x-2 text-destructive">
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <SheetHeader>
                  <SheetTitle>Send Pocket Money</SheetTitle>
                  <SheetDescription>
                    Send pocket money to your children and manage their transactions.
                  </SheetDescription>
                </SheetHeader>
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon
                    const isActive = pathname === item.href
                    return (
                      <Button
                        key={item.name}
                        variant={isActive ? "default" : "ghost"}
                        className="justify-start space-x-2"
                        onClick={() => {
                          router.push(item.href)
                          setMobileMenuOpen(false)
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Button>
                    )
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}
