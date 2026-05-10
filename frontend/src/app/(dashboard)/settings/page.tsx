'use client';

// Re-forcing refresh
import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Shield,
  Bell,
  Globe,
  Database,
  User,
  School,
  Save,
  Users,
  Building2,
  MapPin,
  AlertCircle,
  Plus,
} from 'lucide-react';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UserForm } from '@/components/settings/UserForm';
import { SimpleForm } from '@/components/settings/SimpleForm';
import { toast } from 'sonner';
import { useNotificationStore } from '@/store/notificationStore';
import { useAuthStore } from '@/store/authStore';
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

export default function SettingsPage() {
  const { isSuperAdmin } = useAuthStore();
  const { addNotification } = useNotificationStore();
  const [mounted, setMounted] = useState(false);
  const [isAddUserOpen, setIsAddOpenUser] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);
  const [orgDialog, setOrgDialog] = useState<{ type: 'Department' | 'Category' | 'Location'; open: boolean } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded" />
        <div className="h-14 w-full bg-slate-50 rounded-2xl" />
        <div className="h-96 bg-slate-50 rounded-2xl" />
      </div>
    );
  }

  const handleSave = () => {
    toast.success('Settings saved successfully');
  };

  const simulateNotification = () => {
    addNotification({
      title: 'System Test',
      message: 'This is a test notification generated from settings.',
      type: 'ASSIGNMENT',
      link: '/notifications'
    });
    toast.success('Test notification generated!');
  };

  const handleAddUser = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Adding user:', data);
      toast.success('User account created successfully');
      setLoading(false);
      setIsAddOpenUser(false);
    }, 1000);
  };

  const handleEditUser = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log('Updating user:', data);
      toast.success('User account updated successfully');
      setLoading(false);
      setEditingUser(null);
    }, 1000);
  };

  const handleOrgSubmit = async (data: any) => {
    setLoading(true);
    setTimeout(() => {
      console.log(`Adding ${orgDialog?.type}:`, data);
      toast.success(`${orgDialog?.type} added successfully`);
      setLoading(false);
      setOrgDialog(null);
    }, 1000);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-8"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">System Configuration</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Configure Starhacs Inventory preferences and global school profile.
        </p>
      </motion.div>

      <Tabs defaultValue="school" className="w-full">
        <motion.div variants={itemVariants}>
          <TabsList className="mb-10 bg-slate-100/50 dark:bg-slate-800/50 p-1 rounded-2xl h-14 overflow-x-auto no-scrollbar flex-nowrap w-fit">
            <TabsTrigger value="school" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
              <School className="w-4 h-4" /> School Profile
            </TabsTrigger>
            {mounted && isSuperAdmin() && (
              <>
                <TabsTrigger value="users" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
                  <Users className="w-4 h-4" /> Users
                </TabsTrigger>
                <TabsTrigger value="org" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
                  <Building2 className="w-4 h-4" /> Org Structure
                </TabsTrigger>
              </>
            )}
            <TabsTrigger value="notifications" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
              <Bell className="w-4 h-4" /> Alerts
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
              <Shield className="w-4 h-4" /> Security
            </TabsTrigger>
            <TabsTrigger value="backup" className="gap-2 rounded-xl px-6 font-bold text-xs uppercase tracking-wider data-[state=active]:shadow-md">
              <Database className="w-4 h-4" /> Data Management
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <TabsContent value="school" className="focus-visible:outline-none">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm glass-card">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black text-slate-900">School Information</CardTitle>
                <CardDescription className="font-medium text-slate-500">
                  This information will appear on generated reports and official documents.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label htmlFor="schoolName" className="font-black text-[10px] uppercase tracking-widest text-slate-400">School Name</Label>
                    <Input id="schoolName" defaultValue="Starhacs International School" className="bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="schoolEmail" className="font-black text-[10px] uppercase tracking-widest text-slate-400">Official Email</Label>
                    <Input id="schoolEmail" type="email" defaultValue="admin@starhacs.edu" className="bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="schoolPhone" className="font-black text-[10px] uppercase tracking-widest text-slate-400">Phone Number</Label>
                    <Input id="schoolPhone" defaultValue="+254 700 000 000" className="bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label htmlFor="schoolWebsite" className="font-black text-[10px] uppercase tracking-widest text-slate-400">Website URL</Label>
                    <Input id="schoolWebsite" defaultValue="https://starhacs.edu" className="bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" />
                  </div>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="address" className="font-black text-[10px] uppercase tracking-widest text-slate-400">Physical Address</Label>
                  <Input id="address" defaultValue="123 Education Way, Nairobi, Kenya" className="bg-white dark:bg-slate-900 border-none shadow-sm h-11 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all" />
                </div>
                <div className="pt-4">
                  <Button className="gap-2 h-11 px-8 font-black uppercase tracking-widest text-[11px] shadow-lg shadow-primary/20" onClick={handleSave}>
                    <Save className="w-4 h-4" /> Update Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="users" className="focus-visible:outline-none">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm glass-card">
              <CardHeader className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8">
                <div>
                  <CardTitle className="text-2xl font-black text-slate-900">User Management</CardTitle>
                  <CardDescription className="font-medium text-slate-500">
                    Control system access levels and user permissions.
                  </CardDescription>
                </div>
                <Dialog open={isAddUserOpen} onOpenChange={setIsAddOpenUser}>
                  <DialogTrigger className="gap-2 shadow-md shadow-primary/20 inline-flex items-center justify-center rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-sm font-medium transition-colors">
                    <Plus className="w-4 h-4" /> Add User
                  </DialogTrigger>
                  <DialogContent className="max-w-md glass-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Create New User</DialogTitle>
                      <DialogDescription className="font-medium">
                        Enter account details and assign an appropriate role.
                      </DialogDescription>
                    </DialogHeader>
                    <UserForm onSubmit={handleAddUser} loading={loading} />
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <Dialog open={!!editingUser} onOpenChange={(open) => !open && setEditingUser(null)}>
                  <DialogContent className="max-w-md glass-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Edit User Account</DialogTitle>
                      <DialogDescription className="font-medium">
                        Update user profile or change their system role.
                      </DialogDescription>
                    </DialogHeader>
                    <UserForm 
                      initialData={editingUser} 
                      onSubmit={handleEditUser} 
                      loading={loading} 
                    />
                  </DialogContent>
                </Dialog>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { firstName: 'William', lastName: 'Admin', email: 'admin@starhacs.edu', role: 'SUPER_ADMIN' },
                    { firstName: 'John', lastName: 'Storekeeper', email: 'john@starhacs.edu', role: 'ADMIN' },
                    { firstName: 'Jane', lastName: 'Teacher', email: 'jane@starhacs.edu', role: 'USER' },
                  ].map((user) => (
                    <motion.div 
                      whileHover={{ scale: 1.01, backgroundColor: 'rgba(248, 250, 252, 1)' }}
                      key={user.email} 
                      className="flex items-center justify-between p-5 border border-slate-100 dark:border-slate-800 rounded-2xl transition-all group"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-black shadow-inner">
                          {user.firstName.charAt(0)}
                        </div>
                        <div>
                          <p className="font-black text-slate-900 dark:text-white leading-none">{user.firstName} {user.lastName}</p>
                          <p className="text-xs font-medium text-slate-400 mt-1.5">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={cn(
                          "text-[9px] font-black px-2.5 py-1 rounded-full uppercase tracking-widest shadow-sm",
                          user.role === 'SUPER_ADMIN' ? "bg-purple-100 text-purple-700" :
                          user.role === 'ADMIN' ? "bg-blue-100 text-blue-700" : "bg-slate-100 text-slate-700"
                        )}>
                          {user.role}
                        </span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="font-bold text-[10px] uppercase tracking-wider h-8 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => setEditingUser(user)}
                        >
                          Edit
                        </Button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="org" className="focus-visible:outline-none">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm glass-card">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black text-slate-900">Organizational Structure</CardTitle>
                <CardDescription className="font-medium text-slate-500">
                  Configure departments, asset classifications, and storage locations.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-12">
                <Dialog open={!!orgDialog?.open} onOpenChange={(open) => !open && setOrgDialog(null)}>
                  <DialogContent className="max-w-md glass-card">
                    <DialogHeader>
                      <DialogTitle className="text-2xl font-bold">Add New {orgDialog?.type}</DialogTitle>
                      <DialogDescription className="font-medium text-slate-500">
                        Define a new {orgDialog?.type?.toLowerCase()} for the organization.
                      </DialogDescription>
                    </DialogHeader>
                    {orgDialog && (
                      <SimpleForm 
                        label={orgDialog.type} 
                        placeholder={`e.g. ${orgDialog.type === 'Department' ? 'Finance' : orgDialog.type === 'Category' ? 'Electronics' : 'Warehouse A'}`}
                        onSubmit={handleOrgSubmit} 
                        loading={loading} 
                      />
                    )}
                  </DialogContent>
                </Dialog>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-primary" /> Departments
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-bold text-[10px] uppercase tracking-wider h-8 px-4 rounded-xl border-slate-200"
                      onClick={() => setOrgDialog({ type: 'Department', open: true })}
                    >
                      Add Dept
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['Science', 'ICT', 'Administration', 'Sports', 'Arts'].map((dept) => (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        key={dept} 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 border border-slate-100 dark:border-slate-800 shadow-sm group"
                      >
                        {dept}
                        <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100" onClick={() => toast.info('Remove department coming soon')}>×</button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <Database className="w-4 h-4 text-primary" /> Asset Categories
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-bold text-[10px] uppercase tracking-wider h-8 px-4 rounded-xl border-slate-200"
                      onClick={() => setOrgDialog({ type: 'Category', open: true })}
                    >
                      Add Category
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['ICT Equipment', 'Furniture', 'Lab Tools', 'Vehicles', 'Books'].map((cat) => (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        key={cat} 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 border border-slate-100 dark:border-slate-800 shadow-sm group"
                      >
                        {cat}
                        <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100" onClick={() => toast.info('Remove category coming soon')}>×</button>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                    <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-widest flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary" /> Locations
                    </h3>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="font-bold text-[10px] uppercase tracking-wider h-8 px-4 rounded-xl border-slate-200"
                      onClick={() => setOrgDialog({ type: 'Location', open: true })}
                    >
                      Add Location
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {['Main Building', 'Science Wing', 'Sports Complex', 'Library'].map((loc) => (
                      <motion.div 
                        whileHover={{ y: -2 }}
                        key={loc} 
                        className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-3 border border-slate-100 dark:border-slate-800 shadow-sm group"
                      >
                        {loc}
                        <button className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100" onClick={() => toast.info('Remove location coming soon')}>×</button>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications" className="focus-visible:outline-none">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm glass-card">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black text-slate-900">Notification Preferences</CardTitle>
                <CardDescription className="font-medium text-slate-500">
                  Control how and when you receive critical system alerts.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  'Low stock alerts',
                  'Warranty expiry reminders',
                  'New maintenance requests',
                  'Asset transfer approvals',
                ].map((item) => (
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    key={item} 
                    className="flex items-center justify-between p-6 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-800"
                  >
                    <span className="font-black text-sm text-slate-700 dark:text-slate-200 uppercase tracking-tight">{item}</span>
                    <div className="flex gap-3">
                      <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase tracking-wider h-9 rounded-xl border-slate-200" onClick={() => toast.info(`Email alerts for ${item.toLowerCase()} enabled`)}>Email</Button>
                      <Button variant="outline" size="sm" className="font-bold text-[10px] uppercase tracking-wider h-9 rounded-xl border-slate-200" onClick={() => toast.info(`In-app alerts for ${item.toLowerCase()} enabled`)}>In-app</Button>
                    </div>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="backup" className="focus-visible:outline-none">
          <motion.div variants={itemVariants}>
            <Card className="border-none shadow-sm glass-card">
              <CardHeader className="pb-8">
                <CardTitle className="text-2xl font-black text-slate-900">Data Management</CardTitle>
                <CardDescription className="font-medium text-slate-500">
                  Securely export your data, manage backups, and monitor audit logs.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <TiltCard>
                    <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 group">
                      <div className="p-3 bg-blue-50 dark:bg-blue-500/10 rounded-xl w-fit group-hover:rotate-12 transition-transform">
                        <Database className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">System Backup</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Download a complete encrypted snapshot of all inventory data.</p>
                      <Button variant="outline" size="sm" className="w-full font-bold uppercase tracking-wider text-[10px] h-9 rounded-xl border-slate-200" onClick={() => toast.success('Backup started...')}>Generate</Button>
                    </div>
                  </TiltCard>
                  
                  <TiltCard>
                    <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 group">
                      <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl w-fit group-hover:rotate-12 transition-transform">
                        <Save className="w-6 h-6 text-emerald-600" />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">Excel Export</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Export your entire asset register to a formatted .xlsx spreadsheet.</p>
                      <Button variant="outline" size="sm" className="w-full font-bold uppercase tracking-wider text-[10px] h-9 rounded-xl border-slate-200" onClick={() => toast.success('Export initiated...')}>Download</Button>
                    </div>
                  </TiltCard>

                  <TiltCard>
                    <div className="p-6 bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm space-y-4 group">
                      <div className="p-3 bg-primary/10 rounded-xl w-fit group-hover:rotate-12 transition-transform">
                        <Bell className="w-6 h-6 text-primary" />
                      </div>
                      <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-tight">System Test</h4>
                      <p className="text-xs text-slate-500 font-medium leading-relaxed">Trigger a live test notification to verify communication channels.</p>
                      <Button variant="outline" size="sm" className="w-full font-bold uppercase tracking-wider text-[10px] h-9 rounded-xl border-slate-200" onClick={simulateNotification}>Trigger Test</Button>
                    </div>
                  </TiltCard>
                </div>

                {mounted && isSuperAdmin() && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-8 bg-rose-50/50 dark:bg-rose-950/10 border border-rose-100 dark:border-rose-900/50 rounded-3xl space-y-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-rose-500 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-black text-rose-900 dark:text-rose-400 uppercase tracking-widest text-sm">Danger Zone</h4>
                        <p className="text-xs text-rose-600 dark:text-rose-500/80 font-medium">Critical system operations. Irreversible actions.</p>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button variant="destructive" size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-destructive/20" onClick={() => toast.error('Logs are protected.')}>Clear Audit Logs</Button>
                      <Button variant="destructive" size="sm" className="font-black uppercase tracking-widest text-[10px] h-10 px-6 rounded-xl shadow-lg shadow-destructive/20" onClick={() => toast.error('Reset restricted.')}>Factory Reset</Button>
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}
