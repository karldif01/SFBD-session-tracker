import { useState, useEffect, useMemo, useRef } from 'react';
import { Plus, Search, Pencil, Trash2 } from 'lucide-react';
import {
  getSessions,
  addSession,
  updateSession,
  deleteSession,
  toggleClientPaid,
  toggleCoachPaid,
} from '../store/sessionStore';
import type { Session, SessionFormData } from '../types';
import SessionForm from '../components/SessionForm';
import PaymentBadge from '../components/PaymentBadge';

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState<Session | null>(null);
  const [searchClient, setSearchClient] = useState('');
  const [searchCoach, setSearchCoach] = useState('');
  const [filterUnpaidClient, setFilterUnpaidClient] = useState(false);
  const [filterUnpaidCoach, setFilterUnpaidCoach] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(toastTimer.current), []);

  async function reload() {
    const data = await getSessions();
    setSessions(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      if (searchClient && !s.client_name.toLowerCase().includes(searchClient.toLowerCase()))
        return false;
      if (searchCoach && !s.coach_name.toLowerCase().includes(searchCoach.toLowerCase()))
        return false;
      if (filterUnpaidClient && s.client_paid) return false;
      if (filterUnpaidCoach && s.coach_paid) return false;
      return true;
    });
  }, [sessions, searchClient, searchCoach, filterUnpaidClient, filterUnpaidCoach]);

  async function handleAdd(data: SessionFormData) {
    const result = await addSession(data);
    setShowForm(false);
    if (result.packageUsed && result.packageInfo) {
      const { sessionsUsed, totalSessions } = result.packageInfo;
      setToast(`Package rate applied — ${sessionsUsed} of ${totalSessions} sessions used`);
      toastTimer.current = setTimeout(() => setToast(null), 4000);
    }
    await reload();
  }

  async function handleEdit(data: SessionFormData) {
    if (editingSession) {
      await updateSession(editingSession.id, data);
      setEditingSession(null);
      await reload();
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this session?')) {
      await deleteSession(id);
      await reload();
    }
  }

  async function handleToggleClientPaid(id: string) {
    await toggleClientPaid(id);
    await reload();
  }

  async function handleToggleCoachPaid(id: string) {
    await toggleCoachPaid(id);
    await reload();
  }

  if (loading) {
    return <div className="text-text-muted text-sm py-12 text-center">Loading sessions...</div>;
  }

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in-up bg-accent/10 border border-accent/30 text-accent px-5 py-3 rounded-lg text-sm font-medium shadow-lg shadow-accent/5">
          {toast}
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-text-primary">Sessions</h1>
          <p className="text-text-muted text-sm mt-1">Manage training sessions & payments</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-surface bg-accent rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.25)]"
        >
          <Plus size={16} strokeWidth={2.5} />
          Add Session
        </button>
      </div>

      {/* Filters */}
      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle p-4">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Search Client</label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchClient}
                onChange={e => setSearchClient(e.target.value)}
                placeholder="Client name..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-surface border border-border-medium rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 min-w-[180px]">
            <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">Search Coach</label>
            <div className="relative">
              <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-text-muted" />
              <input
                type="text"
                value={searchCoach}
                onChange={e => setSearchCoach(e.target.value)}
                placeholder="Coach name..."
                className="w-full pl-9 pr-3.5 py-2.5 bg-surface border border-border-medium rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all"
              />
            </div>
          </div>
          <label className="flex items-center gap-2.5 text-sm text-text-secondary pb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnpaidClient}
              onChange={e => setFilterUnpaidClient(e.target.checked)}
            />
            Unpaid Clients
          </label>
          <label className="flex items-center gap-2.5 text-sm text-text-secondary pb-1 cursor-pointer">
            <input
              type="checkbox"
              checked={filterUnpaidCoach}
              onChange={e => setFilterUnpaidCoach(e.target.checked)}
            />
            Unpaid Coaches
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle overflow-x-auto" style={{ animationDelay: '100ms' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border-subtle">
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Date</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Time</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Coach</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Type</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Dur.</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Price</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Coach Pay</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Coach</th>
              <th className="px-4 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Location</th>
              <th className="px-4 py-3.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors group">
                <td className="px-4 py-3.5 text-text-secondary whitespace-nowrap">{s.date}</td>
                <td className="px-4 py-3.5 text-text-muted">{s.time}</td>
                <td className="px-4 py-3.5 text-text-primary font-medium">{s.client_name}</td>
                <td className="px-4 py-3.5 text-text-secondary">{s.coach_name}</td>
                <td className="px-4 py-3.5 text-text-muted">{s.session_type}</td>
                <td className="px-4 py-3.5 text-text-muted">{s.duration}m</td>
                <td className="px-4 py-3.5 text-right text-text-primary font-medium">${s.client_price}</td>
                <td className="px-4 py-3.5 text-right text-text-secondary">${s.coach_pay}</td>
                <td className="px-4 py-3.5">
                  <PaymentBadge
                    paid={s.client_paid}
                    onClick={() => handleToggleClientPaid(s.id)}
                    label="client"
                  />
                </td>
                <td className="px-4 py-3.5">
                  <PaymentBadge
                    paid={s.coach_paid}
                    onClick={() => handleToggleCoachPaid(s.id)}
                    label="coach"
                  />
                </td>
                <td className="px-4 py-3.5 text-text-muted max-w-[140px] truncate" title={s.location}>
                  {s.location}
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingSession(s)}
                      className="p-1.5 text-text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(s.id)}
                      className="p-1.5 text-text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={12} className="px-4 py-12 text-center text-text-muted">
                  No sessions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">{filtered.length} session(s)</p>

      {showForm && <SessionForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}
      {editingSession && (
        <SessionForm
          session={editingSession}
          onSubmit={handleEdit}
          onClose={() => setEditingSession(null)}
        />
      )}
    </div>
  );
}
