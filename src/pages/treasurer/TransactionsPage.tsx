import React, { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { Loader2, DollarSign, TrendingUp, Filter, Download } from 'lucide-react';
import { mpesaAPI } from '@/utils/api';
import { useToast } from '@/hooks/use-toast';

interface PurposeItem {
  purpose: string;
  amount: number;
  other_purpose_details?: string;
}

interface Transaction {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  total_amount?: number;
  purposes?: PurposeItem[];
  purpose?: string;
  other_purpose_details?: string;
  status: string;
  mpesa_receipt_number?: string;
  transaction_date: string;
}

interface PaginatedResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Transaction[];
}

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(150); // 150 items per page
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [purposeFilter, setPurposeFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  
  const { toast } = useToast();

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, statusFilter, purposeFilter, searchQuery, startDate, endDate]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const response = await mpesaAPI.listTransactions({
        page: currentPage,
        page_size: pageSize,
        status: statusFilter,
        purpose: purposeFilter,
        search: searchQuery,
        start_date: startDate,
        end_date: endDate,
      });

      if (response.ok) {
        const data: PaginatedResponse = await response.json();
        setTransactions(data.results);
        setTotalCount(data.count);
        setTotalPages(Math.ceil(data.count / pageSize));
      } else {
        toast({
          title: 'Error',
          description: 'Failed to fetch transactions',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching transactions',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetFilters = () => {
    setStatusFilter('all');
    setPurposeFilter('all');
    setSearchQuery('');
    setStartDate('');
    setEndDate('');
    setCurrentPage(1);
  };

  const getStatusBadge = (status: string) => {
    const statusColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      completed: "default",
      success: "default",
      pending: "secondary",
      failed: "destructive",
    };
    
    return (
      <Badge variant={statusColors[status.toLowerCase()] || "outline"}>
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string | null) => {
    if (
      !dateString ||
      dateString === "null" ||
      dateString === "" ||
      isNaN(Date.parse(dateString))
    ) {
      return "No Date (Failed Txn)";
    }

    // Remove timezone offset (-06:00) before parsing
    const cleaned = dateString.replace(/[-+]\d{2}:\d{2}$/, "");

    const date = new Date(cleaned);

    return date.toLocaleString("en-KE", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat('en-KE', {
      style: 'currency',
      currency: 'KES',
    }).format(amount);
  };

  const calculateStats = () => {
    const completedTransactions = transactions.filter(
      t => t.status.toLowerCase() === 'completed' || t.status.toLowerCase() === 'success'
    );

    const totalAmount = completedTransactions.reduce((sum, t) => {
      if (t.purposes && Array.isArray(t.purposes)) {
        return sum + t.purposes.reduce((pSum, p) => pSum + Number(p.amount || 0), 0);
      }
      return sum + Number(t.total_amount || 0);
    }, 0);

    const purposeBreakdown = completedTransactions.reduce((acc, t) => {
      if (t.purposes && Array.isArray(t.purposes)) {
        t.purposes.forEach(p => {
          const purpose = p.purpose;
          acc[purpose] = (acc[purpose] || 0) + Number(p.amount || 0);
        });
      } else if (t.purpose) {
        // Fallback for old structure
        acc[t.purpose] = (acc[t.purpose] || 0) + Number(t.total_amount || 0);
      }
      return acc;
    }, {} as Record<string, number>);

    return {
      totalTransactions: totalCount,
      completedCount: completedTransactions.length,
      totalAmount,
      purposeBreakdown,
    };
  };

  const stats = calculateStats();

  const handleExport = () => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Total Amount', 'Purposes', 'Status', 'Receipt #', 'Date'];
    const csvData = transactions.map(t => {
      const totalAmount = t.purposes 
        ? t.purposes.reduce((sum, p) => sum + Number(p.amount || 0), 0)
        : t.total_amount || 0;
      
      const purposesStr = t.purposes 
        ? t.purposes.map(p => `${p.purpose}: ${p.amount}`).join('; ')
        : t.purpose || '';
      
      return [
        t.id,
        t.name,
        t.phone_number,
        t.email || '',
        totalAmount,
        `"${purposesStr}"`,
        t.status,
        t.mpesa_receipt_number || '',
        t.transaction_date,
      ];
    });
    
    const csv = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');
    
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (isLoading && transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading transactions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Transactions</h1>
          <p className="text-sm text-muted-foreground">Track and manage all M-Pesa contributions</p>
        </div>
        <Button onClick={handleExport} className="gap-2 rounded-xl shadow-sm">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Transactions</p>
                <p className="text-2xl font-bold">{stats.totalTransactions}</p>
              </div>
              <div className="p-3 rounded-xl bg-primary/10 text-primary">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{stats.completedCount}</p>
              </div>
              <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-600">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold">{formatAmount(stats.totalAmount)}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-500/10 text-blue-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Avg Transaction</p>
                <p className="text-2xl font-bold">
                  {formatAmount(stats.completedCount > 0 ? stats.totalAmount / stats.completedCount : 0)}
                </p>
              </div>
              <div className="p-3 rounded-xl bg-amber-500/10 text-amber-600">
                <DollarSign className="h-5 w-5" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purpose Breakdown */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Purpose Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.purposeBreakdown).map(([purpose, amount]) => (
              <div key={purpose} className="p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors">
                <p className="text-xs font-medium text-muted-foreground mb-1">{purpose}</p>
                <p className="text-lg font-bold">{formatAmount(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="h-5 w-5 text-muted-foreground" />
              Filters
            </CardTitle>
            <Button onClick={handleResetFilters} variant="ghost" size="sm" className="rounded-lg">
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Search</Label>
              <Input
                placeholder="Name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="rounded-lg bg-muted/50 border-0 focus-visible:ring-primary"
              />
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="rounded-lg bg-muted/50 border-0">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Purpose</Label>
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger className="rounded-lg bg-muted/50 border-0">
                  <SelectValue placeholder="All purposes" />
                </SelectTrigger>
                <SelectContent className="bg-card">
                  <SelectItem value="all">All Purposes</SelectItem>
                  <SelectItem value="Tithe">Tithe</SelectItem>
                  <SelectItem value="Offering">Offering</SelectItem>
                  <SelectItem value="Local Church Budget (LCB)">LCB</SelectItem>
                  <SelectItem value="Camp Offering">Camp Offering</SelectItem>
                  <SelectItem value="Camp Expenses">Camp Expenses</SelectItem>
                  <SelectItem value="Evangelism">Evangelism</SelectItem>
                  <SelectItem value="Station Dev">Station Dev</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="rounded-lg bg-muted/50 border-0"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground">End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="rounded-lg bg-muted/50 border-0"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card className="border-0 shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">
              All Transactions 
            </CardTitle>
            <span className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Page {currentPage} of {totalPages}
            </span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Purposes</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Transaction Code</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <Loader2 className="h-6 w-6 animate-spin mx-auto" />
                    </TableCell>
                  </TableRow>
                ) : transactions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center text-muted-foreground">
                      No transactions found
                    </TableCell>
                  </TableRow>
                ) : (
                  transactions.map((transaction, index) => {
                    const totalAmount = transaction.purposes 
                      ? transaction.purposes.reduce((sum, p) => sum + Number(p.amount || 0), 0)
                      : transaction.total_amount || 0;
                    
                    return (
                      <TableRow key={transaction.id}>
                        {/* Continuous numbering with newest first */}
                        <TableCell className="font-medium">
                          {((currentPage - 1) * pageSize + index + 1)}
                        </TableCell>
                        <TableCell>{transaction.name}</TableCell>
                        <TableCell>{transaction.phone_number}</TableCell>
                        <TableCell className="font-medium">{formatAmount(totalAmount)}</TableCell>
                        <TableCell>
  {transaction.purposes && transaction.purposes.length > 0 ? (
    <div className="flex flex-col gap-1">
      {/* Summary Line */}
      <div className="text-sm">
        {transaction.purposes
          .map((p) => {
            const label =
              p.purpose.toLowerCase() === "other" && p.other_purpose_details
                ? p.other_purpose_details
                : p.purpose;
            return `${label} (KES ${p.amount})`;
          })
          .join(", ")
        }
      </div>

      {/* Toggle Button */}
      <button
        onClick={() =>
          setExpanded((prev) => ({
            ...prev,
            [transaction.id]: !prev[transaction.id],
          }))
        }
        className="text-xs text-primary underline hover:opacity-80 mt-1 w-fit"
      >
        {expanded[transaction.id] ? "Hide Details" : "Show Details"}
      </button>

      {/* Collapsible Section */}
      {expanded[transaction.id] && (
        <div className="mt-2 space-y-1 border rounded-md p-2 bg-muted/30">
          {transaction.purposes.map((p, idx) => {
            const label =
  p.purpose === "DEVGR" && p.other_purpose_details
    ? `DEVGR${p.other_purpose_details}`
    : p.purpose.toLowerCase() === "other" && p.other_purpose_details
    ? p.other_purpose_details
    : p.purpose;


            return (
              <div
                key={idx}
                className="flex justify-between text-sm border-b last:border-b-0 pb-1"
              >
                <span className="font-medium">{label}</span>
                <span className="text-muted-foreground">
                  KES {p.amount}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  ) : (
    // Fallback for legacy single-purpose records
    <div>
      {transaction.purpose}
      {transaction.other_purpose_details && (
        <div className="text-xs text-muted-foreground">
          {transaction.other_purpose_details}
        </div>
      )}
    </div>
  )}
</TableCell>

                        <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                        <TableCell>
                          {transaction.mpesa_receipt_number || (
                            <div className='bg-[#44444E] rounded-full text-white flex justify-center items-center w-auto'>
                              Failed Txn.
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-sm">{formatDate(transaction.transaction_date)}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>

            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-4">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>

                  {/* Show up to 5 page links */}
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    let pageNum;
                    if (totalPages <= 5) pageNum = i + 1;
                    else if (currentPage <= 3) pageNum = i + 1;
                    else if (currentPage >= totalPages - 2) pageNum = totalPages - 4 + i;
                    else pageNum = currentPage - 2 + i;

                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink
                          onClick={() => setCurrentPage(pageNum)}
                          isActive={currentPage === pageNum}
                          className="cursor-pointer"
                        >
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionsPage;
