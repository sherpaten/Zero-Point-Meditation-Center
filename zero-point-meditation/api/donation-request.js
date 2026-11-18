const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app'
]);
const purposes = new Set([
  'General support for ZPMC',
  'Support an upcoming event',
  'Free meditation programs',
  'Monastery and sangha activities',
  'Other'
]);
const amounts = new Set(['25', '50', '100', '250', '500']);
const zelleQrBase64 = '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';

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}
function validEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
async function sendEmail(apiKey, payload) {
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload)
  });
  if (!response.ok) throw new Error('Email provider rejected a donation email.');
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }
  const origin = req.headers.origin;
  const isPreview = typeof origin === 'string' && /^https:\/\/zero-point-meditation-[a-z0-9-]+-tenzings-projects\.vercel\.app$/.test(origin);
  if (!origin || (!allowedOrigins.has(origin) && !isPreview)) return res.status(403).json({ error: 'Request origin is not allowed.' });

  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const amount = clean(body.amount, 20);
  const purpose = clean(body.purpose, 100);
  const paymentMethod = clean(body.paymentMethod, 30);
  const message = clean(body.message, 1500);
  if (name.length < 2 || !validEmail(email) || !/^\d{1,8}(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || !purposes.has(purpose) || !['bank_transfer', 'zelle'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Please provide a valid name, email, amount, and donation purpose.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  const teamEmails = (process.env.DONATION_TO_EMAILS || 'bookings@zeropointmeditationcenter.org,admin@zeropointmeditationcenter.org').split(',').map(x=>x.trim()).filter(Boolean);
  if (!apiKey || !fromEmail) return res.status(503).json({ error: 'Donation email service is not configured. Please contact info@zeropointmeditationcenter.org.' });

  const bankDetails = clean(process.env.DONATION_BANK_DETAILS, 5000);
  const zelleDetails = clean(process.env.DONATION_ZELLE_DETAILS, 2000);
  const paymentDetails = paymentMethod === 'zelle' ? zelleDetails : bankDetails;
  const paymentLabel = paymentMethod === 'zelle' ? 'Zelle' : 'Bank transfer (ACH)';
  const instructions = paymentDetails || 'Our team will follow up by email with payment details and instructions to complete your donation.';
  const donorText = [
    'Dear ' + name + ',',
    '',
    'Thank you for your generous intention to support Zero Point Meditation Center.',
    'Donation amount: USD ' + amount,
    'Purpose: ' + purpose,
    '',
    paymentLabel + ' instructions:',
    instructions,
    '',
    'If you have any questions, reply to this email or contact info@zeropointmeditationcenter.org.',
    '',
    'With gratitude,',
    'Zero Point Meditation Center'
  ].join('\n');
  const teamText = [
    'New donation request from the ZPMC website',
    '',
    'Name: ' + name,
    'Email: ' + email,
    'Requested amount: USD ' + amount,
    'Purpose: ' + purpose,
    'Payment method: ' + paymentLabel,
    'Message: ' + (message || 'Not provided'),
    '',
    'Payment method: ' + paymentLabel,
    'Payment instructions configured: ' + (paymentDetails ? 'Yes' : 'No — follow up with donor'),
    '',
    'Zero Point Meditation Center'
  ].join('\n');

  try {
    await sendEmail(apiKey, { from: fromEmail, to: teamEmails, reply_to: email, subject: 'Donation request — USD ' + amount + ' — ' + name, text: teamText });
    const donorEmail = {
      from: fromEmail,
      to: [email],
      subject: 'Thank you for supporting Zero Point Meditation Center',
      text: donorText
    };
    await sendEmail(apiKey, donorEmail);
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Donation email send failed:', error.message);
    return res.status(502).json({ error: 'We could not send your donation email right now. Please try again or contact info@zeropointmeditationcenter.org.' });
  }
}
