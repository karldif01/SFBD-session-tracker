import { supabase } from '../lib/supabase';
import type { Package, PackageFormData, PackagePreset } from '../types';

export async function getPackages(): Promise<Package[]> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getPackage(id: string): Promise<Package | null> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function addPackage(formData: PackageFormData): Promise<Package> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('packages')
    .insert({ ...formData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updatePackage(id: string, formData: Partial<PackageFormData>): Promise<Package> {
  const { data, error } = await supabase
    .from('packages')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase
    .from('packages')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getActivePackageForClient(clientName: string): Promise<Package | null> {
  const { data, error } = await supabase
    .from('packages')
    .select('*')
    .eq('client_name', clientName)
    .order('created_at', { ascending: false });

  if (error) throw error;

  const active = (data ?? []).find(pkg => pkg.sessions_used < pkg.total_sessions);
  return active ?? null;
}

export async function usePackageSession(packageId: string): Promise<Package> {
  const pkg = await getPackage(packageId);
  if (!pkg) throw new Error('Package not found');
  if (pkg.sessions_used >= pkg.total_sessions) throw new Error('No remaining sessions in package');

  return updatePackage(packageId, { sessions_used: pkg.sessions_used + 1 });
}

export async function restorePackageSession(packageId: string): Promise<Package> {
  const pkg = await getPackage(packageId);
  if (!pkg) throw new Error('Package not found');
  if (pkg.sessions_used <= 0) throw new Error('No sessions to restore');

  return updatePackage(packageId, { sessions_used: pkg.sessions_used - 1 });
}

export function getPackagePresets(): PackagePreset[] {
  return [
    {
      label: '4 Sessions — $320',
      total_sessions: 4,
      total_price: 320,
      notes: '',
    },
    {
      label: '4 Sessions / 2 Kids — $520',
      total_sessions: 4,
      total_price: 520,
      notes: '2 Kids',
    },
  ];
}
