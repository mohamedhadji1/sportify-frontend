// Utility function to construct proper image URLs
export const getImageUrl = (imagePath) => {
  if (!imagePath) return null;
  
  // Get the base URL and clean it up
  let baseUrl = process.env.REACT_APP_API_URL || 'sportify-auth-backend.onrender.com/api';
    if (baseUrl.includes('sportify-auth.onrender.com') && !baseUrl.includes('sportify-auth-backend.onrender.com')) {
    baseUrl = baseUrl.replace('sportify-auth.onrender.com', 'sportify-auth-backend.onrender.com');
  }
  
  // Ensure the image path starts with /
  const cleanImagePath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
  
  console.log('getImageUrl debug:', { baseUrl, imagePath, cleanImagePath, result: `${baseUrl}${cleanImagePath}` });
  
  return `${baseUrl}${cleanImagePath}`;
};
