// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Get the base URL and clean it up
  let baseUrl = process.env.REACT_APP_API_URL || 'https://sportify-auth-backend.onrender.com/api';
  
  // Remove /api suffix if present
  baseUrl = baseUrl.replace(/\/api$/, '');
  
  // Comprehensive URL cleanup - fix all malformed patterns
  baseUrl = baseUrl
    .replace(/https:\/\/https:\/\//g, 'https://')  // Fix https://https://
    .replace(/https:\/\/https\/\//g, 'https://')   // Fix https://https//
    .replace(/http:\/\/https:\/\//g, 'https://')   // Fix http://https://
    .replace(/https\/\//g, 'https://')             // Fix https//
    .replace(/https:\/\/+/g, 'https://');          // Fix multiple slashes after https:  
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
  
  // Clean up the imagePath parameter as well - it might contain malformed URLs
  let cleanImagePath = imagePath;
  
  // If imagePath already contains a full URL, extract just the path part
  if (cleanImagePath.includes('://')) {
    // Clean up malformed protocols in imagePath
    cleanImagePath = cleanImagePath
      .replace(/https:\/\/https:\/\//g, 'https://')  // Fix https://https://
      .replace(/https:\/\/https\/\//g, 'https://')   // Fix https://https//
      .replace(/http:\/\/https:\/\//g, 'https://')   // Fix http://https://
      .replace(/https\/\//g, 'https://')             // Fix https//
      .replace(/https:\/\/+/g, 'https://');          // Fix multiple slashes after https:
    
    // Extract just the path part after the domain
    try {
      const url = new URL(cleanImagePath);
      cleanImagePath = url.pathname;
    } catch (e) {
      // If URL parsing fails, try to extract path manually
      const pathMatch = cleanImagePath.match(/https?:\/\/[^\/]+(.*)$/);
      if (pathMatch) {
        cleanImagePath = pathMatch[1];
      }
    }
  }
  
  // Ensure the image path starts with /
  cleanImagePath = cleanImagePath.startsWith('/') ? cleanImagePath : `/${cleanImagePath}`;  
  console.log('getImageUrl debug:', { 
    originalImagePath: imagePath,
    originalBaseUrl: process.env.REACT_APP_API_URL,
    cleanedBaseUrl: baseUrl, 
    cleanImagePath, 
    finalResult: `${baseUrl}${cleanImagePath}` 
  });
  
  return `${baseUrl}${cleanImagePath}`;
};
