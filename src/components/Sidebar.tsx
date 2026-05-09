import React from 'react';
import { useStore, PHOTO_PRESETS, PAGE_PRESETS } from '../store/useStore';
import { cn } from '../lib/cn';
import { 
  Camera, 
  Settings, 
  Layout, 
  Palette, 
  Printer, 
  FileText, 
  Maximize, 
  Trash2,
  Crop as CropIcon,
  Plus,
  Minus
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const {
    items,
    addItem,
    removeItem,
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
    setIsCropping
  } = useStore();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach(file => {
        const reader = new FileReader();
        reader.onload = (event) => {
          addItem(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  return (
    <div className="w-80 h-full border-r border-slate-200 bg-white flex flex-col overflow-y-auto no-scrollbar">
      <div className="p-4 border-b border-slate-100 flex items-center gap-2">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <Camera size={18} />
        </div>
        <h1 className="font-bold text-slate-800 tracking-tight">PassportPro</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Step 1: Upload */}
        <section>
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Layout size={14} /> 1. Photo Library
          </label>
          
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className="p-2 border border-slate-200 rounded-xl bg-slate-50/50 group">
                <div className="flex gap-3">
                  <div className="relative w-16 h-20 bg-white rounded-lg overflow-hidden border border-slate-200 shrink-0">
                    <img src={item.processedImage} className="w-full h-full object-cover" alt="Thumb" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1">
                      <button onClick={() => setIsCropping(true, item.id)} className="p-1 bg-white rounded text-slate-900"><CropIcon size={12} /></button>
                      <button onClick={() => removeItem(item.id)} className="p-1 bg-white rounded text-red-600"><Trash2 size={12} /></button>
                    </div>
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Quantity</span>
                      <div className="flex items-center h-6 bg-white rounded border border-slate-200 px-1 scale-90 origin-right">
                        <button onClick={() => updateItemQuantity(item.id, item.quantity - 1)} className="p-0.5 hover:text-blue-500"><Minus size={12}/></button>
                        <input 
                          type="number" 
                          value={item.quantity} 
                          onChange={(e) => updateItemQuantity(item.id, parseInt(e.target.value) || 0)}
                          className="w-10 text-center bg-transparent text-[10px] font-bold focus:outline-none"
                        />
                        <button onClick={() => updateItemQuantity(item.id, item.quantity + 1)} className="p-0.5 hover:text-blue-500"><Plus size={12}/></button>
                      </div>
                    </div>
                    
                    <div className="flex gap-1">
                       <button onClick={() => updateItemQuantity(item.id, 4)} className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:border-blue-300">4x</button>
                       <button onClick={() => updateItemQuantity(item.id, 8)} className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:border-blue-300">8x</button>
                       <button onClick={() => updateItemQuantity(item.id, 12)} className="text-[9px] px-1.5 py-0.5 bg-white border border-slate-200 rounded hover:border-blue-300">12x</button>
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <div 
              className="border-2 border-dashed border-slate-200 rounded-xl p-3 transition-all hover:border-blue-400 hover:bg-blue-50/30 group cursor-pointer"
              onClick={() => document.getElementById('imageInput')?.click()}
            >
              <input type="file" id="imageInput" className="hidden" accept="image/*" multiple onChange={handleFileChange} />
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:bg-blue-100 transition-colors">
                  <Plus size={16} />
                </div>
                <div className="text-left">
                  <p className="text-xs font-bold text-slate-600">Add Photos</p>
                  <p className="text-[10px] text-slate-400">Multi person support</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Step 2: Dimensions */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            <Settings size={14} /> 2. Print Settings
          </label>
          
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Photo Size</label>
            <select 
              value={photoSize.id}
              onChange={(e) => setPhotoSize(PHOTO_PRESETS.find(p => p.id === e.target.value)!)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {PHOTO_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {photoSize.id === 'custom' && (
            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 duration-200">
               <div className="space-y-1">
                 <input 
                    type="number" 
                    value={photoSize.width} 
                    onChange={(e) => setPhotoSize({...photoSize, width: parseFloat(e.target.value) || 0})}
                    placeholder="W"
                    className="w-full h-8 px-2 border border-slate-200 rounded text-xs" 
                 />
               </div>
               <div className="space-y-1">
                 <input 
                    type="number" 
                    value={photoSize.height} 
                    onChange={(e) => setPhotoSize({...photoSize, height: parseFloat(e.target.value) || 0})}
                    placeholder="H"
                    className="w-full h-8 px-2 border border-slate-200 rounded text-xs" 
                 />
               </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-600">Page Size</label>
            <select 
              value={pageSize.id}
              onChange={(e) => setPageSize(PAGE_PRESETS.find(p => p.id === e.target.value)!)}
              className="w-full h-9 px-3 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              {PAGE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>

          {pageSize.id === 'custom' && (
            <div className="grid grid-cols-2 gap-2 animate-in slide-in-from-top-1 duration-200">
               <input 
                  type="number" 
                  value={pageSize.width} 
                  onChange={(e) => setPageSize({...pageSize, width: parseFloat(e.target.value) || 0})}
                  placeholder="Page W"
                  className="w-full h-8 px-2 border border-slate-200 rounded text-xs" 
               />
               <input 
                  type="number" 
                  value={pageSize.height} 
                  onChange={(e) => setPageSize({...pageSize, height: parseFloat(e.target.value) || 0})}
                  placeholder="Page H"
                  className="w-full h-8 px-2 border border-slate-200 rounded text-xs" 
               />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Orientation</label>
              <div className="flex bg-slate-50 p-1 rounded-lg border border-slate-100">
                <button 
                  onClick={() => setOrientation('portrait')}
                  className={cn("flex-1 text-[10px] py-1 px-2 rounded-md font-medium transition-all", orientation === 'portrait' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                >
                  Portrait
                </button>
                <button 
                  onClick={() => setOrientation('landscape')}
                  className={cn("flex-1 text-[10px] py-1 px-2 rounded-md font-medium transition-all", orientation === 'landscape' ? "bg-white shadow-sm text-blue-600" : "text-slate-400")}
                >
                  Landscape
                </button>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-600">Quantity</label>
              <div className="flex items-center h-8 bg-slate-50 rounded-lg border border-slate-100 px-1">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-1 hover:text-blue-500"><Minus size={14}/></button>
                <input 
                  type="number" 
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  className="w-full text-center bg-transparent text-xs font-medium focus:outline-none"
                />
                <button onClick={() => setQuantity(quantity + 1)} className="p-1 hover:text-blue-500"><Plus size={14}/></button>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 group cursor-pointer" onClick={() => setAutoFill(!autoFill)}>
            <div className={cn("w-4 h-4 rounded border flex items-center justify-center transition-colors", autoFill ? "bg-blue-600 border-blue-600 text-white" : "border-slate-300 bg-white")}>
              {autoFill && <Plus size={10} strokeWidth={3} />}
            </div>
            <span className="text-xs font-medium text-slate-700">Auto Fill Page</span>
          </div>
        </section>

        {/* Step 3: Styling */}
        <section className="space-y-4">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
            <Palette size={14} /> 3. Layout Styling
          </label>
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium text-slate-600">Background Color</label>
              <input 
                type="color" 
                value={backgroundColor} 
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-10 h-6 p-0 border-none rounded bg-transparent cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-600">Photo Padding</label>
                <span className="text-[10px] font-mono text-slate-400">{spacing}mm</span>
              </div>
              <input 
                type="range" min="0" max="20" value={spacing} 
                onChange={(e) => setSpacing(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-600">Sheet Margin</label>
                <span className="text-[10px] font-mono text-slate-400">{margin}mm</span>
              </div>
              <input 
                type="range" min="5" max="30" value={margin} 
                onChange={(e) => setMargin(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs font-medium text-slate-600">Border Width</label>
                <div className="flex items-center gap-2">
                   <input 
                    type="color" 
                    value={borderColor} 
                    onChange={(e) => setBorderColor(e.target.value)}
                    className="w-5 h-5 p-0 border-none rounded bg-transparent cursor-pointer"
                  />
                  <span className="text-[10px] font-mono text-slate-400">{borderWidth}px</span>
                </div>
              </div>
              <input 
                type="range" min="0" max="10" value={borderWidth} 
                onChange={(e) => setBorderWidth(parseInt(e.target.value))}
                className="w-full h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600" 
              />
            </div>
          </div>
        </section>
      </div>

      <div className="mt-auto p-4 border-t border-slate-100 bg-slate-50 space-y-2">
        <button 
          onClick={() => window.print()}
          className="w-full h-10 bg-slate-900 text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors shadow-sm"
        >
          <Printer size={16} /> Print Sheet
        </button>
      </div>
    </div>
  );
};
