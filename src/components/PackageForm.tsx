import { useState, useEffect } from 'react';
import type { Package, PackageFormData } from '../types';
import { X } from 'lucide-react';
import { getPackagePresets, getUniquePackageClientNames } from '../store/packageStore';
import { getUniqueClientNames } from '../store/sessionStore';
import ComboBox from './ComboBox';

interface PackageFormProps {
  pkg?: Package | null;
  onSubmit: (data: PackageFormData) => void;
  onClose: () => void;
}

const defaultForm: PackageFormData = {
  client_name: '',
  total_sessions: 4,
  sessions_used: 0,
  total_price: 320,
  paid: false,
  notes: '',
};

export default function PackageForm({ pkg, onSubmit, onClose }: PackageFormProps) {
  const [form, setForm] = useState<PackageFormData>(defaultForm);
  const [clientNames, setClientNames] = useState<string[]>([]);
  const presets = getPackagePresets();

  useEffect(() => {
    if (pkg) {
      const { id, user_id, created_at, updated_at, ...rest } = pkg;
      setForm(rest);
    }
  }, [pkg]);

  useEffect(() => {
    Promise.all([getUniqueClientNames(), getUniquePackageClientNames()]).then(
      ([sessionClients, packageClients]) => {
        const merged = [...new Set([...sessionClients, ...packageClients])].sort();
        setClientNames(merged);
      }
    );
  }, []);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit(form);
  }

  function update<K extends keyof PackageFormData>(key: K, value: PackageFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }));
  }

  function applyPreset(preset: { total_sessions: number; total_price: number; notes: string }) {
    setForm(prev => ({
      ...prev,
      total_sessions: preset.total_sessions,
      total_price: preset.total_price,
      notes: preset.notes,
    }));
  }

  const inputClass =
    'w-full px-3.5 py-2.5 bg-surface border border-border-medium rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-200';
  const labelClass = 'block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5';

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/60 backdrop-blur-sm">
      <div className="animate-slide-in-modal bg-surface-raised rounded-2xl border border-border-subtle shadow-2xl shadow-black/50 w-full max-w-2xl max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle">
          <h2 className="font-display text-2xl tracking-wide text-text-primary">
            {pkg ? 'Edit Package' : 'New Package'}
          </h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Presets */}
          <div>
            <label className={labelClass}>Quick Presets</label>
            <div className="flex gap-2">
              {presets.map(p => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => applyPreset(p)}
                  className="px-4 py-2 text-sm font-medium text-text-secondary bg-white/5 border border-border-medium rounded-lg hover:bg-accent/10 hover:text-accent hover:border-accent/30 transition-all duration-200"
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Total Sessions</label>
              <input
                type="number"
                value={form.total_sessions}
                onChange={e => update('total_sessions', Number(e.target.value))}
                className={inputClass}
                min={1}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Total Price ($)</label>
              <input
                type="number"
                value={form.total_price}
                onChange={e => update('total_price', Number(e.target.value))}
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
                checked={form.paid}
                onChange={e => update('paid', e.target.checked)}
              />
              Paid
            </label>
          </div>

          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              value={form.notes}
              onChange={e => update('notes', e.target.value)}
              className={inputClass}
              rows={2}
              placeholder="Optional notes about the package..."
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
              {pkg ? 'Save Changes' : 'Add Package'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
