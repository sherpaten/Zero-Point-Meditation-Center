const allowedTypes = new Set(['event', 'service']);
const maxLengths = { name: 120, email: 254, phone: 40, place: 120, profession: 120, service: 160, date: 40 };

function clean(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL || 'info@zeropointmeditation.org';
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return res.status(503).json({
      error: 'The booking form is being configured. Please contact the center directly for now.'
    });
  }

  const body = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body || {});

  const type = clean(body.type, 20);
  const service = clean(body.service, maxLengths.service);
  const name = clean(body.name, maxLengths.name);
  const email = clean(body.email, maxLengths.email);
  const phone = clean(body.phone, maxLengths.phone);
  const place = clean(body.place, maxLengths.place);
  const profession = clean(body.profession, maxLengths.profession);
  const date = clean(body.date, maxLengths.date);
  const paymentPreference = clean(body.paymentPreference, 40);

  if (!allowedTypes.has(type) || !service || !name || !email || !phone || !place || !profession) {
    return res.status(400).json({ error: 'Please complete all required fields and try again.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (type === 'service' && !['zelle', 'other'].includes(paymentPreference)) {
    return res.status(400).json({ error: 'Please choose a payment preference.' });
  }

  const paymentLabel = paymentPreference === 'zelle'
    ? 'Zelle (subject to center confirmation)'
    : paymentPreference === 'other'
      ? 'Would like to discuss another payment option'
      : 'Not applicable / not selected';

  const textBody = [
    'New website booking enquiry',
    '',
    'Type: ' + type,
    'Service or event: ' + service,
    'Requested date: ' + (date || 'Not specified'),
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + phone,
    'Place / city / country: ' + place,
    'Profession: ' + profession,
    'Payment preference: ' + paymentLabel,
    '',
    'This is an enquiry only. The booking is not confirmed and no payment has been collected.'
  ].join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [toEmail],
        reply_to: email,
        subject: 'Website booking enquiry: ' + service,
        text: textBody
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend booking email failed:', response.status, detail.slice(0, 500));
      return res.status(502).json({ error: 'We could not send your enquiry right now. Please contact the center directly.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Booking email request failed:', error);
    return res.status(502).json({ error: 'We could not send your enquiry right now. Please contact the center directly.' });
  }
}
