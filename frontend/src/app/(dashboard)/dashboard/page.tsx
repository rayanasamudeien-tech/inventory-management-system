'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Package,
  Box,
  Wrench,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  History,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Typewriter } from '@/components/shared/Typewriter';
import { AnimatedBarChart, AnimatedPieChart } from '@/components/shared/AnimatedCharts';
import { useNotificationStore } from '@/store/notificationStore';
import { TiltCard } from '@/components/shared/TiltCard';
import { PulseIndicator } from '@/components/shared/PulseIndicator';
import { useState, useEffect } from 'react';

import api from '@/lib/axios';

const stats = [
  {
    label: 'Total Assets',
    value: '0',
    icon: Package,
    change: '+0%',
    trend: 'neutral',
    href: '/assets',
    color: 'blue',
  },
  {
    label: 'Total Consumables',
    value: '0',
    icon: Box,
    change: '+0%',
    trend: 'neutral',
    href: '/stock',
    color: 'emerald',
  },
  {
    label: 'Under Repair',
    value: '0',
    icon: Wrench,
    change: '+0%',
    trend: 'neutral',
    href: '/maintenance',
    color: 'amber',
  },
  {
    label: 'Low Stock Alerts',
    value: '0',
    icon: AlertTriangle,
    change: '+0%',
    trend: 'neutral',
    href: '/stock',
    color: 'rose',
  },
];

const barData = [
  { name: 'Mon', total: 0 },
  { name: 'Tue', total: 0 },
  { name: 'Wed', total: 0 },
  { name: 'Thu', total: 0 },
  { name: 'Fri', total: 0 },
  { name: 'Sat', total: 0 },
  { name: 'Sun', total: 0 },
];

const pieData = [
  { name: 'No Data', value: 1 },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function DashboardPage() {
  const [mounted, setMounted] = useState(false);
  const [statsData, setStatsData] = useState(stats);
  const [chartData, setChartData] = useState({ barData, pieData });
  const allNotifications = useNotificationStore((state) => state.notifications);
  const notifications = allNotifications.slice(0, 4);

  useEffect(() => {
    setMounted(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsResponse, chartResponse] = await Promise.all([
        api.get('/analytics/dashboard'),
        api.get('/analytics/charts'),
      ]);

      const dashboardStats = statsResponse.data;
      const chartStats = chartResponse.data;

      // Update stats with real data
      const updatedStats = stats.map(stat => {
        let value = '0';
        let change = '+0%';
        let trend: 'up' | 'down' | 'neutral' = 'neutral';

        switch (stat.label) {
          case 'Total Assets':
            value = dashboardStats.totalAssets.toLocaleString();
            break;
          case 'Total Consumables':
            value = dashboardStats.totalConsumables.toLocaleString();
            break;
          case 'Under Repair':
            value = dashboardStats.underRepair.toString();
            break;
          case 'Low Stock Alerts':
            value = dashboardStats.lowStockAlerts.toString();
            break;
        }

        return { ...stat, value, change, trend };
      });

      setStatsData(updatedStats);
      setChartData(chartStats);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      // Keep default values on error
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-64 bg-slate-100 rounded-lg" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-100 rounded-2xl" />
          <div className="h-80 bg-slate-100 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Dashboard Overview
          </h1>
          <div className="text-slate-500 dark:text-slate-400 mt-1 h-6">
            <Typewriter 
              text="Welcome back! Here's what's happening with your school's inventory today." 
              speed={40}
            />
          </div>
        </div>
        <Link href="/transactions">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <button className="gap-2 shadow-sm border border-slate-200 inline-flex items-center justify-center rounded-lg bg-background hover:bg-accent hover:text-accent-foreground px-4 py-2 text-sm font-medium transition-colors">
              <History className="w-4 h-4" /> View Activity
            </button>
          </motion.div>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsData.map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            <Link href={stat.href}>
              <TiltCard>
                <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden relative glass-card">
                  <div className={cn(
                    "absolute top-0 left-0 w-1 h-full",
                    stat.color === 'blue' && "bg-blue-500",
                    stat.color === 'emerald' && "bg-emerald-500",
                    stat.color === 'amber' && "bg-amber-500",
                    stat.color === 'rose' && "bg-rose-500",
                  )} />
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-bold text-slate-500 group-hover:text-slate-900 transition-colors uppercase tracking-wider">
                      {stat.label}
                    </CardTitle>
                    <div className={cn(
                      "p-2.5 rounded-xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm",
                      stat.color === 'blue' && "bg-blue-50 text-blue-500 group-hover:bg-blue-500 group-hover:text-white",
                      stat.color === 'emerald' && "bg-emerald-50 text-emerald-500 group-hover:bg-emerald-500 group-hover:text-white",
                      stat.color === 'amber' && "bg-amber-50 text-amber-500 group-hover:bg-amber-500 group-hover:text-white",
                      stat.color === 'rose' && "bg-rose-50 text-rose-500 group-hover:bg-rose-500 group-hover:text-white",
                    )}>
                      <stat.icon className="w-5 h-5" />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-baseline gap-2">
                      <div className="text-4xl font-black text-slate-900 tracking-tight">
                        {stat.value}
                      </div>
                      {stat.color === 'rose' && <PulseIndicator color="rose" size="sm" className="mb-2" />}
                    </div>
                    <div className="flex items-center gap-1 mt-3">
                      <div className={cn(
                        "flex items-center px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-tighter",
                        stat.trend === 'up' ? "bg-emerald-100 text-emerald-700" : 
                        stat.trend === 'down' ? "bg-rose-100 text-rose-700" : 
                        "bg-slate-100 text-slate-600"
                      )}>
                        {stat.trend === 'up' && <ArrowUpRight className="w-3 h-3 mr-0.5" />}
                        {stat.trend === 'down' && <ArrowDownRight className="w-3 h-3 mr-0.5" />}
                        {stat.change}
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 ml-1 uppercase tracking-widest">
                        vs last month
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </Link>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div variants={itemVariants} className="lg:col-span-2">
          <AnimatedBarChart 
            data={chartData.barData} 
            dataKey="total" 
            categoryKey="name" 
            title="Weekly Asset Movements" 
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <AnimatedPieChart 
            data={chartData.pieData} 
            dataKey="value" 
            nameKey="name" 
            title="Inventory Distribution" 
          />
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Recent Activity</CardTitle>
                <TrendingUp className="w-4 h-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {notifications.map((n, idx) => (
                  <Link key={n.id} href="/notifications">
                    <motion.div 
                      whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                      className="flex items-start gap-4 p-4 transition-colors"
                    >
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
                        <History className="w-5 h-5 text-slate-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {n.title}
                        </p>
                        <p className="text-sm text-slate-600 mt-0.5">
                          {n.message}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider font-bold text-slate-400 mt-1">
                          {n.time}
                        </p>
                      </div>
                    </motion.div>
                  </Link>
                ))}
                {notifications.length === 0 && (
                  <div className="text-center py-12 text-slate-400 text-sm italic">
                    No recent activity to report
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-none shadow-sm overflow-hidden">
            <CardHeader className="bg-slate-50/50 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Upcoming Maintenance</CardTitle>
                <Wrench className="w-4 h-4 text-slate-400" />
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-slate-100">
                {[
                  { task: "Projector Service - Lab 3", date: "May 12, 2026", status: "Pending" },
                  { task: "AC Filter Cleaning - Hall A", date: "May 14, 2026", status: "Scheduled" },
                  { task: "Network Router Check", date: "May 15, 2026", status: "Critical" },
                  { task: "Printer Toner Replacement", date: "May 18, 2026", status: "Pending" },
                ].map((item, i) => (
                  <motion.div 
                    key={i}
                    whileHover={{ backgroundColor: "rgba(248, 250, 252, 1)" }}
                    className="flex items-center justify-between p-4 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                        item.status === 'Critical' ? "bg-rose-50 text-rose-600" : "bg-amber-50 text-amber-600"
                      )}>
                        <Wrench className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {item.task}
                        </p>
                        <p className="text-xs text-slate-500">
                          {item.date}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full",
                      item.status === 'Critical' ? "bg-rose-100 text-rose-700" : 
                      item.status === 'Scheduled' ? "bg-blue-100 text-blue-700" : 
                      "bg-amber-100 text-amber-700"
                    )}>
                      {item.status}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
