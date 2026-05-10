'use client';

import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { motion } from 'framer-motion';

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

interface AnimatedBarChartProps {
  data: any[];
  dataKey: string;
  categoryKey: string;
  title?: string;
}

export const AnimatedBarChart: React.FC<AnimatedBarChartProps> = ({
  data,
  dataKey,
  categoryKey,
  title,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse flex flex-col">
        <div className="h-6 w-32 bg-slate-100 rounded mb-4" />
        <div className="flex-1 bg-slate-50 rounded" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
          <XAxis 
            dataKey={categoryKey} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip 
            cursor={{ fill: '#f3f4f6' }}
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
          />
          <Bar 
            dataKey={dataKey} 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
            animationDuration={1500}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

interface AnimatedPieChartProps {
  data: any[];
  dataKey: string;
  nameKey: string;
  title?: string;
}

export const AnimatedPieChart: React.FC<AnimatedPieChartProps> = ({
  data,
  dataKey,
  nameKey,
  title,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-full h-[300px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm animate-pulse flex flex-col">
        <div className="h-6 w-32 bg-slate-100 rounded mb-4" />
        <div className="flex-1 bg-slate-50 rounded-full mx-auto aspect-square w-48" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[300px] p-4 bg-white dark:bg-gray-800 rounded-xl shadow-sm"
    >
      {title && <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">{title}</h3>}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            paddingAngle={5}
            dataKey={dataKey}
            nameKey={nameKey}
            animationDuration={1500}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              borderRadius: '8px', 
              border: 'none', 
              boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
            }}
          />
          <Legend verticalAlign="bottom" height={36}/>
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};
