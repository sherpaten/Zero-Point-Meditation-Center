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
  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  const intent = clean(body.intent, 20) || 'standard';
  if (!['standard', 'booking', 'inquiry'].includes(intent)) return res.status(400).json({ error: 'Invalid form type.' });
  const toEmail = intent === 'inquiry'
    ? 'info@zeropointmeditationcenter.org'
    : 'bookings@zeropointmeditationcenter.org';
  const fromEmail = process.env.BOOKING_FROM_EMAIL;

  if (!apiKey || !fromEmail) {
    return res.status(503).json({
      error: 'The booking form is being configured. Please contact the center directly for now.'
    });
  }

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
  const freeEventNames = new Set(['Free Morning Meditation', 'Free Weekend Community Classes', 'Free Meditation Class', 'Free Event']);
  const requiresPaymentPreference = intent === 'booking' || (intent === 'standard' && (type === 'service' || !freeEventNames.has(service)));
  if (requiresPaymentPreference && paymentPreference !== 'zelle') {
    return res.status(400).json({ error: 'Please choose a payment preference.' });
  }

  const paymentLabel = paymentPreference === 'zelle' ? 'Zelle (centre will email authorised payment instructions after confirming the booking)' : 'Not applicable — free event';

  const autoConfirmedFreeEvents = new Set([
    'Free Morning Meditation',
    'Free Weekend Community Classes',
    'Free Meditation Class',
    'Free Event'
  ]);
  const autoConfirm = type === 'event' && autoConfirmedFreeEvents.has(service);
  const morningMeditationSessions = {
    '2026-11-07': {
      language: 'Nepali',
      url: 'https://us06web.zoom.us/j/88470677871',
      meetingId: '884 7067 7871'
    },
    '2026-11-08': {
      language: 'English',
      url: 'https://us06web.zoom.us/j/84582891079',
      meetingId: '845 8289 1079'
    },
    '2026-11-14': {
      language: 'Nepali',
      url: 'https://us06web.zoom.us/j/88470677871',
      meetingId: '884 7067 7871'
    },
    '2026-11-15': {
      language: 'English',
      url: 'https://us06web.zoom.us/j/84582891079',
      meetingId: '845 8289 1079'
    }
  };
  const morningMeditationSession = autoConfirm
    && ['Free Morning Meditation', 'Free Weekend Community Classes'].includes(service)
    ? morningMeditationSessions[date]
    : null;
  if (type === 'event' && ['Free Morning Meditation', 'Free Weekend Community Classes'].includes(service) && !date) {
    return res.status(400).json({ error: 'Please choose an available class date.' });
  }
  if (type === 'event' && service === 'Free Morning Meditation' && !morningMeditationSessions[date]) {
    return res.status(400).json({ error: 'Please choose an available Morning Meditation date.' });
  }

  const requiresApproval = !autoConfirm && intent !== 'inquiry';
  const token = !requiresApproval ? '' : approvalToken({
    name, email, service, date: type === 'event' ? date : '',
    exp: Date.now() + 7 * 24 * 60 * 60 * 1000
  }, apiKey);
  const approvalUrl = requiresApproval ? siteUrl + '/api/booking-approve?token=' + encodeURIComponent(token) : '';

  const notificationText = [
    autoConfirm ? 'New automatically confirmed free class registration' : intent === 'inquiry' ? 'New website service enquiry' : 'New website booking request',
    '',
    'Request type: ' + (intent === 'inquiry' ? 'General service enquiry — no payment requested' : 'Booking request'),
    'Booking status: ' + (autoConfirm ? 'Confirmed automatically — no staff approval required' : intent === 'inquiry' ? 'Enquiry received — response required' : 'Awaiting center review'),
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
    ...(intent === 'inquiry' ? ['Payment: Not applicable — enquiry only'] : ['Payment preference: ' + paymentLabel]),
    ...(morningMeditationSession ? [
      '',
      morningMeditationSession.language + ' Morning Meditation Zoom link: ' + morningMeditationSession.url,
      'Language: ' + morningMeditationSession.language,
      'Meeting ID: ' + morningMeditationSession.meetingId
    ] : []),
    '',
    autoConfirm
      ? 'The free class registration is already confirmed. No payment is required and no staff approval is needed.'
      : intent === 'inquiry'
        ? 'This is an information enquiry only. No booking or payment has been requested.'
        : 'This is a booking request only. The booking is not confirmed and no payment has been collected.',
    '',
    ...(requiresApproval ? [
      'After checking availability and details, open this link to review and approve the booking:',
      approvalUrl,
      '',
      'The customer receives a final confirmation only after you approve it. The link expires in 7 days.'
    ])
  ].join('\n');

  const receiptText = [
    'Hello ' + name + ',',
    '',
    intent === 'inquiry' ? 'Thank you for contacting Zero Point Meditation Center.' : 'Thank you for registering with Zero Point Meditation Center.',
    autoConfirm
      ? 'Your registration for this free class is confirmed. You do not need to wait for another approval email.'
      : intent === 'inquiry'
        ? 'We have received your service enquiry and forwarded it to our information team.'
        : 'We have received your booking request and sent it to the bookings team for review.',
    '',
    'Service or event: ' + service,
    'Teacher: ' + (teacher || 'Not specified'),
    'Requested date: ' + (date || 'Not specified'),
    '',
    ...(autoConfirm
      ? [
          'No payment is required for this free class.',
          ...(morningMeditationSession ? [
            'Join the ' + morningMeditationSession.language + ' Morning Meditation on Zoom:',
            morningMeditationSession.url,
            'Language: ' + morningMeditationSession.language,
            'Meeting ID: ' + morningMeditationSession.meetingId,
            'Session time: 6:30–7:15 AM US Eastern Time.'
          ] : ['The center will share any additional session or joining details separately if needed.'])
        ]
      : intent === 'inquiry'
        ? ['This is an enquiry acknowledgement only. No payment is required or requested.', 'The information team will respond to your message.']
        : ['This email confirms receipt of your booking request only. Your booking is not confirmed yet, and no payment has been collected.', 'The bookings team will contact you after reviewing availability and next steps.'],
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
          subject: (autoConfirm ? 'Free class registration confirmed: ' : intent === 'inquiry' ? 'Website service enquiry: ' : 'Website booking request: ') + service,
          text: notificationText
        })
      }),
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: fromEmail,
          to: [email],
          subject: (autoConfirm ? 'Your free class registration is confirmed: ' : intent === 'inquiry' ? 'We received your service enquiry: ' : 'We received your booking request: ') + service,
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

    return res.status(200).json({ ok: true, receiptSent: true, confirmed: autoConfirm });
  } catch (error) {
    console.error('Booking email request failed:', error);
    return res.status(502).json({ error: 'We could not send your enquiry right now. Please contact the center directly.' });
  }
}
