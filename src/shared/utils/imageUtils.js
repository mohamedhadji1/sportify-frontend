// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Get the base URL and clean it up
  let baseUrl = process.env.REACT_APP_API_URL || 'https://sportify-auth-backend.onrender.com/api';
  
  // Remove /api suffix if present
  baseUrl = baseUrl.replace(/\/api$/, '');
  
  // Fix malformed URLs (http://https:// pattern)
  if (baseUrl.includes('http://https://')) {
    baseUrl = baseUrl.replace('http://https://', 'https://');
  }
  
  // Fix double slashes
  if (baseUrl.includes('https//')) {
    baseUrl = baseUrl.replace('https//', 'https://');
  }
  
  // Ensure the image path starts with /
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  return `${baseUrl}${cleanImagePath}`;
};
