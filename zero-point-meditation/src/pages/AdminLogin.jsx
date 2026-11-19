import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let active = true;

    async function checkExistingSession() {
      if (!supabase) {
        if (active) setChecking(false);
        return;
      }

      const { data } = await supabase.auth.getSession();
      const currentUser = data?.session?.user;

      if (currentUser) {
        const { data: admin, error } = await supabase
          .from('admin_users')
          .select('user_id')
          .eq('user_id', currentUser.id)
          .maybeSingle();

        if (!active) return;

        if (!error && admin) {
          navigate('/membership-admin', { replace: true });
          return;
        }
      }

      if (active) setChecking(false);
    }

    checkExistingSession();
    return () => { active = false; };
  }, [navigate]);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!supabase) return;

    setLoading(true);
    setNotice('');

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      setNotice('Sign-in failed. Check your administrator email and password.');
      setLoading(false);
      return;
    }

    const { data: admin, error: adminError } = await supabase
      .from('admin_users')
      .select('user_id')
      .eq('user_id', data.user.id)
      .maybeSingle();

    if (adminError || !admin) {
      await supabase.auth.signOut();
      setNotice('Access denied. This login is not registered as a ZPMC administrator.');
      setLoading(false);
      return;
    }

    navigate('/membership-admin', { replace: true });
  }

  async function handlePasswordReset() {
    if (!supabase || !email.trim()) {
      setNotice('Enter your administrator email address first.');
      return;
    }

    setLoading(true);
    setNotice('');

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${window.location.origin}/membership`,
    });

    setNotice(error
      ? 'Could not send the password reset email. Please check the address and try again.'
      : 'If the address is registered, a password reset email has been sent.');
    setLoading(false);
  }

  if (checking) {
    return <main className="mx-auto flex min-h-[65vh] max-w-lg items-center justify-center px-6"><p className="text-stone-600">Checking administrator session…</p></main>;
  }

  return (
    <main className="flex min-h-[70vh] items-center justify-center px-4 py-12">
      <section className="w-full max-w-md rounded-2xl border border-stone-200 bg-white p-7 shadow-sm sm:p-9">
        <p className="text-center text-xs font-semibold tracking-[0.2em] text-amber-800">ZERO POINT MEDITATION CENTER</p>
        <h1 className="mt-3 text-center font-serif text-3xl font-bold text-buddhist-burgundy">Administrator Sign In</h1>
        <p className="mt-3 text-center text-sm leading-6 text-stone-600">Private access for authorized ZPMC administrators. Member accounts cannot access this dashboard.</p>

        {!isSupabaseConfigured && <p className="mt-6 rounded-lg bg-red-50 p-3 text-sm text-red-800">Administrator sign-in is temporarily unavailable.</p>}

        {notice && <p role="status" className="mt-6 rounded-lg bg-amber-50 p-3 text-sm text-stone-800">{notice}</p>}

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div>
            <label htmlFor="admin-email" className="mb-2 block text-sm font-medium text-stone-700">Administrator Email</label>
            <input id="admin-email" type="email" autoComplete="username" required value={email} onChange={(event) => setEmail(event.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100" placeholder="Enter administrator email" />
          </div>
          <div>
            <label htmlFor="admin-password" className="mb-2 block text-sm font-medium text-stone-700">Password</label>
            <input id="admin-password" type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} className="w-full rounded-lg border border-stone-300 px-4 py-3 outline-none focus:border-amber-700 focus:ring-2 focus:ring-amber-100" placeholder="Enter administrator password" />
          </div>
          <button type="submit" disabled={loading || !isSupabaseConfigured} className="w-full rounded-lg bg-buddhist-burgundy px-6 py-3.5 font-semibold text-white transition hover:bg-buddhist-burgundy/90 disabled:cursor-not-allowed disabled:opacity-60">{loading ? 'Signing in…' : 'Sign In to Admin Dashboard'}</button>
        </form>

        <button type="button" onClick={handlePasswordReset} disabled={loading || !isSupabaseConfigured} className="mt-5 w-full text-center text-sm font-medium text-buddhist-burgundy underline disabled:opacity-50">Forgot administrator password?</button>
        <div className="mt-7 border-t border-stone-200 pt-5 text-center">
          <Link to="/home" className="text-sm text-stone-600 underline hover:text-buddhist-burgundy">Return to ZPMC website</Link>
        </div>
      </section>
    </main>
  );
}
