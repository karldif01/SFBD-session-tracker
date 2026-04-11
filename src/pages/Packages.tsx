import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Package, CheckCircle, Clock } from 'lucide-react';
import {
  getPackages,
  addPackage,
  updatePackage,
  deletePackage,
} from '../store/packageStore';
import type { Package as PackageType, PackageFormData } from '../types';
import PackageForm from '../components/PackageForm';
import StatCard from '../components/StatCard';

export default function Packages() {
  const [packages, setPackages] = useState<PackageType[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);

  async function reload() {
    const data = await getPackages();
    setPackages(data);
    setLoading(false);
  }

  useEffect(() => {
    reload();
  }, []);

  async function handleAdd(data: PackageFormData) {
    try {
      await addPackage(data);
      setShowForm(false);
      await reload();
    } catch (err) {
      alert('Failed to add package: ' + (err instanceof Error ? err.message : String(err)));
    }
  }

  async function handleEdit(data: PackageFormData) {
    if (editingPackage) {
      await updatePackage(editingPackage.id, data);
      setEditingPackage(null);
      await reload();
    }
  }

  async function handleDelete(id: string) {
    if (confirm('Delete this package?')) {
      await deletePackage(id);
      await reload();
    }
  }

  const activeCount = packages.filter(p => p.sessions_used < p.total_sessions).length;
  const fullyUsedCount = packages.filter(p => p.sessions_used >= p.total_sessions).length;

  if (loading) {
    return <div className="text-text-muted text-sm py-12 text-center">Loading packages...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-wide text-text-primary">Packages</h1>
          <p className="text-text-muted text-sm mt-1">Manage session packages & billing</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-surface bg-accent rounded-lg hover:bg-accent/90 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.25)]"
        >
          <Plus size={16} strokeWidth={2.5} />
          New Package
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
        <StatCard label="Total Packages" value={packages.length} icon={Package} color="blue" />
        <StatCard label="Active Packages" value={activeCount} icon={Clock} color="emerald" />
        <StatCard label="Fully Used" value={fullyUsedCount} icon={CheckCircle} color="amber" />
      </div>

      <div className="animate-fade-in-up bg-surface-raised rounded-xl border border-border-subtle overflow-x-auto" style={{ animationDelay: '200ms' }}>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-border-subtle">
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Client</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Sessions</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted text-right">Price</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Paid</th>
              <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-text-muted">Notes</th>
              <th className="px-5 py-3.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {packages.map(p => (
              <tr key={p.id} className="border-b border-border-subtle/50 hover:bg-white/[0.02] transition-colors group">
                <td className="px-5 py-3.5 text-text-primary font-medium">{p.client_name}</td>
                <td className="px-5 py-3.5 text-text-secondary">
                  <span className={p.sessions_used >= p.total_sessions ? 'text-warning font-medium' : ''}>
                    {p.sessions_used} of {p.total_sessions} used
                  </span>
                </td>
                <td className="px-5 py-3.5 text-right text-text-primary font-medium">${p.total_price}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                      p.paid
                        ? 'bg-accent/10 text-accent border border-accent/20'
                        : 'bg-danger/10 text-danger border border-danger/20'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${p.paid ? 'bg-accent shadow-[0_0_6px_rgba(0,212,170,0.5)]' : 'bg-danger shadow-[0_0_6px_rgba(255,77,106,0.5)]'}`} />
                    {p.paid ? 'Paid' : 'Unpaid'}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-text-muted max-w-[200px] truncate" title={p.notes}>
                  {p.notes || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => setEditingPackage(p)}
                      className="p-1.5 text-text-muted hover:text-accent rounded-md hover:bg-accent/10 transition-colors"
                      title="Edit"
                    >
                      <Pencil size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="p-1.5 text-text-muted hover:text-danger rounded-md hover:bg-danger/10 transition-colors"
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {packages.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-text-muted">
                  No packages yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="text-xs text-text-muted">{packages.length} package(s)</p>

      {showForm && <PackageForm onSubmit={handleAdd} onClose={() => setShowForm(false)} />}
      {editingPackage && (
        <PackageForm
          pkg={editingPackage}
          onSubmit={handleEdit}
          onClose={() => setEditingPackage(null)}
        />
      )}
    </div>
  );
}
