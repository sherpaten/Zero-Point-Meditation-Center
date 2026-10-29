import { createHmac } from 'node:crypto';

const allowedTypes = new Set(['event', 'service']);
const maxLengths = { name: 120, email: 254, phone: 40, place: 120, profession: 120, service: 160, date: 40, teacher: 160 };
const siteUrl = 'https://www.zeropointmeditationcenter.org';

function clean(value, maxLength = 500) {
  return typeof value === 'string' ? value.trim().slice(0, maxLength) : '';
}

function approvalToken(payload, secret) {
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return encoded + '.' + signature;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL || 'bookings@zeropointmeditationcenter.org';
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return res.status(503).json({
      error: 'The booking form is being configured. Please contact the center directly for now.'
    });
  }

  const body = typeof req.body === 'string' ? (() => {
    try { return JSON.parse(req.body); } catch { return {}; }
  })() : (req.body || {});

  // Honeypot: normal visitors leave this hidden field empty. Silently ignore bots that fill it.
  if (clean(body.website, 200)) return res.status(200).json({ ok: true, receiptSent: false });

  const type = clean(body.type, 20);
  const service = clean(body.service, maxLengths.service);
  const name = clean(body.name, maxLengths.name);
  const email = clean(body.email, maxLengths.email);
  const phone = clean(body.phone, maxLengths.phone);
  const place = clean(body.place, maxLengths.place);
  const profession = clean(body.profession, maxLengths.profession);
  const date = clean(body.date, maxLengths.date);
  const teacher = clean(body.teacher, maxLengths.teacher);
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

  const token = approvalToken({
    name, email, service, date: type === 'event' ? date : '',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  }, apiKey);
  const approvalUrl = siteUrl + '/api/booking-approve?token=' + encodeURIComponent(token);

  const notificationText = [
    'New website booking enquiry',
    '',
    'Type: ' + type,
    'Service or event: ' + service,
    'Teacher: ' + (teacher || 'Not specified'),
    'Requested date: ' + (date || 'Not specified'),
    'Name: ' + name,
    'Email: ' + email,
    'Phone: ' + phone,
    'Place / city / country: ' + place,
    'Profession: ' + profession,
    'Payment preference: ' + paymentLabel,
    '',
    'This is an enquiry only. The booking is not confirmed and no payment has been collected.',
    '',
    'After checking availability and details, open this link to review and approve the booking:',
    approvalUrl,
    '',
    'The customer receives a final confirmation only after you approve it. The link expires in 7 days.'
  ].join('\n');

  const receiptText = [
    'Hello ' + name + ',',
    '',
    'Thank you for contacting Zero Point Meditation Center.',
    'We have received your booking enquiry and sent it to the center team for review.',
    '',
    'Service or event: ' + service,
    'Teacher: ' + (teacher || 'Not specified'),
    'Requested date: ' + (date || 'Not specified'),
    '',
    'This email confirms receipt of your enquiry only. Your booking is not confirmed yet, and no payment has been collected.',
    'The center will contact you after reviewing availability and next steps.',
    '',
    'With regards,',
    'Zero Point Meditation Center'
  ].join('\n');

  try {
    const [notificationResponse, receiptResponse] = await Promise.all([
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [toEmail],
          reply_to: email,
          subject: 'Website booking enquiry: ' + service,
          text: notificationText
        })
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: 'We received your enquiry: ' + service,
          text: receiptText
        })
      })
    ]);

    if (!notificationResponse.ok || !receiptResponse.ok) {
      const notificationDetail = !notificationResponse.ok ? await notificationResponse.text() : '';
      const receiptDetail = !receiptResponse.ok ? await receiptResponse.text() : '';
      console.error('Resend booking email failed:', {
        notificationStatus: notificationResponse.status,
        receiptStatus: receiptResponse.status,
        notificationDetail: notificationDetail.slice(0, 300),
        receiptDetail: receiptDetail.slice(0, 300)
      });
      return res.status(502).json({
        error: 'We could not send all booking emails. Please contact the center before submitting again.'
      });
    }

    return res.status(200).json({ ok: true, receiptSent: true });
  } catch (error) {
    console.error('Booking email request failed:', error);
    return res.status(502).json({ error: 'We could not send your enquiry right now. Please contact the center directly.' });
  }
}
