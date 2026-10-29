import { createHmac, timingSafeEqual } from 'node:crypto';

const SITE_URL = 'https://www.zeropointmeditationcenter.org';

function sign(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return encoded + '.' + signature;
}

function verify(token, secret) {
  if (typeof token !== 'string' || token.length > 5000) return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const expected = createHmac('sha256', secret).update(parts[0]).digest();
  let supplied;
  try { supplied = Buffer.from(parts[1], 'base64url'); } catch { return null; }
  if (expected.length !== supplied.length || !timingSafeEqual(expected, supplied)) return null;
  try {
    const payload = JSON.parse(Buffer.from(parts[0], 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now() || !payload.email || !payload.name || !payload.service) return null;
    return payload;
  } catch { return null; }
}

function page(title, message, form = '') {
  return `<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} | Zero Point Meditation Center</title><body style="font-family:Arial,sans-serif;background:#fafaf9;color:#292524;margin:0;padding:24px"><main style="max-width:620px;margin:8vh auto;background:white;border:1px solid #e7e5e4;border-radius:16px;padding:28px"><h1 style="color:#6b2135">${title}</h1><p style="line-height:1.6">${message}</p>${form}<p style="font-size:12px;color:#78716c;margin-top:28px">Zero Point Meditation Center</p></main></body></html>`;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const secret = process.env.RESEND_API_KEY;
  const token = req.method === 'POST'
    ? (typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body).token; } catch { return ''; } })() : req.body?.token)
    : req.query?.token;

  if (!secret) return res.status(503).send(page('Temporarily unavailable', 'The approval service is not configured yet.'));
  const payload = verify(token, secret);
  if (!payload) return res.status(400).send(page('Link expired or invalid', 'This approval link is invalid or has expired. Please contact the center and ask for a new booking enquiry link.'));

  if (req.method === 'GET') {
    const form = '<form method="post" action="/api/booking-approve" style="margin-top:24px"><input type="hidden" name="token" value="' + token.replace(/&/g, '&amp;').replace(/"/g, '&quot;') + '"><button style="background:#6b2135;color:white;border:0;border-radius:10px;padding:12px 18px;font-size:16px;cursor:pointer">Approve booking and email customer</button></form>';
    return res.status(200).setHeader('Content-Type', 'text/html; charset=utf-8').send(page('Review booking approval', 'You are about to approve the request for ' + String(payload.service).replace(/[&<>"]/g, '') + ' from ' + String(payload.name).replace(/[&<>"]/g, '') + '. Confirm only after checking availability and any required details.', form));
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).send(page('Method not allowed', 'Use the approval link sent to the center.'));
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!fromEmail) return res.status(503).send(page('Email not configured', 'The center email sender is not configured. No confirmation was sent.'));

  const dateText = payload.date ? 'Requested date: ' + payload.date + '\n' : '';
  const text = [
    'Hello ' + payload.name + ',',
    '',
    'Your booking has been approved by Zero Point Meditation Center.',
    '',
    'Service or event: ' + payload.service,
    dateText.trim(),
    '',
    'The center will contact you separately if any additional details are needed.',
    'Please reply to this email if you have questions.',
    '',
    'With regards,',
    'Zero Point Meditation Center'
  ].filter(Boolean).join('\n');

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from: fromEmail,
        to: [payload.email],
        subject: 'Your booking is confirmed: ' + payload.service,
        text
      })
    });
    if (!response.ok) {
      const detail = await response.text();
      console.error('Resend booking confirmation failed:', response.status, detail.slice(0, 300));
      return res.status(502).send(page('Confirmation not sent', 'The confirmation email could not be sent. Please try again or contact the site administrator.'));
    }
    return res.status(200).send(page('Booking confirmation sent', 'The customer has been emailed that their booking is approved. You may close this page.'));
  } catch (error) {
    console.error('Booking confirmation request failed:', error);
    return res.status(502).send(page('Confirmation not sent', 'The confirmation email could not be sent. Please try again or contact the site administrator.'));
  }
}
