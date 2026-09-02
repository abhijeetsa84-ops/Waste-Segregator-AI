/**
 * Convert a File object to a base64-encoded string (without the data URL prefix).
 * @param {File} file
 * @returns {Promise<{ base64: string, mimeType: string }>}
 */
export const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      // Strip "data:<mimeType>;base64," prefix
      const base64 = dataUrl.split(',')[1];
      resolve({ base64, mimeType: file.type || 'image/jpeg' });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Resize an image file to a maximum dimension while preserving aspect ratio.
 * Returns a base64 string of the resized image.
 * @param {File} file
 * @param {number} maxDimension - max width or height in pixels
 * @returns {Promise<{ base64: string, mimeType: string }>}
 */
export const resizeImage = (file, maxDimension = 1024) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      let { width, height } = img;
      if (width > maxDimension || height > maxDimension) {
        if (width > height) {
          height = Math.round((height * maxDimension) / width);
          width = maxDimension;
        } else {
          width = Math.round((width * maxDimension) / height);
          height = maxDimension;
        }
      }
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);
      const mimeType = 'image/jpeg';
      const base64 = canvas.toDataURL(mimeType, 0.85).split(',')[1];
      resolve({ base64, mimeType });
    };
    img.onerror = reject;
    img.src = url;
  });
};

/**
 * Create an object URL for previewing a file.
 * @param {File} file
 * @returns {string} object URL
 */
export const createPreviewUrl = (file) => URL.createObjectURL(file);
