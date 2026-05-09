import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Download, 
  Printer, 
  Share2, 
  Undo, 
  Redo, 
  Image as ImageIcon,
  FileDown
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { convertToMm } from '../lib/utils';

export const Header: React.FC = () => {
  const { pageSize, orientation } = useStore();

  const exportAsPDF = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;

    // Use jsPDF directly with the high-res canvas if possible, 
    // but for this implementation we'll use the browser print approach 
    // or direct canvas image capture.
    
    const canvas = element.querySelector('canvas');
    if (canvas) {
      const isPortrait = orientation === 'portrait';
      const w = isPortrait ? pageSize.width : pageSize.height;
      const h = isPortrait ? pageSize.height : pageSize.width;
      
      const pdf = new jsPDF({
        orientation: isPortrait ? 'portrait' : 'landscape',
        unit: 'mm',
        format: [w, h]
      });

      const imgData = canvas.toDataURL('image/jpeg', 1.0);
      pdf.addImage(imgData, 'JPEG', 0, 0, w, h);
      pdf.save('passport-photo-sheet.pdf');
    }
  };

  const exportAsJPG = () => {
    const element = document.getElementById('print-area');
    const canvas = element?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = 'passport-photo-sheet.jpg';
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    }
  };

  return (
    <header className="h-14 border-b border-slate-200 bg-white flex items-center justify-between px-6 z-20">
      <div className="flex items-center gap-4">
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><Undo size={16}/></button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors"><Redo size={16}/></button>
        </div>
        <div className="h-4 w-px bg-slate-200" />
        <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">300 DPI Rendering</span>
      </div>

      <div className="flex items-center gap-3">
        <button 
           onClick={exportAsJPG}
           className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <ImageIcon size={14} /> Export JPG
        </button>
        <button 
           onClick={exportAsPDF}
           className="h-9 px-4 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600 flex items-center gap-2 hover:bg-slate-50 transition-colors"
        >
          <FileDown size={14} /> Save PDF
        </button>
        <button 
           onClick={() => window.print()}
           className="h-9 px-4 bg-blue-600 text-white rounded-lg text-xs font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Printer size={14} /> Send to Print
        </button>
      </div>
    </header>
  );
};
