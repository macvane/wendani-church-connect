import React from 'react';
import {
  PieChart as RechartsPie,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface StatusChartProps {
  completed: number;
  failed: number;
}

const StatusChart: React.FC<StatusChartProps> = ({ completed, failed }) => {
  const total = completed + failed;

  const data = [
    { name: 'Completed', value: completed },
    { name: 'Failed', value: failed },
  ];
  const totalcount = completed + failed;
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Transaction Status</CardTitle>
        <CardDescription>
          Completed vs Failed transactions
        </CardDescription>
        <CardDescription>
          Total Transactions: {totalcount}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RechartsPie>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              outerRadius={120}
              dataKey="value"
              labelLine={false}
              label={({ name, value }) => {
                const percentage = total
                  ? ((value / total) * 100).toFixed(1)
                  : '0';
                return `${name}: ${value} (${percentage}%)`;
              }}
            >
              <Cell fill="#10b981" /> {/* Completed */}
              <Cell fill="#ef4444" /> {/* Failed */}
            </Pie>

            <Tooltip
              formatter={(value: number) => {
                const percentage = total
                  ? ((value / total) * 100).toFixed(1)
                  : '0';
                return [`${value} (${percentage}%)`, 'Transactions'];
              }}
            />

            <Legend />
          </RechartsPie>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default StatusChart;
