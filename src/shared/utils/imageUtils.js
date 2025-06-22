// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // EMERGENCY FIX: If the input already contains the exact error pattern, fix it immediately
  let inputPath = String(imagePath);
  if (inputPath.includes('http://https//')) {
    inputPath = inputPath.replace(/http:\/\/https\/\//g, 'https://');
  }
  
  // IMMEDIATE FIX for the exact error pattern we're seeing
  if (inputPath.includes('https//sportify-auth.onrender.com')) {
    inputPath = inputPath.replace(/https\/\/sportify-auth\.onrender\.com/g, '');
  }
  
  imagePath = inputPath;
    // ULTRA-AGGRESSIVE FIX: Remove ALL malformed protocol patterns IMMEDIATELY
  let cleanedPath = String(imagePath);
  
  // Store original for comparison
  const originalPath = cleanedPath;
  
  // Remove https// patterns EVERYWHERE in the string (not just at start)
  while (cleanedPath.includes('https//')) {
    cleanedPath = cleanedPath.replace(/https\/\//g, '');
  }
  
  // Remove http// patterns EVERYWHERE in the string  
  while (cleanedPath.includes('http//')) {
    cleanedPath = cleanedPath.replace(/http\/\//g, '');
  }
  
  // Remove any other malformed protocol patterns - ULTRA AGGRESSIVE
  cleanedPath = cleanedPath
    .replace(/https:\/\/https:\/\//g, '')
    .replace(/https:\/\/https\/\//g, '')
    .replace(/http:\/\/https:\/\//g, '')
    .replace(/http:\/\/https\/\//g, '')
    .replace(/https:\/\/http:\/\//g, '')
    .replace(/https:\/\/http\/\//g, '')    .replace(/http:\/\/http:\/\//g, '')
    .replace(/http:\/\/http\/\//g, '');
  
  imagePath = cleanedPath;
  
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
  if (baseUrl.includes('sportify-auth.onrender.com') && !baseUrl.includes('sportify-auth-backend.onrender.com')) {    baseUrl = baseUrl.replace('sportify-auth.onrender.com', 'sportify-auth-backend.onrender.com');
  }
  
  // Clean up the imagePath parameter - AGGRESSIVELY remove all protocol patterns
  let cleanImagePath = imagePath;  // AGGRESSIVE APPROACH: If it contains any URL patterns, extract just the path
  if (cleanImagePath.includes('://') || cleanImagePath.includes('//') || cleanImagePath.includes('.onrender.com') || cleanImagePath.includes('sportify-auth')) {
    
    // SPECIFIC FIX for the exact error pattern: https//sportify-auth.onrender.com/uploads/...
    if (cleanImagePath.includes('https//sportify-auth.onrender.com')) {
      cleanImagePath = cleanImagePath.replace(/https\/\/sportify-auth\.onrender\.com/g, '');
    }
    
    // CRITICAL: Remove ALL malformed protocol patterns AGAIN before processing
    cleanImagePath = cleanImagePath
      .replace(/https\/\//g, '')
      .replace(/http\/\//g, '')
      .replace(/https:\/\/https:\/\//g, '')
      .replace(/https:\/\/https\/\//g, '')
      .replace(/http:\/\/https:\/\//g, '')
      .replace(/http:\/\/https\/\//g, '');
    
    console.log('🔥 After aggressive protocol cleanup:', cleanImagePath);
      // First, try to extract /uploads/ path pattern
    const uploadsMatch = cleanImagePath.match(/(\/uploads\/[^?\s\n]*)/);
    if (uploadsMatch) {
      cleanImagePath = uploadsMatch[1];
    } else {      // Try to extract any path after .com
      const pathMatch = cleanImagePath.match(/\.com([/].*?)(?:\?|$|$)/);
      if (pathMatch && pathMatch[1]) {
        cleanImagePath = pathMatch[1];
      } else {
        // Last resort: remove everything before the first /
        const slashIndex = cleanImagePath.lastIndexOf('/');
        if (slashIndex > 0) {
          cleanImagePath = cleanImagePath.substring(slashIndex);
        }
      }
    }
  }
  
  // Remove any remaining protocol fragments
  cleanImagePath = cleanImagePath
    .replace(/^https?:\/\/.*?\//, '/')  // Remove full protocol+domain
    .replace(/^https?\/\/.*?\//, '/')   // Remove malformed protocol+domain
    .replace(/https?\/\//g, '')        // Remove any remaining https// patterns    .replace(/^\/+/, '/');             // Normalize multiple leading slashes
  
  // Ensure the image path starts with /
  if (!cleanImagePath.startsWith('/')) {
    cleanImagePath = `/${cleanImagePath}`;
  }
    // Construct the final URL
  const finalUrl = `${baseUrl}${cleanImagePath}`;
  
  // Final safety check - ensure the result is a proper HTTPS URL
  if (!finalUrl.startsWith('https://')) {
    const safeUrl = `https://sportify-auth-backend.onrender.com${cleanImagePath}`;
    return safeUrl;
  }
  
  // Double-check that we don't have any malformed patterns in the final URL
  if (finalUrl.includes('https//') || finalUrl.includes('http//') || finalUrl.includes('://://') || finalUrl.includes('https://https//')) {
    let fixedUrl = finalUrl
      .replace(/https\/\//g, 'https://')
      .replace(/http\/\//g, 'https://')
      .replace(/https:\/\/https:\/\//g, 'https://')
      .replace(/https:\/\/https\/\//g, 'https://')
      .replace(/http:\/\/https:\/\//g, 'https://')
      .replace(/http:\/\/https\/\//g, 'https://')
      .replace(/https:\/\/https\/\//g, 'https://')
      .replace(/:\/\/:\/\//g, '://');
    return fixedUrl;
  }
  
  // FINAL EMERGENCY CHECK: Look for the exact error pattern we're getting
  if (finalUrl.includes('https://https//')) {
    const emergencyFix = finalUrl.replace(/https:\/\/https\/\//g, 'https://');
    return emergencyFix;
  }
  
  return finalUrl;
};
