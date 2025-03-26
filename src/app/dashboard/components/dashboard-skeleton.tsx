"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-8 animate-in fade-in-50">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <Skeleton className="h-8 w-16" />
                <Skeleton className="h-10 w-10 rounded-full" />
              </div>
              <Skeleton className="h-4 w-36 mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
        <Card className="md:col-span-1">
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-64 w-full" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Procedures */}
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex justify-between items-center p-2 border-b">
                <div className="space-y-1">
                  <Skeleton className="h-5 w-48" />
                  <div className="flex gap-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
                <Skeleton className="h-8 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Activity chart skeleton
export function ActivityChartSkeleton() {
  return (
    <div className="h-[300px] w-full">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-5 w-32" />
        <Skeleton className="h-5 w-40" />
      </div>
      <div className="flex items-end h-[250px] w-full space-x-2">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end">
            <Skeleton className={`w-full h-[${Math.random() * 200 + 20}px]`} />
            <Skeleton className="h-4 w-full mt-2" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Distribution chart skeleton
export function DistributionChartSkeleton() {
  return (
    <div className="h-[300px] w-full">
      <div className="flex justify-between mb-4">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-5 w-24" />
      </div>
      <div className="flex justify-center items-center h-[220px]">
        <div className="relative h-[220px] w-[220px] rounded-full overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton
              key={i}
              className="absolute"
              style={{
                transform: `rotate(${i * 72}deg)`,
                transformOrigin: 'center',
                height: '110px',
                width: '220px',
                borderRadius: '110px 110px 0 0',
                top: 0,
                left: 0,
              }}
            />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-2">
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-24" />
          </div>
        ))}
      </div>
    </div>
  );
}
