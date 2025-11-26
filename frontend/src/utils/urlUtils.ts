import { API_BASE_URL } from "../services/api";

export const toAbsoluteUrl = (url?: string): string | undefined => {
  if (!url) return undefined;
  
  // If it's already an absolute URL (http/https), handle example.com case
  if (/^https?:\/\//i.test(url)) {
    // Replace example.com with localhost for development
    if (url.includes('example.com')) {
      return url.replace('https://example.com', 'http://localhost:5126');
    }
    return url;
  }
  
  // Remove any leading slashes for consistency
  const cleanUrl = url.replace(/^\/+/, '');
  
  // For development, always use localhost:5126 as the base URL
  const baseUrl = 'http://localhost:5126';
  
  // Handle specific image files (image1.png, image2.png, etc.)
  if (/^image\d+\.(png|jpg|jpeg|gif)$/i.test(cleanUrl)) {
    return `${baseUrl}/images/${cleanUrl}`;
  }
  
  // If it's a path that starts with 'images/' or 'uploads/', use it as is
  if (cleanUrl.startsWith('images/') || cleanUrl.startsWith('uploads/')) {
    return `${baseUrl}/${cleanUrl}`;
  }
  
  // If it's just a filename with an extension, assume it's in the images directory
  if (!cleanUrl.includes('/') && /\.[a-z0-9]+$/i.test(cleanUrl)) {
    return `${baseUrl}/images/${cleanUrl}`;
  }
  
  // For any other case, assume it's a relative path from the root
  return `${baseUrl}/${cleanUrl}`;
};

// Helper to extract filename from URL
export const getFilenameFromUrl = (url?: string): string => {
  if (!url) return '';
  return url.split('/').pop() || '';
};
