const recipient = 'bookings@zeropointmeditationcenter.org';
const allowedOrigins = new Set([
  'https://www.zeropointmeditationcenter.org',
  'https://zeropointmeditationcenter.org',
  'https://zero-point-meditation-center.vercel.app'
]);

function clean(value, maxLength) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const origin = req.headers.origin;
  if (!origin || !allowedOrigins.has(origin)) {
    return res.status(403).json({ error: 'Request origin is not allowed.' });
  }

  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});

  // Silently ignore automated submissions that fill the hidden honeypot.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const phone = clean(body.phone, 40);
  const country = clean(body.country, 100);

  if (name.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'A valid name and email are required.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !fromEmail) {
    console.error('Membership notification email is not configured.');
    return res.status(503).json({ error: 'Email notification is not configured.' });
  }

  const text = [
    'New ZPMC community membership application',
    '',
    'A visitor has submitted a membership registration on the website.',
    '',
    'Applicant name: ' + name,
    'Applicant email: ' + email,
    'Phone: ' + (phone || 'Not provided'),
    'Country: ' + (country || 'Not provided'),
    '',
    'Membership account verification is handled separately by Supabase.',
    'Review membership records in the authorized membership admin portal:',
    'https://www.zeropointmeditationcenter.org/membership-admin',
    '',
    'Zero Point Meditation Center'
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
        to: [recipient],
        reply_to: email,
        subject: 'New ZPMC membership application: ' + name,
        text
      })
    });

    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend membership notification failed:', response.status, detail.slice(0, 300));
      return res.status(502).json({ error: 'Could not send the team notification.' });
    }

    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Membership notification request failed:', error);
    return res.status(502).json({ error: 'Could not send the team notification.' });
  }
}
