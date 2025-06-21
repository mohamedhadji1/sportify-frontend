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
    // Clean up the imagePath parameter - AGGRESSIVELY remove all protocol patterns
  let cleanImagePath = imagePath;
  
  // Step 1: Fix the specific https// pattern (missing colon) EVERYWHERE in the string
  cleanImagePath = cleanImagePath.replace(/https\/\//g, '');
  
  // Step 2: Remove all variations of malformed protocols at the beginning
  cleanImagePath = cleanImagePath
    .replace(/^https?:\/\/https?:\/\//g, '')    // Remove http(s)://http(s)://
    .replace(/^https?:\/\/https?\/\//g, '')     // Remove http(s)://http(s)//
    .replace(/^https?:\/\//g, '')               // Remove http(s)://
    .replace(/^\/\/+/g, '')                     // Remove leading //
    .replace(/^\/+/g, '/');                     // Normalize leading slashes
  
  // Step 3: If it still contains any domain patterns, extract just the path part
  if (cleanImagePath.includes('sportify-auth') || cleanImagePath.includes('.onrender.com') || cleanImagePath.includes('.com')) {
    // Try to extract the path after the domain
    const pathMatch = cleanImagePath.match(/(?:sportify-auth[^\/]*\.onrender\.com|[^\/]*\.com)(.*)$/);
    if (pathMatch && pathMatch[1]) {
      cleanImagePath = pathMatch[1];
    } else {
      // Fallback: if it contains a domain but no clear path, look for /uploads/ pattern
      const uploadsMatch = cleanImagePath.match(/(\/uploads\/.*)$/);
      if (uploadsMatch) {
        cleanImagePath = uploadsMatch[1];
      }
    }
  }
  
  // Ensure the image path starts with /
  if (!cleanImagePath.startsWith('/')) {
    cleanImagePath = `/${cleanImagePath}`;
  }
  console.log('getImageUrl debug:', { 
    originalImagePath: imagePath,
    originalBaseUrl: process.env.REACT_APP_API_URL,
    cleanedBaseUrl: baseUrl, 
    cleanImagePath, 
    finalResult: `${baseUrl}${cleanImagePath}` 
  });
  
  return `${baseUrl}${cleanImagePath}`;
};
