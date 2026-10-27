# On-site booking modal implementation and launch checklist

The separate `/meditation-booking` page has been removed. Visitors now open a booking pop-up from the Services page or Events page and remain on the main website.

## Current UI behavior

- The modal collects name, email, phone number, place/city/country, and profession.
- Visitors can choose an event or a service.
- The free morning meditation selector lists November 7, 8, 14, and 15, 2026, from 6:30–7:15 AM. The time zone still needs confirmation.
- Paid-service requests display a notice that payment is not enabled until the center's US bank/payment gateway is confirmed.
- The current modal is a UI prototype only. It does not yet save participant data, create appointments, send emails, charge payments, or confirm bookings. Do not represent bookings as live until the secure backend is implemented and tested.

## Before launch

1. Confirm the session time zone, final event schedule, and Zoom meeting URL.
2. Configure the Supabase project and a secure server-side booking endpoint (for example, a Supabase Edge Function). Validate inputs server-side, prevent duplicate registrations and abuse, and keep public users from reading participant data.
3. Add a staff-only dashboard using authenticated accounts and restrictive Row Level Security policies.
4. Configure a trusted email provider on the server for confirmation messages and reminders. Store email API credentials only as server-side secrets, never in browser-visible `VITE_*` variables.
5. Once the center's US bank has confirmed its payment gateway, inspect the provider's API documentation, test/sandbox support, fees, and webhook/signature verification. Use a hosted checkout or provider-approved secure flow; never collect card details in this form.
6. Create paid bookings as pending until the payment provider confirms payment through a verified server-side webhook. Do not trust a browser redirect as proof of payment.
7. Test the entire flow in a non-production environment: free booking, paid checkout, failed/cancelled payments, duplicate submissions, email delivery, reminders, mobile layout, staff permissions, and data privacy.
8. Confirm the center's data retention policy and which staff may view or export participant information.

## Security rules

- Never place Supabase service-role keys, payment secrets, or email-provider secrets in frontend code or `VITE_*` environment variables.
- Do not create public SELECT access for booking records.
- Do not accept or store payment-card numbers or security codes in the booking database.
- Do not open live registration until the backend, email, and required payment flow have been tested.
