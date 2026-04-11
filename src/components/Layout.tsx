import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, CalendarDays, Users, Package, UserCog, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

const navItems = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/sessions', label: 'Sessions', icon: CalendarDays },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/packages', label: 'Packages', icon: Package },
  { to: '/coaches', label: 'Coaches', icon: UserCog },
];

export default function Layout() {
  async function handleSignOut() {
    await supabase.auth.signOut();
  }

  return (
    <div className="min-h-screen bg-surface font-body">
      {/* Top ambient glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <header className="sticky top-0 z-30 border-b border-border-subtle backdrop-blur-xl bg-surface/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-9 h-9 bg-accent/10 border border-accent/30 rounded-lg flex items-center justify-center">
                <span className="font-display text-accent text-lg tracking-wider">SF</span>
              </div>
              <div className="absolute inset-0 rounded-lg bg-accent/20 blur-md -z-10" />
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-display text-text-primary text-xl tracking-wider">SFBD</span>
              <span className="text-text-muted text-xs font-medium uppercase tracking-widest">Tracker</span>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <nav className="flex gap-1">
              {navItems.map(({ to, label, icon: Icon }) => (
                <NavLink
                  key={to}
                  to={to}
                  end={to === '/'}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-accent/10 text-accent shadow-[inset_0_1px_0_rgba(0,212,170,0.1)]'
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.03]'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />
                      <span className="hidden sm:inline">{label}</span>
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
            <div className="w-px h-6 bg-border-subtle mx-2" />
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-text-muted hover:text-danger hover:bg-danger/5 transition-all duration-200"
              title="Sign out"
            >
              <LogOut size={16} />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8 relative">
        <Outlet />
      </main>
    </div>
  );
}
