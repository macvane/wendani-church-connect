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

interface Transaction {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  amount: number;
  purpose: string;
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

    const totalAmount = completedTransactions.reduce(
      (sum, t) => sum + Number(t.amount), 0
    );

    const purposeBreakdown = completedTransactions.reduce((acc, t) => {
      const purpose = t.purpose;
      acc[purpose] = (acc[purpose] || 0) + Number(t.amount);
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
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Amount', 'Purpose', 'Status', 'Receipt #', 'Date'];
    const csvData = transactions.map(t => [
      t.id,
      t.name,
      t.phone_number,
      t.email || '',
      t.amount,
      t.purpose,
      t.status,
      t.mpesa_receipt_number || '',
      t.transaction_date,
    ]);
    
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
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">M-Pesa Transactions</h1>
        <Button onClick={handleExport} variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transactions</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalTransactions}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedCount}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatAmount(stats.totalAmount)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Transaction</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatAmount(stats.completedCount > 0 ? stats.totalAmount / stats.completedCount : 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Purpose Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Purpose Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(stats.purposeBreakdown).map(([purpose, amount]) => (
              <div key={purpose} className="space-y-1">
                <p className="text-sm text-muted-foreground">{purpose}</p>
                <p className="text-lg font-bold">{formatAmount(amount)}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters
            </CardTitle>
            <Button onClick={handleResetFilters} variant="outline" size="sm">
              Reset Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label>Search</Label>
              <Input
                placeholder="Name, phone, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="success">Success</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Purpose</Label>
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All purposes" />
                </SelectTrigger>
                <SelectContent>
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
              <Label>Start Date</Label>
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>End Date</Label>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>
            All Transactions 
            <span className="text-sm font-normal text-muted-foreground ml-2">
              (Page {currentPage} of {totalPages})
            </span>
          </CardTitle>
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
                  <TableHead>Purpose</TableHead>
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
                  transactions.map((transaction, index) => (
                    <TableRow key={transaction.id}>
                      {/* Continuous numbering with newest first */}
                      <TableCell className="font-medium">
                        {((currentPage - 1) * pageSize + index + 1)}
                      </TableCell>
                      <TableCell>{transaction.name}</TableCell>
                      <TableCell>{transaction.phone_number}</TableCell>
                      <TableCell className="font-medium">{formatAmount(transaction.amount)}</TableCell>
                      <TableCell>
                        {transaction.purpose}
                        {transaction.other_purpose_details && (
                          <div className="text-xs text-muted-foreground">{transaction.other_purpose_details}</div>
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
                  ))
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
