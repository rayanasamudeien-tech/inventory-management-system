import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DateTime } from 'luxon';

interface ReportConfig {
  title: string;
  filename: string;
  columns: string[];
  data: any[][];
}

export const generatePDFReport = ({ title, filename, columns, data }: ReportConfig) => {
  const doc = new jsPDF();
  const timestamp = DateTime.now().toFormat('yyyy-MM-dd HH:mm');

  // Add Header
  doc.setFontSize(20);
  doc.setTextColor(15, 23, 42); // slate-900
  doc.text('Starhacs Inventory', 14, 22);
  
  doc.setFontSize(14);
  doc.setTextColor(71, 85, 105); // slate-500
  doc.text(title, 14, 32);

  doc.setFontSize(10);
  doc.text(`Generated on: ${timestamp}`, 14, 40);

  // Add Table
  autoTable(doc, {
    startY: 50,
    head: [columns],
    body: data,
    theme: 'striped',
    headStyles: { fillColor: [15, 23, 42], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [248, 250, 252] },
    margin: { top: 50 },
  });

  // Add Footer
  const pageCount = (doc.internal as any).getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184); // slate-400
    doc.text(
      `Page ${i} of ${pageCount} - Starhacs School Management System`,
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: 'center' }
    );
  }

  doc.save(`${filename}_${DateTime.now().toFormat('yyyyMMdd')}.pdf`);
};
