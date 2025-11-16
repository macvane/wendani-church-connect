import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface StatusChartProps {
  completed: number;
  pending: number;
}

const StatusChart: React.FC<StatusChartProps> = ({ completed, pending }) => {
  const data = [
    { name: 'Completed', value: completed },
    { name: 'Pending', value: pending },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transaction Status</CardTitle>
        <CardDescription>Pending vs Completed transactions</CardDescription>
      </CardHeader>

      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              labelLine={false}
              dataKey="value"
              label={({ name, value }) => `${name}: ${value}`}
            >
              <Cell fill="#00c36d" />
              <Cell fill="#f59e0b" />
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
