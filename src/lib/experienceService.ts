import { supabase } from './supabase';

export interface ExperienceMoment {
  id: string;
  heading: string;
  subtitle?: string;
  bullets?: string[];
  display_order: number;
}

export interface ExperienceImage {
  id: string;
  image_url: string;
  display_order: number;
}

export interface ExperienceItem {
  id: string;
  year: string;
  title: string;
  intro: string;
  display_order: number;
  moments: ExperienceMoment[];
  images: ExperienceImage[];
}

export async function getExperienceTimeline(): Promise<ExperienceItem[]> {
  const { data: experiences, error: expError } = await supabase
    .from('experience_timeline')
    .select('*')
    .order('display_order', { ascending: true });

  if (expError) {
    console.error('Error fetching experiences:', expError);
    return [];
  }

  if (!experiences || experiences.length === 0) {
    return [];
  }

  const experiencesWithDetails = await Promise.all(
    experiences.map(async (exp) => {
      const { data: moments } = await supabase
        .from('experience_moments')
        .select('*')
        .eq('experience_id', exp.id)
        .order('display_order', { ascending: true });

      const { data: images } = await supabase
        .from('experience_images')
        .select('*')
        .eq('experience_id', exp.id)
        .order('display_order', { ascending: true });

      return {
        id: exp.id,
        year: exp.year,
        title: exp.title,
        intro: exp.intro,
        display_order: exp.display_order,
        moments: moments || [],
        images: images || [],
      };
    })
  );

  return experiencesWithDetails;
}

export async function createExperience(
  year: string,
  title: string,
  intro: string
): Promise<string | null> {
  const { data, error } = await supabase
    .from('experience_timeline')
    .insert({
      year,
      title,
      intro,
      display_order: 0,
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating experience:', error);
    return null;
  }

  return data.id;
}

export async function updateExperience(
  id: string,
  year: string,
  title: string,
  intro: string
): Promise<boolean> {
  const { error } = await supabase
    .from('experience_timeline')
    .update({ year, title, intro, updated_at: new Date().toISOString() })
    .eq('id', id);

  if (error) {
    console.error('Error updating experience:', error);
    return false;
  }

  return true;
}

export async function deleteExperience(id: string): Promise<boolean> {
  const { error: momentsError } = await supabase
    .from('experience_moments')
    .delete()
    .eq('experience_id', id);

  if (momentsError) {
    console.error('Error deleting moments:', momentsError);
    return false;
  }

  const { data: images } = await supabase
    .from('experience_images')
    .select('image_url')
    .eq('experience_id', id);

  if (images) {
    for (const img of images) {
      const urlParts = img.image_url.split('/experience-images/');
      if (urlParts.length > 1) {
        await supabase.storage.from('experience-images').remove([urlParts[1]]);
      }
    }
  }

  const { error: imagesError } = await supabase
    .from('experience_images')
    .delete()
    .eq('experience_id', id);

  if (imagesError) {
    console.error('Error deleting images:', imagesError);
    return false;
  }

  const { error } = await supabase
    .from('experience_timeline')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting experience:', error);
    return false;
  }

  return true;
}

export async function addMoment(
  experienceId: string,
  heading: string,
  subtitle?: string,
  bullets?: string[]
): Promise<boolean> {
  const { error } = await supabase.from('experience_moments').insert({
    experience_id: experienceId,
    heading,
    subtitle,
    bullets,
    display_order: 0,
  });

  if (error) {
    console.error('Error adding moment:', error);
    return false;
  }

  return true;
}

export async function updateMoment(
  id: string,
  heading: string,
  subtitle?: string,
  bullets?: string[]
): Promise<boolean> {
  const { error } = await supabase
    .from('experience_moments')
    .update({ heading, subtitle, bullets })
    .eq('id', id);

  if (error) {
    console.error('Error updating moment:', error);
    return false;
  }

  return true;
}

export async function deleteMoment(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('experience_moments')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting moment:', error);
    return false;
  }

  return true;
}

export async function uploadExperienceImage(
  experienceId: string,
  file: File
): Promise<string | null> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${experienceId}/${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from('experience-images')
    .upload(fileName, file);

  if (uploadError) {
    console.error('Error uploading image:', uploadError);
    return null;
  }

  const { data: urlData } = supabase.storage
    .from('experience-images')
    .getPublicUrl(fileName);

  const { error: dbError } = await supabase.from('experience_images').insert({
    experience_id: experienceId,
    image_url: urlData.publicUrl,
    display_order: 0,
  });

  if (dbError) {
    console.error('Error saving image to database:', dbError);
    await supabase.storage.from('experience-images').remove([fileName]);
    return null;
  }

  return urlData.publicUrl;
}

export async function deleteExperienceImage(
  imageId: string,
  imageUrl: string
): Promise<boolean> {
  const urlParts = imageUrl.split('/experience-images/');
  if (urlParts.length > 1) {
    const filePath = urlParts[1];
    await supabase.storage.from('experience-images').remove([filePath]);
  }

  const { error } = await supabase
    .from('experience_images')
    .delete()
    .eq('id', imageId);

  if (error) {
    console.error('Error deleting image:', error);
    return false;
  }

  return true;
}
