import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface TrendChartProps {
  data: any[];
}

const TrendChart: React.FC<TrendChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Monthly Giving Trend</CardTitle>
      <CardDescription>Contribution trends over the last 12 months</CardDescription>
    </CardHeader>

    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip formatter={(v: number) => `KSH ${v.toLocaleString()}`} />
          <Legend />
          <Line type="monotone" dataKey="amount" stroke="#8b5cf6" strokeWidth={2} name="Amount (KSH)" />
        </LineChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default TrendChart;
