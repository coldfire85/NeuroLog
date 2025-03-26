"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ExportOptions } from "./export-options";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ExportPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // If the authentication is still loading, wait
    if (status === "loading") {
      return;
    }

    // If not authenticated, redirect to login
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/export");
      return;
    }

    // If authenticated, show the page
    setIsLoading(false);
  }, [status, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading export options...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Export Data</h1>
        <p className="text-muted-foreground">
          Generate reports and export your procedures data
        </p>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle>Export Options</CardTitle>
          <CardDescription>
            Choose the type of data you want to export and customize the output
            format
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ExportOptions />
        </CardContent>
      </Card>
    </div>
  );
}
