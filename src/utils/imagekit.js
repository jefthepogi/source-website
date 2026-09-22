const IK_ENDPOINT = import.meta.env.VITE_IMAGEKIT_URL_ENDPOINT;

export function getOptimizedImageUrl(path = null, { width = 600, height, quality = 80 } = {}) {
  if (!path) return 'https://placehold.co/600x600/191c1a/22c55e?text=No+Image';

  // If relative path is passed (/events/photo.jpg)
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${IK_ENDPOINT}${cleanPath}?tr=w-${width}${height ? `,h-${height}` : ''},q-${quality},f-auto`;
}