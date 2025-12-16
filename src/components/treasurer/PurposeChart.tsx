import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend } from 'recharts';

interface PurposeChartProps {
  data: any[];
}

const PurposeChart: React.FC<PurposeChartProps> = ({ data }) => (
  <Card className="border-0 shadow-sm">
    <CardHeader>
      <CardTitle className="text-lg">Amount by Purpose</CardTitle>
      <CardDescription>Total contributions per category</CardDescription>
    </CardHeader>
    <CardContent>
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 80 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
          <XAxis 
            dataKey="name" 
            angle={-45} 
            textAnchor="end" 
            height={100} 
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
            formatter={(value: number) => [`KSH ${value.toLocaleString()}`, 'Amount']}
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
          <Bar 
            dataKey="value" 
            fill="hsl(var(--primary))" 
            name="Amount (KSH)" 
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default PurposeChart;
