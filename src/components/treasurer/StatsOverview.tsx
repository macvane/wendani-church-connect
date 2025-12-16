import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { DollarSign, TrendingUp, CreditCard, Activity } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalAmount: number;
    totalTransactions: number;
    avgTransaction: number;
    completedTransactions: number;
    pendingTransactions: number;
    thisMonthAmount: number;
    thisYearAmount: number;
    purposeBreakdown: { [key: string]: number };
  };
}

const StatCard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend,
  accentColor = 'primary' 
}: { 
  title: string; 
  value: string; 
  subtitle: string; 
  icon: React.ElementType;
  trend?: string;
  accentColor?: 'primary' | 'blue' | 'amber' | 'emerald';
}) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-500/10 text-blue-600',
    amber: 'bg-amber-500/10 text-amber-600',
    emerald: 'bg-emerald-500/10 text-emerald-600',
  };

  return (
    <Card className="overflow-hidden border-0 shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <div>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
            </div>
            {trend && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                <TrendingUp className="h-3 w-3" />
                {trend}
              </span>
            )}
          </div>
          <div className={`p-3 rounded-xl ${colorClasses[accentColor]}`}>
            <Icon className="h-5 w-5" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const StatsOverview: React.FC<StatsOverviewProps> = ({ stats }) => {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Amount (All Time)"
        value={`KSH ${stats.totalAmount.toLocaleString()}`}
        subtitle={`${stats.completedTransactions} completed transactions`}
        icon={DollarSign}
        accentColor="primary"
      />
      <StatCard
        title="This Month"
        value={`KSH ${stats.thisMonthAmount.toLocaleString()}`}
        subtitle="Current month contributions"
        icon={TrendingUp}
        accentColor="blue"
      />
      <StatCard
        title="This Year"
        value={`KSH ${stats.thisYearAmount.toLocaleString()}`}
        subtitle="Year to date contributions"
        icon={Activity}
        accentColor="amber"
      />
      <StatCard
        title="Average Transaction"
        value={`KSH ${stats.avgTransaction.toLocaleString()}`}
        subtitle={`${stats.pendingTransactions} pending transactions`}
        icon={CreditCard}
        accentColor="emerald"
      />
    </div>
  );
};

export default StatsOverview;
