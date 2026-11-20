import React,{useCallback,useEffect,useState} from 'react';
import {supabase} from '../lib/supabase';

const field='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm';
const btn='rounded-lg px-3 py-2 text-sm font-semibold disabled:opacity-50';
const dateLabel=value=>value?new Date(value).toLocaleString():'—';

export default function MerchandiseAdmin(){
  const [session,setSession]=useState(null),[authLoading,setAuthLoading]=useState(true);
  const [orders,setOrders]=useState([]),[loading,setLoading]=useState(false),[working,setWorking]=useState('');
  const [notice,setNotice]=useState(''),[error,setError]=useState('');
  const [drafts,setDrafts]=useState({});
  const getToken=useCallback(async()=>{
    if(!supabase) throw new Error('Administrator sign-in is unavailable.');
    const {data,error}=await supabase.auth.getSession(); if(error) throw error;
    let active=data?.session||null;
    const valid=value=>typeof value==='string'&&/^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(value);
    if(!valid(active?.access_token)){const refreshed=await supabase.auth.refreshSession();if(refreshed.error)throw new Error('Please sign out and sign in again.');active=refreshed.data?.session||null;}
    if(!valid(active?.access_token))throw new Error('Your administrator session is invalid. Please sign in again.');
    return active.access_token;
  },[]);
  const load=useCallback(async()=>{
    setLoading(true);setError('');
    try{
      const token=await getToken();
      const response=await fetch('/api/admin-payment-receipts?view=merchandise-orders',{headers:{Authorization:'Bearer '+token}});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not load merchandise orders.');
      setOrders(result.orders||[]);
      setDrafts(Object.fromEntries((result.orders||[]).map(order=>[order.id,{
        itemAmount:order.item_amount??'',shippingAmount:order.shipping_amount??'',
        fulfillmentStatus:order.fulfillment_status||'not_started',trackingNumber:order.tracking_number||'',
        adminNotes:order.admin_notes||''
      }])));
    }catch(err){setError(err.message||'Could not load orders.');}
    finally{setLoading(false);}
  },[getToken]);
  useEffect(()=>{
    if(!supabase){setAuthLoading(false);return;}
    let active=true;
    supabase.auth.getSession().then(({data})=>{if(active){setSession(data?.session||null);setAuthLoading(false);}});
    const {data:{subscription}}=supabase.auth.onAuthStateChange((_event,next)=>{if(active)setSession(next||null);});
    return()=>{active=false;subscription.unsubscribe();};
  },[]);
  useEffect(()=>{if(session)load();},[session,load]);
  async function save(order,confirmPrice=false){
    setWorking(order.id);setNotice('');setError('');
    try{
      const token=await getToken(),draft=drafts[order.id]||{};
      const body={action:'order_update',orderId:order.id,status:confirmPrice?'awaiting_payment':order.status,
        itemAmount:draft.itemAmount===''?undefined:Number(draft.itemAmount),
        shippingAmount:draft.shippingAmount===''?undefined:Number(draft.shippingAmount),
        fulfillmentStatus:draft.fulfillmentStatus,trackingNumber:draft.trackingNumber,adminNotes:draft.adminNotes};
      const response=await fetch('/api/admin-payment-receipts',{method:'POST',headers:{'Content-Type':'application/json',Authorization:'Bearer '+token},body:JSON.stringify(body)});
      const result=await response.json();if(!response.ok)throw new Error(result.error||'Could not update this order.');
      setNotice(result.warning|| (confirmPrice?'Final amount saved and payment instructions emailed to the customer.':'Order details updated.'));
      await load();
    }catch(err){setError(err.message||'Could not update order.');}
    finally{setWorking('');}
  }
  async function signOut(){if(supabase)await supabase.auth.signOut();}
  if(authLoading)return <main className="mx-auto max-w-5xl p-8">Checking administrator session…</main>;
  if(!session)return <main className="mx-auto max-w-xl p-8 text-center"><h1 className="text-2xl font-bold text-buddhist-burgundy">Administrator sign-in required</h1><p className="mt-3 text-gray-600">Sign in with an authorized ZPMC administrator account to manage merchandise orders.</p><a className="mt-5 inline-block rounded-lg bg-amber-800 px-5 py-3 font-semibold text-white" href="/admin-login">Go to Admin Login</a></main>;
  return <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
    <header className="mb-7 flex flex-wrap items-center justify-between gap-3"><div><p className="text-xs font-bold tracking-widest text-amber-800">ZERO POINT MEDITATION CENTER</p><h1 className="mt-2 font-serif text-3xl font-bold text-buddhist-burgundy">Merchandise Orders</h1><p className="mt-2 text-sm text-gray-600">Confirm item and shipping prices, send the secure Zelle payment link, and track fulfillment.</p></div><div className="flex flex-wrap gap-2"><a href="/payment-receipts-admin" className="rounded-lg border px-3 py-2 text-sm font-semibold">Membership Payments</a><a href="/donation-admin" className="rounded-lg border px-3 py-2 text-sm font-semibold">Donations</a><a href="/merchandise-payment-receipts" className="rounded-lg border px-3 py-2 text-sm font-semibold">Merchandise Receipts</a><button onClick={load} disabled={loading} className={btn+' border'}>{loading?'Refreshing…':'Refresh'}</button><button onClick={signOut} className={btn+' border'}>Sign out</button></div></header>
    <div className="mb-5 rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">Signed in as</p><p className="font-semibold">{session.user?.email}</p></div>
    {notice&&<p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{notice}</p>}
    {error&&<p role="alert" className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p>}
    <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">{[['New requests',orders.filter(o=>o.status==='pending_confirmation').length],['Awaiting payment',orders.filter(o=>o.status==='awaiting_payment').length],['Proof submitted',orders.filter(o=>o.status==='payment_submitted').length],['Paid',orders.filter(o=>o.status==='paid').length]].map(([label,value])=><div key={label} className="rounded-xl border bg-white p-4"><p className="text-xs text-gray-500">{label}</p><p className="mt-1 text-2xl font-bold text-buddhist-burgundy">{value}</p></div>)}</div>
    {loading?<p className="py-10 text-center">Loading orders…</p>:orders.length===0?<div className="rounded-xl border bg-white p-8 text-center text-sm text-gray-600">No merchandise orders have been submitted yet.</div>:<div className="space-y-5">{orders.map(order=>{const draft=drafts[order.id]||{};return <article key={order.id} className="rounded-2xl border bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3"><div><span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold capitalize text-amber-900">{order.status.replaceAll('_',' ')}</span><h2 className="mt-2 text-lg font-bold text-buddhist-burgundy">{order.product_name} × {order.quantity}</h2><p className="text-sm text-gray-600">{order.payer_name} · {order.payer_email}</p><p className="mt-1 text-xs text-gray-500">Received {dateLabel(order.created_at)} · Order {order.id}</p></div>{order.total_amount&&<p className="text-xl font-bold">{order.currency} {Number(order.total_amount).toFixed(2)}</p>}</div>
      {order.public_token && order.status !== 'pending_confirmation' && <a className="mt-3 inline-block text-sm font-semibold text-amber-800 underline" href={"/merchandise-payment?orderId="+encodeURIComponent(order.id)+"&token="+encodeURIComponent(order.public_token)} target="_blank" rel="noreferrer">Open customer payment link</a>}
      <div className="mt-4 grid gap-3 rounded-xl bg-stone-50 p-4 text-sm sm:grid-cols-2"><p><strong>Phone:</strong> {order.phone}</p><p><strong>Listed price:</strong> {order.listed_price||'Not listed'}</p><p className="sm:col-span-2"><strong>Delivery address:</strong> {Object.values(order.delivery_address||{}).filter(Boolean).join(', ')}</p></div>
      {order.status==='payment_submitted'&&<p className="mt-4 rounded-lg bg-blue-50 p-3 text-sm text-blue-900">Payment proof submitted. Verify the funds in Merchandise Payment Receipts before marking it paid.</p>}
      <div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-gray-700">Item amount (USD)<input type="number" min="0" step="0.01" value={draft.itemAmount} onChange={e=>setDrafts(v=>({...v,[order.id]:{...v[order.id],itemAmount:e.target.value}}))} className={field+' mt-1'}/></label><label className="text-xs font-semibold text-gray-700">Shipping amount (USD)<input type="number" min="0" step="0.01" value={draft.shippingAmount} onChange={e=>setDrafts(v=>({...v,[order.id]:{...v[order.id],shippingAmount:e.target.value}}))} className={field+' mt-1'}/></label></div>
      {order.status==='pending_confirmation'&&<button onClick={()=>save(order,true)} disabled={working===order.id} className={btn+' mt-4 bg-buddhist-burgundy text-white'}>{working===order.id?'Saving…':'Confirm final amount & email payment link'}</button>}
      {order.status!=='pending_confirmation'&&<div className="mt-5 grid gap-3 sm:grid-cols-2"><label className="text-xs font-semibold text-gray-700">Fulfillment status<select value={draft.fulfillmentStatus} onChange={e=>setDrafts(v=>({...v,[order.id]:{...v[order.id],fulfillmentStatus:e.target.value}}))} className={field+' mt-1'}><option value="not_started">Not started</option><option value="processing">Processing</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option></select></label><label className="text-xs font-semibold text-gray-700">Tracking number<input value={draft.trackingNumber} onChange={e=>setDrafts(v=>({...v,[order.id]:{...v[order.id],trackingNumber:e.target.value}}))} className={field+' mt-1'}/></label><label className="text-xs font-semibold text-gray-700 sm:col-span-2">Internal admin notes<textarea rows="2" value={draft.adminNotes} onChange={e=>setDrafts(v=>({...v,[order.id]:{...v[order.id],adminNotes:e.target.value}}))} className={field+' mt-1'}/></label></div>}
      {order.status!=='pending_confirmation'&&<button onClick={()=>save(order,false)} disabled={working===order.id} className={btn+' mt-4 border border-amber-800 text-amber-900'}>{working===order.id?'Saving…':'Save fulfillment / order updates'}</button>}
      {order.payment_record_id&&<p className="mt-3 text-xs text-gray-500">Payment record: {order.payment_record_id}</p>}
    </article>})}</div>}
  </main>;
}
