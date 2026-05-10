'use client';

import { useState, useEffect } from 'react';
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
  MapPin,
  Plus,
  MoreVertical,
  ChevronRight,
  Package,
  Box,
  Users,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { LocationForm } from '@/components/locations/LocationForm';
import { toast } from 'sonner';
import Link from 'next/link';
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
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function LocationsPage() {
  const { isSuperAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [locations, setLocations] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    setMounted(true);
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    setFetching(true);
    try {
      const response = await api.get('/locations');
      setLocations(response.data);
    } catch (error: any) {
      console.error('Failed to fetch locations:', error);
      toast.error('Failed to load locations');
    } finally {
      setFetching(false);
    }
  };

  const handleAddLocation = async (data: any) => {
    setLoading(true);
    try {
      await api.post('/locations', {
        name: data.name,
        description: data.description || undefined,
        parentId: data.parentId || undefined,
      });
      toast.success('New location registered successfully');
      setIsAddOpen(false);
      fetchLocations();
    } catch (error: any) {
      console.error('Failed to add location:', error);
      toast.error(error.response?.data?.message || 'Failed to register location');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <motion.div variants={itemVariants}>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Location Management</h1>
          <p className="text-slate-500 mt-1 font-medium">
            Manage school buildings, rooms, and storage areas with high-level oversight.
          </p>
        </motion.div>
        {mounted && isSuperAdmin() && (
          <motion.div variants={itemVariants}>
            <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
              <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
                <Plus className="w-4 h-4" />
                Add Location
              </DialogTrigger>
              <DialogContent className="max-w-md glass-card">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold">Register New Location</DialogTitle>
                  <DialogDescription className="font-medium">
                    Define a new building, room, or specific storage area.
                  </DialogDescription>
                </DialogHeader>
                <LocationForm
                  onSubmit={handleAddLocation}
                  loading={loading}
                  parentLocations={locations}
                />
              </DialogContent>
            </Dialog>
          </motion.div>
        )}
      </div>

      {fetching ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-48 bg-slate-50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : locations.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-12 text-center">
          <p className="text-xl font-bold text-slate-900">No locations found yet</p>
          <p className="mt-2 text-slate-500">Add your first location to begin tracking physical inventory.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <AnimatePresence mode="popLayout">
            {locations.map((location) => {
              const subLocations = location.children?.map((child: any) => child.name) || [];
              return (
                <motion.div key={location.id} variants={itemVariants}>
                  <TiltCard>
                    <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden glass-card">
                      <CardHeader className="flex flex-row items-start justify-between pb-2">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-primary/10 rounded-2xl group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-sm">
                            <MapPin className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <CardTitle className="text-2xl font-black text-slate-900 leading-none">
                              {location.name}
                            </CardTitle>
                            <CardDescription className="text-slate-500 font-medium mt-1.5 line-clamp-1">
                              {location.description || 'No description provided.'}
                            </CardDescription>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="rounded-full hover:bg-slate-100"
                          onClick={() => toast.info('Location options coming soon')}
                        >
                          <MoreVertical className="w-4 h-4 text-slate-400" />
                        </Button>
                      </CardHeader>
                      <CardContent className="pt-6">
                        <div className="grid grid-cols-3 gap-6 mb-8">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Package className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Assets</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                              {location._count?.assets ?? 0}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Box className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Stock</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                              {location._count?.stockItems ?? 0}
                            </p>
                          </div>
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5 text-slate-400">
                              <Users className="w-4 h-4" />
                              <span className="text-[10px] font-black uppercase tracking-widest">Sub-locations</span>
                            </div>
                            <p className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight">
                              {subLocations.length}
                            </p>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Sub-locations
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {subLocations.length > 0 ? (
                              subLocations.map((sub: string) => (
                                <Badge
                                  key={sub}
                                  variant="secondary"
                                  className="bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-none font-bold text-[10px] px-3 py-1 uppercase tracking-tighter"
                                >
                                  {sub}
                                </Badge>
                              ))
                            ) : (
                              <Badge
                                variant="secondary"
                                className="bg-slate-100/50 dark:bg-slate-800/50 text-slate-600 dark:text-slate-400 border-none font-bold text-[10px] px-3 py-1 uppercase tracking-tighter"
                              >
                                No sub-locations
                              </Badge>
                            )}
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="h-7 px-3 rounded-full text-[10px] font-black text-primary bg-primary/5 hover:bg-primary/10 border border-primary/20 uppercase tracking-wider transition-colors"
                              onClick={() => toast.info('Add sub-location coming soon')}
                            >
                              <Plus className="w-3 h-3 inline mr-1" /> Add
                            </motion.button>
                          </div>
                        </div>

                        <Link href="/assets" className="block w-full">
                          <Button
                            variant="outline"
                            className="w-full mt-8 gap-2 font-bold uppercase tracking-widest text-[10px] h-11 border-slate-200 hover:text-primary hover:border-primary group rounded-xl"
                          >
                            View Detailed Inventory <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  </TiltCard>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
