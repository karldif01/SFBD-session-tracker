import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';

interface ComboBoxProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder?: string;
  required?: boolean;
  addLabel?: string;
  onAdd?: (name: string) => void;
}

export default function ComboBox({ value, onChange, options, placeholder, required, addLabel, onAdd }: ComboBoxProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState('');
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
        setFilter('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filtered = options.filter(o =>
    o.toLowerCase().includes(filter.toLowerCase())
  );

  function handleAdd() {
    const name = prompt(`Add new ${addLabel || 'name'}:`);
    if (name && name.trim()) {
      onAdd?.(name.trim());
      onChange(name.trim());
    }
  }

  return (
    <div ref={wrapperRef} className="relative flex gap-1.5">
      <div className="relative flex-1">
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className={`w-full px-3.5 py-2.5 bg-surface border border-border-medium rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-200 ${
            value ? 'text-text-primary' : 'text-text-muted'
          }`}
        >
          {value || placeholder || 'Select...'}
        </button>
        {required && (
          <input
            type="text"
            value={value}
            onChange={() => {}}
            required
            className="absolute inset-0 opacity-0 pointer-events-none"
            tabIndex={-1}
          />
        )}
        {open && (
          <div className="absolute z-10 mt-1 w-full bg-surface-overlay border border-border-medium rounded-lg shadow-xl shadow-black/40">
            <div className="p-2 border-b border-border-subtle">
              <input
                type="text"
                value={filter}
                onChange={e => setFilter(e.target.value)}
                placeholder="Search..."
                autoFocus
                className="w-full px-2.5 py-1.5 bg-surface border border-border-subtle rounded text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-1 focus:ring-accent/40"
              />
            </div>
            <ul className="max-h-48 overflow-y-auto">
              {filtered.map(o => (
                <li
                  key={o}
                  onMouseDown={() => {
                    onChange(o);
                    setOpen(false);
                    setFilter('');
                  }}
                  className={`px-3.5 py-2.5 text-sm cursor-pointer transition-colors ${
                    o === value
                      ? 'bg-accent/10 text-accent font-medium'
                      : 'text-text-secondary hover:bg-white/[0.03] hover:text-text-primary'
                  }`}
                >
                  {o}
                </li>
              ))}
              {filtered.length === 0 && (
                <li className="px-3.5 py-2.5 text-sm text-text-muted">No matches</li>
              )}
            </ul>
          </div>
        )}
      </div>
      {onAdd && (
        <button
          type="button"
          onClick={handleAdd}
          title={`Add new ${addLabel || 'name'}`}
          className="px-2.5 py-2.5 border border-border-medium rounded-lg text-text-muted hover:text-accent hover:border-accent/30 hover:bg-accent/5 transition-all duration-200"
        >
          <Plus size={16} />
        </button>
      )}
    </div>
  );
}
