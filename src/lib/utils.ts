export const DPI = 300;
export const MM_TO_INCH = 0.0393701;
export const INCH_TO_MM = 25.4;

export const mmToPx = (mm: number) => Math.round(mm * MM_TO_INCH * DPI);
export const inchToPx = (inch: number) => Math.round(inch * DPI);
export const pxToMm = (px: number) => (px / DPI) / MM_TO_INCH;

export const convertToPx = (value: number, unit: 'mm' | 'cm' | 'inch' | 'px') => {
  switch (unit) {
    case 'mm': return mmToPx(value);
    case 'cm': return mmToPx(value * 10);
    case 'inch': return inchToPx(value);
    case 'px': return value;
    default: return value;
  }
};

export const convertToMm = (value: number, unit: 'mm' | 'cm' | 'inch' | 'px') => {
  switch (unit) {
    case 'mm': return value;
    case 'cm': return value * 10;
    case 'inch': return value * INCH_TO_MM;
    case 'px': return pxToMm(value);
    default: return value;
  }
};
