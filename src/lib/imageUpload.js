import { supabase } from './supabase';

const BUCKET = 'medfolio-uploads';

/**
 * Uploads a data URL to Supabase Storage and returns the public URL.
 * @param {string} dataUrl  - e.g. "data:image/jpeg;base64,..."
 * @param {string} folder   - e.g. "prescriptions" | "lab-reports"
 */
export async function uploadImage(dataUrl, folder) {
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const ext = blob.type === 'image/png' ? 'png' : 'jpg';
  const path = `${folder}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: blob.type, upsert: false });

  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
