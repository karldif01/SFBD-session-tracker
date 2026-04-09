import { supabase } from '../lib/supabase';
import type { Session, SessionFormData, ClientSummary, CoachSummary, DashboardStats } from '../types';

export async function getSessions(): Promise<Session[]> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('date', { ascending: false })
    .order('time', { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export async function getSession(id: string): Promise<Session | null> {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data;
}

export async function addSession(formData: SessionFormData): Promise<Session> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('sessions')
    .insert({ ...formData, user_id: user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateSession(id: string, formData: Partial<SessionFormData>): Promise<Session> {
  const { data, error } = await supabase
    .from('sessions')
    .update(formData)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteSession(id: string): Promise<void> {
  const { error } = await supabase
    .from('sessions')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function toggleClientPaid(id: string): Promise<void> {
  const session = await getSession(id);
  if (!session) return;
  await updateSession(id, { client_paid: !session.client_paid });
}

export async function toggleCoachPaid(id: string): Promise<void> {
  const session = await getSession(id);
  if (!session) return;
  await updateSession(id, { coach_paid: !session.coach_paid });
}

export async function getDashboardStats(): Promise<DashboardStats> {
  const sessions = await getSessions();
  const now = new Date();
  const currentMonth = now.getFullYear() + '-' + String(now.getMonth() + 1).padStart(2, '0');

  return {
    totalSessions: sessions.length,
    unpaidClientBalance: sessions
      .filter(s => !s.client_paid)
      .reduce((sum, s) => sum + Number(s.client_price), 0),
    unpaidCoachBalance: sessions
      .filter(s => !s.coach_paid)
      .reduce((sum, s) => sum + Number(s.coach_pay), 0),
    sessionsThisMonth: sessions.filter(s => s.date.startsWith(currentMonth)).length,
  };
}

export async function getClientSummaries(): Promise<ClientSummary[]> {
  const sessions = await getSessions();
  const map = new Map<string, ClientSummary>();

  for (const s of sessions) {
    const existing = map.get(s.client_name) || {
      name: s.client_name,
      totalSessions: 0,
      totalBilled: 0,
      totalPaid: 0,
      unpaidBalance: 0,
    };
    existing.totalSessions++;
    existing.totalBilled += Number(s.client_price);
    if (s.client_paid) existing.totalPaid += Number(s.client_price);
    existing.unpaidBalance = existing.totalBilled - existing.totalPaid;
    map.set(s.client_name, existing);
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getCoachSummaries(): Promise<CoachSummary[]> {
  const sessions = await getSessions();
  const map = new Map<string, CoachSummary>();

  for (const s of sessions) {
    const existing = map.get(s.coach_name) || {
      name: s.coach_name,
      totalSessions: 0,
      totalPay: 0,
      totalPaid: 0,
      unpaidBalance: 0,
    };
    existing.totalSessions++;
    existing.totalPay += Number(s.coach_pay);
    if (s.coach_paid) existing.totalPaid += Number(s.coach_pay);
    existing.unpaidBalance = existing.totalPay - existing.totalPaid;
    map.set(s.coach_name, existing);
  }

  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}

export async function getUniqueClientNames(): Promise<string[]> {
  const sessions = await getSessions();
  return [...new Set(sessions.map(s => s.client_name))].sort();
}

export async function getUniqueCoachNames(): Promise<string[]> {
  const sessions = await getSessions();
  return [...new Set(sessions.map(s => s.coach_name))].sort();
}
