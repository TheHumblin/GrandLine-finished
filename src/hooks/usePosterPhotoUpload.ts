import { useState } from 'react';
import type { ChangeEvent } from 'react';
import { uploadPosterPhoto } from '@/lib/posterPhotos';
import { syncProgressFromSupabase } from '@/lib/progressSync';
import { toast } from 'sonner';

interface PosterPhotoUploadOptions {
  userId?: string;
  onUploaded: (avatar: string) => void;
}
export function usePosterPhotoUpload({ userId, onUploaded }: PosterPhotoUploadOptions) {
  const [uploading, setUploading] = useState(false);
  const upload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file || !userId || uploading) return;
    setUploading(true);
    try {
      const avatar = await uploadPosterPhoto(userId, file);
      onUploaded(avatar);
      const synced = await syncProgressFromSupabase(userId);
      if (synced) toast.success('Poster photo synced to your profile and Bounty Board.');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Photo upload failed. Please retry.');
    } finally { setUploading(false); }
  };
  return { uploading, upload };
}
