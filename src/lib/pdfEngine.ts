import * as pdfjsLib from 'pdfjs-dist';

// Use a reliable worker source
const PDFJS_VERSION = '5.7.284';
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/build/pdf.worker.min.mjs`;

// Standard Aadhaar Card physical dimensions: 85.6mm x 54.0mm
// At 300 DPI, this is approximately 1011 x 638 pixels.
export const AADHAAR_CONFIG = {
  // Coordinates based on percentage of standard e-Aadhaar PDF
  crop: {
    front: { x: 0.045, y: 0.73, width: 0.435, height: 0.22 },
    back: { x: 0.525, y: 0.73, width: 0.435, height: 0.22 }
  },
  output: {
    width: 1011,
    height: 638,
    dpi: 300
  },
  filters: {
    brightness: 1.05,
    contrast: 1.10
  }
};

export interface AadhaarExtractResult {
  front: string | null;
  back: string | null;
  fullPage: string | null;
}

export async function processAadhaarPDF(file: File, password?: string): Promise<AadhaarExtractResult> {
  const arrayBuffer = await file.arrayBuffer();
  
  try {
    const loadingTask = pdfjsLib.getDocument({
      data: arrayBuffer,
      password: password,
      standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/standard_fonts/`,
      cMapUrl: `https://unpkg.com/pdfjs-dist@${PDFJS_VERSION}/cmaps/`,
      cMapPacked: true,
    });
    
    const pdf = await loadingTask.promise;
    const result: AadhaarExtractResult = { front: null, back: null, fullPage: null };
    
    // Aadhaar PDFs usually have 1 page with both front/back
    const page = await pdf.getPage(1);
    
    // Use high scale for extraction
    const viewport = page.getViewport({ scale: 6 }); 
    
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas context failed');
    
    canvas.height = viewport.height;
    canvas.width = viewport.width;
    
    await page.render({
      canvasContext: context,
      viewport: viewport,
      canvas: canvas
    } as any).promise;
    
    result.fullPage = canvas.toDataURL('image/jpeg', 0.8);

    // Extraction function
    const extractRegion = (region: { x: number, y: number, width: number, height: number }) => {
      const tempCanvas = document.createElement('canvas');
      const tempCtx = tempCanvas.getContext('2d');
      if (!tempCtx) return null;

      const targetW = AADHAAR_CONFIG.output.width;
      const targetH = AADHAAR_CONFIG.output.height;
      
      tempCanvas.width = targetW;
      tempCanvas.height = targetH;
      
      const srcX = canvas.width * region.x;
      const srcY = canvas.height * region.y;
      const srcW = canvas.width * region.width;
      const srcH = canvas.height * region.height;

      // Apply enhancements
      tempCtx.filter = `brightness(${AADHAAR_CONFIG.filters.brightness}) contrast(${AADHAAR_CONFIG.filters.contrast})`;
      
      tempCtx.drawImage(
        canvas, 
        srcX, srcY, srcW, srcH,
        0, 0, targetW, targetH
      );
      
      return tempCanvas.toDataURL('image/jpeg', 0.98);
    };

    // Use config for coordinates
    result.front = extractRegion(AADHAAR_CONFIG.crop.front);
    result.back = extractRegion(AADHAAR_CONFIG.crop.back);
    
    return result;
  } catch (error: any) {
    if (error.name === 'PasswordException' || (error.message && error.message.includes('Password'))) {
      throw new Error('WRONG_PASSWORD');
    }
    console.error('PDF Error:', error);
    throw new Error('This PDF could not be opened. Please check the file or password.');
  }
}

export async function addBorderToImage(base64: string, borderType: 'none' | 'thin' | 'thick'): Promise<string> {
  if (borderType === 'none') return base64;
  
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        resolve(base64);
        return;
      }
      
      const thickness = borderType === 'thin' ? 2 : 6;
      canvas.width = img.width + (thickness * 2);
      canvas.height = img.height + (thickness * 2);
      
      ctx.fillStyle = '#000000';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, thickness, thickness);
      
      resolve(canvas.toDataURL('image/jpeg', 0.95));
    };
    img.onerror = () => resolve(base64);
    img.src = base64;
  });
}
