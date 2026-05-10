'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PulseIndicatorProps {
  color?: 'emerald' | 'rose' | 'amber' | 'blue' | 'primary';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const colorMap = {
  emerald: 'bg-emerald-500',
  rose: 'bg-rose-500',
  amber: 'bg-amber-500',
  blue: 'bg-blue-500',
  primary: 'bg-primary',
};

const sizeMap = {
  sm: 'w-2 h-2',
  md: 'w-3 h-3',
  lg: 'w-4 h-4',
};

export const PulseIndicator: React.FC<PulseIndicatorProps> = ({
  color = 'primary',
  size = 'md',
  className,
}) => {
  return (
    <div className={cn('relative flex items-center justify-center', sizeMap[size], className)}>
      <motion.span
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 0, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className={cn(
          'absolute inline-flex h-full w-full rounded-full opacity-75',
          colorMap[color]
        )}
      />
      <span className={cn('relative inline-flex rounded-full', sizeMap[size], colorMap[color])} />
    </div>
  );
};
