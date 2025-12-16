import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { mpesaAPI } from '@/utils/api';
import { FileText, Download } from 'lucide-react';
import { PieChart as RechartsPie, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { calculateStats, getPurposeChartData, getMonthlyTrendData } from '@/components/treasurer/utils';

// Components
import StatsOverview from '@/components/treasurer/StatsOverview';
import PurposeChart from '@/components/treasurer/PurposeChart';
import TrendChart from '@/components/treasurer/TrendChart';
import StatusChart from '@/components/treasurer/StatusChart';

interface Transaction {
  id: number;
  name: string;
  phone_number: string;
  email?: string;
  amount?: string | number; // For backward compatibility
  purposes?: Array<{ purpose: string; amount: number }>; // New structure
  purpose?: string; // For backward compatibility
  other_purpose_details?: string;
  status: string;
  mpesa_receipt_number?: string;
  transaction_date: string; // ISO or date string
}

interface Stats {
  totalAmount: number;
  totalTransactions: number;
  avgTransaction: number;
  completedTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  thisMonthAmount: number;
  thisYearAmount: number;
  purposeBreakdown: { [key: string]: number };
}

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#ec4899', '#6366f1', '#14b8a6'];

const PURPOSES = [
  'Tithe',
  'Offering',
  'Local Church',
  'Camp Offering',
  'Camp Expenses',
  'Evangelism',
  'Station Dev',
  'DEVGR',
  'Other'
];

// ---- Helpers ----

// Status Normalizer (case-insensitive)
const isCompleted = (t: Transaction) => {
  return ['success', 'completed', 'succeeded', 'ok'].includes((t.status || '').toLowerCase());
};

// Safe date parsing to avoid timezone shifts that change month/day
// Accepts 'YYYY-MM-DD' or ISO datetime strings.
const safeDate = (input: string) => {
  if (!input) return new Date(NaN);
  // If input is YYYY-MM-DD format, Date(...) is treated as UTC in some implementations.
  // We create using parts so local time is used and month/day won't shift.
  const isoMatch = input.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const [_, y, m, d] = isoMatch;
    return new Date(Number(y), Number(m) - 1, Number(d));
  }
  const d = new Date(input);
  if (isNaN(d.getTime())) {
    // fallback: try Date.parse
    const parsed = Date.parse(input);
    return isNaN(parsed) ? new Date(NaN) : new Date(parsed);
  }
  // normalize to local date (strip time)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
};

// Format amount to KSH with commas, handle string or number
const formatKsh = (val: string | number) => {
  const n = typeof val === 'string' ? parseFloat(val as string || '0') : (val as number || 0);
  return `KSH ${n.toLocaleString()}`;
};

// ---- Component ----

const ReportsPage: React.FC = () => {
  const { toast } = useToast();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<Stats>({
    totalAmount: 0,
    totalTransactions: 0,
    avgTransaction: 0,
    completedTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    thisMonthAmount: 0,
    thisYearAmount: 0,
    purposeBreakdown: {},
  });
  const [loading, setLoading] = useState(true);

  
  const completedCount = transactions.filter(isCompleted).length;
  const isFailed = (t: Transaction) => {
  return ['failed', 'error', 'cancelled', 'canceled', 'rejected']
    .includes((t.status || '').toLowerCase());
};
const failedCount = transactions.filter(isFailed).length;
const totalStatusCount = completedCount + failedCount;

const statusChartData = [
  { name: 'Completed', value: completedCount },
  { name: 'Failed', value: failedCount },
];


  // Export filters
  const [exportStartDate, setExportStartDate] = useState('');
  const [exportEndDate, setExportEndDate] = useState('');
  const [reportType, setReportType] = useState<'monthly' | 'yearly'>('monthly');
  const [reportYear, setReportYear] = useState(new Date().getFullYear().toString());
  const [reportMonth, setReportMonth] = useState((new Date().getMonth() + 1).toString());

  useEffect(() => {
    fetchAllTransactions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchAllTransactions = async () => {
    try {
      setLoading(true);
      const response = await mpesaAPI.listTransactions({ page_size: 10000 });
      if (!response.ok) throw new Error('Failed to fetch transactions');

      const data = await response.json();
      const allTransactions = data.results || [];
      setTransactions(allTransactions);

      setStats(calculateStats(allTransactions)as Stats);
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to fetch transactions', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  // ---- Exports ----

  // Export Summary Report as CSV
const exportSummaryCSV = (data: Transaction[]) => {
  const s = calculateStats(data);

  const rows = [
    ['Metric', 'Value'],
    ['Total Transactions', s.totalTransactions],
    ['Completed Transactions', s.completedTransactions],
    ['Total Amount', s.totalAmount],
    ['Average Transaction', s.avgTransaction],
    ['This Month Amount', s.thisMonthAmount],
    ['This Year Amount', s.thisYearAmount],
    [],
    ['Purpose Breakdown'],
    ['Purpose', 'Amount', 'Percentage']
  ];

  const purposeData = getPurposeChartData(s.purposeBreakdown, s.totalAmount);
  purposeData.forEach(p => {
    rows.push([p.name, p.value, `${p.percentage}%`]);
  });

  // Convert rows → CSV
  const csvContent = rows
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(','))
    .join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'financial_summary_report.csv';
  a.click();
  window.URL.revokeObjectURL(url);
};


  const exportToCSV = (data: Transaction[], filename: string) => {
    const headers = ['ID', 'Name', 'Phone', 'Email', 'Total Amount', 'Purposes', 'Status', 'Receipt', 'Date'];
    const rows = data.map(t => {
      const totalAmount = t.purposes 
        ? t.purposes.reduce((sum, p) => sum + Number(p.amount || 0), 0)
        : (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as string || '0'));
      
      const purposesStr = t.purposes 
        ? t.purposes.map(p => `${p.purpose}: ${p.amount}`).join('; ')
        : t.purpose || '';
      
      return [
        t.id,
        t.name,
        t.phone_number,
        t.email || '',
        totalAmount.toString(),
        purposesStr,
        t.status,
        t.mpesa_receipt_number || '',
        safeDate(t.transaction_date).toLocaleDateString(),
      ];
    });

    const escaped = rows.map(r => r.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(','));
    const csvContent = [headers.join(','), ...escaped].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const exportToPDF = (data: Transaction[], filename: string, includeSummary = false) => {
    const doc = new jsPDF({
      unit: 'pt',
      format: 'a4',
    });

    // Stats for this dataset
    const tempStats = calculateStats(data);

    doc.setFontSize(18);
    doc.text('Transaction Report', 40, 50);
    doc.setFontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`, 40, 70);

    let yCursor = 90;

    // Summary block
    if (includeSummary) {
      doc.setFontSize(14);
      doc.text('Summary', 40, yCursor + 10);

      const summaryData = [
        ['Total Transactions', String(tempStats.totalTransactions)],
        ['Completed Transactions', String(tempStats.completedTransactions)],
        ['Total Amount', formatKsh(tempStats.totalAmount)],
        ['Average Transaction', formatKsh(tempStats.avgTransaction)],
        ['This Month', formatKsh(tempStats.thisMonthAmount)],
        ['This Year', formatKsh(tempStats.thisYearAmount)],
      ];

      autoTable(doc, {
        startY: yCursor + 20,
        head: [['Metric', 'Value']],
        body: summaryData,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { cellPadding: 6, fontSize: 10 },
      });

      const last = (doc as any).lastAutoTable;
      const afterSummaryY = last ? last.finalY + 10 : yCursor + 100;

      // Purpose breakdown table
      const purposeRows = getPurposeChartData(tempStats.purposeBreakdown, tempStats.totalAmount).map(p => [
        p.name,
        formatKsh(p.value),
        `${p.percentage}%`,
      ]);

      doc.setFontSize(12);
      doc.text('Purpose Breakdown', 40, afterSummaryY + 14);

      autoTable(doc, {
        startY: afterSummaryY + 20,
        head: [['Purpose', 'Amount', 'Percentage']],
        body: purposeRows,
        theme: 'grid',
        headStyles: { fillColor: [139, 92, 246] },
        styles: { cellPadding: 6, fontSize: 10 },
      });

      const last2 = (doc as any).lastAutoTable;
      yCursor = last2 ? last2.finalY + 10 : afterSummaryY + 100;
    }

    // Transactions table
    doc.setFontSize(12);
    doc.text('Transactions', 40, yCursor + 14);

    const txRows = data.map(t => {
      const totalAmount = t.purposes 
        ? t.purposes.reduce((sum, p) => sum + Number(p.amount || 0), 0)
        : (typeof t.amount === 'number' ? t.amount : parseFloat(t.amount as string || '0'));
      
      const purposesStr = t.purposes 
        ? t.purposes.map(p => `${p.purpose}: KSH ${p.amount}`).join(', ')
        : t.purpose || '';
      
      return [
        String(t.id),
        t.name,
        t.phone_number,
        totalAmount.toString(),
        purposesStr,
        t.status,
        safeDate(t.transaction_date).toLocaleDateString(),
      ];
    });

    autoTable(doc, {
      startY: yCursor + 24,
      head: [['ID', 'Name', 'Phone', 'Amount', 'Purposes', 'Status', 'Date']],
      body: txRows,
      theme: 'striped',
      headStyles: { fillColor: [139, 92, 246] },
      styles: { fontSize: 8, cellPadding: 4 },
      margin: { left: 40, right: 40 },
    });

    doc.save(filename);
  };

  // Custom Date Range Export
  const handleCustomRangeExport = (format: 'csv' | 'pdf') => {
    if (!exportStartDate || !exportEndDate) {
      toast({ title: 'Error', description: 'Please select both start and end dates', variant: 'destructive' });
      return;
    }

    const start = safeDate(exportStartDate);
    const end = safeDate(exportEndDate);
    // make end inclusive by adding one day to end's time check or compare <= end
    const filtered = transactions.filter(t => {
      const d = safeDate(t.transaction_date);
      return !isNaN(d.getTime()) && d >= start && d <= end;
    });

    if (filtered.length === 0) {
      toast({ title: 'No Data', description: 'No transactions found in the selected date range' });
      return;
    }

    const filename = `transactions_${exportStartDate}_to_${exportEndDate}.${format}`;
    format === 'csv' ? exportToCSV(filtered, filename) : exportToPDF(filtered, filename, true);

    toast({ title: 'Success', description: `Exported ${filtered.length} transactions to ${format.toUpperCase()}` });
  };

  // Export by Purpose
  const handlePurposeExport = (purpose: string, format: 'csv' | 'pdf') => {
    if (!purpose) {
      toast({ title: 'Error', description: 'Purpose not specified', variant: 'destructive' });
      return;
    }

    // Filter transactions that have this purpose in their purposes array
    const filtered = transactions.filter(t => {
      if (t.purposes && Array.isArray(t.purposes)) {
        return t.purposes.some(p => (p.purpose || '').trim().toLowerCase() === purpose.trim().toLowerCase());
      }
      // Fallback for old structure
      return (t.purpose || '').trim().toLowerCase() === purpose.trim().toLowerCase();
    });

    if (filtered.length === 0) {
      toast({ title: 'No Data', description: `No transactions found for ${purpose}` });
      return;
    }

    const filename = `${purpose.replace(/\s+/g, '_')}_transactions.${format}`;
    format === 'csv' ? exportToCSV(filtered, filename) : exportToPDF(filtered, filename, true);

    toast({ title: 'Success', description: `Exported ${filtered.length} ${purpose} transactions` });
  };

  // Summary report for all completed transactions
  const handleSummaryExport = (format: 'csv' | 'pdf') => {
  const completed = transactions.filter(isCompleted);

  if (completed.length === 0) {
    toast({ title: 'No Data', description: 'No completed transactions found' });
    return;
  }

  if (format === 'csv') {
    exportSummaryCSV(completed);
  } else {
    exportToPDF(completed, 'financial_summary_report.pdf', true);
  }

  toast({ title: 'Success', description: `Summary ${format.toUpperCase()} exported successfully` });
};


  // Period report (monthly/yearly)
  const handlePeriodReport = () => {
    let filtered = transactions.filter(isCompleted);

    if (reportType === 'monthly') {
      filtered = filtered.filter(t => {
        const d = safeDate(t.transaction_date);
        return !isNaN(d.getTime()) && d.getMonth() + 1 === parseInt(reportMonth, 10) && d.getFullYear() === parseInt(reportYear, 10);
      });
    } else {
      filtered = filtered.filter(t => {
        const d = safeDate(t.transaction_date);
        return !isNaN(d.getTime()) && d.getFullYear() === parseInt(reportYear, 10);
      });
    }

    if (filtered.length === 0) {
      toast({ title: 'No Data', description: 'No transactions found for the selected period' });
      return;
    }

    const period = reportType === 'monthly'
      ? `${new Date(2000, parseInt(reportMonth, 10) - 1).toLocaleString('default', { month: 'long' })}_${reportYear}`
      : reportYear;

    exportToPDF(filtered, `${reportType}_report_${period}.pdf`, true);
    toast({ title: 'Success', description: `${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated` });
  };

  // Loading state
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

  // UI
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Financial Reports</h1>
        <p className="text-sm text-muted-foreground">Comprehensive financial analysis and reporting</p>
      </div>

      <StatsOverview stats={stats} />

      <Tabs defaultValue="purpose" className="space-y-4">
        <TabsList className="bg-muted/50 p-1 rounded-xl">
          <TabsTrigger value="purpose" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">By Purpose</TabsTrigger>
          <TabsTrigger value="trend" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Trend Analysis</TabsTrigger>
          <TabsTrigger value="distribution" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Distribution</TabsTrigger>
          <TabsTrigger value="status" className="rounded-lg data-[state=active]:bg-card data-[state=active]:shadow-sm">Status Overview</TabsTrigger>
        </TabsList>

        <TabsContent value="purpose" className="space-y-4">
          <PurposeChart data={getPurposeChartData(stats.purposeBreakdown, stats.totalAmount)} />
        </TabsContent>

        <TabsContent value="trend" className="space-y-4">
          <TrendChart data={getMonthlyTrendData(transactions)} />
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Purpose Distribution</CardTitle>
              <CardDescription>Percentage breakdown by category</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <RechartsPie>
                  <Pie
                    data={getPurposeChartData(stats.purposeBreakdown, stats.totalAmount)}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percentage }: any) => `${name}: ${percentage}%`}
                    outerRadius={120}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {getPurposeChartData(stats.purposeBreakdown, stats.totalAmount).map((entry, index) => (
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
          <StatusChart
            completed={completedCount}
            failed={failedCount}
          />
        </TabsContent>

      </Tabs>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg">Export Options</CardTitle>
          <CardDescription>Generate and download financial reports</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Period Reports */}
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Period Reports</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Report Type</Label>
                <Select value={reportType} onValueChange={(value: 'monthly' | 'yearly') => setReportType(value)}>
                  <SelectTrigger className="rounded-lg bg-muted/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {reportType === 'monthly' && (
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-muted-foreground">Month</Label>
                  <Select value={reportMonth} onValueChange={setReportMonth}>
                    <SelectTrigger className="rounded-lg bg-muted/50 border-0">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
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
                <Label className="text-xs font-medium text-muted-foreground">Year</Label>
                <Select value={reportYear} onValueChange={setReportYear}>
                  <SelectTrigger className="rounded-lg bg-muted/50 border-0">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card">
                    {Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i).map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">&nbsp;</Label>
                <Button onClick={handlePeriodReport} className="w-full rounded-xl shadow-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </Button>
              </div>
            </div>
          </div>

          {/* Custom Date Range */}
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Custom Date Range Export</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">Start Date</Label>
                <Input
                  type="date"
                  value={exportStartDate}
                  onChange={(e) => setExportStartDate(e.target.value)}
                  className="rounded-lg bg-muted/50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">End Date</Label>
                <Input
                  type="date"
                  value={exportEndDate}
                  onChange={(e) => setExportEndDate(e.target.value)}
                  className="rounded-lg bg-muted/50 border-0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">&nbsp;</Label>
                <Button onClick={() => handleCustomRangeExport('csv')} variant="outline" className="w-full rounded-xl">
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </div>
              <div className="space-y-2">
                <Label className="text-xs font-medium text-muted-foreground">&nbsp;</Label>
                <Button onClick={() => handleCustomRangeExport('pdf')} className="w-full rounded-xl shadow-sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
          </div>

          {/* Export by Purpose */}
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Export by Purpose</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {PURPOSES.map(purpose => (
                <div key={purpose} className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors">
                  <p className="text-xs font-medium text-muted-foreground mb-1">{purpose}</p>
                  <p className="text-xl font-bold mb-3">
                    {formatKsh(stats.purposeBreakdown[purpose] || 0)}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePurposeExport(purpose, 'csv')}
                      className="flex-1 rounded-lg text-xs"
                    >
                      CSV
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handlePurposeExport(purpose, 'pdf')}
                      className="flex-1 rounded-lg text-xs"
                    >
                      PDF
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary Report */}
          <div className="space-y-4">
            <h3 className="font-semibold text-muted-foreground">Summary Report</h3>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-xl bg-gradient-to-r from-primary/5 to-primary/10">
              <div>
                <p className="font-semibold">Complete Financial Summary</p>
                <p className="text-sm text-muted-foreground">
                  Includes totals, averages, purpose breakdown, and all completed transactions
                </p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => handleSummaryExport('csv')} className="rounded-xl">
                  <Download className="mr-2 h-4 w-4" /> CSV
                </Button>
                <Button onClick={() => handleSummaryExport('pdf')} className="rounded-xl shadow-sm">
                  <FileText className="mr-2 h-4 w-4" /> PDF
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
