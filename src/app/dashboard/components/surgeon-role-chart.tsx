"use client";

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface SurgeonRoleChartProps {
  data: DataItem[];
}

export function SurgeonRoleChart({ data }: SurgeonRoleChartProps) {
  // Calculate total for percentage
  const total = data.reduce((acc, item) => acc + item.value, 0);

  // Transform data for bar chart
  const formattedData = data.map(item => ({
    name: item.name,
    value: item.value,
    percentage: ((item.value / total) * 100).toFixed(1),
  }));

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={formattedData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" />
          <YAxis
            dataKey="name"
            type="category"
            width={80}
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            formatter={(value: number, name, props) => {
              const percentage = props.payload.percentage;
              return [`${value} (${percentage}%)`, 'Procedures'];
            }}
          />
          <Bar
            dataKey="value"
            fill="#8b5cf6"
            radius={[0, 4, 4, 0]}
            label={{
              position: 'right',
              formatter: (value: number) => value,
              style: { fontSize: '12px' }
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
