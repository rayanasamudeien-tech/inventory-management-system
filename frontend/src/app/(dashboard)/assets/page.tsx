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
  Download,
  FileText,
  History,
  Trash2,
  Edit,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { generateQRCode, downloadQRCode } from '@/lib/qr/qrGenerator';
import { AssetForm } from '@/components/assets/AssetForm';
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

const statusStyles: Record<string, string> = {
  FUNCTIONAL: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  NEEDS_REPAIR: 'bg-amber-100 text-amber-700 border-amber-200',
  UNDER_REPAIR: 'bg-blue-100 text-blue-700 border-blue-200',
  REPAIRED: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  RETIRED: 'bg-slate-100 text-slate-700 border-slate-200',
  DISPOSED: 'bg-rose-100 text-rose-700 border-rose-200',
};

export default function AssetsPage() {
  const { isSuperAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<any>(null);
  const [qrAsset, setQrAsset] = useState<any>(null);
  const [qrUrl, setQrUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState<any[]>([]);

  const fetchAssets = async () => {
    try {
      const response = await api.get('/assets', {
        params: { search: searchTerm }
      });
      setAssets(response.data);
    } catch (error) {
      console.error('Failed to fetch assets:', error);
      toast.error('Could not load assets from database');
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchAssets();
  }, [searchTerm]);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="flex justify-between">
          <div className="h-10 w-48 bg-slate-100 rounded" />
          <div className="h-10 w-32 bg-slate-100 rounded" />
        </div>
        <div className="h-12 w-full bg-slate-50 rounded-xl" />
        <div className="h-96 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const handleAddAsset = async (data: any) => {
    setLoading(true);
    try {
      // Clean up empty strings in optional fields
      const cleanedData = { ...data };
      if (!cleanedData.purchaseDate) delete cleanedData.purchaseDate;
      if (!cleanedData.brand) delete cleanedData.brand;
      if (!cleanedData.model) delete cleanedData.model;
      if (!cleanedData.serialNumber) delete cleanedData.serialNumber;
      if (!cleanedData.locationId) delete cleanedData.locationId;
      
      console.log('Submitting asset data:', cleanedData);
      const response = await api.post('/assets', cleanedData);
      console.log('Asset created:', response.data);
      toast.success('Asset registered successfully');
      setIsAddOpen(false);
      fetchAssets();
    } catch (error: any) {
      console.error('Asset creation error:', error);
      console.error('Error response:', error.response?.data);
      const errorMessage = error.response?.data?.message || error.message || 'Failed to register asset';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleEditAsset = async (data: any) => {
    setLoading(true);
    try {
      await api.patch(`/assets/${editingAsset.id}`, data);
      toast.success('Asset updated successfully');
      setEditingAsset(null);
      fetchAssets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to update asset');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAsset = async (id: string) => {
    if (!confirm('Are you sure you want to delete this asset?')) return;
    
    try {
      await api.delete(`/assets/${id}`);
      toast.success('Asset deleted successfully');
      fetchAssets();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to delete asset');
    }
  };

  const handleShowQR = async (asset: any) => {
    const url = await generateQRCode(JSON.stringify({ id: asset.id, code: asset.assetId }));
    setQrUrl(url);
    setQrAsset(asset);
  };

  const filteredAssets = assets;

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-6"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Asset Register</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage and track all school fixed assets with precision.
          </p>
        </motion.div>
        <motion.div variants={itemVariants} className="flex items-center gap-3">
          <Button 
            variant="outline" 
            className="hidden md:flex gap-2 shadow-sm border-slate-200"
            onClick={() => toast.info('Export feature coming soon')}
          >
            <Download className="w-4 h-4" />
            Export
          </Button>
          {mounted && isSuperAdmin() && (
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Asset
              </DialogTrigger>
              <DialogContent className="max-w-2xl glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Register New Asset</DialogTitle>
                  <DialogDescription className="font-medium">
                    Enter the details of the new asset to add it to the inventory.
                  </DialogDescription>
                </DialogHeader>
                <AssetForm onSubmit={handleAddAsset} loading={loading} />
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </div>

      <Dialog open={!!editingAsset} onOpenChange={(open) => !open && setEditingAsset(null)}>
        <DialogContent className="max-w-2xl glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Edit Asset</DialogTitle>
            <DialogDescription className="font-medium">
              Update the details of the asset.
            </DialogDescription>
          </DialogHeader>
          <AssetForm 
            initialData={editingAsset} 
            onSubmit={handleEditAsset} 
            loading={loading} 
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!qrAsset} onOpenChange={(open) => !open && setQrAsset(null)}>
        <DialogContent className="max-w-sm glass-card">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Asset QR Code</DialogTitle>
            <DialogDescription className="font-medium">
              Scan this code to instantly look up asset details.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-8 bg-white dark:bg-slate-950 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-inner">
            {qrUrl && (
              <>
                <motion.img 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  src={qrUrl} 
                  alt="Asset QR Code" 
                  className="w-48 h-48 rounded-xl" 
                />
                <p className="mt-4 font-mono text-base font-black text-slate-900 dark:text-white">{qrAsset?.assetId}</p>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{qrAsset?.name}</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="mt-6 w-full font-bold uppercase tracking-wider text-[10px]"
                  onClick={() => downloadQRCode(qrUrl, qrAsset?.assetId)}
                >
                  <Download className="mr-2 h-3 w-3" /> Download PNG
                </Button>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>


      <motion.div variants={itemVariants} className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by name, ID, or serial number..."
            className="pl-10 bg-white dark:bg-slate-900 border-none shadow-sm focus-visible:ring-2 focus-visible:ring-primary/20 transition-all h-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" className="gap-2 border-slate-200 h-10 px-4 font-bold">
          <Filter className="w-4 h-4" />
          Filter
        </Button>
      </motion.div>

      <motion.div variants={itemVariants} className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-slate-50/50 dark:bg-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Asset ID</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Name</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Category</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Location</TableHead>
              <TableHead className="font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Status</TableHead>
              <TableHead className="text-right font-bold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {filteredAssets.map((asset, index) => (
                <tr
                  key={asset.id}
                  className="group hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors border-b border-slate-50 dark:border-slate-800 last:border-0"
                >
                  <TableCell className="font-mono text-xs font-black text-slate-500 group-hover:text-primary transition-colors">
                    {asset.assetId}
                  </TableCell>
                  <TableCell>
                    <div className="font-bold text-slate-900 dark:text-slate-100">{asset.name}</div>
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">{asset.condition} Condition</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-slate-50 text-slate-600 border-slate-200 font-bold text-[10px] uppercase tracking-tighter">
                      {asset.category?.name || 'Uncategorized'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    {asset.location?.name || 'N/A'}
                  </TableCell>
                  <TableCell>
                    <Badge className={cn('font-black text-[10px] uppercase tracking-widest px-2 py-0.5 shadow-none border', statusStyles[asset.status])}>
                      {asset.status.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <button className="inline-flex items-center justify-center h-8 w-8 hover:bg-slate-100 rounded-full transition-colors">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="glass-card">
                        <DropdownMenuLabel className="font-bold text-[10px] uppercase tracking-widest text-slate-400">Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => setEditingAsset(asset)} className="font-bold gap-2">
                          <Edit className="w-3.5 h-3.5" /> Edit Asset
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleShowQR(asset)} className="font-bold gap-2">
                          <FileText className="w-3.5 h-3.5" /> View QR Code
                        </DropdownMenuItem>
                        <DropdownMenuItem className="font-bold gap-2">
                          <History className="w-3.5 h-3.5" /> View History
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="text-destructive focus:text-destructive font-bold gap-2"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </tr>
              ))}
            </AnimatePresence>
          </TableBody>
        </Table>
        {filteredAssets.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <div className="inline-flex p-4 rounded-full bg-slate-50 dark:bg-slate-800 mb-4">
              <Search className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">No assets found</h3>
            <p className="text-slate-500 mt-1 font-medium">Try adjusting your search or filters.</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
