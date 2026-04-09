import { useState, useEffect } from 'react';
import { CalendarDays, DollarSign, AlertCircle, TrendingUp } from 'lucide-react';
import StatCard from '../components/StatCard';
import { getDashboardStats, getSessions } from '../store/sessionStore';
import type { DashboardStats, Session } from '../types';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalSessions: 0,
    unpaidClientBalance: 0,
    unpaidCoachBalance: 0,
    sessionsThisMonth: 0,
  });
  const [recentSessions, setRecentSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [statsData, sessionsData] = await Promise.all([
        getDashboardStats(),
        getSessions(),
      ]);
      setStats(statsData);
      setRecentSessions(sessionsData.slice(0, 5));
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return <div className="text-text-muted text-sm py-12 text-center">Loading dashboard...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Dashboard</h1>
        <p className="text-text-muted text-sm mt-1">Session overview & payment status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        <StatCard label="Total Sessions" value={stats.totalSessions} icon={CalendarDays} color="blue" />
        <StatCard
          label="Unpaid Client Balance"
          value={formatCurrency(stats.unpaidClientBalance)}
          icon={DollarSign}
          color="red"
        />
        <StatCard
          label="Unpaid Coach Balance"
          value={formatCurrency(stats.unpaidCoachBalance)}
          icon={AlertCircle}
          color="amber"
        />
        <StatCard
          label="Sessions This Month"
          value={stats.sessionsThisMonth}
          icon={TrendingUp}
          color="emerald"
        />
      </div>

      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle overflow-hidden" style={{ animationDelay: '200ms' }}>
        <div className="px-5 py-4 border-b border-border-subtle flex items-center justify-between">
          <h2 className="font-display text-xl tracking-wide text-text-primary">Recent Sessions</h2>
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">Last 5</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left border-b border-border-subtle">
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Coach</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Type</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Price</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
                <th className="px-5 py-3 text-xs font-semibold uppercase tracking-wider text-text-muted">Coach</th>
              </tr>
            </thead>
            <tbody>
              {recentSessions.map(s => (
                <tr key={s.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3.5 text-text-secondary whitespace-nowrap">{s.date}</td>
                  <td className="px-5 py-3.5 text-text-primary font-medium">{s.client_name}</td>
                  <td className="px-5 py-3.5 text-text-secondary">{s.coach_name}</td>
                  <td className="px-5 py-3.5 text-text-muted">{s.session_type}</td>
                  <td className="px-5 py-3.5 text-right text-text-primary font-medium">${s.client_price}</td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.client_paid
                          ? 'bg-accent/10 text-accent'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.client_paid ? 'bg-accent shadow-[0_0_4px_rgba(0,212,170,0.5)]' : 'bg-danger shadow-[0_0_4px_rgba(255,77,106,0.5)]'}`} />
                      {s.client_paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold ${
                        s.coach_paid
                          ? 'bg-accent/10 text-accent'
                          : 'bg-danger/10 text-danger'
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${s.coach_paid ? 'bg-accent shadow-[0_0_4px_rgba(0,212,170,0.5)]' : 'bg-danger shadow-[0_0_4px_rgba(255,77,106,0.5)]'}`} />
                      {s.coach_paid ? 'Paid' : 'Unpaid'}
                    </span>
                  </td>
                </tr>
              ))}
              {recentSessions.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-text-muted">
                    No sessions yet. Add your first session!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
