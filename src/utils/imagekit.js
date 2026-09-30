import { supabase } from "../lib/supabase";

//Get the ImageKit URL endpoint from the environment variables
const IK_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export async function deleteImageFromImageKit(fileId) {
  if (!fileId) return true;

  const { error } = await supabase.functions.invoke('delete-image', {
    body: { fileId }
  });

  if (error) {
    console.error('Failed to delete image from ImageKit:', error);
    return false;
  }

  return true;
}


export function getOptimizedImageUrl(path = null, { width = 600, height, quality = 80 } = {}) {
  if (!path) return 'https://placehold.co/600x600/191c1a/22c55e?text=No+Image';

  // If full URL is already passed from Supabase
  if (path.startsWith('http')) {
    const transformParam = `?tr=w-${width}${height ? `,h-${height}` : ''},q-${quality},f-auto`;
    return `${path}${transformParam}`;
  }
  
  // If relative path is passed (/events/photo.jpg)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${IK_ENDPOINT}${cleanPath}?tr=w-${width}${height ? `,h-${height}` : ''},q-${quality},f-auto`;
}