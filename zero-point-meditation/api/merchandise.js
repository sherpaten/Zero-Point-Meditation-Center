const max = { product: 160, price: 80, name: 120, email: 254, phone: 40, address: 180, city: 100, region: 100, postalCode: 30, country: 100 };
const siteUrl = 'https://www.zeropointmeditationcenter.org';
const clean = (value, limit = 200) => typeof value === 'string' ? value.trim().slice(0, limit) : '';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Method not allowed.' }); }
  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.BOOKING_TO_EMAIL || 'bookings@zeropointmeditationcenter.org';
  const fromEmail = process.env.BOOKING_FROM_EMAIL;
  if (!apiKey || !fromEmail) return res.status(503).json({ error: 'The order form is being configured. Please contact the centre directly for now.' });
  const body = typeof req.body === 'string' ? (() => { try { return JSON.parse(req.body); } catch { return {}; } })() : (req.body || {});
  if (clean(body.website, 200)) return res.status(200).json({ ok: true });
  const fields = Object.fromEntries(Object.entries(max).map(([key, limit]) => [key, clean(body[key], limit)]));
  if (!fields.product || !fields.name || !fields.email || !fields.phone || !fields.address || !fields.city || !fields.country) return res.status(400).json({ error: 'Please complete all required fields.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(fields.email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (clean(body.paymentMethod, 20) !== 'zelle') return res.status(400).json({ error: 'Zelle is the available payment method.' });
  const address = [fields.address, fields.city, fields.region, fields.postalCode, fields.country].filter(Boolean).join(', ');
  const notification = [
    'New merchandise order enquiry', '', 'Product: ' + fields.product, 'Listed price: ' + (fields.price || 'To confirm'),
    'Payment method: Zelle', 'Customer: ' + fields.name, 'Email: ' + fields.email, 'Phone: ' + fields.phone,
    'Delivery address: ' + address, '', 'Please confirm product availability, final price and shipping, then email the customer the authorised Zelle payment details. No payment has been collected.'
  ].join('\n');
  const receipt = [
    'Hello ' + fields.name + ',', '', 'Thank you for your merchandise order enquiry to Zero Point Meditation Center.',
    'Item: ' + fields.product, 'Listed price: ' + (fields.price || 'To confirm'), 'Payment method: Zelle', 'Delivery address: ' + address, '',
    'The centre will confirm availability, final price and shipping, then email you the authorised Zelle payment instructions. Please do not send payment before receiving them. This email is an acknowledgement only; your order is not yet confirmed.', '',
    'With regards,', 'Zero Point Meditation Center', siteUrl
  ].join('\n');
  try {
    const [internal, customer] = await Promise.all([
      fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: fromEmail, to: [toEmail], reply_to: fields.email, subject: 'Merchandise order enquiry: ' + fields.product, text: notification }) }),
      fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: 'Bearer ' + apiKey, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: fromEmail, to: [fields.email], subject: 'We received your merchandise enquiry', text: receipt }) })
    ]);
    if (!internal.ok || !customer.ok) {
      console.error('Merchandise email delivery failed:', { internal: internal.status, customer: customer.status });
      return res.status(502).json({ error: 'We could not send the order emails. Please contact the centre before trying again.' });
    }
    return res.status(200).json({ ok: true });
  } catch (error) {
    console.error('Merchandise email error:', error);
    return res.status(502).json({ error: 'We could not send your order enquiry right now. Please contact the centre directly.' });
  }
}
