import { supabase } from './supabase';

export interface PortfolioPlaybook {
  id: string;
  title: string;
  teaser: string;
  icon_name: string | null;
  challenge: string;
  actions: string[];
  result: string;
  image_url: string | null;
  mvp_url: string | null;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export async function getPortfolioPlaybooks(): Promise<PortfolioPlaybook[]> {
  const { data, error } = await supabase
    .from('portfolio_playbooks')
    .select('*')
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching portfolio playbooks:', error);
    return [];
  }

  return data || [];
}

export async function createPlaybook(playbook: Omit<PortfolioPlaybook, 'id' | 'created_at' | 'updated_at'>): Promise<PortfolioPlaybook | null> {
  const { data, error } = await supabase
    .from('portfolio_playbooks')
    .insert([playbook])
    .select()
    .single();

  if (error) {
    console.error('Error creating playbook:', error);
    return null;
  }

  return data;
}

export async function updatePlaybook(id: string, updates: Partial<PortfolioPlaybook>): Promise<PortfolioPlaybook | null> {
  const { data, error } = await supabase
    .from('portfolio_playbooks')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating playbook:', error);
    return null;
  }

  return data;
}

export async function deletePlaybook(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('portfolio_playbooks')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting playbook:', error);
    return false;
  }

  return true;
}
