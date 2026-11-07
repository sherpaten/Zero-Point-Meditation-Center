import React, { useState } from 'react';
import { CheckCircle2, Users, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';

export default function MembershipPrompt({ open, onClose, initialName = '', initialEmail = '', initialPhone = '' }) {
  const [mode, setMode] = useState('choice');
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [member, setMember] = useState(null);

  if (!open) return null;

  const showMode = (nextMode) => {
    setMode(nextMode);
    setError('');
    setMessage('');
    setMember(null);
  };

  const loadMember = async (userId) => {
    const { data, error: profileError } = await supabase
      .from('members')
      .select('member_number, full_name, status')
      .eq('id', userId)
      .maybeSingle();
    if (profileError) throw profileError;
    if (!data) throw new Error('Your account is active, but the membership profile is not available yet. Please contact the center.');
    setMember(data);
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!isSupabaseConfigured) {
      setError('Membership registration is temporarily unavailable. You can continue as a guest.');
      return;
    }
    if (password.length < 8) {
      setError('Please use a password with at least 8 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Your passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: signupError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/membership`,
          data: { full_name: name.trim(), phone: phone.trim(), country: country.trim() },
        },
      });
      if (signupError) throw signupError;
      if (data.session && data.user) {
        await loadMember(data.user.id);
        setMessage('Welcome to the ZPMC community. Your membership has been created.');
      } else {
        setMessage('Your registration has been received. Please check your email and verify your address. After verification, sign in to view your membership number.');
        setMode('signin');
      }
    } catch (err) {
      setError(err.message || 'Registration could not be completed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleSignin = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!isSupabaseConfigured) {
      setError('Membership login is temporarily unavailable. You can continue as a guest.');
      return;
    }
    setLoading(true);
    try {
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });
      if (loginError) throw loginError;
      await loadMember(data.user.id);
      setMessage('You are signed in to your ZPMC membership.');
    } catch (err) {
      setError(err.message || 'Sign in failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-stone-950/75 p-4 backdrop-blur-sm" role="presentation">
      <section role="dialog" aria-modal="true" aria-labelledby="membership-invite-title" className="relative my-auto max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-amber-200 bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" onClick={onClose} aria-label="Close membership invitation" className="absolute right-4 top-4 rounded-full p-2 text-stone-500 hover:bg-stone-100"><X size={20}/></button>
        <div className="text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-buddhist-gold"><Users size={27}/></div>
          <p className="mt-4 text-xs font-bold uppercase tracking-[0.18em] text-amber-700">ZPMC Community</p>
          <h2 id="membership-invite-title" className="mt-2 font-serif text-2xl font-bold text-buddhist-burgundy">Stay connected with our sangha</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">Your booking has been submitted. Would you like to join the ZPMC community? Membership is optional — you can continue as a guest.</p>
        </div>

        {member ? (
          <div className="mt-6 rounded-2xl border-2 border-amber-200 bg-buddhist-bg p-6 text-center">
            <CheckCircle2 className="mx-auto text-emerald-700" size={30}/>
            <h3 className="mt-2 font-serif text-xl font-bold text-buddhist-burgundy">Welcome, {member.full_name}</h3>
            <p className="mt-4 text-xs font-semibold uppercase tracking-widest text-stone-500">Your membership number</p>
            <p className="mt-1 font-serif text-5xl font-bold text-buddhist-burgundy">{member.member_number ?? 'Pending'}</p>
            <p className="mt-3 text-sm capitalize text-stone-600">Status: {member.status}</p>
            <p className="mt-4 text-xs text-stone-500">You can view your membership card and attendance history any time from the Member Login link in our website footer.</p>
            <button type="button" onClick={onClose} className="mt-5 w-full rounded-xl bg-buddhist-burgundy px-5 py-3 font-semibold text-white hover:bg-red-900">Continue</button>
          </div>
        ) : mode === 'choice' ? (
          <div className="mt-7 space-y-3">
            <button type="button" onClick={() => showMode('signup')} className="w-full rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white hover:bg-red-900">Join the community</button>
            <button type="button" onClick={() => showMode('signin')} className="w-full rounded-xl border border-buddhist-burgundy px-5 py-3.5 font-semibold text-buddhist-burgundy hover:bg-amber-50">Already a member? Sign in</button>
            <button type="button" onClick={onClose} className="w-full px-5 py-3 text-sm font-medium text-stone-500 underline underline-offset-4">Continue as guest</button>
          </div>
        ) : (
          <form onSubmit={mode === 'signup' ? handleSignup : handleSignin} className="mt-6 space-y-4">
            {mode === 'signup' && <>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-name">Full name</label><input id="invite-name" value={name} onChange={e => setName(e.target.value)} required maxLength={120} autoComplete="name" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-phone">Phone number (optional)</label><input id="invite-phone" value={phone} onChange={e => setPhone(e.target.value)} maxLength={40} autoComplete="tel" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-country">Country (optional)</label><input id="invite-country" value={country} onChange={e => setCountry(e.target.value)} maxLength={100} autoComplete="country-name" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            </>}
            <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-email">Email address</label><input id="invite-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} autoComplete="email" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-password">Password</label><input id="invite-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            {mode === 'signup' && <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-confirm-password">Confirm password</label><input id="invite-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>}
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
            <button type="submit" disabled={loading} className="w-full rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white hover:bg-red-900 disabled:opacity-60">{loading ? 'Please wait…' : mode === 'signup' ? 'Create membership' : 'Sign in'}</button>
            <button type="button" onClick={() => showMode(mode === 'signup' ? 'signin' : 'signup')} className="w-full text-sm font-medium text-buddhist-burgundy underline">{mode === 'signup' ? 'Already a member? Sign in' : 'New to ZPMC? Create membership'}</button>
            <button type="button" onClick={() => showMode('choice')} className="w-full text-xs text-stone-500 underline">Back to options</button>
          </form>
        )}
        {error && mode === 'choice' && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && mode === 'choice' && <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
        {mode !== 'choice' && !member && <p className="mt-4 text-center text-xs text-stone-500">Membership is optional. You may close this window and keep your booking as a guest.</p>}
      </section>
    </div>
  );
}
