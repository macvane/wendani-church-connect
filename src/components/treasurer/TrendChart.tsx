import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Area, AreaChart } from 'recharts';

interface TrendChartProps {
  data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => (
  <Card className="border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="text-lg">Monthly Giving Trend</CardTitle>
      <CardDescription>Contribution trends over the last 12 months</CardDescription>
    </CardHeader>

    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <AreaChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
          <defs>
            <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={{ stroke: 'hsl(var(--border))' }}
            tickLine={false}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip 
            formatter={(v: number) => [`KSH ${v.toLocaleString()}`, 'Amount']}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
              padding: '12px 16px',
            }}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Legend wrapperStyle={{ paddingTop: 20 }} />
          <Area 
            type="monotone" 
            dataKey="amount" 
            stroke="hsl(var(--primary))" 
            strokeWidth={2.5} 
            fill="url(#colorAmount)"
            name="Amount (KSH)" 
          />
        </AreaChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TrendChart;
