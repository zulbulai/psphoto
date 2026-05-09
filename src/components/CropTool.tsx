import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect } from 'react-konva';
import useImage from 'use-image';
import { useStore } from '../store/useStore';
import { Check, X, RotateCcw, ZoomIn, ZoomOut, Maximize } from 'lucide-react';

export const CropTool: React.FC = () => {
  const { 
    isCropping, 
    setIsCropping, 
    items,
    activeItemId,
    updateItemImage,
    photoSize,
    cropX, cropY, cropScale, cropRotation,
    setCropParams
  } = useStore();

  const activeItem = items.find(i => i.id === activeItemId);
  const [img] = useImage(activeItem?.originalImage || '');
  const stageRef = useRef<any>(null);
  
  // Calculate initial scale to fit/cover on open
  useEffect(() => {
    if (img && isCropping) {
      const photoRatio = photoSize.width / photoSize.height;
      const stageW = 400;
      const stageH = stageW / photoRatio;

      const scaleW = stageW / img.width;
      const scaleH = stageH / img.height;
      const initialScale = Math.max(scaleW, scaleH);
      
      setCropParams({
        x: 0,
        y: 0,
        scale: initialScale,
        rotation: 0
      });
    }
  }, [img, isCropping, photoSize.width, photoSize.height]);

  if (!isCropping || !activeItem) return null;

  const handleApply = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: 6, 
        quality: 1,
      });
      updateItemImage(activeItem.id, dataUrl);
      setIsCropping(false);
    }
  };

  const photoRatio = photoSize.width / photoSize.height;
  const stageW = 400;
  const stageH = stageW / photoRatio;

  const handleWheel = (e: any) => {
    e.evt.preventDefault();
    const scaleBy = 1.1;
    const oldScale = cropScale;
    const pointer = stageRef.current.getPointerPosition();

    const mousePointTo = {
      x: (pointer.x - (cropX + stageW/2)) / oldScale,
      y: (pointer.y - (cropY + stageH/2)) / oldScale,
    };

    const newScale = e.evt.deltaY < 0 ? oldScale * scaleBy : oldScale / scaleBy;
    
    // Smooth boundary for scale
    const finalScale = Math.max(0.01, Math.min(10, newScale));
    
    setCropParams({
      scale: finalScale,
      x: pointer.x - stageW/2 - mousePointTo.x * finalScale,
      y: pointer.y - stageH/2 - mousePointTo.y * finalScale,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 sm:p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white pt-6">
          <div className="flex flex-col">
            <h3 className="font-black text-slate-900 uppercase tracking-tighter">Precision Alignment</h3>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Use mouse wheel or slider to zoom</p>
          </div>
          <button onClick={() => setIsCropping(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-4 sm:p-8 flex flex-col items-center gap-6">
          <div className="relative border-8 border-slate-100 shadow-2xl bg-white rounded-xl overflow-hidden cursor-move ring-1 ring-slate-200">
            <Stage 
                width={stageW} 
                height={stageH} 
                ref={stageRef}
                onWheel={handleWheel}
            >
              <Layer>
                {/* Background Base */}
                <Rect width={stageW} height={stageH} fill="#ffffff" />
                {img && (
                  <KonvaImage
                    image={img}
                    x={cropX + stageW/2}
                    y={cropY + stageH/2}
                    scaleX={cropScale}
                    scaleY={cropScale}
                    rotation={cropRotation}
                    offsetX={img.width / 2}
                    offsetY={img.height / 2}
                    draggable
                    onDragEnd={(e) => {
                        setCropParams({ x: e.target.x() - stageW/2, y: e.target.y() - stageH/2 });
                    }}
                  />
                )}
              </Layer>
            </Stage>
            
            {/* Professional Passport Framing Guides */}
            <div className="absolute inset-0 pointer-events-none">
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 px-3 py-1 bg-slate-900/60 backdrop-blur-sm rounded-full">
                    <p className="text-[9px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                       <Maximize size={10} /> Drag to position image
                    </p>
                 </div>
                 {/* Rule of Thirds Grid */}
                 <div className="absolute inset-0 grid grid-cols-3 grid-rows-3">
                    <div className="border-r border-b border-blue-400/30" />
                    <div className="border-r border-b border-blue-400/30" />
                    <div className="border-b border-blue-400/30" />
                    <div className="border-r border-b border-blue-400/30" />
                    <div className="border-r border-b border-blue-400/30" />
                    <div className="border-b border-blue-400/30" />
                    <div className="border-r border-blue-400/30" />
                    <div className="border-r border-blue-400/30" />
                    <div className="border-blue-400/30" />
                 </div>
                 
                 {/* Center Crosshair */}
                 <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-4 h-[1px] bg-blue-500/50" />
                    <div className="w-[1px] h-4 bg-blue-500/50 absolute" />
                 </div>

                 {/* Corners */}
                 <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-blue-500 rounded-tl" />
                 <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-blue-500 rounded-tr" />
                 <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-blue-500 rounded-bl" />
                 <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-blue-500 rounded-br" />
            </div>
          </div>

          <div className="flex flex-col gap-6 w-full px-8 pb-8">
             <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <ZoomIn size={12} /> Image Zoom Intensity
                  </label>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{Math.round(cropScale * 100)}%</span>
                </div>
                <input 
                  type="range" min="0.1" max="5" step="0.05" value={cropScale}
                  onChange={(e) => setCropParams({ scale: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
             </div>

             <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center px-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <RotateCcw size={12} /> Precise Rotation
                  </label>
                  <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-100">{cropRotation}°</span>
                </div>
                <input 
                  type="range" min="-180" max="180" step="1" value={cropRotation}
                  onChange={(e) => setCropParams({ rotation: parseFloat(e.target.value) })}
                  className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
             </div>

             <div className="flex gap-3">
                <button 
                    onClick={() => setCropParams({ x: 0, y: 0, scale: 1, rotation: 0 })}
                    className="flex-1 h-11 border-2 border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-slate-900 hover:text-slate-900 transition-all flex items-center justify-center gap-2"
                >
                    <Maximize size={14} /> Reset View
                </button>
             </div>
          </div>
        </div>

        <div className="p-5 bg-slate-50 border-t border-slate-100 flex justify-end gap-4">
          <button 
            onClick={() => setIsCropping(false)}
            className="px-6 h-10 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-white transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={handleApply}
            className="px-6 h-10 bg-blue-600 text-white rounded-lg text-sm font-semibold flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Check size={18} /> Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
};
