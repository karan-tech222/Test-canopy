import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Document, Packer, Paragraph, Table, TableCell, TableRow, WidthType, AlignmentType, HeadingLevel, TextRun } from 'docx';
import { saveAs } from 'file-saver';
import { ProrationResult, ProrationInput } from '../types';

/**
 * Provides functions to export proration results to various formats:
 * - Excel (.xlsx)
 * - PDF (.pdf)
 * - Word (.docx)
 * - Clipboard (text)
 */

interface ExportData {
  data: ProrationResult;
  input: ProrationInput;
}

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => jsPDF;
  }
}

const formatCurrency = (amount: number): string => {
  return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 5 })}`;
};

export const exportToExcel = (results: ExportData, filename: string = 'allocation_results.xlsx'): void => {
  if (!results || !results.data) {
    console.error('No results data to export');
    return;
  }

  const worksheetData: any[] = [
    ['Investor Allocation Results'],
    [],
    ['Total Allocation:', formatCurrency(results.input.allocation_amount)],
    ['Total Allocated:', formatCurrency(Object.values(results.data).reduce((sum, val) => sum + val, 0))],
    ['Number of Investors:', Object.keys(results.data).length],
    [],
    ['Investor Name', 'Requested Amount', 'Average Amount', 'Allocated Amount', 'Utilization %']
  ];

  results.input.investor_amounts.forEach(investor => {
    const allocated = results.data[investor.name] || 0;
    const utilization = investor.requested_amount > 0 
      ? ((allocated / investor.requested_amount) * 100).toFixed(2) 
      : '0.00';
    
    worksheetData.push([
      investor.name,
      investor.requested_amount,
      investor.average_amount,
      allocated,
      utilization
    ]);
  });

  const ws = XLSX.utils.aoa_to_sheet(worksheetData);
  ws['!cols'] = [
    { wch: 20 }, { wch: 18 }, { wch: 16 }, { wch: 18 }, { wch: 15 }
  ];

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'Allocation Results');
  XLSX.writeFile(wb, filename);
};

export const exportToPDF = (results: ExportData, filename: string = 'allocation_results.pdf'): void => {
  if (!results || !results.data) {
    console.error('No results data to export');
    return;
  }

  const doc = new jsPDF();
  
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Investor Allocation Results', 14, 20);
  
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  const totalAllocated = Object.values(results.data).reduce((sum, val) => sum + val, 0);
  
  doc.text(`Total Allocation: ${formatCurrency(results.input.allocation_amount)}`, 14, 32);
  doc.text(`Total Allocated: ${formatCurrency(totalAllocated)}`, 14, 39);
  doc.text(`Number of Investors: ${Object.keys(results.data).length}`, 14, 46);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 53);

  const tableData = results.input.investor_amounts.map(investor => {
    const allocated = results.data[investor.name] || 0;
    const utilization = investor.requested_amount > 0 
      ? ((allocated / investor.requested_amount) * 100).toFixed(2) + '%'
      : '0.00%';
    
    return [
      investor.name,
      formatCurrency(investor.requested_amount),
      formatCurrency(investor.average_amount),
      formatCurrency(allocated),
      utilization
    ];
  });

  doc.autoTable({
    startY: 60,
    head: [['Investor Name', 'Requested', 'Average', 'Allocated', 'Utilization']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [99, 102, 241],
      textColor: 255,
      fontStyle: 'bold'
    },
    styles: {
      fontSize: 9,
      cellPadding: 3
    },
    columnStyles: {
      0: { cellWidth: 50 },
      1: { cellWidth: 30, halign: 'right' },
      2: { cellWidth: 30, halign: 'right' },
      3: { cellWidth: 30, halign: 'right' },
      4: { cellWidth: 25, halign: 'center' }
    }
  });

  doc.save(filename);
};

export const exportToWord = async (results: ExportData, filename: string = 'allocation_results.docx'): Promise<void> => {
  if (!results || !results.data) {
    console.error('No results data to export');
    return;
  }

  const totalAllocated = Object.values(results.data).reduce((sum, val) => sum + val, 0);

  const tableRows = [
    new TableRow({
      children: [
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Investor Name', bold: true })] })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Requested', bold: true })], alignment: AlignmentType.RIGHT })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Average', bold: true })], alignment: AlignmentType.RIGHT })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Allocated', bold: true })], alignment: AlignmentType.RIGHT })] }),
        new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: 'Utilization %', bold: true })], alignment: AlignmentType.CENTER })] })
      ]
    }),
    ...results.input.investor_amounts.map(investor => {
      const allocated = results.data[investor.name] || 0;
      const utilization = investor.requested_amount > 0 
        ? ((allocated / investor.requested_amount) * 100).toFixed(2) + '%'
        : '0.00%';
      
      return new TableRow({
        children: [
          new TableCell({ children: [new Paragraph(investor.name)] }),
          new TableCell({ children: [new Paragraph({ text: formatCurrency(investor.requested_amount), alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ text: formatCurrency(investor.average_amount), alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ text: formatCurrency(allocated), alignment: AlignmentType.RIGHT })] }),
          new TableCell({ children: [new Paragraph({ text: utilization, alignment: AlignmentType.CENTER })] })
        ]
      });
    })
  ];

  const doc = new Document({
    sections: [{
      children: [
        new Paragraph({
          text: 'Investor Allocation Results',
          heading: HeadingLevel.HEADING_1,
          spacing: { after: 200 }
        }),
        new Paragraph({
          text: `Total Allocation: ${formatCurrency(results.input.allocation_amount)}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Total Allocated: ${formatCurrency(totalAllocated)}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Number of Investors: ${Object.keys(results.data).length}`,
          spacing: { after: 100 }
        }),
        new Paragraph({
          text: `Date: ${new Date().toLocaleDateString()}`,
          spacing: { after: 300 }
        }),
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: tableRows
        })
      ]
    }]
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, filename);
};

export const copyToClipboard = async (results: ExportData): Promise<boolean> => {
  if (!results || !results.data) {
    console.error('No results data to copy');
    return false;
  }

  try {
    const totalAllocated = Object.values(results.data).reduce((sum, val) => sum + val, 0);
    
    let text = 'INVESTOR ALLOCATION RESULTS\n';
    text += '═══════════════════════════════════════════════════\n\n';
    text += `Total Allocation: ${formatCurrency(results.input.allocation_amount)}\n`;
    text += `Total Allocated: ${formatCurrency(totalAllocated)}\n`;
    text += `Number of Investors: ${Object.keys(results.data).length}\n`;
    text += `Date: ${new Date().toLocaleDateString()}\n\n`;
    text += '───────────────────────────────────────────────────\n';
    text += 'Investor Name'.padEnd(25) + 'Requested'.padStart(15) + 'Allocated'.padStart(15) + 'Util %'.padStart(10) + '\n';
    text += '───────────────────────────────────────────────────\n';
    
    results.input.investor_amounts.forEach(investor => {
      const allocated = results.data[investor.name] || 0;
      const utilization = investor.requested_amount > 0 
        ? ((allocated / investor.requested_amount) * 100).toFixed(2)
        : '0.00';
      
      text += investor.name.padEnd(25);
      text += formatCurrency(investor.requested_amount).padStart(15);
      text += formatCurrency(allocated).padStart(15);
      text += `${utilization}%`.padStart(10);
      text += '\n';
    });
    
    text += '───────────────────────────────────────────────────\n';

    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};
