import React, { useCallback, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

const button = 'rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50';
const dateLabel = (value) => value ? new Date(value).toLocaleString() : '—';
const amountLabel = (record) => `${record.currency || 'USD'} ${Number(record.amount || 0).toFixed(2)}`;

export default function PaymentReceiptsAdmin() {
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [workingId, setWorkingId] = useState('');
  const [filter, setFilter] = useState('all');
  const [notice, setNotice] = useState('');
  const [noticeError, setNoticeError] = useState(false);
  const [selected, setSelected] = useState(null);
  const [proofLinks, setProofLinks] = useState({});

  const getFreshAccessToken = useCallback(async () => {
    if (!supabase) throw new Error('Administrator sign-in is unavailable.');
    const { data, error } = await supabase.auth.getSession();
    if (error) throw error;
    let activeSession = data?.session || null;
    const isValidJwt = (value) => typeof value === 'string' && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);

    // A corrupted/stale browser token can contain non-JWT characters. Refresh
    // it once before sending anything in an HTTP Authorization header.
    if (!isValidJwt(activeSession?.access_token)) {
      const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
      if (refreshError) throw new Error('Your saved administrator session could not be refreshed. Please sign out and sign in again.');
      activeSession = refreshed?.session || null;
    }
    if (!isValidJwt(activeSession?.access_token)) {
      throw new Error('Your administrator session token is damaged. Please sign out, sign in again, and reload this page.');
    }
    // Do not write this session back into React state here. This function is
    // called by loadRecords(), which is triggered by the session state effect.
    // Updating session on every load would retrigger that effect indefinitely.
    return activeSession.access_token;
  }, []);

  const loadRecords = useCallback(async () => {
    setLoading(true);
    try {
      const accessToken = await getFreshAccessToken();
      const response = await fetch('/api/admin-payment-receipts', { headers: { Authorization: `Bearer ${accessToken}` } });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not load payment records.');
      setRecords(result.records || []);
    } catch (error) {
      setNotice(error.message || 'Could not load payment records.');
      setNoticeError(true);
    } finally { setLoading(false); }
  }, [getFreshAccessToken]);

  useEffect(() => {
    if (!supabase) { setAuthLoading(false); return undefined; }
    let mounted = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data?.session || null);
      setAuthLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      if (mounted) setSession(nextSession || null);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  useEffect(() => { if (session) loadRecords(); }, [session, loadRecords]);

  async function act(record, action) {
    if (!session?.access_token) return;
    if (action === 'reject' && !window.confirm('Reject this payment record? No paid receipt will be issued.')) return;
    setWorkingId(record.id); setNotice(''); setNoticeError(false);
    try {
      const accessToken = await getFreshAccessToken();
      const response = await fetch('/api/admin-payment-receipts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${accessToken}` },
        body: JSON.stringify({ id: record.id, action }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'Could not update this payment.');
      if (action === 'proof') {
        setProofLinks((current) => ({ ...current, [record.id]: result.signedUrl }));
        setNotice('Secure payment proof link created. It expires in 60 seconds.');
      } else {
        setNotice(action === 'reject' ? 'Payment record rejected.' : result.emailSent ? 'Payment verified and official receipt emailed to the client.' : 'Payment marked paid and receipt number created, but the email could not be sent. Use Resend receipt.');
        if (result.warning) setNotice(result.warning);
        await loadRecords();
        if (selected?.id === record.id) setSelected(result.record);
      }
    } catch (error) { setNotice(error.message || 'Action failed.'); setNoticeError(true); }
    finally { setWorkingId(''); }
  }

  async function signOut() {
    if (!supabase) return;
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      setNotice(error.message || 'Could not sign out. Please try again.');
      setNoticeError(true);
    }
  }

  const visible = records.filter((record) => filter === 'all' || record.status === filter);
  const pendingCount = records.filter((record) => record.status === 'pending').length;
  const paidCount = records.filter((record) => record.status === 'paid').length;

  if (authLoading) return <main className="mx-auto max-w-6xl p-8">Checking administrator session…</main>;
  if (!session) return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold text-buddhist-burgundy">Administrator sign-in required</h1><p className="mt-3 text-gray-600">Sign in with your authorized ZPMC administrator account to view payment records.</p><a className="mt-5 inline-block rounded-lg bg-amber-800 px-5 py-3 font-semibold text-white" href="/admin-login">Go to Admin Login</a></main>;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <style>{'@media print { body * { visibility:hidden !important; } #zpmc-print-receipt, #zpmc-print-receipt * { visibility:visible !important; } .receipt-overlay { position:static !important; display:block !important; inset:auto !important; padding:0 !important; background:#fff !important; } .receipt-dialog { max-height:none !important; overflow:visible !important; width:100% !important; max-width:none !important; margin:0 !important; padding:0 !important; border:0 !important; box-shadow:none !important; } #zpmc-print-receipt { position:absolute; inset:0; width:100%; margin:0; padding:24px; } .no-print { display:none !important; } }'}</style>
      <header className="no-print relative z-[60] pointer-events-auto mb-8 flex flex-wrap items-center justify-between gap-4">
        <div><p className="text-sm font-semibold tracking-widest text-amber-800">ZERO POINT MEDITATION CENTER</p><h1 className="mt-2 font-serif text-3xl font-bold text-buddhist-burgundy">Donations & Payment Receipts</h1><p className="mt-2 text-sm text-gray-600">Review payments, verify funds received, and issue official receipts to clients.</p></div>
        <div className="flex flex-wrap gap-2"><a href="/membership-admin" className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold">Membership Admin</a><button type="button" onClick={() => loadRecords()} disabled={loading} className="pointer-events-auto relative z-[61] cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50 disabled:cursor-wait disabled:opacity-60">{loading ? 'Refreshing…' : 'Refresh'}</button><button type="button" onClick={signOut} className="pointer-events-auto relative z-[61] cursor-pointer rounded-lg border border-gray-300 px-4 py-2 text-sm font-semibold hover:bg-gray-50">Sign Out</button></div>
      </header>
      <div className="no-print mb-6 rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">Signed in as</p><p className="font-semibold">{session.user?.email}</p></div>
      {notice && <div role="status" className={`no-print mb-5 rounded-lg p-4 text-sm ${noticeError ? 'bg-red-50 text-red-800' : 'bg-green-50 text-green-800'}`}>{notice}</div>}
      <section className="no-print mb-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        {[['Pending verification',pendingCount],['Verified / paid',paidCount],['All records',records.length]].map(([label,value]) => <div key={label} className="rounded-xl border bg-white p-5"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-3xl font-bold text-buddhist-burgundy">{value}</p></div>)}
      </section>
      <section className="no-print rounded-2xl border bg-white p-4 shadow-sm sm:p-6">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-semibold">Payment records</h2><select value={filter} onChange={(event) => setFilter(event.target.value)} className="rounded-lg border px-3 py-2 text-sm"><option value="pending">Pending verification</option><option value="paid">Paid / receipts issued</option><option value="rejected">Rejected</option><option value="all">All records</option></select></div>
        {loading ? <p className="py-8 text-center text-gray-500">Loading payment records…</p> : visible.length === 0 ? <p className="py-8 text-center text-gray-500">No payment records in this view. If this is a new setup, apply the payment-receipts SQL migration in Supabase first.</p> : (
          <div className="space-y-4">{visible.map((record) => <article key={record.id} className="rounded-xl border border-gray-200 p-4">
            <div className="flex flex-wrap items-start justify-between gap-3"><div><div className="flex flex-wrap items-center gap-2"><span className="rounded-full bg-stone-100 px-2.5 py-1 text-xs font-semibold uppercase">{record.payment_type}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${record.status === 'paid' ? 'bg-green-100 text-green-800' : record.status === 'rejected' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-900'}`}>{record.status}</span></div><h3 className="mt-2 text-lg font-semibold">{record.payer_name}</h3><p className="text-sm text-gray-600">{record.payer_email}</p><p className="mt-2 text-sm text-gray-600">{record.membership_plan || record.purpose || '—'} · {record.payment_method}</p><p className="mt-1 text-xs text-gray-500">Submitted: {dateLabel(record.created_at)}</p>{record.receipt_number && <p className="mt-1 text-sm font-semibold text-green-800">Receipt: {record.receipt_number}</p>}</div><p className="text-xl font-bold text-buddhist-burgundy">{amountLabel(record)}</p></div>
            <div className="mt-4 flex flex-wrap gap-2">
              {record.payment_proof_path && <button disabled={workingId===record.id} onClick={() => act(record,'proof')} className={`${button} border border-amber-800 text-amber-900`}>View payment proof</button>}
              {proofLinks[record.id] && <a href={proofLinks[record.id]} target="_blank" rel="noreferrer" className={`${button} bg-amber-50 text-amber-900 underline`}>Open proof (60 sec)</a>}
              {record.status === 'pending' && <><button disabled={workingId===record.id} onClick={() => act(record,'issue')} className={`${button} bg-green-700 text-white`}>{workingId===record.id?'Working…':'Verify payment & issue receipt'}</button><button disabled={workingId===record.id} onClick={() => act(record,'reject')} className={`${button} border border-red-300 text-red-700`}>Reject</button></>}
              {record.status === 'paid' && <><button onClick={() => setSelected(record)} className={`${button} border border-gray-300`}>View / Print receipt</button><button disabled={workingId===record.id} onClick={() => act(record,'resend')} className={`${button} bg-amber-800 text-white`}>Resend receipt email</button></>}
            </div>
          </article>)}</div>
        )}
      </section>
      {selected && <div className="receipt-overlay fixed inset-0 z-[120] flex items-center justify-center bg-black/60 p-3 sm:p-6" onClick={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
        <section className="receipt-dialog max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl sm:p-8">
          <div id="zpmc-print-receipt" className="border border-gray-200 p-5 sm:p-8">
            <p className="text-xs font-bold tracking-widest text-amber-800">ZERO POINT MEDITATION CENTER INC.</p><h2 className="mt-2 font-serif text-3xl font-bold text-buddhist-burgundy">Official Payment Receipt</h2>
            <div className="mt-6 grid gap-3 border-y py-4 sm:grid-cols-2"><div><p className="text-xs text-gray-500">Receipt number</p><p className="font-bold">{selected.receipt_number}</p></div><div><p className="text-xs text-gray-500">Payment date</p><p className="font-semibold">{dateLabel(selected.verified_at)}</p></div></div>
            <div className="mt-5 space-y-3 text-sm"><p><strong>Received from:</strong> {selected.payer_name}</p><p><strong>Email:</strong> {selected.payer_email}</p><p><strong>Payment type:</strong> {selected.payment_type === 'membership' ? 'Membership' : 'Donation'}</p>{selected.membership_plan && <p><strong>Membership plan:</strong> {selected.membership_plan}</p>}{selected.purpose && <p><strong>Purpose:</strong> {selected.purpose}</p>}<p><strong>Payment method:</strong> {selected.payment_method}</p></div>
            <div className="mt-7 rounded-xl bg-amber-50 p-5"><p className="text-sm text-gray-600">Amount received</p><p className="mt-1 text-3xl font-bold text-buddhist-burgundy">{amountLabel(selected)}</p></div>
            <p className="mt-7 text-sm leading-6">This receipt confirms that Zero Point Meditation Center Inc. has recorded the payment above as received.</p><p className="mt-6 text-sm">With gratitude,<br/><strong>Zero Point Meditation Center Inc.</strong><br/>www.zeropointmeditationcenter.org</p>
          </div>
          <div className="no-print mt-5 flex flex-wrap justify-end gap-2"><button onClick={() => setSelected(null)} className="rounded-lg border px-4 py-2 text-sm font-semibold">Close</button><button onClick={() => window.print()} className="rounded-lg bg-amber-800 px-4 py-2 text-sm font-semibold text-white">Print / Save as PDF</button></div>
        </section>
      </div>}
    </main>
  );
}
