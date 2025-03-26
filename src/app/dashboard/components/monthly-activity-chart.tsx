"use client";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DataItem {
  month: string;
  count: number;
}

interface MonthlyActivityChartProps {
  data: DataItem[];
}

export function MonthlyActivityChart({ data }: MonthlyActivityChartProps) {
  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#6366f1" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#6366f1" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
          <XAxis
            dataKey="month"
            style={{ fontSize: '12px' }}
            tickMargin={10}
          />
          <YAxis
            style={{ fontSize: '12px' }}
            tickMargin={10}
            domain={[0, 'auto']}
          />
          <Tooltip
            formatter={(value: number) => [`${value} procedures`, 'Count']}
            contentStyle={{
              borderRadius: '6px',
              borderColor: '#e2e8f0',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
            }}
          />
          <Area
            type="monotone"
            dataKey="count"
            stroke="#6366f1"
            fillOpacity={1}
            fill="url(#colorCount)"
            strokeWidth={2}
            dot={{ strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
