import React, { useEffect, useState } from 'react';
import { CheckCircle2, Users, X } from 'lucide-react';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { QRCodeSVG } from 'qrcode.react';

export default function MembershipPrompt({ open, onClose, initialName = '', initialEmail = '', initialPhone = '', source = 'booking' }) {
  const [mode, setMode] = useState('choice');
  const [name, setName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [country, setCountry] = useState('');
  const [membershipPlan, setMembershipPlan] = useState('yearly');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentProofPath, setPaymentProofPath] = useState('');
  const [proofUploading, setProofUploading] = useState(false);
  const [zelleQrOpen, setZelleQrOpen] = useState(false);
  const zelleQrValue = 'https://enroll.zellepay.com/qr-codes?data=eyJuYW1lIjoiWkVSTyBQT0lOVCBNRURJVEFUSU9OIENFTlRFUiBJTkMuIiwiYWN0aW9uIjoicGF5bWVudCIsInRva2VuIjoiNjQ2NDU2MDg0MyJ9';
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [member, setMember] = useState(null);

  useEffect(() => {
    if (!open) return;
    setMode('choice');
    setName(initialName);
    setEmail(initialEmail);
    setPhone(initialPhone);
    setCountry('');
    setMembershipPlan('yearly');
    setPaymentProof(null);
    setPaymentProofPath('');
    setProofUploading(false);
    setZelleQrOpen(false);
    setPassword('');
    setConfirmPassword('');
    setLoading(false);
    setError('');
    setMessage('');
    setMember(null);
  }, [open, initialName, initialEmail, initialPhone]);

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

  const handlePaymentProofSelection = (event) => {
    const file = event.target.files?.[0] || null;
    setPaymentProof(file);
    setPaymentProofPath('');
    setError('');
    setMessage('');
  };

  const handleUploadPaymentProof = async () => {
    setError('');
    setMessage('');
    if (!paymentProof) return setError('Please choose your payment receipt first.');
    if (!['image/jpeg', 'image/png', 'image/webp', 'application/pdf'].includes(paymentProof.type)) return setError('Upload a JPG, PNG, WebP, or PDF receipt.');
    if (paymentProof.size <= 0 || paymentProof.size > 10 * 1024 * 1024) return setError('Your payment proof must be smaller than 10 MB.');
    if (!isSupabaseConfigured) return setError('Secure payment upload is not configured yet.');

    setProofUploading(true);
    try {
      const urlResponse = await fetch('/api/membership-proof-upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contentType: paymentProof.type, size: paymentProof.size }),
      });
      const uploadDetails = await urlResponse.json().catch(() => ({}));
      if (!urlResponse.ok) throw new Error(uploadDetails.error || 'Could not prepare the secure upload.');
      const { error: uploadError } = await supabase.storage
        .from('membership-payment-proofs')
        .uploadToSignedUrl(uploadDetails.path, uploadDetails.token, paymentProof, {
          contentType: paymentProof.type,
          upsert: false,
        });
      if (uploadError) throw uploadError;
      setPaymentProofPath(uploadDetails.path);
      setMessage('Payment proof uploaded securely. You can now create your membership.');
    } catch (uploadError) {
      setPaymentProofPath('');
      setError(uploadError.message || 'Payment proof upload failed. Please try again.');
    } finally {
      setProofUploading(false);
    }
  };

  const handleSignup = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    if (!isSupabaseConfigured) {
      setError('Membership registration is temporarily unavailable. You can continue as a guest.');
      return;
    }
    if (!paymentProofPath) {
      setError('Please upload your payment proof before creating your membership.');
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
          data: { full_name: name.trim(), phone: phone.trim(), country: country.trim(), membership_plan: membershipPlan, payment_proof_path: paymentProofPath },
        },
      });
      if (signupError) throw signupError;
      try {
        const notificationResponse = await fetch('/api/membership-notification', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim(),
            country: country.trim(),
            membershipPlan,
            paymentProofUploaded: true,
          }),
        });
        if (!notificationResponse.ok) {
          console.error('Membership was created, but the team notification email could not be sent.');
        }
      } catch (notificationError) {
        console.error('Membership was created, but the team notification request failed:', notificationError);
      }
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
          <h2 id="membership-invite-title" className="mt-2 font-serif text-2xl font-bold text-buddhist-burgundy">{source === 'booking' ? 'Stay connected with our sangha' : 'Register for ZPMC Membership'}</h2>
          <p className="mt-3 text-sm leading-6 text-stone-600">{source === 'booking' ? 'Your booking has been submitted. Would you like to join the ZPMC community? Membership is optional — you can continue as a guest.' : 'Join the Zero Point Meditation Center community or sign in if you already have a membership account.'}</p>
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
            {mode === 'signup' && (
              <section className="rounded-2xl border border-amber-200 bg-amber-50/70 p-4" aria-label="Membership prices and benefits">
                <h3 className="font-serif text-lg font-bold text-buddhist-burgundy">Membership options</h3>
                <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
                  <button type="button" onClick={() => setMembershipPlan('yearly')} aria-pressed={membershipPlan === 'yearly'} className={`rounded-xl border p-3 text-left transition ${membershipPlan === 'yearly' ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
                    <p className="text-xs font-semibold text-buddhist-burgundy">Yearly</p><p className="mt-1 text-xl font-bold text-buddhist-burgundy">$25<span className="text-xs font-medium text-stone-500"> / year</span></p><p className="mt-1 text-xs font-semibold text-amber-800">New members: 2 years for $25</p>
                  </button>
                  <button type="button" onClick={() => setMembershipPlan('benefactor')} aria-pressed={membershipPlan === 'benefactor'} className={`rounded-xl border p-3 text-left transition ${membershipPlan === 'benefactor' ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
                    <p className="text-xs font-semibold text-buddhist-burgundy">Benefactor</p><p className="mt-1 text-xl font-bold text-buddhist-burgundy">$500<span className="text-xs font-medium text-stone-500"> / year</span></p>
                  </button>
                  <button type="button" onClick={() => setMembershipPlan('lifetime')} aria-pressed={membershipPlan === 'lifetime'} className={`rounded-xl border p-3 text-left transition ${membershipPlan === 'lifetime' ? 'border-amber-500 bg-amber-100 ring-2 ring-amber-300' : 'border-stone-200 bg-white hover:border-amber-300'}`}>
                    <p className="text-xs font-semibold text-buddhist-burgundy">Lifetime</p><p className="mt-1 text-xl font-bold text-buddhist-burgundy">$3,000</p><p className="mt-1 text-xs text-stone-500">One-time</p>
                  </button>
                </div>
                <p className="mt-3 text-xs font-semibold text-buddhist-burgundy">Selected: {membershipPlan === 'yearly' ? 'Yearly Membership — $25 (2 years for $25 for new members)' : membershipPlan === 'benefactor' ? 'Benefactor Membership — $500/year' : 'Lifetime Membership — $3,000 one-time'}</p>
                <h4 className="mt-4 text-sm font-bold text-buddhist-burgundy">Member benefits</h4>
                <ul className="mt-2 space-y-1.5 text-xs leading-5 text-stone-700">
                  <li>• Access to 200+ free meditation sessions every Saturday and Sunday.</li>
                  <li>• Free English Learning Camp in 2027 (approximately 4–6 months).</li>
                  <li>• One butter lamp offering made in each new member’s name.</li>
                  <li>• Connection with the ZPMC community.</li>
                </ul>
                <p className="mt-3 text-[11px] leading-4 text-stone-500">To complete registration, pay the selected membership fee using the Zelle QR and upload your payment receipt below. Your account is created after the receipt uploads successfully.</p>
              </section>
            )}
            {mode === 'signup' && <>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-name">Full name</label><input id="invite-name" value={name} onChange={e => setName(e.target.value)} required maxLength={120} autoComplete="name" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-phone">Phone number (optional)</label><input id="invite-phone" value={phone} onChange={e => setPhone(e.target.value)} maxLength={40} autoComplete="tel" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-country">Country (optional)</label><input id="invite-country" value={country} onChange={e => setCountry(e.target.value)} maxLength={100} autoComplete="country-name" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            </>}
            <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-email">Email address</label><input id="invite-email" type="email" value={email} onChange={e => setEmail(e.target.value)} required maxLength={254} autoComplete="email" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-password">Password</label><input id="invite-password" type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={8} autoComplete={mode === 'signup' ? 'new-password' : 'current-password'} className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>
            {mode === 'signup' && <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-confirm-password">Confirm password</label><input id="invite-confirm-password" type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={8} autoComplete="new-password" className="w-full rounded-xl border border-stone-300 px-4 py-3 outline-none focus:border-amber-700"/></div>}
            {mode === 'signup' && <section className="space-y-3 rounded-2xl border border-amber-200 bg-amber-50/70 p-4" aria-label="Zelle payment and receipt upload">
              <h4 className="font-semibold text-buddhist-burgundy">Payment and proof of payment</h4>
              <p className="text-xs leading-5 text-stone-600">Please pay the selected membership fee using Zelle, then upload your receipt. Your payment proof is stored privately and can only be viewed by authorised ZPMC administrators.</p>
              <button type="button" onClick={() => setZelleQrOpen(true)} className="w-full rounded-xl border border-buddhist-burgundy bg-white px-4 py-3 font-semibold text-buddhist-burgundy hover:bg-amber-50">View Zelle Payment QR</button>
              <div><label className="mb-1 block text-sm font-medium text-stone-700" htmlFor="invite-payment-proof">Upload payment proof (JPG, PNG, WebP, or PDF · max 10 MB)</label><input id="invite-payment-proof" type="file" accept="image/jpeg,image/png,image/webp,application/pdf" onChange={handlePaymentProofSelection} className="w-full rounded-xl border border-stone-300 bg-white px-3 py-3 text-sm" /></div>
              {paymentProof && <p className="text-xs text-stone-600">Selected: {paymentProof.name}</p>}
              <button type="button" onClick={handleUploadPaymentProof} disabled={!paymentProof || proofUploading || Boolean(paymentProofPath)} className="w-full rounded-xl border border-amber-700 px-4 py-3 font-semibold text-amber-900 disabled:cursor-not-allowed disabled:opacity-50">{proofUploading ? 'Uploading receipt…' : paymentProofPath ? 'Payment proof uploaded' : 'Upload Payment Proof'}</button>
              {paymentProofPath && <p role="status" className="text-xs font-medium text-emerald-800">Payment proof uploaded successfully.</p>}
            </section>}
            {error && <p role="alert" className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
            {message && <p role="status" className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
            <button type="submit" disabled={loading || (mode === 'signup' && !paymentProofPath)} className="w-full rounded-xl bg-buddhist-burgundy px-5 py-3.5 font-semibold text-white hover:bg-red-900 disabled:opacity-60">{loading ? 'Please wait…' : mode === 'signup' ? 'Create membership' : 'Sign in'}</button>
            <button type="button" onClick={() => showMode(mode === 'signup' ? 'signin' : 'signup')} className="w-full text-sm font-medium text-buddhist-burgundy underline">{mode === 'signup' ? 'Already a member? Sign in' : 'New to ZPMC? Create membership'}</button>
            <button type="button" onClick={() => showMode('choice')} className="w-full text-xs text-stone-500 underline">Back to options</button>
          </form>
        )}
        {error && mode === 'choice' && <p role="alert" className="mt-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</p>}
        {message && mode === 'choice' && <p role="status" className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">{message}</p>}
        {mode !== 'choice' && !member && <p className="mt-4 text-center text-xs text-stone-500">{source === 'booking' ? 'Membership is optional. You may close this window and keep your booking as a guest.' : 'Your ZPMC membership account gives you access to your member information and community updates.'}</p>}
      </section>
      {zelleQrOpen && <div className="fixed inset-0 z-[140] flex items-center justify-center bg-stone-950/80 p-4" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setZelleQrOpen(false); }}>
        <section role="dialog" aria-modal="true" aria-labelledby="zelle-qr-title" className="w-full max-w-sm rounded-2xl bg-white p-6 text-center shadow-2xl">
          <button type="button" onClick={() => setZelleQrOpen(false)} aria-label="Close Zelle QR" className="float-right rounded-full p-2 text-stone-500 hover:bg-stone-100"><X size={19}/></button>
          <h3 id="zelle-qr-title" className="font-serif text-xl font-bold text-buddhist-burgundy">Zelle Payment QR</h3>
          <p className="mt-2 text-sm text-stone-600">Scan to pay Zero Point Meditation Center.</p>
          <div className="mx-auto mt-4 flex justify-center rounded-xl border border-stone-200 bg-white p-4"><QRCodeSVG value={zelleQrValue} size={220} level="H" includeMargin /></div>
          <p className="mt-3 text-xs text-stone-500">After payment, close this window and upload your receipt.</p>
          <button type="button" onClick={() => setZelleQrOpen(false)} className="mt-4 w-full rounded-xl bg-buddhist-burgundy px-4 py-3 font-semibold text-white">Close</button>
        </section>
      </div>}
    </div>
  );
}
