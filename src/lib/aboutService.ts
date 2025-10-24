import { supabase } from './supabase';

export interface AboutSection {
  id: string;
  photo_url: string | null;
  resume_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface GalleryImage {
  id: string;
  image_url: string;
  display_order: number;
  created_at: string;
}

export async function getAboutSection(): Promise<AboutSection | null> {
  const { data, error } = await supabase
    .from('about_section')
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Error fetching about section:', error);
    return null;
  }

  console.log('Fetched about section data:', data);
  return data;
}

export async function uploadProfilePhoto(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `profile-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading photo:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function uploadResume(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `resume-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('resumes')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading resume:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('resumes')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function updateAboutSection(photoUrl?: string, resumeUrl?: string): Promise<boolean> {
  const existing = await getAboutSection();

  const updateData: Partial<AboutSection> = {
    updated_at: new Date().toISOString(),
  };

  if (photoUrl !== undefined) {
    updateData.photo_url = photoUrl;
  }

  if (resumeUrl !== undefined) {
    updateData.resume_url = resumeUrl;
  }

  if (existing) {
    const { error } = await supabase
      .from('about_section')
      .update(updateData)
      .eq('id', existing.id);

    if (error) {
      console.error('Error updating about section:', error);
      return false;
    }
  } else {
    const { error } = await supabase
      .from('about_section')
      .insert({
        photo_url: photoUrl || null,
        resume_url: resumeUrl || null,
      });

    if (error) {
      console.error('Error creating about section:', error);
      return false;
    }
  }

  return true;
}

export async function getGalleryImages(): Promise<GalleryImage[]> {
  const { data, error } = await supabase
    .from('gallery_images')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching gallery images:', error);
    return [];
  }

  return data || [];
}

export async function uploadGalleryImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `gallery-${Date.now()}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('profile-photos')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading gallery image:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('profile-photos')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function addGalleryImage(imageUrl: string, displayOrder: number): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_images')
    .insert({
      image_url: imageUrl,
      display_order: displayOrder,
    });

  if (error) {
    console.error('Error adding gallery image:', error);
    return false;
  }

  return true;
}

export async function deleteGalleryImage(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_images')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting gallery image:', error);
    return false;
  }

  return true;
}

export async function updateGalleryImageOrder(id: string, displayOrder: number): Promise<boolean> {
  const { error } = await supabase
    .from('gallery_images')
    .update({ display_order: displayOrder })
    .eq('id', id);

  if (error) {
    console.error('Error updating gallery image order:', error);
    return false;
  }

  return true;
}
