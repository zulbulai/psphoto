import React, { useRef, useMemo, useEffect, useState } from 'react';
import { Stage, Layer, Rect, Image as KonvaImage, Group } from 'react-konva';
import useImage from 'use-image';
import { useStore } from '../store/useStore';
import { convertToPx, MM_TO_INCH, DPI } from '../lib/utils';
import { Layout } from 'lucide-react';

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
    margin
  } = useStore();

  // Create an array of image hooks for each item
  const itemImages = items.map(item => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [img] = useImage(item.processedImage);
    return { id: item.id, img };
  });

  // Page dimensions in PX (300 DPI)
  const isPortrait = orientation === 'portrait';
  const pageW = convertToPx(isPortrait ? pageSize.width : pageSize.height, pageSize.unit);
  const pageH = convertToPx(isPortrait ? pageSize.height : pageSize.width, pageSize.unit);

  // Photo dimensions in PX
  const photoW = convertToPx(photoSize.width, photoSize.unit);
  const photoH = convertToPx(photoSize.height, photoSize.unit);

  // Spacing and Margin in PX
  const spacingPx = convertToPx(spacing, 'mm');
  const marginPx = convertToPx(margin, 'mm');

  // Calculate grid
  const availableW = pageW - (marginPx * 2);
  const availableH = pageH - (marginPx * 2);

  const cols = Math.floor((availableW + spacingPx) / (photoW + spacingPx));
  const rows = Math.floor((availableH + spacingPx) / (photoH + spacingPx));
  const totalSlots = cols * rows;

  // Flatten items into a single list of photos
  const photos = useMemo(() => {
    const list = [];
    let slotIndex = 0;
    
    for (const item of items) {
        for (let q = 0; q < item.quantity; q++) {
            if (slotIndex >= totalSlots) break;
            const r = Math.floor(slotIndex / cols);
            const c = slotIndex % cols;
            list.push({
                itemId: item.id,
                x: marginPx + c * (photoW + spacingPx),
                y: marginPx + r * (photoH + spacingPx)
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
                itemId: lastItem.id,
                x: marginPx + c * (photoW + spacingPx),
                y: marginPx + r * (photoH + spacingPx)
            });
            slotIndex++;
        }
    }
    
    return list;
  }, [items, autoFill, totalSlots, cols, marginPx, photoW, photoH, spacingPx]);

  const actualQuantity = photos.length;

  // Adjust preview scaling to fit container
  useEffect(() => {
    const updateScale = () => {
      if (!containerRef.current) return;
      const { clientWidth, clientHeight } = containerRef.current;
      const padding = 40;
      const scaleX = (clientWidth - padding) / pageW;
      const scaleY = (clientHeight - padding) / pageH;
      setScale(Math.min(scaleX, scaleY, 1));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, [pageW, pageH]);

  return (
    <div ref={containerRef} className="flex-1 bg-slate-100 flex items-center justify-center p-8 overflow-hidden relative group">
      {/* HUD Info */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 pointer-events-none">
        <div className="bg-white/95 backdrop-blur border border-slate-200 rounded-xl px-4 py-3 shadow-xl text-[11px] space-y-2 min-w-[180px]">
          <p className="text-blue-600 font-bold uppercase tracking-widest border-b border-blue-100 pb-1.5 flex justify-between">
            Sheet Analysis <Layout size={12} className="inline ml-2" />
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            <div>
              <p className="text-slate-400 font-medium">Page Size</p>
              <p className="text-slate-900 font-semibold">{pageSize.name}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Photo Size</p>
              <p className="text-slate-900 font-semibold">{photoSize.width}x{photoSize.height}{photoSize.unit}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Layout</p>
              <p className="text-slate-900 font-semibold">{cols} × {rows}</p>
            </div>
            <div>
              <p className="text-slate-400 font-medium">Utility</p>
              <p className="text-slate-900 font-semibold text-blue-600">
                {Math.round((actualQuantity / totalSlots) * 100)}%
              </p>
            </div>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="text-slate-500 font-bold">Total Photos</span>
            <span className="text-lg font-black text-slate-900">{actualQuantity}</span>
          </div>
        </div>

        <div className="bg-slate-900 text-white rounded-lg px-3 py-1.5 shadow-lg text-[10px] font-mono flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            300 DPI High-Precision Output
        </div>
      </div>

      {/* Main Print Stage (Print Area) */}
      <div 
        id="print-area"
        style={{ 
          width: pageW, 
          height: pageH, 
          transform: `scale(${scale})`, 
          transformOrigin: 'center center',
          boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.15)',
          backgroundColor: 'white',
          position: 'relative'
        }}
        className="transition-transform duration-300 ease-out"
      >
        <Stage width={pageW} height={pageH}>
          <Layer>
            {/* Background for whole page */}
            <Rect x={0} y={0} width={pageW} height={pageH} fill="#ffffff" />
            
            {/* Printable margins indicator (only visible on screen) */}
            <Rect 
              x={marginPx} 
              y={marginPx} 
              width={availableW} 
              height={availableH} 
              stroke="#e2e8f0" 
              strokeWidth={1} 
              dash={[10, 10]}
              listening={false}
            />

            {photos.map((p, i) => (
              <Group key={i} x={p.x} y={p.y}>
                {/* Photo Background Color */}
                <Rect 
                  width={photoW} 
                  height={photoH} 
                  fill={backgroundColor} 
                />
                
                {/* Photo Image */}
                {itemImages.find(img => img.id === p.itemId)?.img && (
                  <KonvaImage 
                    image={itemImages.find(img => img.id === p.itemId)!.img!} 
                    width={photoW} 
                    height={photoH} 
                    listening={false}
                  />
                )}

                {/* Border */}
                {borderWidth > 0 && (
                  <Rect 
                    width={photoW} 
                    height={photoH} 
                    stroke={borderColor} 
                    strokeWidth={borderWidth} 
                    listening={false}
                  />
                )}
              </Group>
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};
