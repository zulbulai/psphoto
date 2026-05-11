/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { Workspace } from './components/Workspace';
import { CropTool } from './components/CropTool';
import { Home } from './components/Home';
import { useStore } from './store/useStore';
import { Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState<'home' | 'editor'>('home');
  const { setMode } = useStore();

  const handleStartTool = (mode: 'aadhaar' | 'passport' | 'voter' | 'pan' | 'shram') => {
    setMode(mode);
    setCurrentPage('editor');
  };

  if (currentPage === 'home') {
    return <Home onStartTool={handleStartTool} />;
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[40] lg:hidden"
            />
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[280px] bg-white z-[50] lg:hidden shadow-2xl"
            >
               <div className="absolute top-4 right-4 z-10 lg:hidden">
                <button 
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
                >
                  <X size={24} />
                </button>
              </div>
              <Sidebar />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <Header 
          onMenuClick={() => setIsSidebarOpen(true)} 
          onHomeClick={() => setCurrentPage('home')}
        />
        <Workspace />
        
        {/* Mobile FAB to open settings if sidebar is closed */}
        <button 
          onClick={() => setIsSidebarOpen(true)}
          className="lg:hidden absolute bottom-6 right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center z-30 active:scale-95 transition-transform"
        >
          <Menu size={24} />
        </button>
      </div>

      <CropTool />
    </div>
  );
}
