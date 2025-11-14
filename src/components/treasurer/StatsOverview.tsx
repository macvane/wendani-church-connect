import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard } from 'lucide-react';

interface StatsOverviewProps {
  stats: any;
}

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => (
  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Amount (All Time)</CardTitle>
        <DollarSign className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">KSH {stats.totalAmount.toLocaleString()}</div>
        <p className="text-xs text-muted-foreground">{stats.completedTransactions} completed transactions</p>
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
        <p className="text-xs text-muted-foreground">{stats.pendingTransactions} pending transactions</p>
      </CardContent>
    </Card>
  </div>
);

export default StatsOverview;
