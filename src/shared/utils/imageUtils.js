// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  console.log('🔍 getImageUrl called with:', imagePath);
  
  // Get the base URL and clean it up
  let baseUrl = process.env.REACT_APP_API_URL || 'https://sportify-auth-backend.onrender.com/api';
  
  // Remove /api suffix if present
  baseUrl = baseUrl.replace(/\/api$/, '');
  
  // Comprehensive URL cleanup - fix all malformed patterns in baseUrl
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
  
  console.log('🔧 Cleaned baseUrl:', baseUrl);  // Clean up the imagePath parameter - AGGRESSIVELY remove all protocol patterns
  let cleanImagePath = imagePath;
  
  console.log('🧹 Before cleanup:', { originalImagePath: imagePath, cleanImagePath });
  
  // AGGRESSIVE APPROACH: If it contains any URL patterns, extract just the path
  if (cleanImagePath.includes('://') || cleanImagePath.includes('//') || cleanImagePath.includes('.onrender.com') || cleanImagePath.includes('sportify-auth')) {
    console.log('🚨 DETECTED malformed URL pattern in imagePath!');
    
    // First, try to extract /uploads/ path pattern
    const uploadsMatch = cleanImagePath.match(/(\/uploads\/[^?\s\n]*)/);
    if (uploadsMatch) {
      cleanImagePath = uploadsMatch[1];
      console.log('✅ Extracted via uploads pattern:', cleanImagePath);
    } else {
      // Try to extract any path after .com
      const pathMatch = cleanImagePath.match(/\.com([\/].*?)(?:\?|$|$)/);
      if (pathMatch && pathMatch[1]) {
        cleanImagePath = pathMatch[1];
        console.log('✅ Extracted via .com pattern:', cleanImagePath);
      } else {
        // Last resort: remove everything before the first /
        const slashIndex = cleanImagePath.lastIndexOf('/');
        if (slashIndex > 0) {
          cleanImagePath = cleanImagePath.substring(slashIndex);
          console.log('✅ Extracted via last slash:', cleanImagePath);
        }
      }
    }
  }
  
  // Remove any remaining protocol fragments
  cleanImagePath = cleanImagePath
    .replace(/^https?:\/\/.*?\//, '/')  // Remove full protocol+domain
    .replace(/^https?\/\/.*?\//, '/')   // Remove malformed protocol+domain
    .replace(/https?\/\//g, '')        // Remove any remaining https// patterns
    .replace(/^\/+/, '/');             // Normalize multiple leading slashes
  
  console.log('🔧 After aggressive cleanup:', cleanImagePath);  // Ensure the image path starts with /
  if (!cleanImagePath.startsWith('/')) {
    cleanImagePath = `/${cleanImagePath}`;
  }
  
  console.log('🔧 Final cleanup result:', cleanImagePath);
  
  // Construct the final URL
  const finalUrl = `${baseUrl}${cleanImagePath}`;
  
  console.log('🎯 FINAL RESULT:', { 
    originalImagePath: imagePath,
    cleanedBaseUrl: baseUrl, 
    cleanImagePath, 
    finalUrl: finalUrl
  });
  
  // Final safety check - ensure the result is a proper HTTPS URL
  if (!finalUrl.startsWith('https://')) {
    console.error('🚨 ERROR: Final URL does not start with https://', finalUrl);
    const safeUrl = `https://sportify-auth-backend.onrender.com${cleanImagePath}`;
    console.log('🛡️ FALLBACK URL:', safeUrl);
    return safeUrl;
  }
  
  // Double-check that we don't have any malformed patterns in the final URL
  if (finalUrl.includes('https//') || finalUrl.includes('http//')) {
    console.error('🚨 ERROR: Final URL still contains malformed patterns!', finalUrl);
    const fixedUrl = finalUrl.replace(/https?\/\//g, 'https://');
    console.log('🔧 FIXED URL:', fixedUrl);
    return fixedUrl;
  }
  
  return finalUrl;
};
