"use client";

import { useState, useRef, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface DataItem {
  name: string;
  value: number;
}

interface ProcedureTypeChartProps {
  data: DataItem[];
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#6b7280'];

export function ProcedureTypeChart({ data }: ProcedureTypeChartProps) {
  const [chartWidth, setChartWidth] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setChartWidth(containerRef.current.offsetWidth);
    }

    const handleResize = () => {
      if (containerRef.current) {
        setChartWidth(containerRef.current.offsetWidth);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Calculate total for percentage
  const total = data.reduce((acc, item) => acc + item.value, 0);

  return (
    <div className="w-full h-80" ref={containerRef}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={chartWidth < 400 ? 80 : 100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) => `${name}: ${((value / total) * 100).toFixed(1)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`${value} (${((value / total) * 100).toFixed(1)}%)`, 'Procedures']}
          />
          <Legend layout="vertical" verticalAlign="middle" align="right" />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
