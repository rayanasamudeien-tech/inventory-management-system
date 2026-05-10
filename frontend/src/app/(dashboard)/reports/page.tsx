'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Download,
  PieChart,
  BarChart,
  ClipboardList,
  AlertTriangle,
  Truck,
  History,
} from 'lucide-react';

import { generatePDFReport } from '@/lib/reports/pdfGenerator';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { TiltCard } from '@/components/shared/TiltCard';
import { useState, useEffect } from 'react';
import api from '@/lib/axios';

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

const reportTypes = [
  {
    title: 'Asset Register',
    description: 'Complete list of all fixed assets with current status and location.',
    icon: ClipboardList,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
    columns: ['ID', 'Name', 'Category', 'Location', 'Status'],
    data: [
      ['AST-001', 'iMac 24" M3', 'ICT', 'Lab 1', 'Functional'],
      ['AST-002', 'Dell Projector', 'ICT', 'Conference', 'Repair'],
      ['AST-003', 'Office Desk', 'Furniture', 'Admin', 'Functional'],
    ]
  },
  {
    title: 'Low Stock Report',
    description: 'List of all consumables currently below their minimum threshold.',
    icon: AlertTriangle,
    color: 'text-amber-600',
    bg: 'bg-amber-50',
    columns: ['Item', 'Quantity', 'Min. Threshold', 'Location'],
    data: [
      ['A4 Paper', '15 Reams', '20', 'Main Store'],
      ['Hand Sanitizer', '5 Bottles', '10', 'Janitor'],
    ]
  },
  {
    title: 'Maintenance History',
    description: 'Comprehensive log of all repair requests and maintenance costs.',
    icon: History,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
    columns: ['Asset', 'Problem', 'Tech', 'Cost', 'Status'],
    data: [
      ['Projector', 'Lamp replace', 'Sam', '$120', 'Done'],
      ['Printer', 'Jam', 'Sam', '$0', 'Done'],
    ]
  },
  {
    title: 'Supplier Performance',
    description: 'Analysis of procurement history and supplier reliability.',
    icon: Truck,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
    columns: ['Supplier', 'Category', 'Orders', 'Rating'],
    data: [
      ['EduTech', 'ICT', '15', '5.0'],
      ['Office Mart', 'Stationery', '42', '4.5'],
    ]
  },
  {
    title: 'Departmental Audit',
    description: 'Inventory breakdown by department and assigned users.',
    icon: PieChart,
    color: 'text-cyan-600',
    bg: 'bg-cyan-50',
    columns: ['Department', 'Assets', 'Value', 'Head'],
    data: [
      ['ICT', '120', '$45,000', 'Jane Doe'],
      ['Science', '85', '$22,000', 'Dr. Smith'],
    ]
  },
  {
    title: 'Disposal Report',
    description: 'Record of all retired, sold, or scrapped assets.',
    icon: FileText,
    color: 'text-rose-600',
    bg: 'bg-rose-50',
    columns: ['Asset', 'Date', 'Method', 'Recovery'],
    data: [
      ['Old PC', '2026-01-10', 'Sold', '$150'],
    ]
  },
];

export default function ReportsPage() {
  const [mounted, setMounted] = useState(false);
  const [reportsData, setReportsData] = useState(reportTypes);

  useEffect(() => {
    setMounted(true);
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      const response = await api.get('/analytics/reports');
      const reportData = response.data;

      // Update reports with real data
      const updatedReports = reportTypes.map(report => {
        let data = [];
        switch (report.title) {
          case 'Asset Register':
            data = reportData.assetRegister || [];
            break;
          case 'Low Stock Report':
            data = reportData.lowStockReport || [];
            break;
          case 'Maintenance History':
            data = reportData.maintenanceReport || [];
            break;
          case 'Supplier Performance':
            data = reportData.supplierReport || [];
            break;
          default:
            data = report.data; // Keep existing mock data for other reports
        }
        return { ...report, data };
      });

      setReportsData(updatedReports);
    } catch (error) {
      console.error('Failed to fetch reports data:', error);
      // Keep default values on error
    }
  };

  if (!mounted) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-10 w-48 bg-slate-100 rounded" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-48 bg-slate-50 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const handleExport = (report: any) => {
    toast.info(`Generating ${report.title}...`);
    try {
      generatePDFReport({
        title: report.title,
        filename: report.title.toLowerCase().replace(/\s+/g, '_'),
        columns: report.columns,
        data: report.data,
      });
      toast.success(`${report.title} exported successfully`);
    } catch (error) {
      toast.error('Failed to generate report');
    }
  };

  const handlePreview = (title: string) => {
    toast.info(`Loading preview for ${title}...`);
  };

  return (
    <motion.div 
      initial="hidden"
      animate="show"
      variants={containerVariants}
      className="space-y-10"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Reports & Analytics</h1>
        <p className="text-slate-500 mt-1 font-medium">
          Generate and export detailed inventory reports for your school.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {reportsData.map((report) => (
          <motion.div key={report.title} variants={itemVariants}>
            <TiltCard>
              <Card className="border-none shadow-sm hover:shadow-2xl transition-all duration-500 group overflow-hidden glass-card">
                <CardHeader>
                  <div className={cn(
                    "p-4 w-fit rounded-2xl mb-4 group-hover:rotate-12 group-hover:scale-110 transition-all duration-300 shadow-sm",
                    report.bg
                  )}>
                    <report.icon className={cn("w-7 h-7", report.color)} />
                  </div>
                  <CardTitle className="text-2xl font-black text-slate-900 leading-tight">
                    {report.title}
                  </CardTitle>
                  <CardDescription className="text-slate-500 font-medium leading-relaxed mt-2">
                    {report.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="flex-1 gap-2 border-slate-200 font-bold uppercase tracking-wider text-[10px] h-9 shadow-sm"
                    onClick={() => handlePreview(report.title)}
                  >
                    <FileText className="w-4 h-4" />
                    Preview
                  </Button>
                  <Button 
                    size="sm" 
                    className="flex-1 gap-2 font-bold uppercase tracking-wider text-[10px] h-9 shadow-md shadow-primary/10"
                    onClick={() => handleExport(report)}
                  >
                    <Download className="w-4 h-4" />
                    Export
                  </Button>
                </CardContent>
              </Card>
            </TiltCard>
          </motion.div>
        ))}
      </div>

      <motion.div variants={itemVariants}>
        <Card className="border-none shadow-xl bg-slate-900 text-white overflow-hidden relative min-h-[250px] flex items-center">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <BarChart className="w-64 h-64" />
          </div>
          <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
          
          <CardHeader className="relative z-10 max-w-2xl pl-10">
            <CardTitle className="text-4xl font-black tracking-tight">Custom Report Builder</CardTitle>
            <CardDescription className="text-slate-400 text-lg font-medium mt-4">
              Need something specific? Build a custom report with your own filters, columns, and data points.
            </CardDescription>
            <div className="pt-8">
              <Button 
                className="bg-white text-slate-900 hover:bg-slate-100 font-black px-10 h-12 text-sm uppercase tracking-widest shadow-xl"
                onClick={() => toast.info('Launching custom report builder...')}
              >
                Launch Builder
              </Button>
            </div>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
}
