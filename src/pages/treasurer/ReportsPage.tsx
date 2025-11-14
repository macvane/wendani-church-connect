import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mpesaAPI } from '@/utils/api';
import { Download, FileText, TrendingUp, DollarSign, CreditCard, PieChart } from 'lucide-react';
import { BarChart, Bar, LineChart, Line, PieChart as RechartsPie, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface Transaction {
  id: number;
  name: string;
  phone_number: string;
  email: string;
  amount: string;
  purpose: string;
  other_purpose_details: string;
  status: string;
  mpesa_receipt_number: string;
  transaction_date: string;
}

interface Stats {
  totalAmount: number;
  totalTransactions: number;
  avgTransaction: number;
  completedTransactions: number;
  pendingTransactions: number;
  thisMonthAmount: number;
  thisYearAmount: number;
  purposeBreakdown: { [key: string]: number };
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const PURPOSES = [
  'Tithe',
  'Offering',
  'Local Church Budget (LCB)',
  'Camp Offering',
  'Camp Expenses',
  'Evangelism',
  'Station Dev',
  'Other'
];

const ReportsPage = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalTransactions: 0,
    avgTransaction: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    thisMonthAmount: 0,
    thisYearAmount: 0,
    purposeBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  // Export filters
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [exportPurpose, setExportPurpose] = useState('all');
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [reportMonth, setReportMonth] = useState((new Date().getMonth() + 1).toString());

  useEffect(() => {
    fetchAllTransactions();
  }, []);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await mpesaAPI.listTransactions({ page_size: 10000 });
      
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }

      const data = await response.json();
      const allTransactions = data.results || [];
      setTransactions(allTransactions);
      calculateStats(allTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch transactions',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (transactionList: Transaction[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const completed = transactionList.filter(t => t.status === 'success' || t.status === 'completed');
    const pending = transactionList.filter(t => t.status === 'pending');
    
    const totalAmount = completed.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
    const thisMonthTransactions = completed.filter(t => {
      const date = new Date(t.transaction_date);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });
    const thisYearTransactions = completed.filter(t => {
      const date = new Date(t.transaction_date);
      return date.getFullYear() === currentYear;
    });

    const thisMonthAmount = thisMonthTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);
    const thisYearAmount = thisYearTransactions.reduce((sum, t) => sum + parseFloat(t.amount || '0'), 0);

    const purposeBreakdown: { [key: string]: number } = {};
    completed.forEach(t => {
      const purpose = t.purpose || 'Unknown';
      purposeBreakdown[purpose] = (purposeBreakdown[purpose] || 0) + parseFloat(t.amount || '0');
    });

    setStats({
      totalAmount,
      totalTransactions: transactionList.length,
      avgTransaction: completed.length > 0 ? totalAmount / completed.length : 0,
      completedTransactions: completed.length,
      pendingTransactions: pending.length,
      thisMonthAmount,
      thisYearAmount,
      purposeBreakdown,
    });
  };

  const getPurposeChartData = () => {
    return Object.entries(stats.purposeBreakdown).map(([name, value]) => ({
      name,
      value,
      percentage: ((value / stats.totalAmount) * 100).toFixed(1),
    }));
  };

  const getMonthlyTrendData = () => {
    const monthlyData: { [key: string]: number } = {};
    const completed = transactions.filter(t => t.status === 'success' || t.status === 'completed');
    
    completed.forEach(t => {
      const date = new Date(t.transaction_date);
      const monthYear = `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`;
      monthlyData[monthYear] = (monthlyData[monthYear] || 0) + parseFloat(t.amount || '0');
    });

    return Object.entries(monthlyData)
      .sort((a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime())
      .slice(-12)
      .map(([month, amount]) => ({ month, amount }));
  };

  const exportToCSV = (data: Transaction[], filename: string) => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Amount', 'Purpose', 'Status', 'Receipt', 'Date'];
    const rows = data.map(t => [
      t.id,
      t.name,
      t.phone_number,
      t.email || '',
      t.amount,
      t.purpose,
      t.status,
      t.mpesa_receipt_number || '',
      new Date(t.transaction_date).toLocaleDateString(),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: Transaction[], filename: string, includeSummary = false) => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.text('Transaction Report', 14, 20);
    doc.setFontSize(11);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 14, 28);

    if (includeSummary) {
      // Add summary section
      doc.setFontSize(14);
      doc.text('Summary', 14, 40);
      doc.setFontSize(10);
      
      const summaryData = [
        ['Total Transactions', stats.totalTransactions.toString()],
        ['Completed Transactions', stats.completedTransactions.toString()],
        ['Total Amount', `KSH ${stats.totalAmount.toLocaleString()}`],
        ['Average Transaction', `KSH ${stats.avgTransaction.toLocaleString()}`],
        ['This Month', `KSH ${stats.thisMonthAmount.toLocaleString()}`],
        ['This Year', `KSH ${stats.thisYearAmount.toLocaleString()}`],
      ];

      autoTable(doc, {
        startY: 45,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
      });

      // Add purpose breakdown
      doc.setFontSize(14);
      const finalY = (doc as any).lastAutoTable.finalY || 45;
      doc.text('Purpose Breakdown', 14, finalY + 15);
      
      const purposeData = Object.entries(stats.purposeBreakdown).map(([purpose, amount]) => [
        purpose,
        `KSH ${amount.toLocaleString()}`,
        `${((amount / stats.totalAmount) * 100).toFixed(1)}%`
      ]);

      autoTable(doc, {
        startY: finalY + 20,
        head: [['Purpose', 'Amount', 'Percentage']],
        body: purposeData,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
      });
    }

    // Add transactions table
    const startY = includeSummary ? (doc as any).lastAutoTable.finalY + 15 : 35;
    doc.setFontSize(14);
    doc.text('Transactions', 14, startY);

    const tableData = data.map(t => [
      t.id.toString(),
      t.name,
      t.phone_number,
      t.amount,
      t.purpose,
      t.status,
      new Date(t.transaction_date).toLocaleDateString(),
    ]);

    autoTable(doc, {
      startY: startY + 5,
      head: [['ID', 'Name', 'Phone', 'Amount', 'Purpose', 'Status', 'Date']],
      body: tableData,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 8 },
    });

    doc.save(filename);
  };

  const handleCustomRangeExport = (format: 'csv' | 'pdf') => {
    if (!exportStartDate || !exportEndDate) {
      toast({
        title: 'Error',
        description: 'Please select both start and end dates',
        variant: 'destructive',
      });
      return;
    }

    const filtered = transactions.filter(t => {
      const tDate = new Date(t.transaction_date);
      const start = new Date(exportStartDate);
      const end = new Date(exportEndDate);
      return tDate >= start && tDate <= end;
    });

    if (filtered.length === 0) {
      toast({
        title: 'No Data',
        description: 'No transactions found in the selected date range',
      });
      return;
    }

    const filename = `transactions_${exportStartDate}_to_${exportEndDate}.${format}`;
    if (format === 'csv') {
      exportToCSV(filtered, filename);
    } else {
      exportToPDF(filtered, filename);
    }

    toast({
      title: 'Success',
      description: `Exported ${filtered.length} transactions to ${format.toUpperCase()}`,
    });
  };

  const handlePurposeExport = (purpose: string, format: 'csv' | 'pdf') => {
    const filtered = transactions.filter(t => t.purpose === purpose);
    
    if (filtered.length === 0) {
      toast({
        title: 'No Data',
        description: `No transactions found for ${purpose}`,
      });
      return;
    }

    const filename = `${purpose.replace(/\s+/g, '_')}_transactions.${format}`;
    if (format === 'csv') {
      exportToCSV(filtered, filename);
    } else {
      exportToPDF(filtered, filename);
    }

    toast({
      title: 'Success',
      description: `Exported ${filtered.length} ${purpose} transactions`,
    });
  };

  const handleSummaryExport = () => {
    const completed = transactions.filter(t => t.status === 'success' || t.status === 'completed');
    exportToPDF(completed, 'financial_summary_report.pdf', true);
    
    toast({
      title: 'Success',
      description: 'Summary report exported successfully',
    });
  };

  const handlePeriodReport = () => {
    let filtered = transactions.filter(t => t.status === 'success' || t.status === 'completed');
    
    if (reportType === 'monthly') {
      filtered = filtered.filter(t => {
        const date = new Date(t.transaction_date);
        return date.getMonth() + 1 === parseInt(reportMonth) && 
               date.getFullYear() === parseInt(reportYear);
      });
    } else {
      filtered = filtered.filter(t => {
        const date = new Date(t.transaction_date);
        return date.getFullYear() === parseInt(reportYear);
      });
    }

    if (filtered.length === 0) {
      toast({
        title: 'No Data',
        description: 'No transactions found for the selected period',
      });
      return;
    }

    const period = reportType === 'monthly' 
      ? `${new Date(2000, parseInt(reportMonth) - 1).toLocaleString('default', { month: 'long' })}_${reportYear}`
      : reportYear;
    
    exportToPDF(filtered, `${reportType}_report_${period}.pdf`, true);
    
    toast({
      title: 'Success',
      description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated`,
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading reports...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Financial Reports</h1>
        <p className="text-muted-foreground">Comprehensive financial analysis and reporting</p>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Amount (All Time)</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {stats.totalAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedTransactions} completed transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {stats.thisMonthAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Current month contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Year</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {stats.thisYearAmount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Year to date contributions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Transaction</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">KSH {stats.avgTransaction.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              {stats.pendingTransactions} pending transactions
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Tabs defaultValue="purpose" className="space-y-4">
        <TabsList>
          <TabsTrigger value="purpose">By Purpose</TabsTrigger>
          <TabsTrigger value="trend">Trend Analysis</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
          <TabsTrigger value="status">Status Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="purpose" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Amount by Purpose</CardTitle>
              <CardDescription>Total contributions per category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={getPurposeChartData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={100} />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                  <Legend />
                  <Bar dataKey="value" fill="#8b5cf6" name="Amount (KSH)" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Giving Trend</CardTitle>
              <CardDescription>Contribution trends over the last 12 months</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <LineChart data={getMonthlyTrendData()}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                  <Legend />
                  <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} name="Amount (KSH)" />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Purpose Distribution</CardTitle>
              <CardDescription>Percentage breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RechartsPie>
                  <Pie
                    data={getPurposeChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPurposeChartData().map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => `KSH ${value.toLocaleString()}`} />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="status" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Transaction Status</CardTitle>
              <CardDescription>Pending vs Completed transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RechartsPie>
                  <Pie
                    data={[
                      { name: 'Completed', value: stats.completedTransactions },
                      { name: 'Pending', value: stats.pendingTransactions },
                    ]}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    <Cell fill="#10b981" />
                    <Cell fill="#f59e0b" />
                  </Pie>
                  <Tooltip />
                  <Legend />
                </RechartsPie>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>Generate and download financial reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Reports */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Period Reports</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Report Type</Label>
                <Select value={reportType} onValueChange={(value: 'monthly' | 'yearly') => setReportType(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportType === 'monthly' && (
                <div className="space-y-2">
                  <Label>Month</Label>
                  <Select value={reportMonth} onValueChange={setReportMonth}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                        <SelectItem key={month} value={month.toString()}>
                          {new Date(2000, month - 1).toLocaleString('default', { month: 'long' })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-2">
                <Label>Year</Label>
                <Select value={reportYear} onValueChange={setReportYear}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={handlePeriodReport} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Custom Date Range Export</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label>Start Date</Label>
                <Input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>End Date</Label>
                <Input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={() => handleCustomRangeExport('csv')} variant="outline" className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <div className="space-y-2">
                <Label>&nbsp;</Label>
                <Button onClick={() => handleCustomRangeExport('pdf')} className="w-full">
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Export by Purpose */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Export by Purpose</h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {PURPOSES.map(purpose => (
                <Card key={purpose}>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm">{purpose}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <p className="text-2xl font-bold">
                      KSH {(stats.purposeBreakdown[purpose] || 0).toLocaleString()}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePurposeExport(purpose, 'csv')}
                        className="flex-1"
                      >
                        CSV
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handlePurposeExport(purpose, 'pdf')}
                        className="flex-1"
                      >
                        PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Summary Report */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Summary Report</h3>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <p className="font-medium">Complete Financial Summary</p>
                <p className="text-sm text-muted-foreground">
                  Includes totals, averages, purpose breakdown, and all completed transactions
                </p>
              </div>
              <Button onClick={handleSummaryExport}>
                <FileText className="mr-2 h-4 w-4" />
                Export Summary PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;