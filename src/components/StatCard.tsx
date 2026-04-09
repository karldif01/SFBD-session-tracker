import { type LucideIcon } from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: 'emerald' | 'red' | 'amber' | 'blue';
}

const colorMap = {
  emerald: {
    icon: 'text-accent',
    bg: 'bg-accent/10',
    glow: 'bg-accent/20',
    border: 'border-accent/20',
  },
  red: {
    icon: 'text-danger',
    bg: 'bg-danger/10',
    glow: 'bg-danger/20',
    border: 'border-danger/20',
  },
  amber: {
    icon: 'text-warning',
    bg: 'bg-warning/10',
    glow: 'bg-warning/20',
    border: 'border-warning/20',
  },
  blue: {
    icon: 'text-sky-400',
    bg: 'bg-sky-400/10',
    glow: 'bg-sky-400/20',
    border: 'border-sky-400/20',
  },
};

export default function StatCard({ label, value, icon: Icon, color }: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className={`relative bg-surface-raised rounded-xl border ${c.border} p-5 overflow-hidden group hover:border-opacity-40 transition-all duration-300`}>
      {/* Subtle corner glow */}
      <div className={`absolute -top-8 -right-8 w-24 h-24 ${c.glow} rounded-full blur-2xl opacity-50 group-hover:opacity-80 transition-opacity duration-500`} />

      <div className="flex items-center justify-between relative">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">{label}</p>
          <p className="text-3xl font-display tracking-wide text-text-primary mt-2">{value}</p>
        </div>
        <div className={`p-2.5 rounded-lg ${c.bg}`}>
          <Icon size={22} className={c.icon} />
        </div>
      </div>
    </div>
  );
}
