export interface Session {
  id: string;
  user_id: string;
  date: string;
  time: string;
  client_name: string;
  coach_name: string;
  session_type: string;
  duration: number;
  client_price: number;
  coach_pay: number;
  client_paid: boolean;
  coach_paid: boolean;
  location: string;
  notes: string;
  package_id?: string | null;
  created_at: string;
  updated_at: string;
}

export type SessionFormData = Omit<Session, 'id' | 'user_id' | 'package_id' | 'created_at' | 'updated_at'>;

export interface ClientSummary {
  name: string;
  totalSessions: number;
  totalBilled: number;
  totalPaid: number;
  unpaidBalance: number;
}

export interface CoachSummary {
  name: string;
  totalSessions: number;
  totalPay: number;
  totalPaid: number;
  unpaidBalance: number;
}

export interface DashboardStats {
  totalSessions: number;
  unpaidClientBalance: number;
  unpaidCoachBalance: number;
  sessionsThisMonth: number;
}

export interface Package {
  id: string;
  user_id: string;
  client_name: string;
  total_sessions: number;
  sessions_used: number;
  total_price: number;
  paid: boolean;
  notes: string;
  created_at: string;
  updated_at: string;
}

export type PackageFormData = Omit<Package, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

export interface PackagePreset {
  label: string;
  total_sessions: number;
  total_price: number;
  notes: string;
}
