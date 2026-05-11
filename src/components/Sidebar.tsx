import React, { useState } from 'react';
import { useStore, PHOTO_PRESETS, PAGE_PRESETS } from '../store/useStore';
import { cn } from '../lib/cn';
import { processAadhaarPDF, addBorderToImage } from '../lib/pdfEngine';
import { 
  Camera, 
  Settings2, 
  Layout, 
  Palette, 
  Printer, 
  Trash2,
  Crop as CropIcon,
  Plus,
  Minus,
  Sparkles,
  Layers,
  ChevronRight,
  UserPlus,
  FileText,
  CreditCard,
  Zap,
  Download,
  ExternalLink,
  Eye,
  EyeOff,
  Lock,
  IdCard,
  Contact,
  HardDrive
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'photos' | 'settings'>('photos');
  const [isProcessingPdf, setIsProcessingPdf] = useState(false);
  const [pdfPassword, setPdfPassword] = useState('');
  const [selectedPdf, setSelectedPdf] = useState<File | null>(null);
  const {
    mode,
    setMode,
    items,
    addItem,
    removeItem,
    clearAllItems,
    updateItemQuantity,
    photoSize,
    setPhotoSize,
    pageSize,
    setPageSize,
    orientation,
    setOrientation,
    autoFill,
    setAutoFill,
    backgroundColor,
    setBackgroundColor,
    borderWidth,
    setBorderWidth,
    borderColor,
    setBorderColor,
    spacing,
    setSpacing,
    margin,
    setMargin,
    showDate,
    setShowDate,
    customText,
    setCustomText,
    setIsCropping,
    aadhaarResult,
    setAadhaarResult,
    aadhaarBorder,
    setAadhaarBorder
  } = useStore();

  const [showFullPage, setShowFullPage] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    for (const file of Array.from(files)) {
      if (file.type === 'application/pdf') {
        setSelectedPdf(file);
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          addItem(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const processPdfManual = async () => {
    if (!selectedPdf) return;
    setIsProcessingPdf(true);
    try {
      const result = await processAadhaarPDF(selectedPdf, pdfPassword);
      setAadhaarResult(result);
      setSelectedPdf(null); 
      setPdfPassword('');
    } catch (error: any) {
      if (error.message === 'WRONG_PASSWORD') {
        alert('गलत पासवर्ड! (पासवर्ड आपके नाम के पहले 4 अक्षर CAPITAL में + जन्म वर्ष है, जैसे: ANIL1992)');
      } else {
        alert('Error: ' + error.message);
      }
    } finally {
      setIsProcessingPdf(false);
    }
  };

  const addExtractedToLayout = async () => {
    if (!aadhaarResult || !aadhaarResult.front || !aadhaarResult.back) return;
    const frontWithBorder = await addBorderToImage(aadhaarResult.front, aadhaarBorder);
    const backWithBorder = await addBorderToImage(aadhaarResult.back, aadhaarBorder);
    addItem(frontWithBorder);
    addItem(backWithBorder);
  };

  const downloadExtracted = async () => {
    if (!aadhaarResult || !aadhaarResult.front || !aadhaarResult.back) return;
    const frontWithBorder = await addBorderToImage(aadhaarResult.front, aadhaarBorder);
    const backWithBorder = await addBorderToImage(aadhaarResult.back, aadhaarBorder);
    
    const link = document.createElement('a');
    link.href = frontWithBorder;
    link.download = 'aadhaar_front.jpg';
    link.click();
    
    setTimeout(() => {
      link.href = backWithBorder;
      link.download = 'aadhaar_back.jpg';
      link.click();
    }, 500);
  };

  const convertToPvc = () => {
    const pvcSize = PAGE_PRESETS.find(p => p.id === 'pvc');
    if (pvcSize) {
      setPageSize(pvcSize);
      setActiveTab('settings');
    }
  };

  return (
    <div className="w-full lg:w-[320px] h-full border-r border-slate-200 bg-white flex flex-col overflow-hidden">
      {/* Mode Switcher - Premium Toggle */}
      <div className="p-3 bg-slate-900 flex gap-2 overflow-x-auto no-scrollbar shrink-0">
        <button 
          onClick={() => setMode('aadhaar')}
          className={cn(
            "min-w-[70px] flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            mode === 'aadhaar' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50" 
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
        >
          <CreditCard size={18} /> Aadhaar
        </button>
        <button 
          onClick={() => setMode('voter')}
          className={cn(
            "min-w-[70px] flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            mode === 'voter' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50" 
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
        >
          <IdCard size={18} /> Voter
        </button>
        <button 
          onClick={() => setMode('pan')}
          className={cn(
            "min-w-[70px] flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            mode === 'pan' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50" 
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
        >
          <HardDrive size={18} /> PAN
        </button>
        <button 
          onClick={() => setMode('shram')}
          className={cn(
            "min-w-[70px] flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            mode === 'shram' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50" 
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
        >
          <Contact size={18} /> Shram
        </button>
        <button 
          onClick={() => setMode('passport')}
          className={cn(
            "min-w-[70px] flex-1 flex flex-col items-center justify-center gap-1 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all",
            mode === 'passport' 
              ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20 ring-1 ring-blue-400/50" 
              : "bg-slate-800 text-slate-400 hover:text-slate-200 hover:bg-slate-700"
          )}
        >
          <Camera size={18} /> Passport
        </button>
      </div>

      {/* Header */}
      <div className="p-5 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-slate-900 rounded-xl flex items-center justify-center text-white shadow-lg shadow-slate-200">
            {mode === 'aadhaar' ? <CreditCard size={20} strokeWidth={2.5} /> : <Camera size={20} strokeWidth={2.5} />}
          </div>
          <div>
            <h1 className="font-black text-slate-900 tracking-tight text-base leading-none capitalize">
              {mode} Pro
            </h1>
            <p className="text-[10px] font-bold text-blue-600 uppercase mt-1 tracking-widest leading-none">Layout Engine</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex px-5 pt-4 shrink-0">
        <div className="flex w-full bg-slate-100/80 p-1 rounded-xl border border-slate-200/50">
          <button 
            onClick={() => setActiveTab('photos')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === 'photos' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Layers size={14} /> Library
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all",
              activeTab === 'settings' ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Settings2 size={14} /> Page
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-5">
        {activeTab === 'photos' ? (
          <div className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
             <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Sparkles size={12} /> Photo Library
              </h3>
              <div className="flex items-center gap-2">
                {items.length > 0 && (
                  <button 
                    onClick={clearAllItems}
                    className="text-[9px] font-black text-red-500 hover:text-red-700 uppercase tracking-widest px-2 py-1 bg-red-50 rounded-lg transition-colors"
                  >
                    Clear All
                  </button>
                )}
                <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">{items.length} Images</span>
              </div>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="p-3 border border-slate-200 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
                  <div className="flex gap-4">
                    <div className="relative w-16 h-20 bg-slate-50 rounded-xl overflow-hidden border border-slate-100 shrink-0 shadow-inner">
                      <img src={item.processedImage} className="w-full h-full object-cover" alt="Thumb" />
                      <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 border-2 border-transparent group-hover:border-blue-500/50 rounded-xl">
                        <button onClick={() => setIsCropping(true, item.id)} className="p-1.5 bg-white rounded-lg text-slate-900 hover:scale-110 active:scale-95 transition-transform"><CropIcon size={14} /></button>
                        <button onClick={() => removeItem(item.id)} className="p-1.5 bg-white rounded-lg text-red-600 hover:scale-110 active:scale-95 transition-transform"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Copies to Print</p>
                        <div className="flex items-center gap-3">
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <input 
                            type="number" 
                            value={item.quantity} 
                            onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                            className="w-8 text-center bg-transparent text-sm font-black text-slate-900 focus:outline-none"
                          />
                          <button 
                            onClick={() => updateItemQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                      
                      <div className="flex gap-1.5 pt-2">
                         {[4, 8, 12].map(n => (
                           <button 
                             key={n}
                             onClick={() => updateItemQuantity(item.id, n)} 
                             className="text-[9px] font-black px-2 py-0.5 bg-slate-50 border border-slate-200 rounded-lg hover:border-blue-400 hover:text-blue-600 transition-colors"
                           >
                            {n}x
                           </button>
                         ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <div className="space-y-4">
                {mode === 'aadhaar' ? (
                  <div className="space-y-4">
                    {/* Security Notice */}
                    <div className="bg-slate-900 rounded-2xl p-4 flex items-start gap-3 shadow-xl shadow-slate-200">
                      <Lock className="text-emerald-400 shrink-0 mt-0.5" size={16} />
                      <div className="space-y-1">
                        <p className="text-[10px] font-black text-white uppercase tracking-wider">Browser Protected</p>
                        <p className="text-[9px] font-medium text-slate-400 leading-tight">Your Aadhaar never leaves your device. All processing happens locally in your browser.</p>
                      </div>
                    </div>

                    {!aadhaarResult ? (
                      <>
                        {/* The "Drop Zone" box like the screenshot */}
                        <div className="bg-white border-2 border-dashed border-red-500 rounded-[2rem] p-8 text-center space-y-4 relative overflow-hidden group hover:bg-red-50/30 transition-colors">
                          <div className="w-20 h-14 mx-auto mb-2 group-hover:scale-110 transition-transform">
                            <img 
                              src="https://upload.wikimedia.org/wikipedia/en/thumb/c/cf/Aadhaar_Logo.svg/1200px-Aadhaar_Logo.svg.png" 
                              alt="Aadhaar" 
                              className="w-full h-full object-contain opacity-80"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Drop Your Aadhaar PDF Here</h3>
                            <p className="text-[9px] font-bold text-slate-400 uppercase tracking-[0.1em]">Supported: UIDAI e-Aadhaar PDF • Max 10MB</p>
                          </div>

                          {selectedPdf && (
                            <div className="bg-blue-50 py-2 px-3 rounded-lg flex items-center justify-center gap-2 border border-blue-100">
                              <p className="text-[10px] font-black text-blue-600 truncate max-w-[180px]">
                                Selected: {selectedPdf.name}
                              </p>
                              <button onClick={() => setSelectedPdf(null)} className="text-blue-400 hover:text-red-500">
                                <Trash2 size={12} />
                              </button>
                            </div>
                          )}

                          <div className="space-y-2 relative">
                            <input 
                              type={isPasswordVisible ? "text" : "password"}
                              value={pdfPassword}
                              onChange={(e) => setPdfPassword(e.target.value)}
                              placeholder="PDF PASSWORD (e.g. ANIL1992)"
                              className="w-full h-10 px-4 pr-10 bg-slate-50 border border-slate-200 rounded-xl text-center text-xs font-black tracking-widest placeholder:tracking-normal placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-red-500/20 transition-all uppercase"
                            />
                            <button 
                              onClick={() => setIsPasswordVisible(!isPasswordVisible)}
                              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                            >
                              {isPasswordVisible ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                            <p className="text-[8px] font-bold text-slate-400 uppercase tracking-tighter">Hint: First 4 letters of name (CAPS) + Birth Year</p>
                          </div>

                          <button 
                            onClick={() => document.getElementById('imageInput')?.click()}
                            className="w-fit mx-auto bg-red-600 text-white px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-500/20"
                          >
                            <FileText size={14} /> Select PDF File
                          </button>
                          
                          <input type="file" id="imageInput" className="hidden" accept="image/*,application/pdf" multiple onChange={handleFileChange} />
                        </div>

                        <button 
                          onClick={processPdfManual}
                          disabled={!selectedPdf || isProcessingPdf}
                          className="w-full h-14 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] flex items-center justify-center gap-3 hover:bg-slate-800 transition-all disabled:opacity-50 shadow-xl shadow-slate-200"
                        >
                          {isProcessingPdf ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <><Layers size={18} /> Crop Aadhaar Front & Back</>
                          )}
                        </button>
                      </>
                    ) : (
                      <div className="space-y-4 animate-in zoom-in-95 duration-300">
                         {/* Success Banner */}
                         <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-2xl flex items-center gap-3">
                            <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shrink-0">
                              <Sparkles size={16} />
                            </div>
                            <p className="text-[10px] font-black text-emerald-700 uppercase tracking-tight">Aadhaar card front & back cropped successfully!</p>
                         </div>

                         {/* Results Preview Box */}
                         <div className="bg-white border-2 border-blue-100 rounded-[2rem] p-6 space-y-6 text-center">
                            <div className="flex items-center justify-center gap-2 mb-2">
                               <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center text-white">
                                  <Sparkles size={10} />
                               </div>
                               <h3 className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Aadhaar Card Cropped Successfully!</h3>
                            </div>

                            <div className="space-y-4">
                               <div className="flex items-center justify-between px-1">
                                  <p className="text-[10px] font-black text-slate-900 uppercase">Crop Results</p>
                                  <button 
                                    onClick={() => setShowFullPage(!showFullPage)}
                                    className="text-[9px] font-bold text-blue-600 hover:underline flex items-center gap-1"
                                  >
                                    <Layout size={10} /> {showFullPage ? 'Hide' : 'Show'} Full Page
                                  </button>
                               </div>

                               {showFullPage && aadhaarResult.fullPage && (
                                 <div className="animate-in fade-in zoom-in-95 duration-200">
                                   <div className="bg-slate-100 rounded-xl overflow-hidden border border-slate-200 shadow-inner max-h-[300px] overflow-y-auto p-2">
                                      <img src={aadhaarResult.fullPage} className="w-full h-auto" alt="Full Page" />
                                   </div>
                                   <p className="text-[8px] font-bold text-slate-400 mt-1 italic text-left">* This is the original page we used to crop</p>
                                 </div>
                               )}

                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-slate-500 uppercase">Front Side</p>
                                  <div className={cn(
                                    "relative bg-slate-50 rounded-xl overflow-hidden shadow-md mx-auto aspect-[85.6/54] w-full max-w-[200px] border",
                                    aadhaarBorder === 'thin' ? "border-slate-900 border-1" : aadhaarBorder === 'thick' ? "border-slate-900 border-4" : "border-transparent"
                                  )}>
                                    <img src={aadhaarResult.front} className="w-full h-full object-cover" alt="Front" />
                                  </div>
                               </div>

                               <div className="space-y-2">
                                  <p className="text-[9px] font-black text-slate-500 uppercase">Back Side</p>
                                  <div className={cn(
                                    "relative bg-slate-50 rounded-xl overflow-hidden shadow-md mx-auto aspect-[85.6/54] w-full max-w-[200px] border",
                                    aadhaarBorder === 'thin' ? "border-slate-900 border-1" : aadhaarBorder === 'thick' ? "border-slate-900 border-4" : "border-transparent"
                                  )}>
                                    <img src={aadhaarResult.back} className="w-full h-full object-cover" alt="Back" />
                                  </div>
                               </div>
                            </div>

                            <div className="space-y-3">
                               <p className="text-[10px] font-black text-slate-900 uppercase">Add Border to Images:</p>
                               <div className="flex flex-col gap-2">
                                  {[
                                    { id: 'none', label: 'No Border' },
                                    { id: 'thin', label: 'Thin Border' },
                                    { id: 'thick', label: 'Thick Border' }
                                  ].map((b) => (
                                    <button 
                                      key={b.id}
                                      onClick={() => setAadhaarBorder(b.id as any)}
                                      className={cn(
                                        "w-full py-2 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all",
                                        aadhaarBorder === b.id 
                                          ? "bg-red-600 text-white border-red-600 shadow-lg shadow-red-200" 
                                          : "bg-white text-red-600 border-red-200 hover:border-red-400"
                                      )}
                                    >
                                      {b.label}
                                    </button>
                                  ))}
                               </div>
                            </div>

                            <div className="space-y-3 pt-2">
                               <button 
                                 onClick={downloadExtracted}
                                 className="w-full h-12 bg-blue-400 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-blue-500 transition-all shadow-lg shadow-blue-100"
                               >
                                 <Download size={16} /> Download Both Sides
                               </button>
                               <button 
                                 onClick={addExtractedToLayout}
                                 className="w-full h-12 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                               >
                                 <Plus size={16} /> Add to Workspace
                               </button>
                               <button 
                                 onClick={() => {
                                   if (aadhaarResult.fullPage) addItem(aadhaarResult.fullPage);
                                 }}
                                 className="w-full h-10 bg-slate-100 text-slate-800 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                               >
                                 <Plus size={14} /> Add Full Page (Manual Crop)
                               </button>
                               <button 
                                 onClick={convertToPvc}
                                 className="w-full h-10 bg-slate-100 text-slate-800 rounded-2xl font-black text-[9px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
                               >
                                 <ExternalLink size={14} /> Convert to PVC Card
                               </button>
                               <div className="pt-4 mt-4 border-t border-slate-100">
                                 <button 
                                   onClick={() => setAadhaarResult(null)}
                                   className="w-full h-10 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-slate-800 transition-all"
                                 >
                                   <Trash2 size={16} /> Crop Another Aadhaar
                                 </button>
                               </div>
                            </div>
                         </div>

                         <div className="p-4 bg-slate-900 rounded-2xl text-white flex items-center gap-3">
                            <Zap size={20} className="text-yellow-400 animate-pulse" />
                            <div>
                               <p className="text-[10px] font-black text-white uppercase leading-none">Lightning Fast</p>
                               <p className="text-[8px] font-bold text-slate-400 uppercase mt-1 leading-none">Processed in seconds</p>
                            </div>
                         </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <button 
                    className="w-full border-2 border-dashed border-slate-200 rounded-2xl p-5 transition-all hover:border-blue-500 hover:bg-blue-50/50 group cursor-pointer flex flex-col items-center gap-3"
                    onClick={() => document.getElementById('imageInput')?.click()}
                  >
                    <input type="file" id="imageInput" className="hidden" accept="image/*,application/pdf" multiple onChange={handleFileChange} />
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-blue-500 shadow-sm border border-slate-100 transition-all group-hover:scale-110 group-hover:rotate-3">
                      <UserPlus size={24} />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black text-slate-900">Add Portrait Image</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Images or PDFs Supported</p>
                    </div>
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-2 duration-300">
            {/* Dimensions Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Layout size={12} /> Physical Layout
              </h3>
              
              <div className="space-y-3">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Photo Dimensions</label>
                    <select 
                      value={photoSize.id}
                      onChange={(e) => setPhotoSize(PHOTO_PRESETS.find(p => p.id === e.target.value)!)}
                      className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all appearance-none cursor-pointer"
                    >
                      {PHOTO_PRESETS
                        .filter(p => mode === 'aadhaar' ? p.id.startsWith('aadhaar') || p.id === 'custom' : !p.id.startsWith('aadhaar'))
                        .map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                      }
                    </select>
                </div>

                {photoSize.id === 'custom' && (
                  <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 text-center">WIDTH (mm)</p>
                      <input 
                        type="number" value={photoSize.width} 
                        onChange={(e) => setPhotoSize({...photoSize, width: parseFloat(e.target.value) || 0})}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-center" 
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-bold text-slate-400 text-center">HEIGHT (mm)</p>
                      <input 
                        type="number" value={photoSize.height} 
                        onChange={(e) => setPhotoSize({...photoSize, height: parseFloat(e.target.value) || 0})}
                        className="w-full h-10 px-3 bg-white border border-slate-200 rounded-xl text-xs font-black text-center" 
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Paper Sheet Size</label>
                  <select 
                    value={pageSize.id}
                    onChange={(e) => setPageSize(PAGE_PRESETS.find(p => p.id === e.target.value)!)}
                    className="w-full h-11 px-4 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none appearance-none cursor-pointer"
                  >
                    {PAGE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Orientation</label>
                    <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-hidden">
                      <button 
                        onClick={() => setOrientation('portrait')}
                        className={cn("flex-1 text-[10px] py-2 px-2 rounded-lg font-black transition-all", orientation === 'portrait' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                      >
                        Portrait
                      </button>
                      <button 
                        onClick={() => setOrientation('landscape')}
                        className={cn("flex-1 text-[10px] py-2 px-2 rounded-lg font-black transition-all", orientation === 'landscape' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                      >
                        Landscape
                      </button>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Page Fill</label>
                    <button 
                      onClick={() => setAutoFill(!autoFill)}
                      className={cn("w-full py-2 px-2 rounded-xl text-[10px] font-black transition-all border", autoFill ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200" : "bg-slate-100 text-slate-400 border-slate-200")}
                    >
                      {autoFill ? "AUTO FILL ON" : "MANUAL MODE"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Styling Section */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Palette size={12} /> Visual Styling
              </h3>
              
              <div className="space-y-5">
                <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
                  <label className="text-[11px] font-black text-slate-700 uppercase">Background</label>
                  <input 
                    type="color" 
                    value={backgroundColor} 
                    onChange={(e) => setBackgroundColor(e.target.value)}
                    className="w-12 h-8 p-0 border-2 border-white rounded-lg shadow-sm cursor-pointer overflow-hidden"
                  />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase">Spacing</label>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{spacing}mm</span>
                    </div>
                    <input 
                      type="range" min="0" max="20" value={spacing} 
                      onChange={(e) => setSpacing(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Sheet Padding</label>
                      <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{margin}mm</span>
                    </div>
                    <input 
                      type="range" min="0" max="30" value={margin} 
                      onChange={(e) => setMargin(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                </div>

                <div className="space-y-3">
                   <div className="flex justify-between items-center px-1">
                      <label className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">Border Weight</label>
                      <div className="flex items-center gap-2">
                        <input 
                          type="color" value={borderColor} 
                          onChange={(e) => setBorderColor(e.target.value)}
                          className="w-5 h-5 p-0 border-none rounded bg-transparent cursor-pointer"
                        />
                        <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{borderWidth}px</span>
                      </div>
                    </div>
                    <input 
                      type="range" min="0" max="10" value={borderWidth} 
                      onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
                    />
                </div>

                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <p className="text-[11px] font-black text-slate-700 uppercase">Print Date</p>
                      <p className="text-[9px] font-bold text-slate-400">Add timestamp below photos</p>
                    </div>
                    <button 
                      onClick={() => setShowDate(!showDate)}
                      className={cn(
                        "w-10 h-5 rounded-full transition-all relative",
                        showDate ? "bg-blue-600" : "bg-slate-200"
                      )}
                    >
                      <div className={cn(
                        "absolute top-1 w-3 h-3 bg-white rounded-full transition-all",
                        showDate ? "left-6" : "left-1"
                      )} />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[11px] font-black text-slate-700 uppercase">Custom Label</p>
                    <input 
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="e.g. John Doe / USA"
                      className="w-full h-10 px-4 bg-slate-50 border border-slate-200 rounded-xl text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Quick Action Footer */}
      <div className="p-5 border-t border-slate-100 bg-slate-50 shrink-0">
        <button 
          onClick={() => window.print()}
          className="w-full h-12 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-800 transition-all shadow-xl active:scale-95 group"
        >
          <Printer size={18} className="group-hover:animate-bounce" /> Process & Print
        </button>
      </div>
    </div>
  );
};
