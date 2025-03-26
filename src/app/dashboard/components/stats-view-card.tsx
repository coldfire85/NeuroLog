"use client";

import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowDown, ArrowUp, Minus, AlertTriangle } from 'lucide-react';

interface StatsViewCardProps {
  title: string;
  value: string;
  description?: string;
  trend?: 'up' | 'down' | 'neutral' | 'warning';
  icon?: ReactNode;
}

export function StatsViewCard({
  title,
  value,
  description,
  trend = 'neutral',
  icon
}: StatsViewCardProps) {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return (
          <span className="flex items-center text-emerald-600 text-xs font-medium">
            <ArrowUp className="h-3 w-3 mr-1" />
            Increasing
          </span>
        );
      case 'down':
        return (
          <span className="flex items-center text-red-600 text-xs font-medium">
            <ArrowDown className="h-3 w-3 mr-1" />
            Decreasing
          </span>
        );
      case 'warning':
        return (
          <span className="flex items-center text-amber-600 text-xs font-medium">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Attention
          </span>
        );
      default:
        return (
          <span className="flex items-center text-gray-500 text-xs font-medium">
            <Minus className="h-3 w-3 mr-1" />
            Stable
          </span>
        );
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-2">
          <h3 className="font-medium text-sm text-muted-foreground">{title}</h3>
          {icon && <div className="text-muted-foreground">{icon}</div>}
        </div>
        <div className="mt-2">
          <div className="text-3xl font-bold">{value}</div>
          <div className="flex items-center justify-between mt-1">
            {description && (
              <p className="text-xs text-muted-foreground">{description}</p>
            )}
            {trend && <div>{getTrendIcon()}</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
