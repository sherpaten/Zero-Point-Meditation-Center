const allowedSubjects = new Set([
  'General Inquiry',
  'Retreat & Event Registration',
  'Volunteer Opportunities',
  'Merchandise & Order Query',
  'Classes'
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

  const body = typeof req.body === 'string'
    ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })()
    : (req.body || {});

  // Honeypot: silently accept bot submissions without sending email.
  if (clean(body.website, 200)) {
    return res.status(200).json({ ok: true });
  }

  const name = clean(body.name, 120);
  const email = clean(body.email, 254);
  const subject = clean(body.subject, 80);
  const message = clean(body.message, 5000);

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: 'Please complete all required fields.' });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  if (!allowedSubjects.has(subject)) {
    return res.status(400).json({ error: 'Please choose a valid subject.' });
  }
  if (message.length < 5) {
    return res.status(400).json({ error: 'Please enter a little more detail in your message.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.CONTACT_TO_EMAIL || 'info@zeropointmeditationcenter.org';
  const fromEmail = process.env.CONTACT_FROM_EMAIL || process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return res.status(503).json({
      error: 'The contact form email service is not fully configured. Please email info@zeropointmeditationcenter.org directly.'
    });
  }

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
        subject: 'Website contact: ' + subject,
        text: [
          'New message from the website contact form',
          '',
          'Name: ' + name,
          'Email: ' + email,
          'Subject: ' + subject,
          '',
          'Message:',
          message
        ].join('\n')
      })
    });

    if (!response.ok) {
      // Avoid logging message contents or sender personal data.
      console.error('Contact email provider returned status:', response.status);
      return res.status(502).json({
        error: 'Your message could not be sent right now. Please try again later or email info@zeropointmeditationcenter.org directly.'
      });
    }

    return res.status(200).json({ ok: true });
  } catch {
    console.error('Contact email request failed.');
    return res.status(502).json({
      error: 'Your message could not be sent right now. Please try again later or email info@zeropointmeditationcenter.org directly.'
    });
  }
}
