import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { supabase } from './lib/supabase';
import type { Session as SupaSession } from '@supabase/supabase-js';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Sessions from './pages/Sessions';
import Clients from './pages/Clients';
import Packages from './pages/Packages';
import Coaches from './pages/Coaches';
import AuthForm from './components/AuthForm';

export default function App() {
  const [session, setSession] = useState<SupaSession | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionError, setConnectionError] = useState<string | null>(null);

  useEffect(() => {
    const timeout = new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('Timed out connecting to Supabase after 8s')), 8000)
    );

    Promise.race([supabase.auth.getSession(), timeout])
      .then((result) => {
        const { data: { session } } = result as Awaited<ReturnType<typeof supabase.auth.getSession>>;
        setSession(session);
        setLoading(false);
      })
      .catch((err: unknown) => {
        setConnectionError(err instanceof Error ? err.message : String(err));
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (connectionError) {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-body p-6">
        <div className="max-w-lg w-full bg-surface-elevated border border-red-500/30 rounded-xl p-8">
          <h1 className="font-display text-2xl text-red-400 mb-3">Can't reach Supabase</h1>
          <p className="text-text-primary text-sm mb-4">{connectionError}</p>
          <div className="text-text-muted text-xs space-y-2">
            <p>
              Configured URL:{' '}
              <code className="text-text-primary">{supabaseUrl || '(not set)'}</code>
            </p>
            <p>Likely causes:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>The Supabase project was paused or deleted</li>
              <li><code>VITE_SUPABASE_URL</code> / <code>VITE_SUPABASE_ANON_KEY</code> in <code>.env</code> are wrong</li>
              <li>No internet connection</li>
            </ul>
            <p className="pt-2">
              Fix <code>.env</code> and restart <code>npm run dev</code>, or{' '}
              <button
                onClick={() => {
                  localStorage.clear();
                  location.reload();
                }}
                className="text-accent underline hover:text-accent/80"
              >
                clear local session and retry
              </button>
              .
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-surface flex items-center justify-center font-body">
        <div className="text-text-muted text-sm">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return <AuthForm />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/clients" element={<Clients />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/coaches" element={<Coaches />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
