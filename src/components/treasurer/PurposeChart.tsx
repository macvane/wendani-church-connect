import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PurposeChartProps {
  data: any[];
}

const PurposeChart: React.FC<PurposeChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Amount by Purpose</CardTitle>
      <CardDescription>Total contributions per category</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data}>
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
);

export default PurposeChart;
