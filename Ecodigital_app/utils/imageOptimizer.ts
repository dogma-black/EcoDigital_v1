/**
 * Optimizador de imágenes
 */

export class ImageOptimizer {
  private static canvas: HTMLCanvasElement | null = null;
  private static ctx: CanvasRenderingContext2D | null = null;
  
  static async optimizeImage(
    file: File,
    options: {
      maxWidth?: number;
      maxHeight?: number;
      quality?: number;
      format?: 'jpeg' | 'webp' | 'png';
    } = {}
  ): Promise<File> {
    const {
      maxWidth = 1920,
      maxHeight = 1080,
      quality = 0.8,
      format = 'jpeg'
    } = options;
    
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
        
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
        
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.ctx = this.canvas.getContext('2d');
        }
        
        this.canvas.width = width;
        this.canvas.height = height;
        
        this.ctx!.drawImage(img, 0, 0, width, height);
        
        this.canvas.toBlob(
          (blob) => {
            const optimizedFile = new File(
              [blob!],
              file.name.replace(/\.[^/.]+$/, `.${format}`),
              { type: `image/${format}` }
            );
            resolve(optimizedFile);
          },
          `image/${format}`,
          quality
        );
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
  
  static async generateThumbnail(
    file: File,
    size: number = 200
  ): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        if (!this.canvas) {
          this.canvas = document.createElement('canvas');
          this.ctx = this.canvas.getContext('2d');
        }
        
        this.canvas.width = size;
        this.canvas.height = size;
        
        const sourceSize = Math.min(img.width, img.height);
        const sourceX = (img.width - sourceSize) / 2;
        const sourceY = (img.height - sourceSize) / 2;
        
        this.ctx!.drawImage(
          img,
          sourceX, sourceY, sourceSize, sourceSize,
          0, 0, size, size
        );
        
        resolve(this.canvas.toDataURL('image/jpeg', 0.7));
      };
      
      img.src = URL.createObjectURL(file);
    });
  }
}