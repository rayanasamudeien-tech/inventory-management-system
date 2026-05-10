'use client';

import { useAuthStore } from '@/store/authStore';
import { User, Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useNotificationStore } from '@/store/notificationStore';
import { useState, useEffect } from 'react';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const user = useAuthStore((state) => state.user);
  const notifications = useNotificationStore((state) => state.notifications);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
     return (
       <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8">
         <div className="flex-1 max-w-md relative">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
           <Input
             placeholder="Search assets, stock, or transactions..."
             className="pl-10 bg-slate-50/50 border-none h-11"
             disabled
           />
         </div>
         <div className="flex items-center gap-6">
           <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />
           <div className="w-24 h-4 bg-slate-100 animate-pulse rounded" />
         </div>
       </header>
     );
   }

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8">
      <div className="flex-1 max-w-md relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search assets, stock, or transactions..."
          className="pl-10 bg-slate-50/50 border-none focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
        />
      </div>

      <div className="flex items-center gap-6">
        <Link href="/notifications">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <motion.span 
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute top-2 right-2 w-2 h-2 bg-destructive rounded-full border-2 border-white"
              />
            )}
          </motion.button>
        </Link>

        <motion.div 
          whileHover={{ x: -5 }}
          className="flex items-center gap-3 pl-6 border-l border-slate-100 cursor-pointer"
        >
          <div className="text-right hidden sm:block">
            <p className="text-sm font-bold text-slate-900 leading-none">
              {user?.firstName} {user?.lastName}
            </p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
              {user?.role?.toLowerCase()}
            </p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-white font-bold shadow-sm shadow-primary/20">
            {user?.firstName?.[0]}
            {user?.lastName?.[0]}
          </div>
        </motion.div>
      </div>
    </header>
  );
}
