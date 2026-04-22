import { useState } from 'react';
import { supabase } from '../lib/supabase';
import { LogIn, UserPlus, Loader2 } from 'lucide-react';

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    if (isLogin) {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) {
        setError(error.message);
      } else {
        setMessage('Check your email to confirm your account.');
      }
    }

    setLoading(false);
  }

  const inputClass =
    'w-full px-4 py-3 bg-surface border border-border-medium rounded-lg text-sm text-text-primary placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent/50 transition-all duration-200';

  return (
    <div className="min-h-screen bg-surface flex items-center justify-center px-4 relative overflow-hidden font-body">
      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="animate-fade-in-up w-full max-w-md relative">
        {/* Logo */}
        <div className="text-center mb-10">
          <img
            src="/sfbd-logo-white.png"
            alt="SFBD"
            className="h-50 sm:h-60 w-auto max-w-[min(100%,28rem)] mx-auto mb-4 object-contain object-center [filter:drop-shadow(0_0_24px_rgba(0,212,170,0.2))]"
          />
          <div className="inline-flex items-center justify-center px-6 py-3 bg-accent/10 border border-accent/30 rounded-xl relative">
            <span className="font-display text-accent text-3xl tracking-wider">SFBD Tracker</span>
            <div className="absolute inset-0 rounded-xl bg-accent/20 blur-lg -z-10" />
          </div>
        </div>

        {/* Card */}
        <div className="bg-surface-raised rounded-2xl border border-border-subtle p-8">
          {/* Toggle */}
          <div className="flex bg-surface rounded-lg border border-border-subtle p-1 mb-6">
            <button
              type="button"
              onClick={() => { setIsLogin(true); setError(''); setMessage(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                isLogin
                  ? 'bg-accent/10 text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <LogIn size={15} />
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsLogin(false); setError(''); setMessage(''); }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-md text-sm font-semibold transition-all duration-200 ${
                !isLogin
                  ? 'bg-accent/10 text-accent shadow-sm'
                  : 'text-text-muted hover:text-text-secondary'
              }`}
            >
              <UserPlus size={15} />
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className={inputClass}
                placeholder="you@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className={inputClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
            </div>

            {error && (
              <div className="text-danger text-sm bg-danger/10 border border-danger/20 rounded-lg px-4 py-2.5">
                {error}
              </div>
            )}

            {message && (
              <div className="text-accent text-sm bg-accent/10 border border-accent/20 rounded-lg px-4 py-2.5">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-surface bg-accent rounded-lg hover:bg-accent/90 disabled:opacity-50 transition-all duration-200 shadow-[0_0_20px_rgba(0,212,170,0.15)] hover:shadow-[0_0_30px_rgba(0,212,170,0.25)]"
            >
              {loading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : isLogin ? (
                <>
                  <LogIn size={16} />
                  Sign In
                </>
              ) : (
                <>
                  <UserPlus size={16} />
                  Create Account
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
