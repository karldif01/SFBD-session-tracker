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
  created_at: string;
  updated_at: string;
}

export type SessionFormData = Omit<Session, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

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
