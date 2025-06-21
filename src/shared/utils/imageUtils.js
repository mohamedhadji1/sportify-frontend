// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
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
  }// Clean up the imagePath parameter - AGGRESSIVELY remove all protocol patterns
  let cleanImagePath = imagePath;
  
  console.log('DEBUG - Before cleanup:', { imagePath, cleanImagePath });
  
  // Step 1: Check if this is already a full URL and extract just the path
  if (cleanImagePath.includes('sportify-auth') || cleanImagePath.includes('.onrender.com')) {
    console.log('DEBUG - Detected full URL in imagePath, extracting path...');
    
    // Try to extract the /uploads/ path from anywhere in the string
    const uploadsMatch = cleanImagePath.match(/(\/uploads\/[^?\s]*)/);
    if (uploadsMatch) {
      cleanImagePath = uploadsMatch[1];
      console.log('DEBUG - Extracted uploads path:', cleanImagePath);
    } else {
      // Fallback: look for any path after a domain
      const pathMatch = cleanImagePath.match(/\.com([\/].*?)(?:\?|$)/);
      if (pathMatch && pathMatch[1]) {
        cleanImagePath = pathMatch[1];
        console.log('DEBUG - Extracted domain path:', cleanImagePath);
      }
    }
  }
  
  // Step 2: Fix the specific https// pattern (missing colon) EVERYWHERE in the string
  cleanImagePath = cleanImagePath.replace(/https\/\//g, '');
  console.log('DEBUG - After https// removal:', cleanImagePath);
  
  // Step 3: Remove all variations of malformed protocols at the beginning
  cleanImagePath = cleanImagePath
    .replace(/^https?:\/\/https?:\/\//g, '')    // Remove http(s)://http(s)://
    .replace(/^https?:\/\/https?\/\//g, '')     // Remove http(s)://http(s)//
    .replace(/^https?:\/\//g, '')               // Remove http(s)://
    .replace(/^\/\/+/g, '')                     // Remove leading //
    .replace(/^\/+/g, '/');                     // Normalize leading slashes
  
  console.log('DEBUG - After protocol removal:', cleanImagePath);
  
  // Step 4: Final cleanup - if it still contains domain patterns, try one more extraction
  if (cleanImagePath.includes('sportify-auth') || cleanImagePath.includes('.onrender.com') || cleanImagePath.includes('.com')) {
    console.log('DEBUG - Still contains domain, final extraction...');
    // Remove everything up to and including the domain
    cleanImagePath = cleanImagePath.replace(/^.*?\.com/, '');
    console.log('DEBUG - After domain removal:', cleanImagePath);
  }
  // Ensure the image path starts with /
  if (!cleanImagePath.startsWith('/')) {
    cleanImagePath = `/${cleanImagePath}`;
  }  
  console.log('DEBUG - Final cleanup result:', cleanImagePath);
  
  // Construct the final URL
  const finalUrl = `${baseUrl}${cleanImagePath}`;
  
  console.log('getImageUrl debug:', { 
    originalImagePath: imagePath,
    originalBaseUrl: process.env.REACT_APP_API_URL,
    cleanedBaseUrl: baseUrl, 
    cleanImagePath, 
    finalResult: finalUrl
  });
  
  // Final safety check - ensure the result is a proper HTTPS URL
  if (!finalUrl.startsWith('https://')) {
    console.warn('Final URL does not start with https://', finalUrl);
    return `https://sportify-auth-backend.onrender.com${cleanImagePath}`;
  }
  
  return finalUrl;
};
