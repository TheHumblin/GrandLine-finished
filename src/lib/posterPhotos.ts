import { supabase } from '@/lib/supabase';

const TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const EXTENSIONS: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp', 'image/gif': 'gif' };

export async function uploadPosterPhoto(userId: string, image: Blob): Promise<string> {
  if (!TYPES.has(image.type)) throw new Error('Choose a JPG, PNG, WebP, or GIF image.');
  if (image.size > 5 * 1024 * 1024) throw new Error('Choose an image smaller than 5 MB.');
  const path = `${userId}/${crypto.randomUUID()}.${EXTENSIONS[image.type]}`;
  const { error } = await supabase.storage.from('poster-photos').upload(path, image, { contentType: image.type, cacheControl: '31536000', upsert: false });
  if (error) throw new Error(`Photo upload failed: ${error.message}`);
  return supabase.storage.from('poster-photos').getPublicUrl(path).data.publicUrl;
}

export async function migratePosterPhoto(userId: string, avatar?: string): Promise<string | undefined> {
  if (!avatar?.startsWith('data:image/')) return avatar;
  const response = await fetch(avatar);
  return uploadPosterPhoto(userId, await response.blob());
}
