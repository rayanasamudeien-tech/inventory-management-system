'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Package,
  Box,
  History,
  MapPin,
  Truck,
  Wrench,
  BarChart3,
  Bell,
  Settings,
  ShieldCheck,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useNotificationStore } from '@/store/notificationStore';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/dashboard' },
  { icon: Package, label: 'Assets', href: '/assets' },
  { icon: Box, label: 'Consumables', href: '/stock' },
  { icon: History, label: 'Transactions', href: '/transactions' },
  { icon: MapPin, label: 'Locations', href: '/locations' },
  { icon: Truck, label: 'Suppliers', href: '/suppliers' },
  { icon: Wrench, label: 'Maintenance', href: '/maintenance' },
  { icon: BarChart3, label: 'Reports', href: '/reports' },
  { icon: Bell, label: 'Notifications', href: '/notifications' },
  { icon: Settings, label: 'Settings', href: '/settings' },
];

export default function Sidebar() {
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
        <div className="p-6 border-b border-slate-100 h-20" />
        <div className="flex-1 p-4 space-y-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="h-10 bg-slate-50 rounded-lg animate-pulse" />
          ))}
        </div>
      </aside>
    );
  }

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <aside className="w-64 bg-white border-r border-slate-200 h-screen flex flex-col fixed left-0 top-0 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <motion.div 
          initial={{ rotate: -10, scale: 0.9 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="p-2 bg-primary/10 rounded-lg"
        >
          <ShieldCheck className="w-6 h-6 text-primary" />
        </motion.div>
        <span className="font-bold text-xl text-slate-900 tracking-tight">
          Starhacs
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.href}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <Link
              href={item.href}
              className={cn(
                'flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all group',
                pathname === item.href
                  ? 'bg-primary text-primary-foreground shadow-md scale-[1.02]'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 hover:pl-4',
              )}
            >
              <div className="flex items-center gap-3">
                <item.icon className={cn(
                  "w-4 h-4 transition-transform group-hover:scale-110",
                  pathname === item.href ? "text-white" : "text-slate-400 group-hover:text-primary"
                )} />
                {item.label}
              </div>
              {item.label === 'Notifications' && unreadCount > 0 && (
                <span className={cn(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold",
                  pathname === item.href ? "bg-white text-primary" : "bg-primary text-white"
                )}>
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>
          </motion.div>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <motion.button
          whileHover={{ scale: 1.02, backgroundColor: "rgba(254, 242, 242, 1)" }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium text-destructive transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </motion.button>
      </div>
    </aside>
  );
}
