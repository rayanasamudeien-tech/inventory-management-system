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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
} from '@/components/ui/card';
import {
  Plus,
  Search,
  Phone,
  Mail,
  Building,
  MoreHorizontal,
  ExternalLink,
  Truck,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { SupplierForm } from '@/components/suppliers/SupplierForm';
import { toast } from 'sonner';
import { useAuthStore } from '@/store/authStore';
import api from '@/lib/axios';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { TiltCard } from '@/components/shared/TiltCard';

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

const mockSuppliers = [
  {
    id: '1',
    name: 'EduTech Solutions',
    contact: 'Mark Johnson',
    phone: '+254 712 345 678',
    email: 'sales@edutech.co.ke',
    address: 'Nairobi, Kenya',
    category: 'ICT Equipment',
  },
  {
    id: '2',
    name: 'Office Mart Ltd',
    contact: 'Sarah Williams',
    phone: '+254 722 987 654',
    email: 'info@officemart.com',
    address: 'Mombasa, Kenya',
    category: 'Stationery',
  },
  {
    id: '3',
    name: 'Scientific Supplies Co.',
    contact: 'David Chen',
    phone: '+254 733 111 222',
    email: 'dchen@scisupplies.com',
    address: 'Nakuru, Kenya',
    category: 'Lab Equipment',
  },
  {
    id: '4',
    name: 'Sports World',
    contact: 'Coach James',
    phone: '+254 744 555 666',
    email: 'orders@sportsworld.co.ke',
    address: 'Kisumu, Kenya',
    category: 'Sports Gear',
  },
];

export default function SuppliersPage() {
  const { isSuperAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchSuppliers();
  }, []);

  const fetchSuppliers = async () => {
    try {
      setFetching(true);
      const response = await api.get('/suppliers');
      setSuppliers(response.data);
    } catch (error: any) {
      console.error('Failed to fetch suppliers:', error);
      toast.error('Failed to load suppliers');
      // Fallback to mock data if API fails
      setSuppliers(mockSuppliers);
    } finally {
      setFetching(false);
    }
  };

  const handleAddSupplier = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/suppliers', data);
      toast.success('New supplier registered successfully');
      setIsAddOpen(false);
      fetchSuppliers(); // Refresh the list
    } catch (error: any) {
      console.error('Failed to add supplier:', error);
      toast.error(error.response?.data?.message || 'Failed to register supplier');
    } finally {
      setLoading(false);
    }
  };

  const filteredSuppliers = suppliers.filter((supplier) => {
    const searchLower = searchTerm.toLowerCase();
    return (
      supplier.name.toLowerCase().includes(searchLower) ||
      supplier.contactPerson?.toLowerCase().includes(searchLower) ||
      supplier.category?.toLowerCase().includes(searchLower) ||
      supplier.email?.toLowerCase().includes(searchLower) ||
      supplier.phone?.toLowerCase().includes(searchLower)
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
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Supplier Directory</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage your vendors and procurement partners with world-class efficiency.
          </p>
        </motion.div>
        {mounted && isSuperAdmin() && (
          <motion.div variants={itemVariants}>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Supplier
              </DialogTrigger>
              <DialogContent className="max-w-2xl glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Register New Supplier</DialogTitle>
                  <DialogDescription className="font-medium">
                    Add a new vendor or procurement partner to the directory.
                  </DialogDescription>
                </DialogHeader>
                <SupplierForm onSubmit={handleAddSupplier} loading={loading} />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </div>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search suppliers by name, contact, or category..."
            className="pl-10 bg-white dark:bg-slate-900 border-none shadow-sm h-11 rounded-xl focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Suppliers', value: suppliers.length.toString(), icon: Truck, color: 'blue' },
          { label: 'Active Vendors', value: suppliers.filter(s => s.category).length.toString(), icon: Building, color: 'emerald' },
        ].map((stat) => (
          <motion.div key={stat.label} variants={itemVariants}>
            {mounted ? (
              <TiltCard>
                <Card className="border-none shadow-sm glass-card overflow-hidden group">
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <div className={cn(
                        "p-3 rounded-2xl transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-sm",
                        stat.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                      )}>
                        <stat.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                        <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{stat.value}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            ) : (
              <Card className="border-none shadow-sm glass-card overflow-hidden group">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-3 rounded-2xl transition-all duration-300 shadow-sm",
                      stat.color === 'blue' ? "bg-blue-50 text-blue-600" : "bg-emerald-50 text-emerald-600"
                    )}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                      <p className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        {fetching ? (
          <div className="p-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Truck className="w-8 h-8 text-slate-200 animate-pulse" />
            </div>
            <p className="text-slate-500 font-medium">Loading suppliers...</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 border-b border-slate-100 dark:border-slate-800">
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Supplier Name</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Contact Person</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Category</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Contact Info</TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <AnimatePresence>
                {filteredSuppliers.map((supplier) => (
                  <tr
                    key={supplier.id}
                    className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                  >
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors">{supplier.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-1">{supplier.address}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-slate-700 dark:text-slate-300 font-bold text-sm">{supplier.contactPerson}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-none font-black text-[10px] uppercase tracking-tighter px-3 py-1">
                        {supplier.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Phone className="w-3.5 h-3.5 text-primary" /> {supplier.phone}
                        </div>
                        <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                          <Mail className="w-3.5 h-3.5 text-primary" /> {supplier.email}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-primary hover:bg-primary/10"
                            onClick={() => toast.info('View supplier website coming soon')}
                          >
                            <ExternalLink className="w-4.5 h-4.5" />
                          </Button>
                        </motion.div>
                        <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100"
                            onClick={() => toast.info('Supplier options coming soon')}
                          >
                            <MoreHorizontal className="w-4.5 h-4.5" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </tr>
                ))}
              </AnimatePresence>
            </TableBody>
          </Table>
        )}
        {!fetching && filteredSuppliers.length === 0 && (
          <div className="text-center py-20">
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Truck className="w-8 h-8 text-slate-200" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No suppliers found</h3>
            <p className="text-slate-500 mt-1 font-medium">Try searching for a different name or category.</p>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
