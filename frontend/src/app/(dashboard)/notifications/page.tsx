'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Bell,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Package,
  Wrench,
  Trash2,
  Check,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  show: { opacity: 1, x: 0 },
};

const mockNotifications = [
  {
    id: '1',
    title: 'Low Stock Alert',
    message: 'A4 Printing Paper is below minimum threshold (15 reams left).',
    type: 'LOW_STOCK',
    time: '2 hours ago',
    isRead: false,
  },
  {
    id: '2',
    title: 'Warranty Expiry',
    message: 'Warranty for "Dell Projector - Lab 3" expires in 7 days.',
    type: 'WARRANTY_EXPIRY',
    time: '5 hours ago',
    isRead: false,
  },
  {
    id: '3',
    title: 'Maintenance Completed',
    message: 'Repair request for "HP Laserjet" has been marked as completed.',
    type: 'MAINTENANCE_DUE',
    time: 'Yesterday',
    isRead: true,
  },
  {
    id: '4',
    title: 'Asset Assigned',
    message: 'New asset "iMac 24" M3" has been assigned to Jane Smith.',
    type: 'ASSIGNMENT',
    time: '2 days ago',
    isRead: true,
  },
];

const iconMap: Record<string, any> = {
  LOW_STOCK: AlertTriangle,
  WARRANTY_EXPIRY: Clock,
  MAINTENANCE_DUE: Wrench,
  ASSIGNMENT: Package,
};

const colorMap: Record<string, string> = {
  LOW_STOCK: 'text-amber-600 bg-amber-50',
  WARRANTY_EXPIRY: 'text-blue-600 bg-blue-50',
  MAINTENANCE_DUE: 'text-emerald-600 bg-emerald-50',
  ASSIGNMENT: 'text-purple-600 bg-purple-50',
};

import { useNotificationStore } from '@/store/notificationStore';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function NotificationsPage() {
  const [mounted, setMounted] = useState(false);
  const { notifications, markAllRead, clearAll, markAsRead, deleteNotification } = useNotificationStore();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-100 rounded" />
          <div className="h-10 w-32 bg-slate-100 rounded" />
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleMarkAllRead = () => {
    markAllRead();
    toast.success('All notifications marked as read');
  };

  const handleClearAll = () => {
    clearAll();
    toast.success('All notifications cleared');
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsRead(id);
    toast.success('Notification marked as read');
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNotification(id);
    toast.success('Notification deleted');
  };

  const handleNotificationClick = (n: any) => {
    if (!n.isRead) {
      markAsRead(n.id);
    }
    if (n.link) {
      router.push(n.link);
    }
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="max-w-4xl mx-auto space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Notifications</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Stay updated with inventory alerts and system activities in real-time.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="gap-2 font-bold uppercase tracking-wider text-[10px] h-9 border-slate-200 shadow-sm" 
            onClick={handleMarkAllRead}
            disabled={notifications.length === 0 || notifications.every(n => n.isRead)}
          >
            <Check className="w-4 h-4" /> Mark all read
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-destructive hover:text-destructive hover:bg-destructive/5 gap-2 font-bold uppercase tracking-wider text-[10px] h-9"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            <Trash2 className="w-4 h-4" /> Clear all
          </Button>
        </motion.div>
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="popLayout">
          {notifications.map((n) => {
            const Icon = iconMap[n.type] || Bell;
            return (
              <motion.div
                key={n.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <Card 
                  className={cn(
                    "border-none shadow-sm transition-all cursor-pointer group glass-card relative overflow-hidden",
                    !n.isRead ? "border-l-4 border-l-primary shadow-md" : "opacity-80 grayscale-[0.5]"
                  )}
                  onClick={() => handleNotificationClick(n)}
                >
                  {!n.isRead && (
                    <motion.div 
                      layoutId={`glow-${n.id}`}
                      className="absolute inset-0 bg-primary/5 pointer-events-none"
                    />
                  )}
                  <CardContent className="p-6 flex gap-6">
                    <div className={cn(
                      "p-4 h-fit rounded-2xl shrink-0 transition-all duration-300 group-hover:scale-110 shadow-sm", 
                      colorMap[n.type]
                    )}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className={cn(
                          "text-lg font-black tracking-tight transition-colors", 
                          !n.isRead ? "text-slate-900 dark:text-white" : "text-slate-500"
                        )}>
                          {n.title}
                        </h3>
                        <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">{n.time}</span>
                      </div>
                      <p className={cn(
                        "text-sm font-medium leading-relaxed",
                        !n.isRead ? "text-slate-600 dark:text-slate-300" : "text-slate-400"
                      )}>
                        {n.message}
                      </p>
                      <div className="flex items-center gap-3 mt-4">
                        {!n.isRead && (
                          <Badge className="bg-primary text-white border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5">
                            New Alert
                          </Badge>
                        )}
                        {n.link && (
                          <span className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1 group-hover:gap-2 transition-all">
                            View context <ChevronRight className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 shrink-0">
                      {!n.isRead && (
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-10 w-10 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10"
                            onClick={(e) => handleMarkAsRead(n.id, e)}
                          >
                            <CheckCircle2 className="w-5 h-5" />
                          </Button>
                        </motion.div>
                      )}
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-10 w-10 rounded-xl text-slate-400 hover:text-destructive hover:bg-destructive/10"
                          onClick={(e) => handleDelete(n.id, e)}
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </motion.div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {notifications.length === 0 && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-32 glass-card rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800"
        >
          <div className="inline-flex p-6 rounded-full bg-slate-50 dark:bg-slate-800 mb-6">
            <Bell className="w-12 h-12 text-slate-200 dark:text-slate-700" />
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">All clear!</h3>
          <p className="text-slate-500 font-medium mt-2">You don't have any new notifications at the moment.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
