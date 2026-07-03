import jsPDF from 'jspdf';
import 'jspdf-autotable';

interface PDFOptions {
  title: string;
  subtitle?: string;
  companyName?: string;
  columns: string[];
  rows: any[][];
  totals?: { label: string; value: string }[];
}

export function generatePDF({ title, subtitle, companyName, columns, rows, totals }: PDFOptions) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFontSize(18);
  doc.setTextColor(40, 40, 40);
  doc.text(companyName || 'Ferramenta ERP', 14, 20);

  doc.setFontSize(14);
  doc.setTextColor(60, 60, 60);
  doc.text(title, 14, 30);

  if (subtitle) {
    doc.setFontSize(10);
    doc.setTextColor(120, 120, 120);
    doc.text(subtitle, 14, 38);
  }

  const now = new Date();
  doc.setFontSize(8);
  doc.setTextColor(150, 150, 150);
  doc.text(`Gerado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`, 14, subtitle ? 45 : 40);

  // Table
  const startY = subtitle ? 52 : 45;
  (doc as any).autoTable({
    head: [columns],
    body: rows,
    startY,
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 247, 250] },
    margin: { left: 14, right: 14 },
  });

  // Totals
  if (totals && totals.length > 0) {
    const finalY = (doc as any).lastAutoTable.finalY + 10;
    totals.forEach((t, i) => {
      doc.setFontSize(10);
      doc.setTextColor(40, 40, 40);
      doc.text(t.label, 14, finalY + i * 8);
      doc.text(t.value, pageWidth - 20, finalY + i * 8, { align: 'right' });
    });
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(7);
    doc.setTextColor(160, 160, 160);
    doc.text(`Pagina ${i} de ${pageCount}`, pageWidth - 20, doc.internal.pageSize.getHeight() - 10, { align: 'right' });
  }

  doc.save(`${title.toLowerCase().replace(/\s+/g, '_')}.pdf`);
}