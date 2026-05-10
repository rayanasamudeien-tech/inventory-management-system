'use client';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  Wrench,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  MoreHorizontal,
  User,
  Settings,
  History,
  Trash2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '@/components/shared/TiltCard';
import { PulseIndicator } from '@/components/shared/PulseIndicator';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { MaintenanceRequestForm } from '@/components/maintenance/MaintenanceRequestForm';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';

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

const priorityStyles: Record<string, string> = {
  HIGH: 'bg-rose-50 text-rose-700 border-rose-100',
  MEDIUM: 'bg-amber-50 text-amber-700 border-amber-100',
  LOW: 'bg-emerald-50 text-emerald-700 border-emerald-100',
};

const statusStyles: Record<string, string> = {
  PENDING: 'bg-slate-100 text-slate-600',
  IN_PROGRESS: 'bg-blue-100 text-blue-700',
  COMPLETED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-rose-100 text-rose-700',
};

export default function MaintenancePage() {
  const { user } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requests, setRequests] = useState<any[]>([]);
  const [assets, setAssets] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  const fetchData = async () => {
    setFetching(true);
    try {
      const [requestsResponse, assetsResponse] = await Promise.all([
        api.get('/maintenance'),
        api.get('/assets'),
      ]);
      setRequests(requestsResponse.data);
      setAssets(assetsResponse.data);
    } catch (error: any) {
      console.error('Failed to load maintenance data:', error);
      toast.error('Failed to load maintenance data');
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchData();
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-100 rounded" />
          <div className="h-10 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-96 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const handleCreateRequest = async (data: any) => {
    if (!user) {
      toast.error('You must be signed in to submit a maintenance request.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/maintenance', {
        assetId: data.assetId,
        description: data.description,
        priority: data.priority,
        technicianId: data.technicianId || undefined,
        requesterId: user.id,
      });
      toast.success('Maintenance request submitted successfully');
      setIsAddOpen(false);
      fetchData();
    } catch (error: any) {
      console.error('Failed to create maintenance request:', error);
      toast.error(error.response?.data?.message || 'Failed to submit maintenance request');
    } finally {
      setLoading(false);
    }
  };

  const filteredMaintenance = requests.filter((req) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      req.asset?.name?.toLowerCase().includes(searchLower) ||
      req.requester?.firstName?.toLowerCase().includes(searchLower) ||
      req.requester?.lastName?.toLowerCase().includes(searchLower) ||
      req.technician?.firstName?.toLowerCase().includes(searchLower) ||
      req.technician?.lastName?.toLowerCase().includes(searchLower) ||
      req.description?.toLowerCase().includes(searchLower) ||
      req.status?.toLowerCase().includes(searchLower) ||
      req.priority?.toLowerCase().includes(searchLower)
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Maintenance Hub</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Track and manage equipment repairs with real-time status updates.
          </p>
        </motion.div>
        <motion.div variants={itemVariants}>
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" />
              New Request
            </DialogTrigger>
            <DialogContent className="max-w-2xl glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">New Maintenance Request</DialogTitle>
                <DialogDescription className="font-medium">
                  Report an issue with an asset and request maintenance.
                </DialogDescription>
              </DialogHeader>
              <MaintenanceRequestForm assets={assets} onSubmit={handleCreateRequest} loading={loading} />
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by asset, requester, technician or description..."
            className="pl-10 bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all rounded-xl"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Active', value: '12', icon: Wrench, color: 'blue' },
          { label: 'Pending', value: '5', icon: Clock, color: 'amber' },
          { label: 'Completed', value: '84', icon: CheckCircle2, color: 'emerald' },
          { label: 'Urgent', value: '2', icon: AlertCircle, color: 'rose' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <TiltCard>
                <Card className="border-none shadow-sm glass-card overflow-hidden group">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <div className="flex items-baseline gap-2 mt-1">
                          <p className={cn(
                            "text-3xl font-black tracking-tight",
                            stat.color === 'rose' ? "text-rose-600" : "text-slate-900 dark:text-slate-100"
                          )}>{stat.value}</p>
                          {stat.color === 'rose' && parseInt(stat.value) > 0 && <PulseIndicator color="rose" size="sm" />}
                        </div>
                      </div>
                      <div className={cn(
                        "p-3 rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm",
                        stat.color === 'blue' && "bg-blue-50 text-blue-600 dark:bg-blue-500/10",
                        stat.color === 'amber' && "bg-amber-50 text-amber-600 dark:bg-amber-500/10",
                        stat.color === 'emerald' && "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10",
                        stat.color === 'rose' && "bg-rose-50 text-rose-600 dark:bg-rose-500/10",
                      )}>
                        <Icon className="w-6 h-6" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
          );
        })}
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 border-b border-slate-100 dark:border-slate-800">
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Asset & Description</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Requester</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Technician</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Priority</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Status</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredMaintenance.map((req) => {
                const technicianName = req.technician
                  ? `${req.technician.firstName || ''} ${req.technician.lastName || ''}`.trim()
                  : 'Unassigned';
                const requesterName = req.requester
                  ? `${req.requester.firstName || ''} ${req.requester.lastName || ''}`.trim()
                  : 'Unknown';

                  return (
                    <tr
                      key={req.id}
                      className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                    >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">
                          {req.asset?.name || 'Unknown asset'}
                        </span>
                        <span className="text-xs text-slate-500 font-medium mt-0.5">{req.description}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">
                          {req.createdAt ? new Date(req.createdAt).toLocaleDateString() : 'Unknown date'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center">
                          <User className="w-3.5 h-3.5 text-slate-500" />
                        </div>
                        <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{requesterName}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn(
                          "w-7 h-7 rounded-full flex items-center justify-center shadow-sm border border-white dark:border-slate-800",
                          technicianName === 'Unassigned' ? 'bg-slate-50 text-slate-300' : 'bg-primary/10 text-primary'
                        )}>
                          <Wrench className="w-3.5 h-3.5" />
                        </div>
                        <span className={cn(
                          'text-sm font-bold',
                          technicianName === 'Unassigned' ? 'text-slate-400' : 'text-slate-700 dark:text-slate-300'
                        )}>
                          {technicianName}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={cn(
                        'font-black text-[10px] uppercase tracking-widest px-2.5 py-1 shadow-none border',
                        priorityStyles[req.priority] || 'bg-slate-100 text-slate-600 border-slate-200'
                      )}
                      >
                        {req.priority || 'MEDIUM'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={cn(
                        'font-black text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-full',
                        statusStyles[req.status] || 'bg-slate-100 text-slate-600'
                      )}
                      >
                        {(req.status || 'PENDING').replace('_', ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <button className="inline-flex items-center justify-center h-8 w-8 rounded-full hover:bg-slate-100 transition-colors">
                            <MoreHorizontal className="w-4 h-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                          <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                          <DropdownMenuItem className="font-bold gap-2">
                            <Settings className="w-3.5 h-3.5" /> Manage Task
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold gap-2">
                            <History className="w-3.5 h-3.5" /> Task History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive focus:text-destructive font-bold gap-2">
                            <Trash2 className="w-3.5 h-3.5" /> Cancel Request
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                    </tr>
                  );
              })}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredMaintenance.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Wrench className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No requests found</h3>
            <p className="text-slate-500 mt-1 font-medium">Try adjusting your search or filters.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
