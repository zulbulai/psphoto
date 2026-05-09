import { create } from 'zustand';

export type Unit = 'mm' | 'cm' | 'inch' | 'px';

export interface PhotoSize {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
}

export interface PageSize {
  id: string;
  name: string;
  width: number;
  height: number;
  unit: Unit;
}

export const PHOTO_PRESETS: PhotoSize[] = [
  { id: '35x45', name: '35x45 mm (Standard)', width: 35, height: 45, unit: 'mm' },
  { id: '2x2', name: '2x2 inch (US Passport)', width: 2, height: 2, unit: 'inch' },
  { id: '25x35', name: '25x35 mm', width: 25, height: 35, unit: 'mm' },
  { id: '30x40', name: '30x40 mm', width: 30, height: 40, unit: 'mm' },
  { id: '40x50', name: '40x50 mm', width: 40, height: 50, unit: 'mm' },
  { id: '45x45', name: '45x45 mm', width: 45, height: 45, unit: 'mm' },
  { id: '50x50', name: '50x50 mm', width: 50, height: 50, unit: 'mm' },
  { id: 'custom', name: 'Custom Size...', width: 35, height: 45, unit: 'mm' },
];

export const PAGE_PRESETS: PageSize[] = [
  { id: 'a4', name: 'A4', width: 210, height: 297, unit: 'mm' },
  { id: '4x6', name: '4x6 inch (102x152 mm)', width: 101.6, height: 152.4, unit: 'mm' },
  { id: '5x7', name: '5x7 inch (127x178 mm)', width: 127, height: 177.8, unit: 'mm' },
  { id: 'letter', name: 'Letter', width: 215.9, height: 279.4, unit: 'mm' },
  { id: 'custom', name: 'Custom Size...', width: 210, height: 297, unit: 'mm' },
];

export interface PrintItem {
  id: string;
  originalImage: string;
  processedImage: string;
  quantity: number;
}

interface AppState {
  // Items
  items: PrintItem[];
  
  // Settings
  photoSize: PhotoSize;
  pageSize: PageSize;
  orientation: 'portrait' | 'landscape';
  autoFill: boolean;
  
  // Styling
  backgroundColor: string;
  borderWidth: number;
  borderColor: string;
  spacing: number;
  margin: number;
  showDate: boolean;
  customText: string;
  
  // UI
  isCropping: boolean;
  activeItemId: string | null;
  cropX: number;
  cropY: number;
  cropScale: number;
  cropRotation: number;
  
  // Actions
  addItem: (image: string) => void;
  removeItem: (id: string) => void;
  clearAllItems: () => void;
  updateItemQuantity: (id: string, q: number) => void;
  updateItemImage: (id: string, processedImage: string) => void;
  setPhotoSize: (size: PhotoSize) => void;
  setPageSize: (size: PageSize) => void;
  setOrientation: (o: 'portrait' | 'landscape') => void;
  setAutoFill: (fill: boolean) => void;
  setBackgroundColor: (color: string) => void;
  setBorderWidth: (width: number) => void;
  setBorderColor: (color: string) => void;
  setSpacing: (s: number) => void;
  setMargin: (m: number) => void;
  setShowDate: (show: boolean) => void;
  setCustomText: (text: string) => void;
  setIsCropping: (cropping: boolean, itemId?: string) => void;
  setCropParams: (params: { x?: number, y?: number, scale?: number, rotation?: number }) => void;
}

export const useStore = create<AppState>((set) => ({
  items: [],
  photoSize: PHOTO_PRESETS[0],
  pageSize: PAGE_PRESETS[0],
  orientation: 'portrait',
  autoFill: true,
  backgroundColor: '#ffffff',
  borderWidth: 1,
  borderColor: '#000000',
  spacing: 5,
  margin: 10,
  showDate: false,
  customText: '',
  isCropping: false,
  activeItemId: null,
  cropX: 0,
  cropY: 0,
  cropScale: 1,
  cropRotation: 0,

  addItem: (image) => set((state) => ({
    items: [...state.items, {
      id: Math.random().toString(36).substr(2, 9),
      originalImage: image,
      processedImage: image,
      quantity: 1
    }]
  })),
  removeItem: (id) => set((state) => ({
    items: state.items.filter(i => i.id !== id)
  })),
  clearAllItems: () => set({ items: [] }),
  updateItemQuantity: (id, quantity) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, quantity: Math.max(0, quantity) } : i)
  })),
  updateItemImage: (id, processedImage) => set((state) => ({
    items: state.items.map(i => i.id === id ? { ...i, processedImage } : i)
  })),
  setPhotoSize: (photoSize) => set({ photoSize }),
  setPageSize: (pageSize) => set({ pageSize }),
  setOrientation: (orientation) => set({ orientation }),
  setAutoFill: (autoFill) => set({ autoFill }),
  setBackgroundColor: (backgroundColor) => set({ backgroundColor }),
  setBorderWidth: (borderWidth) => set({ borderWidth }),
  setBorderColor: (borderColor) => set({ borderColor }),
  setSpacing: (spacing) => set({ spacing }),
  setMargin: (margin) => set({ margin }),
  setShowDate: (showDate) => set({ showDate }),
  setCustomText: (customText) => set({ customText }),
  setIsCropping: (isCropping, itemId = null) => set({ 
    isCropping, 
    activeItemId: itemId,
    cropX: 0, cropY: 0, cropScale: 1, cropRotation: 0
  }),
  setCropParams: (params) => set((state) => ({ 
    cropX: params.x ?? state.cropX,
    cropY: params.y ?? state.cropY,
    cropScale: params.scale ?? state.cropScale,
    cropRotation: params.rotation ?? state.cropRotation
  })),
}));
