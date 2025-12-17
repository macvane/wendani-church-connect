import { useMemo, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface Transaction {
  status: string;
  amount?: string | number;
  purposes?: Array<{ purpose: string; amount: number }>;
  transaction_date: string;
}

interface Props {
  transactions: Transaction[];
}

type Mode = 'amount' | 'count';

const COMPLETED_STATUSES = ['success', 'completed', 'succeeded', 'ok'];

const DailyTransactionsChart: React.FC<Props> = ({ transactions }) => {
  const today = new Date();
  const [mode, setMode] = useState<Mode>('amount');
  const [month, setMonth] = useState(today.getMonth());
  const [year, setYear] = useState(today.getFullYear());

  // ---- Aggregate Daily Data ----
  const data = useMemo(() => {
    const map: Record<string, { date: string; amount: number; count: number }> = {};

    transactions.forEach(t => {
      if (!COMPLETED_STATUSES.includes((t.status || '').toLowerCase())) return;

      const d = new Date(t.transaction_date);
      if (isNaN(d.getTime())) return;

      if (d.getMonth() !== month || d.getFullYear() !== year) return;

      const key = d.toISOString().split('T')[0];

      const amount =
        t.purposes?.length
          ? t.purposes.reduce((s, p) => s + Number(p.amount || 0), 0)
          : Number(t.amount || 0);

      if (!map[key]) {
        map[key] = { date: key, amount: 0, count: 0 };
      }

      map[key].amount += amount;
      map[key].count += 1;
    });

    return Object.values(map).sort((a, b) => a.date.localeCompare(b.date));
  }, [transactions, month, year]);

  // ---- Max / Min Days ----
  const { maxDay, minDay } = useMemo(() => {
    if (!data.length) return { maxDay: null, minDay: null };

    const sorted = [...data].sort((a, b) => b[mode] - a[mode]);

    return {
      maxDay: sorted[0],
      minDay: sorted[sorted.length - 1],
    };
  }, [data, mode]);

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <CardTitle className="text-lg">Daily Transactions</CardTitle>
            <CardDescription>
              {mode === 'amount' ? 'Total amount per day (KSH)' : 'Number of transactions per day'}
            </CardDescription>
          </div>

          <div className="flex gap-2">
            <Button
              size="sm"
              variant={mode === 'amount' ? 'default' : 'outline'}
              onClick={() => setMode('amount')}
            >
              Amount
            </Button>
            <Button
              size="sm"
              variant={mode === 'count' ? 'default' : 'outline'}
              onClick={() => setMode('count')}
            >
              Count
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <Select value={month.toString()} onValueChange={(v) => setMonth(Number(v))}>
            <SelectTrigger className="w-[160px] bg-muted/50 border-0 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 12 }, (_, i) => (
                <SelectItem key={i} value={i.toString()}>
                  {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year.toString()} onValueChange={(v) => setYear(Number(v))}>
            <SelectTrigger className="w-[120px] bg-muted/50 border-0 rounded-lg">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Array.from({ length: 5 }, (_, i) => {
                const y = today.getFullYear() - i;
                return (
                  <SelectItem key={y} value={y.toString()}>
                    {y}
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </div>

        {/* Max / Min Badges */}
        {maxDay && minDay && (
          <div className="flex flex-wrap gap-3 pt-2">
            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-500/10 text-green-600 text-sm">
              <TrendingUp className="h-4 w-4" />
              Highest: {maxDay.date} (
              {mode === 'amount'
                ? `KSH ${maxDay.amount.toLocaleString()}`
                : `${maxDay.count} tx`}
              )
            </div>

            <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-red-500/10 text-red-600 text-sm">
              <TrendingDown className="h-4 w-4" />
              Lowest: {minDay.date} (
              {mode === 'amount'
                ? `KSH ${minDay.amount.toLocaleString()}`
                : `${minDay.count} tx`}
              )
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data}>
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis
              tickFormatter={(v) =>
                mode === 'amount' ? `KSH ${v.toLocaleString()}` : v
              }
            />
            <Tooltip
              formatter={(value: number) =>
                mode === 'amount'
                  ? `KSH ${value.toLocaleString()}`
                  : `${value} transactions`
              }
              labelFormatter={(label) => `Date: ${label}`}
            />
            <Bar dataKey={mode} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default DailyTransactionsChart;
