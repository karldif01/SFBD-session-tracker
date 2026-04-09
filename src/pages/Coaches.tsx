import { useState, useEffect } from 'react';
import { getCoachSummaries } from '../store/sessionStore';
import type { CoachSummary } from '../types';
import { UserCog, DollarSign, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

export default function Coaches() {
  const [coaches, setCoaches] = useState<CoachSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCoachSummaries().then(data => {
      setCoaches(data);
      setLoading(false);
    });
  }, []);

  const totalPay = coaches.reduce((s, c) => s + c.totalPay, 0);
  const totalUnpaid = coaches.reduce((s, c) => s + c.unpaidBalance, 0);

  if (loading) {
    return <div className="text-text-muted text-sm py-12 text-center">Loading coaches...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Coaches</h1>
        <p className="text-text-muted text-sm mt-1">Coach compensation & payout status</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <StatCard label="Total Coaches" value={coaches.length} icon={UserCog} color="blue" />
        <StatCard label="Total Coach Pay" value={formatCurrency(totalPay)} icon={DollarSign} color="emerald" />
        <StatCard label="Total Unpaid" value={formatCurrency(totalUnpaid)} icon={AlertTriangle} color="amber" />
      </div>

      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle overflow-x-auto" style={{ animationDelay: '200ms' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border-subtle">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Coach</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Sessions</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Total Pay</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Paid</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Unpaid Balance</th>
            </tr>
          </thead>
          <tbody>
            {coaches.map(c => (
              <tr key={c.name} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-text-primary font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{c.totalSessions}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{formatCurrency(c.totalPay)}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{formatCurrency(c.totalPaid)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={`font-semibold ${
                      c.unpaidBalance > 0 ? 'text-warning' : 'text-accent'
                    }`}
                  >
                    {formatCurrency(c.unpaidBalance)}
                  </span>
                </td>
              </tr>
            ))}
            {coaches.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                  No coach data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
