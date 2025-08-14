"use client"

import { useState, useMemo } from "react"
import { useAppSelector } from "@/store/hooks"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ChevronLeft, ChevronRight, Clock, CheckCircle, XCircle, Calendar } from "lucide-react"

const ITEMS_PER_PAGE = 5

export function TransactionHistory() {
  const [currentPage, setCurrentPage] = useState(1)
  const { transactions } = useAppSelector((state) => state.transactions)

  const paginatedTransactions = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    return transactions.slice(startIndex, endIndex)
  }, [transactions, currentPage])

  const totalPages = Math.ceil(transactions.length / ITEMS_PER_PAGE)

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "failed":
        return <XCircle className="w-4 h-4 text-red-600" />
      default:
        return <Clock className="w-4 h-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Completed</Badge>
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Pending</Badge>
      case "failed":
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const goToPreviousPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1))
  }

  const goToNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              Transaction History
            </CardTitle>
            <CardDescription>View all your money transfers and their current status</CardDescription>
          </div>
          <Badge variant="outline" className="text-sm">
            {transactions.length} total transactions
          </Badge>
        </div>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {/* Desktop Table View */}
          <div className="hidden md:block">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px]">Recipient</TableHead>
                    <TableHead className="min-w-[100px]">Amount</TableHead>
                    <TableHead className="min-w-[80px]">Currency</TableHead>
                    <TableHead className="min-w-[80px]">Fee</TableHead>
                    <TableHead className="min-w-[120px]">Final Amount</TableHead>
                    <TableHead className="min-w-[100px]">Status</TableHead>
                    <TableHead className="min-w-[140px]">Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <Avatar className="w-8 h-8">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs">
                              {getInitials(transaction.recipientName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-medium text-sm truncate">{transaction.recipientName}</p>
                            <p className="text-xs text-muted-foreground truncate">{transaction.recipientEmail}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">${transaction.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{transaction.currency}</Badge>
                      </TableCell>
                      <TableCell className="text-destructive">${transaction.fee.toFixed(2)}</TableCell>
                      <TableCell className="font-semibold">
                        {transaction.finalAmount.toLocaleString()} {transaction.currency}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(transaction.status)}
                          <span className="text-sm">{getStatusBadge(transaction.status)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{formatDate(transaction.createdAt)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden space-y-4">
            {paginatedTransactions.map((transaction) => (
              <Card key={transaction.id} className="p-4">
                <div className="space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {getInitials(transaction.recipientName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <p className="font-medium truncate">{transaction.recipientName}</p>
                        <p className="text-sm text-muted-foreground truncate">{transaction.recipientEmail}</p>
                      </div>
                    </div>
                    <div className="flex-shrink-0">
                      {getStatusBadge(transaction.status)}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">Amount Sent</p>
                      <p className="font-medium">${transaction.amount.toFixed(2)} USD</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Fee</p>
                      <p className="font-medium text-destructive">${transaction.fee.toFixed(2)}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Recipient Gets</p>
                      <p className="font-semibold">
                        {transaction.finalAmount.toLocaleString()} {transaction.currency}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Date</p>
                      <p className="font-medium">{formatDate(transaction.createdAt)}</p>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to{" "}
                {Math.min(currentPage * ITEMS_PER_PAGE, transactions.length)} of {transactions.length} transactions
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2 w-full sm:w-auto">
                <div className="flex items-center gap-2 order-2 sm:order-1">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={goToNextPage}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 bg-transparent"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-1 order-1 sm:order-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <Button
                      key={page}
                      variant={page === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 p-0 text-xs"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
