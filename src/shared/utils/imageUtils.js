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
  
  // Fix double slashes in https URLs
  if (baseUrl.includes('https//')) {
    baseUrl = baseUrl.replace('https//', 'https://');
  }
    // Handle case where baseUrl might be missing protocol or using http://
  if (!baseUrl.startsWith('https://')) {
    // Remove any http:// and force https://
    baseUrl = baseUrl.replace(/^https?:\/\//, '');
    baseUrl = `https://${baseUrl}`;
  }
  
  // Special handling for the domain mismatch issue
  // If the domain is sportify-auth.onrender.com, change it to sportify-auth-backend.onrender.com
  if (baseUrl.includes('sportify-auth.onrender.com') && !baseUrl.includes('sportify-auth-backend.onrender.com')) {
    baseUrl = baseUrl.replace('sportify-auth.onrender.com', 'sportify-auth-backend.onrender.com');
  }
  
  // Ensure the image path starts with /
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  console.log('getImageUrl debug:', { baseUrl, imagePath, cleanImagePath, result: `${baseUrl}${cleanImagePath}` });
  
  return `${baseUrl}${cleanImagePath}`;
};
