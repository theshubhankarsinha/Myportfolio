import { supabase } from './supabase';

export interface HeroFeaturedProject {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  mvp_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export async function getActiveFeaturedProjects(): Promise<HeroFeaturedProject[]> {
  const { data, error } = await supabase
    .from('hero_featured_projects')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching active featured projects:', error);
    return [];
  }

  return data || [];
}

export async function getAllFeaturedProjects(): Promise<HeroFeaturedProject[]> {
  const { data, error } = await supabase
    .from('hero_featured_projects')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching all featured projects:', error);
    return [];
  }

  return data || [];
}

export async function createFeaturedProject(
  project: Omit<HeroFeaturedProject, 'id' | 'created_at' | 'updated_at'>
): Promise<HeroFeaturedProject | null> {
  const { data, error } = await supabase
    .from('hero_featured_projects')
    .insert([project])
    .select()
    .single();

  if (error) {
    console.error('Error creating featured project:', error);
    return null;
  }

  return data;
}

export async function updateFeaturedProject(
  id: string,
  updates: Partial<HeroFeaturedProject>
): Promise<HeroFeaturedProject | null> {
  const { data, error } = await supabase
    .from('hero_featured_projects')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating featured project:', error);
    return null;
  }

  return data;
}

export async function deleteFeaturedProject(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('hero_featured_projects')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting featured project:', error);
    return false;
  }

  return true;
}

export async function uploadHeroImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from('hero-images')
    .upload(filePath, file);

  if (uploadError) {
    console.error('Error uploading hero image:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('hero-images')
    .getPublicUrl(filePath);

  return data.publicUrl;
}

export async function deleteHeroImage(imageUrl: string): Promise<boolean> {
  try {
    const urlParts = imageUrl.split('/hero-images/');
    if (urlParts.length < 2) return false;

    const filePath = urlParts[1];

    const { error } = await supabase.storage
      .from('hero-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting hero image:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error parsing image URL:', error);
    return false;
  }
}
