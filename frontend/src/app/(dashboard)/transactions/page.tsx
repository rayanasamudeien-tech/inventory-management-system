'use client';

// Re-forcing refresh to resolve Button reference error
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  History,
  Search,
  ArrowUpRight,
  ArrowDownRight,
  User,
  Package,
  Calendar,
  Filter,
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
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0 },
};

const mockTransactions = [
  {
    id: '1',
    type: 'STOCK_ISSUE',
    item: 'A4 Printing Paper',
    quantity: '5 Reams',
    user: 'John Doe',
    department: 'Accounts',
    date: '2026-05-09 10:30 AM',
    status: 'APPROVED',
  },
  {
    id: '2',
    type: 'ASSET_ASSIGNMENT',
    item: 'iMac 24" M3',
    quantity: '1 Unit',
    user: 'Jane Smith',
    department: 'ICT',
    date: '2026-05-09 09:15 AM',
    status: 'COMPLETED',
  },
  {
    id: '3',
    type: 'STOCK_RECEIVE',
    item: 'Dry Erase Markers',
    quantity: '50 Units',
    user: 'Storekeeper',
    department: 'Main Store',
    date: '2026-05-08 04:45 PM',
    status: 'COMPLETED',
  },
  {
    id: '4',
    type: 'ASSET_TRANSFER',
    item: 'Dell Projector',
    quantity: '1 Unit',
    user: 'Technician',
    department: 'Maintenance',
    date: '2026-05-08 02:00 PM',
    status: 'PENDING',
  },
];

export default function TransactionsPage() {
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    console.log('TransactionsPage is rendering');
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded" />
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="h-96 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const filteredTransactions = mockTransactions.filter((tx) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      tx.item.toLowerCase().includes(searchLower) ||
      tx.user.toLowerCase().includes(searchLower) ||
      tx.department.toLowerCase().includes(searchLower) ||
      tx.type.toLowerCase().includes(searchLower) ||
      tx.status.toLowerCase().includes(searchLower)
    );
  });

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Inventory Activity</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Track every movement and change across your entire inventory.
          </p>
        </motion.div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <motion.div variants={itemVariants} className="flex flex-col md:flex-row justify-between gap-6 mb-8">
          <TabsList className="bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-xl h-11">
            <TabsTrigger value="all" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">All Activity</TabsTrigger>
            <TabsTrigger value="assets" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">Assets</TabsTrigger>
            <TabsTrigger value="stock" className="rounded-lg px-6 font-bold text-xs uppercase tracking-wider">Stock</TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
              <Input
                placeholder="Search history by item, user, or department..."
                className="pl-10 bg-white dark:bg-slate-900 border-none shadow-sm h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button 
              variant="outline"
              className="h-11 w-11 p-0 rounded-xl border-slate-200 bg-white shadow-sm"
              onClick={() => toast.info('Transaction filters coming soon')}
            >
              <Filter className="w-4 h-4 text-slate-600" />
            </Button>
          </div>
        </motion.div>

        <TabsContent value="all" className="m-0">
          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 border-b border-slate-100 dark:border-slate-800">
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Type</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Item/Asset</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">User/Dept</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Date & Time</TableHead>
                  <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence>
                  {filteredTransactions.map((tx, index) => (
                    <tr
                      key={tx.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                      <TableCell>
                        <div className="flex items-center gap-3">
                          {tx.type.includes('RECEIVE') || tx.type.includes('RETURN') ? (
                            <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl shadow-sm">
                              <ArrowDownRight className="w-4 h-4 text-emerald-600" />
                            </div>
                          ) : (
                            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-xl shadow-sm">
                              <ArrowUpRight className="w-4 h-4 text-blue-600" />
                            </div>
                          )}
                          <span className="text-[10px] font-black text-slate-700 dark:text-slate-300 uppercase tracking-widest">
                            {tx.type.replace('_', ' ')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{tx.item}</span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{tx.quantity}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center border border-white dark:border-slate-700 shadow-sm">
                            <User className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">{tx.user}</span>
                            <span className="text-[10px] text-slate-400 uppercase font-black tracking-tighter mt-1">{tx.department}</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-slate-500 font-medium">
                          <Calendar className="w-3.5 h-3.5" />
                          <span className="text-xs">{tx.date}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            'font-black text-[10px] uppercase tracking-widest px-2.5 py-1 shadow-none border',
                            tx.status === 'APPROVED' || tx.status === 'COMPLETED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                              : 'bg-amber-50 text-amber-700 border-amber-100',
                          )}
                        >
                          {tx.status}
                        </Badge>
                      </TableCell>
                    </tr>
                  ))}
                </AnimatePresence>
              </TableBody>
            </Table>
            {filteredTransactions.length === 0 && (
              <div className="text-center py-20 bg-slate-50/30">
                <div className="inline-flex p-4 rounded-full bg-white shadow-sm mb-4">
                  <Search className="w-8 h-8 text-slate-200" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">No activity found</h3>
                <p className="text-slate-500 mt-1 font-medium">Try searching for something else.</p>
              </div>
            )}
          </motion.div>
        </TabsContent>
        <TabsContent value="assets">
          <motion.div variants={itemVariants} className="p-20 text-center bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <Package className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Asset Transactions</h3>
            <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">This specialized view is currently under development to bring you deeper insights.</p>
          </motion.div>
        </TabsContent>
        <TabsContent value="stock">
          <motion.div variants={itemVariants} className="p-20 text-center bg-white/50 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl">
            <History className="w-16 h-16 text-slate-200 dark:text-slate-800 mx-auto mb-6" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Stock Movements</h3>
            <p className="text-slate-500 font-medium mt-2 max-w-sm mx-auto">Detailed consumables tracking view will be available in the next update.</p>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
