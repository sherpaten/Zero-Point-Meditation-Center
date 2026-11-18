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
  if (name.length < 2 || !validEmail(email) || !/^\d{1,8}(\.\d{1,2})?$/.test(amount) || Number(amount) <= 0 || !purposes.has(purpose) || !['bank_transfer', 'zelle', 'international_usd', 'international_foreign'].includes(paymentMethod)) {
    return res.status(400).json({ error: 'Please provide a valid name, email, amount, and donation purpose.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  const teamEmails = (process.env.DONATION_TO_EMAILS || 'bookings@zeropointmeditationcenter.org,admin@zeropointmeditationcenter.org').split(',').map(x=>x.trim()).filter(Boolean);
  if (!apiKey || !fromEmail) return res.status(503).json({ error: 'Donation email service is not configured. Please contact info@zeropointmeditationcenter.org.' });

  const bankDetails = clean(process.env.DONATION_BANK_DETAILS, 5000);
  const zelleDetails = clean(process.env.DONATION_ZELLE_DETAILS, 2000);
  const internationalUsdDetails = clean(process.env.DONATION_INTERNATIONAL_USD_DETAILS, 3000);
  const internationalForeignDetails = clean(process.env.DONATION_INTERNATIONAL_FOREIGN_DETAILS, 3000);
  const paymentDetails = paymentMethod === 'zelle' ? zelleDetails : paymentMethod === 'international_usd' ? internationalUsdDetails : paymentMethod === 'international_foreign' ? internationalForeignDetails : bankDetails;
  const paymentLabel = paymentMethod === 'zelle' ? 'Zelle' : paymentMethod === 'international_usd' ? 'International wire (USD)' : paymentMethod === 'international_foreign' ? 'International wire (foreign currency)' : 'Bank transfer (ACH)';
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
    await sendEmail(apiKey, { from: fromEmail, to: [email], subject: 'Thank you for supporting Zero Point Meditation Center', text: donorText });
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Donation email send failed:', error.message);
    return res.status(502).json({ error: 'We could not send your donation email right now. Please try again or contact info@zeropointmeditationcenter.org.' });
  }
}
