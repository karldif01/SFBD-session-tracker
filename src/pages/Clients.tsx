import { useState, useEffect } from 'react';
import { getClientSummaries } from '../store/sessionStore';
import type { ClientSummary } from '../types';
import { Users, DollarSign, AlertTriangle } from 'lucide-react';
import StatCard from '../components/StatCard';

function formatCurrency(n: number) {
  return '$' + n.toLocaleString('en-US', { minimumFractionDigits: 0 });
}

export default function Clients() {
  const [clients, setClients] = useState<ClientSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getClientSummaries().then(data => {
      setClients(data);
      setLoading(false);
    });
  }, []);

  const totalBilled = clients.reduce((s, c) => s + c.totalBilled, 0);
  const totalUnpaid = clients.reduce((s, c) => s + c.unpaidBalance, 0);

  if (loading) {
    return <div className="text-text-muted text-sm py-12 text-center">Loading clients...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-4xl tracking-wide text-text-primary">Clients</h1>
        <p className="text-text-muted text-sm mt-1">Client billing & payment overview</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <StatCard label="Total Clients" value={clients.length} icon={Users} color="blue" />
        <StatCard label="Total Billed" value={formatCurrency(totalBilled)} icon={DollarSign} color="emerald" />
        <StatCard label="Total Unpaid" value={formatCurrency(totalUnpaid)} icon={AlertTriangle} color="red" />
      </div>

      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle overflow-x-auto" style={{ animationDelay: '200ms' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border-subtle">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Sessions</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Total Billed</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Total Paid</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Unpaid Balance</th>
            </tr>
          </thead>
          <tbody>
            {clients.map(c => (
              <tr key={c.name} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors">
                <td className="px-5 py-3.5 text-text-primary font-medium">{c.name}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{c.totalSessions}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{formatCurrency(c.totalBilled)}</td>
                <td className="px-5 py-3.5 text-right text-text-secondary">{formatCurrency(c.totalPaid)}</td>
                <td className="px-5 py-3.5 text-right">
                  <span
                    className={`font-semibold ${
                      c.unpaidBalance > 0 ? 'text-danger' : 'text-accent'
                    }`}
                  >
                    {formatCurrency(c.unpaidBalance)}
                  </span>
                </td>
              </tr>
            ))}
            {clients.length === 0 && (
              <tr>
                <td colSpan={5} className="px-5 py-12 text-center text-text-muted">
                  No client data yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
