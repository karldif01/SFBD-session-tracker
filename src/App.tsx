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

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

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
