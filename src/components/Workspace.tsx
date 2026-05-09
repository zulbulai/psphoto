import React, { useRef, useEffect, useState, useMemo } from 'react';
import { Stage, Layer, Image as KonvaImage, Rect, Group, Text } from 'react-konva';
import useImage from 'use-image';
import { useStore } from '../store/useStore';
import { convertToPx, MM_TO_INCH, DPI } from '../lib/utils';
import { Layout, ZoomIn, ZoomOut, Maximize, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Sub-component to handle individual photo rendering safely with hooks
const PhotoItem: React.FC<{
  processedImage: string;
  x: number;
  y: number;
  width: number;
  height: number;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  showDate: boolean;
  customText: string;
}> = ({ processedImage, x, y, width, height, backgroundColor, borderColor, borderWidth, showDate, customText }) => {
  const [img] = useImage(processedImage);
  
  return (
    <Group x={x} y={y}>
      {/* Background Color */}
      <Rect 
        width={width} 
        height={height} 
        fill={backgroundColor} 
      />
      
      {/* Image */}
      {img && (
        <KonvaImage 
          image={img} 
          width={width} 
          height={height} 
          listening={false}
        />
      )}

      {/* Border */}
      {borderWidth > 0 && (
        <Rect 
          width={width} 
          height={height} 
          stroke={borderColor} 
          strokeWidth={borderWidth} 
          listening={false}
        />
      )}

      {/* Labels */}
      {(showDate || customText) && (
        <Group y={height + 1}>
           {customText && (
             <Text 
                text={customText}
                width={width}
                height={10}
                fontSize={8}
                fontFamily="Inter"
                fontStyle="bold"
                align="center"
                fill={borderColor}
             />
           )}
           {showDate && (
             <Text 
                text={new Date().toLocaleDateString()}
                y={customText ? 10 : 0}
                width={width}
                fontSize={6}
                fontFamily="Inter"
                align="center"
                fill={borderColor}
                opacity={0.6}
             />
           )}
        </Group>
      )}
    </Group>
  );
};

export const Workspace: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const {
    items,
    photoSize,
    pageSize,
    orientation,
    autoFill,
    backgroundColor,
    borderWidth,
    borderColor,
    spacing,
    margin,
    roundedCorners,
    showDate,
    customText
  } = useStore();

  // Page dimensions in PX (300 DPI)
  const isPortrait = orientation === 'portrait';
  const pageW = convertToPx(isPortrait ? pageSize.width : pageSize.height, pageSize.unit);
  const pageH = convertToPx(isPortrait ? pageSize.height : pageSize.width, pageSize.unit);

  const photoW = convertToPx(photoSize.width, photoSize.unit);
  const photoH = convertToPx(photoSize.height, photoSize.unit);

  // Spacing and Margin in PX
  const spacingPx = convertToPx(spacing, 'mm');
  const marginPx = convertToPx(margin, 'mm');

  const availableW = pageW - (marginPx * 2);
  const availableH = pageH - (marginPx * 2);

  const labelHeightPx = (showDate || customText) ? convertToPx(5, 'mm') : 0;
  const slotW = photoW;
  const slotH = photoH + labelHeightPx;

  const cols = Math.floor((availableW + spacingPx) / (slotW + spacingPx));
  const rows = Math.floor((availableH + spacingPx) / (slotH + spacingPx));
  const totalSlots = cols * rows;

  // Flatten items into a single list of photos
  const photos = useMemo(() => {
    const list = [];
    let slotIndex = 0;
    
    // Add specific quantities from items
    for (const item of items) {
        for (let q = 0; q < item.quantity; q++) {
            if (slotIndex >= totalSlots) break;
            const r = Math.floor(slotIndex / cols);
            const c = slotIndex % cols;
            list.push({
                id: `${item.id}-${q}`,
                processedImage: item.processedImage,
                x: marginPx + c * (slotW + spacingPx),
                y: marginPx + r * (slotH + spacingPx)
            });
            slotIndex++;
        }
    }
    
    // Auto fill remaining if enabled
    if (autoFill && slotIndex < totalSlots && items.length > 0) {
        const lastItem = items[items.length - 1];
        while (slotIndex < totalSlots) {
            const r = Math.floor(slotIndex / cols);
            const c = slotIndex % cols;
            list.push({
                id: `fill-${slotIndex}`,
                processedImage: lastItem.processedImage,
                x: marginPx + c * (slotW + spacingPx),
                y: marginPx + r * (slotH + spacingPx)
            });
            slotIndex++;
        }
    }
    
    return list;
  }, [items, autoFill, totalSlots, cols, marginPx, slotW, slotH, spacingPx]);

  const actualQuantity = photos.length;

  // Adjust preview scaling to fit container
  useEffect(() => {
    const updateScale = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect();
        const padding = 64; // 2rem p-8 on each side
        const availableW = width - padding;
        const availableH = height - padding;
        
        const scaleX = availableW / pageW;
        const scaleY = availableH / pageH;
        setScale(Math.min(scaleX, scaleY, 1));
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [pageW, pageH, items]);

  return (
    <div ref={containerRef} className="flex-1 bg-slate-100 flex items-center justify-center p-4 lg:p-8 overflow-hidden relative group">
      {/* HUD Info */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-3 pointer-events-none w-full max-w-[200px] sm:max-w-none">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl px-4 py-4 shadow-xl shadow-slate-200/50 text-[11px] space-y-3"
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <p className="text-slate-900 font-black uppercase tracking-widest flex items-center gap-2">
              <Layout size={14} className="text-blue-600" /> Analysis
            </p>
            <span className="text-[10px] h-5 px-2 bg-blue-600 text-white rounded-full flex items-center font-bold">
              {actualQuantity} Units
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-x-4 gap-y-2">
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-tighter">Paper</p>
              <p className="text-slate-900 font-black truncate">{pageSize.name}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-tighter">Photo Size</p>
              <p className="text-slate-900 font-black">{photoSize.width}x{photoSize.height}{photoSize.unit}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-tighter">Grid</p>
              <p className="text-slate-900 font-black">{cols} × {rows}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase text-[9px] tracking-tighter">Efficiency</p>
              <p className="text-blue-600 font-black">
                {Math.round((actualQuantity / totalSlots) * 100)}%
              </p>
            </div>
          </div>
        </motion.div>

        <div className="flex gap-2">
          <div className="bg-slate-900 text-white rounded-xl px-3 py-1.5 shadow-lg text-[10px] font-black tracking-widest flex items-center gap-2 border border-slate-800">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              HI-RES 300DPI
          </div>
          <div className="hidden sm:flex bg-white/95 border border-slate-200 rounded-xl px-2 py-1.5 shadow-sm text-[10px] font-black text-slate-500 items-center gap-1">
            <Ruler size={10} /> 1:1 Scale
          </div>
        </div>
      </div>

      {/* Floating Zoom Controls - Mobile friendly */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-white/90 backdrop-blur border border-slate-200 rounded-3xl p-2 shadow-2xl z-20">
         <button 
           onClick={() => setScale(prev => Math.max(0.1, prev - 0.1))}
           className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-600 transition-colors"
         >
           <ZoomOut size={20}/>
         </button>
         <div className="w-px h-6 bg-slate-200 mx-1" />
         <div className="px-3 min-w-[60px] text-center">
            <span className="text-[11px] font-black text-slate-900">{Math.round(scale * 100)}%</span>
         </div>
         <div className="w-px h-6 bg-slate-200 mx-1" />
         <button 
           onClick={() => setScale(prev => Math.min(3, prev + 0.1))}
           className="p-2.5 hover:bg-slate-100 rounded-2xl text-slate-600 transition-colors"
         >
           <ZoomIn size={20}/>
         </button>
         <button 
           onClick={() => {
              if (containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                const padding = 64;
                const scaleX = (width - padding) / pageW;
                const scaleY = (height - padding) / pageH;
                setScale(Math.min(scaleX, scaleY, 1));
              }
           }} 
           className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-lg hover:bg-slate-800 transition-all hover:scale-110 active:scale-95"
         >
           <Maximize size={20}/>
         </button>
      </div>

      {/* Stage Container */}
      <div 
        className="relative shadow-2xl transition-transform duration-300 ease-out origin-center bg-white"
        style={{ 
          transform: `scale(${scale})`,
          width: pageW,
          height: pageH
        }}
        id="print-area"
      >
        <Stage width={pageW} height={pageH}>
          <Layer>
            {/* Sheet Background */}
            <Rect 
              width={pageW} 
              height={pageH} 
              fill="white" 
              listening={false}
            />

            {photos.map((p) => (
              <PhotoItem 
                key={p.id}
                processedImage={p.processedImage}
                x={p.x}
                y={p.y}
                width={photoW}
                height={photoH}
                backgroundColor={backgroundColor}
                borderColor={borderColor}
                borderWidth={borderWidth}
                showDate={showDate}
                customText={customText}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
