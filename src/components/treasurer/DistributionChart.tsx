import React from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Tooltip, Cell } from "recharts";

const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'];

interface DistributionChartProps {
  data: { name: string; value: number; percentage: number }[];
}

const DistributionChart: React.FC<DistributionChartProps> = ({ data }) => (
  <Card>
    <CardHeader>
      <CardTitle>Purpose Distribution</CardTitle>
      <CardDescription>Percentage breakdown by category</CardDescription>
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
            label={({ name, percentage }) => `${name}: ${percentage}%`}
            dataKey="value"
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(v: number) => `KSH ${v.toLocaleString()}`} />
        </PieChart>
      </ResponsiveContainer>
    </CardContent>
  </Card>
);

export default DistributionChart;
