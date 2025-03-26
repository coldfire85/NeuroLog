"use client";

import { format } from 'date-fns';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface Procedure {
  id: string;
  patientName: string;
  procedureType: string;
  date: Date;
  diagnosis: string;
}

interface RecentProceduresCardProps {
  procedures: Procedure[];
  title?: string;
  description?: string;
  extended?: boolean;
}

export function RecentProceduresCard({
  procedures,
  title = "Recent Procedures",
  description = "Your most recent procedures",
  extended = false
}: RecentProceduresCardProps) {
  const getProcedureTypeBadgeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'cranial':
        return 'bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100';
      case 'spinal':
        return 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100';
      case 'vascular':
        return 'bg-red-50 text-red-700 border border-red-200 hover:bg-red-100';
      case 'functional':
        return 'bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100';
      case 'pediatric':
        return 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100';
      default:
        return 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {procedures.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No procedures recorded yet.</p>
            </div>
          ) : (
            procedures.map((procedure) => (
              <Link
                href={`/procedures/${procedure.id}`}
                key={procedure.id}
                className="flex justify-between items-center border-b pb-3 last:border-0 last:pb-0 hover:bg-muted/30 p-2 -mx-2 rounded transition-colors"
              >
                <div>
                  <div className="font-medium">{procedure.patientName}</div>
                  <div className="text-sm text-muted-foreground flex gap-2 items-center">
                    <span>{format(new Date(procedure.date), 'MMM d, yyyy')}</span>
                    {extended && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="line-clamp-1 max-w-44">{procedure.diagnosis}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getProcedureTypeBadgeColor(procedure.procedureType)} variant="outline">
                    {procedure.procedureType}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground opacity-60" />
                </div>
              </Link>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}
