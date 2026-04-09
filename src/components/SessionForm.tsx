import { useState, useEffect } from 'react';
import type { Session, SessionFormData } from '../types';
import { X } from 'lucide-react';
import { getUniqueClientNames, getUniqueCoachNames } from '../store/sessionStore';
import ComboBox from './ComboBox';

interface SessionFormProps {
  session?: Session | null;
  onSubmit: (data: SessionFormData) => void;
  onClose: () => void;
}

const defaultForm: SessionFormData = {
  date: new Date().toISOString().slice(0, 10),
  time: '09:00',
  client_name: '',
  coach_name: '',
  session_type: '1-on-1',
  duration: 60,
  client_price: 120,
  coach_pay: 60,
  client_paid: false,
  coach_paid: false,
  location: '',
  notes: '',
};

const sessionTypes = ['1-on-1', 'Small Group', 'Team Training', 'Camp', 'Assessment'];

export default function SessionForm({ session, onSubmit, onClose }: SessionFormProps) {
  const [form, setForm] = useState<SessionFormData>(defaultForm);
  const [clientNames, setClientNames] = useState<string[]>([]);
  const [coachNames, setCoachNames] = useState<string[]>([]);

  useEffect(() => {
    if (session) {
      const { id, user_id, created_at, updated_at, ...rest } = session;
      setForm(rest);
    }
  }, [session]);

  useEffect(() => {
    getUniqueClientNames().then(setClientNames);
    getUniqueCoachNames().then(setCoachNames);
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  function update<K extends keyof SessionFormData>(key: K, value: SessionFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  const inputClass =
    'w-full px-3.5 py-2.5 bg-surface border border-border-medium rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/60 backdrop-blur-sm">
      <div className="animate-slide-in-modal bg-surface-raised rounded-2xl border border-border-subtle shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="font-display text-2xl tracking-wide text-text-primary">
            {session ? 'Edit Session' : 'New Session'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className={labelClass}>Date</label>
            <input
              type="date"
              value={form.date}
              onChange={e => update('date', e.target.value)}
              className={inputClass}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client</label>
              <ComboBox
                value={form.client_name}
                onChange={v => update('client_name', v)}
                options={clientNames}
                placeholder="Select client..."
                required
                addLabel="client"
                onAdd={name => update('client_name', name)}
              />
            </div>
            <div>
              <label className={labelClass}>Coach</label>
              <ComboBox
                value={form.coach_name}
                onChange={v => update('coach_name', v)}
                options={coachNames}
                placeholder="Select coach..."
                required
                addLabel="coach"
                onAdd={name => update('coach_name', name)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className={labelClass}>Type</label>
              <select
                value={form.session_type}
                onChange={e => update('session_type', e.target.value)}
                className={inputClass}
              >
                {sessionTypes.map(t => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Duration (min)</label>
              <input
                type="number"
                value={form.duration}
                onChange={e => update('duration', Number(e.target.value))}
                className={inputClass}
                min={15}
                step={15}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Location</label>
              <input
                type="text"
                value={form.location}
                onChange={e => update('location', e.target.value)}
                className={inputClass}
                placeholder="e.g. Beach Chalet Fields"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Client Price ($)</label>
              <input
                type="number"
                value={form.client_price}
                onChange={e => update('client_price', Number(e.target.value))}
                className={inputClass}
                min={0}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Coach Pay ($)</label>
              <input
                type="number"
                value={form.coach_pay}
                onChange={e => update('coach_pay', Number(e.target.value))}
                className={inputClass}
                min={0}
                required
              />
            </div>
          </div>
          <div className="flex gap-6">
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={form.client_paid}
                onChange={e => update('client_paid', e.target.checked)}
              />
              Client Paid
            </label>
            <label className="flex items-center gap-2.5 text-sm text-text-secondary cursor-pointer">
              <input
                type="checkbox"
                checked={form.coach_paid}
                onChange={e => update('coach_paid', e.target.checked)}
              />
              Coach Paid
            </label>
          </div>
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              className={inputClass}
              rows={2}
              placeholder="Optional notes about the session..."
            />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-sm font-semibold text-text-secondary bg-white/5 border border-border-medium rounded-lg hover:bg-white/10 hover:text-text-primary transition-all duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-sm font-semibold text-surface bg-accent rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,170,0.2)] hover:shadow-[0_0_30px_rgba(0,212,170,0.3)]"
            >
              {session ? 'Save Changes' : 'Add Session'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
