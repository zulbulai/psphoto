import React from 'react';
import { useStore } from '../store/useStore';
import { 
  Menu,
  Download, 
  Printer, 
  ImageIcon,
  Share2,
  Info,
  Layers,
  Zap,
  Home as HomeIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { motion } from 'motion/react';

interface HeaderProps {
  onMenuClick: () => void;
  onHomeClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick, onHomeClick }) => {
  const { pageSize, orientation, items, mode } = useStore();

  const exportAsPDF = async () => {
    const element = document.getElementById('print-area');
    if (!element) return;
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
      pdf.save(`${mode === 'aadhaar' ? 'Aadhaar' : 'Passport'}_Layout_${new Date().toLocaleDateString()}.pdf`);
    }
  };

  const exportAsJPG = () => {
    const element = document.getElementById('print-area');
    const canvas = element?.querySelector('canvas');
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${mode === 'aadhaar' ? 'Aadhaar' : 'Passport'}_Layout_${new Date().toLocaleDateString()}.jpg`;
      link.href = canvas.toDataURL('image/jpeg', 1.0);
      link.click();
    }
  };

  return (
    <header className="h-16 lg:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 lg:px-8 shrink-0 z-40 sticky top-0">
      <div className="flex items-center gap-4">
        <button 
          onClick={onHomeClick}
          className="p-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
          title="Back to Home"
        >
          <HomeIcon size={20} />
        </button>

        <button 
          onClick={onMenuClick}
          className="lg:hidden p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-slate-200 transition-colors"
        >
          <Menu size={20} />
        </button>
        
        <div className="hidden sm:flex items-center gap-6">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-100">
             <Zap size={14} fill="currentColor" />
             <span className="text-[10px] font-black uppercase tracking-widest leading-none">{mode === 'aadhaar' ? 'Aadhaar Print Layout Pro' : 'Passport Studio Pro'}</span>
          </div>
          <div className="h-4 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-tighter leading-none mb-1">Active Output</span>
            <span className="text-xs font-bold text-slate-800 leading-none">300 DPI Rendering</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 lg:gap-4">
        <div className="hidden md:flex items-center gap-2 mr-2">
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors" title="Quick Share">
              <Share2 size={20} />
           </button>
           <button className="p-2.5 text-slate-400 hover:text-slate-900 transition-colors" title="Tool Information">
              <Info size={20} />
           </button>
        </div>

        <div className="h-8 w-px bg-slate-200 hidden md:block mx-2" />

        <div className="flex items-center gap-2">
          <button 
            onClick={exportAsJPG}
            className="flex items-center gap-2 px-4 py-2.5 lg:px-5 lg:py-3 bg-white border-2 border-slate-200 text-slate-900 rounded-2xl text-xs font-black uppercase tracking-widest hover:border-slate-900 transition-all active:scale-95"
          >
            <ImageIcon size={16} /> <span className="hidden sm:inline">JPG</span>
          </button>

          <button 
            onClick={exportAsPDF}
            className="flex items-center gap-2 px-4 py-2.5 lg:px-6 lg:py-3 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95 group"
          >
            <Printer size={16} className="group-hover:rotate-12 transition-transform" /> <span className="hidden sm:inline">Print to PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};
