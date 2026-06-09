export interface OptimizedImage {
  dataUrl: string;
  width: number;
  height: number;
  originalBytes: number;
  optimizedBytes: number;
  saved: number; // 0..1 fraction saved
}

/**
 * Client-side image optimization: downscale to a sane max dimension and
 * re-encode (JPEG) at a target quality. Turns a heavy / "pourrie" upload into
 * a fast, web-ready image — no backend needed.
 */
export function optimizeImage(
  file: File,
  { maxDim = 1400, quality = 0.82 }: { maxDim?: number; quality?: number } = {}
): Promise<OptimizedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Le fichier n\'est pas une image.'));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      const scale = Math.min(1, maxDim / Math.max(width, height));
      width = Math.round(width * scale);
      height = Math.round(height * scale);

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Canvas non disponible.'));
        return;
      }
      // white backdrop so transparent PNGs don't turn black as JPEG
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, width, height);

      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      const optimizedBytes = Math.round((dataUrl.length - 'data:image/jpeg;base64,'.length) * 0.75);
      resolve({
        dataUrl,
        width,
        height,
        originalBytes: file.size,
        optimizedBytes,
        saved: file.size > 0 ? Math.max(0, 1 - optimizedBytes / file.size) : 0,
      });
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Image illisible ou corrompue.'));
    };
    img.src = url;
  });
}

export function formatBytes(b: number): string {
  if (b < 1024) return `${b} o`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(0)} Ko`;
  return `${(b / (1024 * 1024)).toFixed(1)} Mo`;
}
