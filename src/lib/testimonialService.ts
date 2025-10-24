import { supabase } from './supabase';

export interface Testimonial {
  id: string;
  name: string;
  title: string;
  quote: string;
  linkedin_url: string | null;
  profile_image_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function getTestimonials(): Promise<Testimonial[]> {
  const { data, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching testimonials:', error);
    return [];
  }

  return data || [];
}

export async function createTestimonial(
  testimonial: Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>
): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .insert([testimonial])
    .select()
    .single();

  if (error) {
    console.error('Error creating testimonial:', error);
    return null;
  }

  return data;
}

export async function updateTestimonial(
  id: string,
  updates: Partial<Omit<Testimonial, 'id' | 'created_at' | 'updated_at'>>
): Promise<Testimonial | null> {
  const { data, error } = await supabase
    .from('testimonials')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating testimonial:', error);
    return null;
  }

  return data;
}

export async function deleteTestimonial(id: string, profileImageUrl?: string): Promise<boolean> {
  if (profileImageUrl) {
    const urlParts = profileImageUrl.split('/testimonial-images/');
    if (urlParts.length > 1) {
      const filePath = urlParts[1];
      await supabase.storage.from('testimonial-images').remove([filePath]);
    }
  }

  const { error } = await supabase
    .from('testimonials')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting testimonial:', error);
    return false;
  }

  return true;
}

export async function uploadTestimonialImage(file: File): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('testimonial-images')
    .upload(fileName, file, {
      cacheControl: '3600',
      upsert: false,
    });

  if (uploadError) {
    console.error('Error uploading testimonial image:', uploadError);
    return null;
  }

  const { data } = supabase.storage
    .from('testimonial-images')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

export async function deleteTestimonialImage(imageUrl: string): Promise<boolean> {
  const urlParts = imageUrl.split('/testimonial-images/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    const { error } = await supabase.storage
      .from('testimonial-images')
      .remove([filePath]);

    if (error) {
      console.error('Error deleting testimonial image:', error);
      return false;
    }
  }

  return true;
}
