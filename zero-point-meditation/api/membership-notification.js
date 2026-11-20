import { createClient } from '@supabase/supabase-js';

const recipients = ['bookings@zeropointmeditationcenter.org', 'admin@zeropointmeditationcenter.org'];
const allowedOrigins = new Set(['https://www.zeropointmeditationcenter.org','https://zeropointmeditationcenter.org','https://zero-point-meditation-center.vercel.app']);
const plans = {
  yearly: { label:'Yearly Membership — $25/year (new-member offer: 2 years for $25)', amount:25 },
  benefactor: { label:'Benefactor Membership — $500/year', amount:500 },
  lifetime: { label:'Lifetime Membership — $3,000 one-time', amount:3000 },
};
const clean = (value, max=254) => typeof value === 'string' ? value.trim().slice(0,max) : '';

export default async function handler(req,res) {
  res.setHeader('Cache-Control','no-store');
  if(req.method!=='POST'){res.setHeader('Allow','POST');return res.status(405).json({error:'Method not allowed.'});}
  const origin=req.headers.origin;
  const preview=typeof origin==='string' && /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin);
  if(!origin || (!allowedOrigins.has(origin)&&!preview)) return res.status(403).json({error:'Request origin is not allowed.'});
  const body=typeof req.body==='string'?(()=>{try{return JSON.parse(req.body)}catch{return {}}})():(req.body||{});
  if(clean(body.website,200)) return res.status(200).json({ok:true,recordSaved:true});

  const name=clean(body.name,120), email=clean(body.email).toLowerCase(), phone=clean(body.phone,40), country=clean(body.country,100);
  const memberId=clean(body.memberId,50), plan=plans[clean(body.membershipPlan,30)];
  if(name.length<2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !plan || !/^[0-9a-f-]{36}$/i.test(memberId)) return res.status(400).json({error:'Valid member details and a membership plan are required.'});

  const apiKey=process.env.RESEND_API_KEY, fromEmail=process.env.BOOKING_FROM_EMAIL;
  const supabaseUrl=process.env.SUPABASE_URL||process.env.VITE_SUPABASE_URL, serviceKey=process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!apiKey||!fromEmail||!supabaseUrl||!serviceKey) return res.status(503).json({error:'Membership payment records or email are not configured.'});

  let recordSaved = false;
  try{
    const supabase=createClient(supabaseUrl,serviceKey,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
    const {data:authData,error:authError}=await supabase.auth.admin.getUserById(memberId);
    const authUser=authData?.user;
    if(authError||!authUser||authUser.email?.toLowerCase()!==email) return res.status(403).json({error:'The membership account could not be verified.'});
    const metadata=authUser.user_metadata||{};
    const proofPath=clean(metadata.payment_proof_path,300);
    if(!proofPath.startsWith('applications/')||proofPath.includes('..')) return res.status(400).json({error:'The membership payment proof is missing.'});

    const {error:recordError}=await supabase.from('payment_records').upsert({
      source_ref:'membership:'+memberId,payment_type:'membership',payer_name:clean(metadata.full_name,120)||name,
      payer_email:email,amount:plan.amount,currency:'USD',payment_method:'Zelle',purpose:'Community membership payment',
      membership_plan:plan.label,member_id:memberId,payment_proof_path:proofPath,status:'pending'
    },{onConflict:'source_ref',ignoreDuplicates:true});
    if(recordError){ console.error('Membership payment ledger insert failed:',recordError.message); return res.status(503).json({ok:false,recordSaved:false,error:'Your member account was created, but the payment record could not be saved. Please do not register again. Contact ZPMC before submitting another application.'}); }
    recordSaved = true;

    const text=[
      'New ZPMC community membership application','','Applicant name: '+name,'Applicant email: '+email,
      'Phone: '+(phone||'Not provided'),'Country: '+(country||'Not provided'),'Selected membership plan: '+plan.label,
      'Amount: USD '+plan.amount.toFixed(2),'Payment proof uploaded: Yes — view it in the secure payment admin portal.',
      'Payment status: Pending administrator verification','','Review membership and payment records:',
      'https://www.zeropointmeditationcenter.org/payment-receipts-admin','','Zero Point Meditation Center'
    ].join('\n');
    const response=await fetch('https://api.resend.com/emails',{method:'POST',headers:{Authorization:'Bearer '+apiKey,'Content-Type':'application/json'},body:JSON.stringify({from:fromEmail,to:recipients,reply_to:email,subject:'New ZPMC membership application: '+name,text})});
    if(!response.ok){const detail=await response.text();console.error('Resend membership notification failed:',response.status,detail.slice(0,300));return res.status(502).json({ok:false,recordSaved:true,error:'Payment record saved, but the team notification email could not be sent.'});}
    return res.status(200).json({ok:true});
  }catch(error){console.error('Membership payment record or notification failed:',error);return res.status(502).json({ok:false,recordSaved,error:recordSaved ? 'Payment record saved, but the team notification could not be completed.' : 'Could not confirm that the payment record was saved. Please do not register again. Contact ZPMC so the team can check your application.'});}
}
