import React, { useRef, useEffect, useState } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Portal } from 'react-konva';
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
  
  if (!isCropping || !activeItem) return null;

  const handleApply = () => {
    if (stageRef.current) {
      const dataUrl = stageRef.current.toDataURL({
        pixelRatio: 4, 
        quality: 1,
      });
      updateItemImage(activeItem.id, dataUrl);
      setIsCropping(false);
    }
  };

  const photoRatio = photoSize.width / photoSize.height;
  const stageW = 400;
  const stageH = stageW / photoRatio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-8">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Crop & Align Face</h3>
          <button onClick={() => setIsCropping(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 flex flex-col items-center gap-8">
          <div className="relative border-4 border-slate-100 shadow-inner bg-slate-50 rounded-lg overflow-hidden cursor-move">
            <Stage 
                width={stageW} 
                height={stageH} 
                ref={stageRef}
            >
              <Layer>
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
            <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center">
                 {/* Face Oval Guide */}
                 <div className="w-[65%] h-[80%] border-2 border-dashed border-blue-400/60 rounded-[50%_50%_45%_45%] flex items-center justify-center relative">
                     <div className="absolute top-[15%] w-full border-t border-blue-400/30" /> {/* Eye line */}
                     <div className="absolute bottom-[20%] w-[40%] border-b-2 border-blue-400/60" /> {/* Chin line */}
                     <span className="text-[9px] text-blue-500/80 font-black uppercase tracking-widest absolute -top-4">Crown Top</span>
                     <span className="text-[9px] text-blue-500/80 font-black uppercase tracking-widest absolute -bottom-4">Chin Base</span>
                 </div>
                 
                 {/* Ruler Ticks */}
                 <div className="absolute top-0 bottom-0 left-0 w-4 flex flex-col justify-between py-2 px-1">
                    {[...Array(10)].map((_, i) => <div key={i} className="h-px bg-slate-400/30 w-full" />)}
                 </div>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
            <button 
              onClick={() => setCropParams({ scale: cropScale * 0.9 })}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
              <ZoomOut size={18} />
            </button>
            <input 
              type="range" min="0.1" max="5" step="0.1" value={cropScale}
              onChange={(e) => setCropParams({ scale: parseFloat(e.target.value) })}
              className="w-32 h-1.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <button 
              onClick={() => setCropParams({ scale: cropScale * 1.1 })}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
              <ZoomIn size={18} />
            </button>
            <div className="w-px h-6 bg-slate-200 mx-2" />
            <button 
              onClick={() => setCropParams({ rotation: cropRotation + 90 })}
              className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
              <RotateCcw size={18} className="rotate-90" />
            </button>
            <button 
                onClick={() => setCropParams({ x: 0, y: 0, scale: 1, rotation: 0 })}
                className="p-2 hover:bg-white hover:shadow-sm rounded-lg transition-all text-slate-600"
            >
                <Maximize size={18} />
            </button>
          </div>
        </div>

        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
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
