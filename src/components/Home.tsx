import React from 'react';
import { 
  ShieldCheck, 
  Zap, 
  Target, 
  Smartphone, 
  CreditCard, 
  Camera, 
  ChevronRight,
  ArrowRight,
  Printer,
  Download,
  Lock,
  Mail,
  MapPin,
  ExternalLink,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';

interface HomeProps {
  onStartTool: (mode: 'aadhaar' | 'passport' | 'voter' | 'pan' | 'shram') => void;
}

export const Home: React.FC<HomeProps> = ({ onStartTool }) => {
  return (
    <div className="h-screen w-full overflow-y-auto bg-slate-50 font-sans selection:bg-red-100 selection:text-red-600 custom-scrollbar scroll-smooth">
      {/* Navbar like screenshot */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50 px-4 h-16 flex items-center justify-between shadow-sm shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
            <Layers size={18} />
          </div>
          <span className="font-black text-xl tracking-tighter text-slate-900">
            E-<span className="text-red-600 font-black">Card</span> <span className="font-black">Cutter</span>
          </span>
        </div>
        <button className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg lg:hidden">
          <Layers size={20} />
        </button>
        <nav className="hidden lg:flex items-center gap-8">
          <a href="#" className="font-bold text-sm text-slate-600 hover:text-red-600">Home</a>
          <a href="#" className="font-bold text-sm text-slate-600 hover:text-red-600">Our Tools</a>
          <a href="#" className="font-bold text-sm text-slate-600 hover:text-red-600">Contact</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-12 md:py-24 px-4 bg-white relative overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-50 rounded-full blur-3xl -z-10 opacity-50" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-50 rounded-full blur-3xl -z-10 opacity-50" />
        
        <div className="max-w-4xl mx-auto text-center space-y-8 relative">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3 py-1 bg-red-100 text-red-600 rounded-full text-[10px] font-black uppercase tracking-widest"
          >
            <Sparkles size={12} /> Trusted by 10,000+ Users
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.05] tracking-tight"
          >
            Instant e-Aadhaar <br />
            <span className="text-red-600">Smart Cropper</span>
          </motion.h1>
          
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
            Extract perfectly sized ID cards from e-Aadhaar PDF files automatically. 
            No manual cutting. No complex software. Fully secure in your browser.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-8">
            <button 
              onClick={() => onStartTool('aadhaar')}
              className="px-8 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              Start Aadhaar Tool <ArrowRight size={20} />
            </button>
            <button 
              onClick={() => onStartTool('voter')}
              className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-slate-900/10 hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              Voter ID Tool
            </button>
            <button 
              onClick={() => onStartTool('passport')}
              className="px-8 py-4 bg-blue-600 text-white rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-500/10 hover:bg-blue-700 transition-all hover:scale-[1.02] active:scale-95 flex items-center gap-2"
            >
              Passport Photo
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <button 
              onClick={() => onStartTool('pan')}
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-emerald-500/10 hover:bg-emerald-700 transition-all flex items-center gap-2"
            >
              PAN Card Crop
            </button>
            <button 
              onClick={() => onStartTool('shram')}
              className="px-6 py-3 bg-orange-600 text-white rounded-xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/10 hover:bg-orange-700 transition-all flex items-center gap-2"
            >
              E-Shram Crop
            </button>
          </div>

          {/* Privacy Banner */}
          <div className="max-w-xl mx-auto bg-emerald-50 border border-emerald-100 p-3 rounded-2xl flex items-center justify-center gap-3 mt-12">
            <Lock className="text-emerald-500" size={16} />
            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-widest">
              100% Privacy: All processing happens in your browser
            </p>
          </div>

          {/* Quick stats */}
          <div className="pt-12 grid grid-cols-3 gap-8 border-t border-slate-100 mt-16">
            <div>
               <p className="text-2xl font-black text-slate-900">100%</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Safe & Secure</p>
            </div>
            <div>
               <p className="text-2xl font-black text-slate-900">300+</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">DPI quality</p>
            </div>
            <div>
               <p className="text-2xl font-black text-slate-900">&lt; 2s</p>
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Processing Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Section Grid like screenshot */}
      <section className="py-8 px-4 bg-slate-50">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <MiniFeature icon={<Zap className="text-yellow-500" />} title="Lightning Fast" desc="Process your Aadhaar PDF in seconds" />
          <MiniFeature icon={<Lock className="text-red-500" />} title="100% Secure" desc="Files auto-delete after 5 minutes" />
          <MiniFeature icon={<Target className="text-blue-500" />} title="Perfect Crop" desc="Automatic detection with precise dim." />
          <MiniFeature icon={<Smartphone className="text-green-500" />} title="Mobile Friendly" desc="Works perfectly on all devices" />
        </div>
      </section>

      {/* How it works section like screenshot */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-slate-900 uppercase tracking-tighter mb-4">How to Crop Aadhaar Card</h2>
            <div className="w-16 h-1.5 bg-red-600 mx-auto rounded-full" />
            <p className="mt-4 text-slate-500 font-bold uppercase text-xs tracking-widest">Simple step-by-step guide</p>
          </div>

          <div className="space-y-4">
            <StepItem number="1" title="Get Aadhaar PDF" desc="Download from UIDAI website or mAadhaar app" />
            <StepItem number="2" title="Upload PDF File" desc="Select your Aadhaar PDF file from your device" />
            <StepItem number="3" title="Automatic Processing" desc="Tool automatically crops both front and back sides" />
            <StepItem number="4" title="Download & Use" desc="Get high quality 300 DPI images for your card" />
          </div>
        </div>
      </section>

      {/* Footer from screenshot */}
      <footer className="bg-slate-900 text-white pt-16 pb-8 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12 border-b border-slate-800 pb-12">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center">
                <Layers size={22} />
              </div>
              <span className="font-black text-2xl tracking-tighter uppercase">E-Card <span className="text-red-500">Cutter</span></span>
            </div>
            <p className="text-slate-400 font-medium">India's leading tool for e-card processing. Fast, secure, and always reliable.</p>
          </div>

          <div className="space-y-6">
            <h3 className="font-black text-lg uppercase tracking-tight relative border-b-2 border-red-600 w-fit pb-1">Our Tools</h3>
            <ul className="space-y-3 font-bold text-slate-400 text-sm">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> ID Card Cropper</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> Passport Photo Maker</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> Image Converter</li>
            </ul>
          </div>

          <div className="space-y-6">
            <h3 className="font-black text-lg uppercase tracking-tight relative border-b-2 border-red-600 w-fit pb-1">Quick Links</h3>
            <ul className="space-y-3 font-bold text-slate-400 text-sm">
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> Home</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> About Us</li>
              <li className="flex items-center gap-2 hover:text-white cursor-pointer"><ArrowRight size={14} className="text-red-600" /> Contact Us</li>
            </ul>
          </div>
        </div>
        
        <div className="text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
          © 2024 E-CARD CUTTER • DESIGNED FOR CONVENIENCE
        </div>
      </footer>
    </div>
  );
};

const ActionCard = ({ title, icon, color, onClick, badge }: any) => (
  <button 
    onClick={onClick}
    className={`${color} text-white p-6 rounded-3xl flex items-center justify-between group overflow-hidden relative shadow-xl shadow-slate-200 transition-all hover:scale-[1.02] active:scale-95`}
  >
    <div className="flex items-center gap-4 relative z-10">
      <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
        {icon}
      </div>
      <div className="text-left">
        <h3 className="font-black text-xl leading-none mb-1">{title}</h3>
        {badge && <span className="bg-white/20 text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full">{badge}</span>}
      </div>
    </div>
    <div className="p-2 bg-white/20 rounded-full backdrop-blur-sm relative z-10 group-hover:bg-white/40 transition-colors">
      <ArrowRight size={20} />
    </div>
    {/* Decorative shape */}
    <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/5 rounded-full blur-2xl group-hover:scale-150 transition-transform" />
  </button>
);

const MiniFeature = ({ icon, title, desc }: any) => (
  <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center space-y-2 hover:shadow-lg transition-shadow">
    <div className="shrink-0">{icon}</div>
    <div>
      <h3 className="font-black text-sm uppercase tracking-tight text-slate-900 leading-none mb-1">{title}</h3>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{desc}</p>
    </div>
  </div>
);

const StepItem = ({ number, title, desc }: any) => (
  <div className="flex items-center gap-5 group">
    <div className="w-10 h-10 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-lg shrink-0 group-hover:scale-110 transition-transform shadow-lg shadow-red-200">
      {number}
    </div>
    <div className="bg-white p-5 rounded-2xl border border-slate-200 flex-1 group-hover:border-red-200 group-hover:shadow-xl group-hover:shadow-red-500/5 transition-all text-left">
      <h4 className="font-black text-slate-900 uppercase tracking-tight text-sm leading-none mb-1">{title}</h4>
      <p className="text-slate-500 font-bold text-xs leading-none">{desc}</p>
    </div>
  </div>
);
