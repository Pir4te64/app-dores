import { SUPABASE_URL } from './config';

export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) return '';

  // URL completa: retornar tal cual
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }

  // Ruta local del dashboard (e.g. /category-01.png): no aplica en mobile
  if (imagePath.startsWith('/')) {
    return `${SUPABASE_URL}/storage/v1/object/public${imagePath}`;
  }

  // Storage path relativo (e.g. product-images/abc123.jpg)
  return `${SUPABASE_URL}/storage/v1/object/public/${imagePath}`;
}
