"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { ProcedureTypeChart } from './components/procedure-type-chart';
import { SurgeonRoleChart } from './components/surgeon-role-chart';
import { MonthlyActivityChart } from './components/monthly-activity-chart';
import { RecentProceduresCard } from './components/recent-procedures-card';
import { StatsViewCard } from './components/stats-view-card';
import { DashboardSkeleton } from './components/dashboard-skeleton';
import Link from 'next/link';
import { Plus, FileSpreadsheet, FileBarChart2, Calendar } from 'lucide-react';
import { useNotifications } from '@/context/notification-context';

// Mock data for the dashboard stats
const procedureTypeData = [
  { name: 'Cranial', value: 42 },
  { name: 'Spinal', value: 28 },
  { name: 'Functional', value: 15 },
  { name: 'Vascular', value: 18 },
  { name: 'Pediatric', value: 9 },
  { name: 'Other', value: 4 },
];

const surgeonRoleData = [
  { name: 'Lead', value: 65 },
  { name: 'Assistant', value: 45 },
  { name: 'Observer', value: 15 },
  { name: 'Supervisor', value: 11 },
];

const monthlyActivityData = [
  { month: 'Jan', count: 12 },
  { month: 'Feb', count: 15 },
  { month: 'Mar', count: 18 },
  { month: 'Apr', count: 14 },
  { month: 'May', count: 22 },
  { month: 'Jun', count: 16 },
  { month: 'Jul', count: 19 },
  { month: 'Aug', count: 23 },
  { month: 'Sep', count: 20 },
  { month: 'Oct', count: 25 },
  { month: 'Nov', count: 21 },
  { month: 'Dec', count: 17 },
];

// Recent procedures for display
const recentProcedures = [
  {
    id: '1',
    patientName: 'John Smith',
    procedureType: 'Cranial',
    date: new Date('2025-03-10'),
    diagnosis: 'Glioblastoma multiforme',
  },
  {
    id: '2',
    patientName: 'Sarah Johnson',
    procedureType: 'Spinal',
    date: new Date('2025-03-08'),
    diagnosis: 'Lumbar disc herniation L4-L5',
  },
  {
    id: '3',
    patientName: 'David Williams',
    procedureType: 'Vascular',
    date: new Date('2025-03-05'),
    diagnosis: 'Anterior communicating artery aneurysm',
  },
  {
    id: '4',
    patientName: 'Emily Brown',
    procedureType: 'Functional',
    date: new Date('2025-03-01'),
    diagnosis: 'Trigeminal neuralgia',
  },
  {
    id: '5',
    patientName: 'Michael Lee',
    procedureType: 'Pediatric',
    date: new Date('2025-02-28'),
    diagnosis: 'Posterior fossa medulloblastoma',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { addNotification } = useNotifications();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  // Simulating a reminder notification for upcoming patient follow-ups
  useEffect(() => {
    // Only show this notification when the dashboard loads for the first time
    setTimeout(() => {
      addNotification({
        title: 'Upcoming Follow-ups',
        message: 'You have 3 patient follow-ups scheduled for this week.',
        type: 'info',
        link: '/procedures',
        linkText: 'View procedures',
      });
    }, 1500);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Stats Cards Data
  const statsCards = [
    {
      title: 'Total Procedures',
      value: '116',
      description: '+8% from last month',
      trend: 'up',
      icon: <FileBarChart2 className="h-4 w-4" />,
    },
    {
      title: 'As Lead Surgeon',
      value: '65',
      description: '56% of all procedures',
      trend: 'neutral',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Total Patients',
      value: '98',
      description: '+5 new this month',
      trend: 'up',
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      title: 'Follow-ups Due',
      value: '12',
      description: '3 due this week',
      trend: 'warning',
      icon: <Calendar className="h-4 w-4" />,
    },
  ];

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your neurosurgical practice and procedure statistics.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => {
              addNotification({
                title: 'Report Generated',
                message: 'Your monthly procedures report has been generated and is ready to download.',
                type: 'success',
                link: '/export',
                linkText: 'Download Report',
              });
              toast({
                title: 'Report Generated',
                description: 'Your monthly procedures report has been generated.',
              });
            }}
          >
            <FileSpreadsheet className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button onClick={() => router.push('/procedures/new')}>
            <Plus className="h-4 w-4 mr-2" />
            New Procedure
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="procedures">Procedures</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat, i) => (
              <StatsViewCard key={i} {...stat} />
            ))}
          </div>

          {/* Main Charts */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-full lg:col-span-4">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                  Number of procedures performed per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyActivityChart data={monthlyActivityData} />
              </CardContent>
            </Card>

            <Card className="md:col-span-1 lg:col-span-3">
              <CardHeader>
                <CardTitle>Procedure Types</CardTitle>
                <CardDescription>
                  Distribution of procedures by type
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ProcedureTypeChart data={procedureTypeData} />
              </CardContent>
            </Card>
          </div>

          {/* Recent Procedures */}
          <RecentProceduresCard procedures={recentProcedures} />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Procedure Types</CardTitle>
                <CardDescription>
                  Distribution of procedures by type
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <ProcedureTypeChart data={procedureTypeData} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Surgeon Roles</CardTitle>
                <CardDescription>
                  Distribution of procedures by your role
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <SurgeonRoleChart data={surgeonRoleData} />
              </CardContent>
            </Card>

            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle>Monthly Activity</CardTitle>
                <CardDescription>
                  Number of procedures performed per month
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MonthlyActivityChart data={monthlyActivityData} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="procedures" className="space-y-4">
          <RecentProceduresCard
            title="All Procedures"
            description="Complete list of your documented procedures"
            procedures={recentProcedures}
            extended={true}
          />

          <div className="flex justify-center">
            <Link href="/procedures">
              <Button variant="outline">
                View All Procedures
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
