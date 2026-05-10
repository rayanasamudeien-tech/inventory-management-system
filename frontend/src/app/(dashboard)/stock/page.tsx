'use client';

// Re-forcing refresh
import { useState, useEffect } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button, buttonVariants } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Plus,
  Search,
  MoreHorizontal,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  History,
  AlertCircle,
  PackagePlus,
  PackageMinus,
  Edit,
  Box,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
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
import { StockMovementForm } from '@/components/stock/StockMovementForm';
import { StockItemForm } from '@/components/stock/StockItemForm';
import { StockAdjustmentForm } from '@/components/stock/StockAdjustmentForm';
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

export default function StockPage() {
  const { isSuperAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [movementConfig, setMovementConfig] = useState<{ item: any; type: 'RECEIVE' | 'ISSUE' } | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAdjustmentOpen, setIsAdjustmentOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState<any[]>([]);

  const fetchStock = async () => {
    try {
      const response = await api.get('/stock', {
        params: { search: searchTerm }
      });
      setStock(response.data);
    } catch (error) {
      console.error('Failed to fetch stock:', error);
      toast.error('Could not load stock from database');
    }
  };

  const handleAddItem = async (data: any) => {
    setLoading(true);
    try {
      const processedData = {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      };
      await api.post('/stock', processedData);
      toast.success('New stock item added successfully');
      setIsAddOpen(false);
      fetchStock();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to add stock item');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchStock();
  }, [searchTerm]);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-100 rounded" />
          <div className="h-10 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-64 bg-slate-50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const categories = Array.from(new Set(stock.map((item) => item.categoryId).filter(Boolean)));

  const handleEditItem = async (data: any) => {
    setLoading(true);
    try {
      const processedData = {
        ...data,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : undefined,
      };
      await api.patch(`/stock/${editingItem.id}`, processedData);
      toast.success('Stock item updated successfully');
      setIsEditOpen(false);
      setEditingItem(null);
      fetchStock();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update stock item');
    } finally {
      setLoading(false);
    }
  };

  const handleMovement = async (data: any) => {
    setLoading(true);
    try {
      // In a real system, we'd have a separate /stock-transactions endpoint
      // For now, we update the stock item's quantity
      const currentItem = movementConfig?.item;
      const newQty = movementConfig?.type === 'RECEIVE' 
        ? currentItem.quantity + data.quantity 
        : currentItem.quantity - data.quantity;
      
      await api.patch(`/stock/${currentItem.id}`, { quantity: newQty });
      toast.success(`Stock ${movementConfig?.type.toLowerCase()}d successfully`);
      setMovementConfig(null);
      fetchStock();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to record movement');
    } finally {
      setLoading(false);
    }
  };

  const handleAdjustment = async (data: any) => {
    setLoading(true);
    try {
      console.log('Sending adjustment data:', data);
      const response = await api.post('/stock-adjustments', data);
      console.log('Adjustment response:', response);
      toast.success('Stock adjustment recorded successfully');
      setIsAdjustmentOpen(false);
      fetchStock();
    } catch (error: any) {
      console.error('Adjustment error:', error);
      console.error('Error response:', error.response);
      toast.error(error.response?.data?.message || 'Failed to record adjustment');
    } finally {
      setLoading(false);
    }
  };

  const filteredStock = stock.filter((item) => {
    const matchesCategory = !selectedCategory || item.categoryId === selectedCategory;
    return matchesCategory;
  });

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Consumables Inventory</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Monitor and manage school stock levels with real-time tracking.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
            <DialogTrigger className="hidden md:flex gap-2 shadow-sm border border-slate-200 inline-flex items-center justify-center rounded-lg hover:bg-slate-50 px-3 py-2 text-sm font-medium transition-colors">
              <History className="w-4 h-4" />
              History
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Stock Movement History</DialogTitle>
                <DialogDescription className="font-medium">
                  Recent incoming and outgoing stock transactions.
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-slate-50/50">
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Date</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Type</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Item</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">Quantity</TableHead>
                      <TableHead className="font-bold uppercase tracking-wider text-[10px]">User</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { date: '2026-05-09', type: 'ISSUE', item: 'A4 Paper', qty: '5 Reams', user: 'John' },
                      { date: '2026-05-09', type: 'RECEIVE', item: 'Markers', qty: '50 Units', user: 'Admin' },
                      { date: '2026-05-08', type: 'ISSUE', item: 'AA Batteries', qty: '10 Packs', user: 'Jane' },
                    ].map((tx, idx) => (
                      <TableRow key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="text-xs font-medium text-slate-500">{tx.date}</TableCell>
                        <TableCell>
                          <Badge variant={tx.type === 'RECEIVE' ? 'outline' : 'secondary'} className={cn(
                            "font-black text-[10px] uppercase tracking-widest",
                            tx.type === 'RECEIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-blue-50 text-blue-700 border-blue-100'
                          )}>
                            {tx.type}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-slate-900">{tx.item}</TableCell>
                        <TableCell className="text-sm font-medium">{tx.qty}</TableCell>
                        <TableCell className="text-sm font-medium text-slate-600">{tx.user}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
          </Dialog>
          {mounted && isSuperAdmin() && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                New Item
              </DialogTrigger>
              <DialogContent className="max-w-2xl glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Add New Stock Item</DialogTitle>
                  <DialogDescription className="font-medium">
                    Enter the details of the new consumable item to add it to the inventory.
                  </DialogDescription>
                </DialogHeader>
                <StockItemForm onSubmit={handleAddItem} loading={loading} />
              </DialogContent>
            </Dialog>
          )}

          {/* Edit Stock Item Dialog */}
          <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
            <DialogContent className="max-w-2xl glass-card">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold">Edit Stock Item</DialogTitle>
                <DialogDescription className="font-medium">
                  Update the details of the selected stock item.
                </DialogDescription>
              </DialogHeader>
              {editingItem && (
                <StockItemForm 
                  initialData={editingItem} 
                  onSubmit={handleEditItem} 
                  loading={loading} 
                />
              )}
            </DialogContent>
          </Dialog>
        </motion.div>
      </div>

      <Dialog open={!!movementConfig} onOpenChange={(open) => !open && setMovementConfig(null)}>
        <DialogContent className="max-w-md glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">
              {movementConfig?.type === 'RECEIVE' ? 'Receive Stock' : 'Issue Stock'}
            </DialogTitle>
            <DialogDescription className="font-medium">
              {movementConfig?.type === 'RECEIVE' 
                ? 'Add incoming stock to the inventory.' 
                : 'Record the issuance of stock to a department.'}
            </DialogDescription>
          </DialogHeader>
          {movementConfig && (
            <StockMovementForm 
              item={movementConfig.item} 
              type={movementConfig.type} 
              onSubmit={handleMovement} 
              loading={loading}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Stock Adjustment Dialog */}
      <Dialog open={isAdjustmentOpen} onOpenChange={setIsAdjustmentOpen}>
        <DialogContent className="max-w-lg glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Adjust Stock Quantity</DialogTitle>
            <DialogDescription className="font-medium">
              Manually adjust the quantity of a stock item. This will create an audit trail entry.
            </DialogDescription>
          </DialogHeader>
          <StockAdjustmentForm onSubmit={handleAdjustment} loading={loading} />
        </DialogContent>
      </Dialog>

      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search consumables..."
            className="pl-10 bg-white dark:bg-slate-900 border-none shadow-sm h-10 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          <Button
            variant={selectedCategory === null ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(null)}
            className={cn(
              "rounded-full px-4 h-8 font-bold text-[11px] uppercase tracking-wider",
              selectedCategory === null ? "shadow-md shadow-primary/20" : "border-slate-200"
            )}
          >
            All
          </Button>
          {categories.map((cat) => (
            <Button
              key={cat}
              variant={selectedCategory === cat ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                "rounded-full px-4 h-8 font-bold text-[11px] uppercase tracking-wider whitespace-nowrap",
                selectedCategory === cat ? "shadow-md shadow-primary/20" : "border-slate-200"
              )}
            >
              {cat}
            </Button>
          ))}
        </div>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredStock.map((item) => {
            const status = item.quantity < (item.minThreshold || 0) ? 'LOW_STOCK' : 'IN_STOCK';
            return (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              key={item.id}
            >
              <div>
                <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 group-hover:text-primary group-hover:bg-primary/10 transition-all duration-300">
                        <Box className="w-5 h-5" />
                      </div>
                      <Badge className={cn(
                        "font-black text-[10px] uppercase tracking-widest px-2 py-0.5",
                        status === 'LOW_STOCK' ? "bg-rose-100 text-rose-700 border-rose-200" : "bg-emerald-100 text-emerald-700 border-emerald-200"
                      )}>
                        {status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-black text-slate-900 dark:text-slate-100 group-hover:text-primary transition-colors leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">
                        {item.itemId} • {item.categoryId}
                      </p>
                    </div>

                    <div className="flex items-end justify-between">
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                          {item.quantity}
                        </span>
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">
                          {item.unit}
                        </span>
                        {status === 'LOW_STOCK' && <PulseIndicator color="rose" size="sm" className="ml-1 mb-1.5" />}
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Threshold</p>
                        <p className="text-sm font-black text-slate-600">{item.minThreshold}</p>
                        {item.expiryDate && (
                          <div className="mt-1">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Expires</p>
                            <p className={cn(
                              "text-xs font-bold",
                              new Date(item.expiryDate) < new Date() ? "text-rose-600" :
                              new Date(item.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) ? "text-amber-600" : "text-slate-600"
                            )}>
                              {new Date(item.expiryDate).toLocaleDateString()}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 flex items-center gap-2">
                      <button 
                        className="flex-1 font-bold text-[10px] uppercase tracking-wider h-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm rounded-lg px-2.5 inline-flex items-center justify-center gap-1.5"
                        onClick={() => setMovementConfig({ item, type: 'RECEIVE' })}
                      >
                        <PackagePlus className="w-3.5 h-3.5 mr-1" /> Receive
                      </button>
                      <button 
                        className="flex-1 font-bold text-[10px] uppercase tracking-wider h-8 border border-slate-200 bg-background hover:bg-accent hover:text-accent-foreground shadow-sm rounded-lg px-2.5 inline-flex items-center justify-center gap-1.5"
                        onClick={() => setMovementConfig({ item, type: 'ISSUE' })}
                      >
                        <PackageMinus className="w-3.5 h-3.5 mr-1" /> Issue
                      </button>
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-8 w-8 rounded-lg hover:bg-slate-100 transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="glass-card">
                          <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Manage</DropdownMenuLabel>
                          <DropdownMenuItem 
                            onClick={() => {
                              setEditingItem(item);
                              setIsEditOpen(true);
                            }}
                            className="font-bold gap-2"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit Item
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={() => setIsAdjustmentOpen(true)}
                            className="font-bold gap-2"
                          >
                            <ArrowUpRight className="w-3.5 h-3.5" /> Adjust Stock
                          </DropdownMenuItem>
                          <DropdownMenuItem className="font-bold gap-2">
                            <History className="w-3.5 h-3.5" /> History
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            onClick={() => {
                              toast.info('Mark defective functionality coming soon');
                            }}
                            className="text-destructive focus:text-destructive font-bold gap-2"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Mark Defective
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            onClick={async () => {
                              if (confirm('Are you sure you want to delete this stock item? This action cannot be undone.')) {
                                try {
                                  await api.delete(`/stock/${item.id}`);
                                  toast.success('Stock item deleted successfully');
                                  fetchStock();
                                } catch (error: any) {
                                  toast.error(error.response?.data?.message || 'Failed to delete stock item');
                                }
                              }
                            }}
                            className="text-destructive focus:text-destructive font-bold gap-2"
                          >
                            <AlertCircle className="w-3.5 h-3.5" /> Delete Item
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>
      
      {filteredStock.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
            <Search className="w-8 h-8 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No stock found</h3>
          <p className="text-slate-500 mt-1 font-medium">Try adjusting your search or category filters.</p>
        </motion.div>
      )}
    </motion.div>
  );
}
