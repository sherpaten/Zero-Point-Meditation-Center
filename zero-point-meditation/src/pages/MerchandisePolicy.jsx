import React from 'react';
import { Helmet } from 'react-helmet-async';

const sections = [
  {
    title: '1. Merchandise Orders and Enquiries',
    paragraphs: [
      'Customers may browse available merchandise and submit an order enquiry through the official ZPMC website. Submitting an enquiry does not automatically confirm an order or guarantee product availability.',
      'All orders are subject to availability and confirmation by ZPMC. Customers must provide accurate personal, contact and delivery information. ZPMC may decline an order if an item is unavailable or the requested order cannot be fulfilled.',
      'An order is confirmed only after ZPMC has reviewed the request and communicated the final order details to the customer.'
    ]
  },
  {
    title: '2. Product Pricing and Shipping Charges',
    paragraphs: [
      'Merchandise prices may vary depending on the selected product, design, quantity and availability. Displayed prices are subject to confirmation where indicated.',
      'Shipping and delivery charges are calculated separately where applicable. Before payment, ZPMC will communicate the merchandise price, quantity, applicable adjustments, shipping charges and total amount payable.',
      'Customers must agree to the final amount before proceeding with payment. ZPMC will not knowingly request additional charges beyond the agreed amount without first informing the customer and obtaining their agreement.'
    ]
  },
  {
    title: '3. Payment Policy',
    paragraphs: [
      'ZPMC currently accepts merchandise payments through its official Zelle payment instructions. Customers are not required to pay when initially submitting an order enquiry.',
      'After product availability, pricing and shipping have been confirmed, ZPMC will send the customer a private payment link by email. The private payment page displays the official ZPMC Zelle QR code and the confirmed amount payable.',
      'Customers must pay the exact amount stated on the payment page and upload the requested payment confirmation or proof. Uploading payment proof does not mean that payment has been received or verified.',
      'ZPMC independently verifies the transaction before marking payment as verified. An official merchandise payment receipt is issued after successful verification. Customers should retain their payment confirmation and order correspondence.',
      'Customers should use only payment instructions and QR codes provided through official ZPMC channels. ZPMC will not ask customers to share banking passwords, PINs or login credentials.'
    ]
  },
  {
    title: '4. Order Cancellation Policy',
    paragraphs: [
      'Customers who wish to cancel an order should contact ZPMC as soon as possible. Cancellation requests made before an order enters processing will generally be considered.',
      'Once an order has entered processing, been prepared or dispatched, cancellation may no longer be possible. All cancellation requests are reviewed by ZPMC.',
      'If ZPMC cannot fulfill an order after payment has been received, ZPMC will inform the customer and arrange an appropriate refund in accordance with this policy and applicable law.'
    ]
  },
  {
    title: '5. Refund Policy',
    paragraphs: [
      'Refund requests are reviewed individually and considered fairly based on the circumstances of the order. A refund may be considered if merchandise becomes unavailable after payment, ZPMC cannot fulfill a confirmed order, the customer receives an incorrect or damaged item, a confirmed duplicate or incorrect payment occurs, or a cancellation qualifies under this policy.',
      'To request a refund, the customer should contact ZPMC with their order details and reason for the request. ZPMC may request additional information or photographs, review the order and payment records, and communicate its decision to the customer.',
      'If approved, ZPMC will explain the refund arrangement and expected processing timeframe. Refunds will normally be arranged through the original payment method where practical and permitted. If that is not possible, ZPMC will discuss an appropriate alternative with the customer.',
      'Refund eligibility and handling remain subject to applicable consumer-protection laws. Nothing in this policy limits rights that customers have under applicable law.'
    ]
  },
  {
    title: '6. Shipping and Delivery Policy',
    paragraphs: [
      'ZPMC will arrange shipment after the order has been confirmed and payment has been successfully verified. Delivery estimates will be communicated where available.',
      'Delivery times may vary depending on the destination, shipping provider, customs procedures and circumstances outside ZPMC’s control. Any delivery estimate is not guaranteed unless expressly confirmed in writing.',
      'Customers are responsible for providing a complete and accurate delivery address. Where tracking information is available, ZPMC may provide the tracking number or relevant delivery details.',
      'Customers should contact ZPMC if an order has not arrived within the communicated delivery timeframe.'
    ]
  },
  {
    title: '7. Damaged, Incorrect or Missing Merchandise',
    paragraphs: [
      'Customers should contact ZPMC promptly after receiving damaged, incorrect or incomplete merchandise. Customers should provide their order details and a description of the issue. Photographs of the merchandise and packaging may be requested.',
      'ZPMC will review the matter and determine an appropriate resolution based on the circumstances. This may include replacement merchandise, correction or completion of the order, a partial refund or a full refund where appropriate and consistent with applicable law.'
    ]
  },
  {
    title: '8. Order Status and Tracking',
    paragraphs: [
      'ZPMC maintains order records to help monitor merchandise orders. Order statuses may include Processing (the order is being prepared), Shipped (the order has been dispatched) and Delivered (the order has been marked as delivered).',
      'Where available, shipping or tracking information may also be recorded. Order statuses are intended to provide progress updates and do not replace confirmation from the delivery provider.'
    ]
  },
  {
    title: '9. Customer Responsibilities',
    paragraphs: [
      'Customers are responsible for providing accurate contact and delivery information, reviewing product details and quantities, agreeing to the final price before payment, using official ZPMC payment instructions, paying the confirmed amount, uploading genuine payment confirmation and contacting ZPMC promptly if an issue arises.',
      'Customers should keep relevant order and payment records for their reference.'
    ]
  },
  {
    title: '10. Privacy and Payment Information',
    paragraphs: [
      'ZPMC collects and uses customer information to process merchandise enquiries, manage orders, verify payments, arrange delivery and provide customer support. Order information and payment proof are handled through the systems used by ZPMC for merchandise administration.',
      'Customers must not send passwords, banking login details, card PINs or other confidential banking credentials to ZPMC. Customer information will be handled in accordance with ZPMC’s applicable privacy practices and legal obligations.'
    ]
  },
  {
    title: '11. Changes to This Policy',
    paragraphs: [
      'ZPMC may update this policy when necessary to reflect changes in merchandise operations, payment procedures, delivery arrangements or applicable legal requirements. The latest version will be published on the official ZPMC website, and the effective date will be updated when a revised policy is published.'
    ]
  }
];

export default function MerchandisePolicy() {
  return (
    <main className="mx-auto max-w-4xl px-5 py-12 sm:px-6">
      <Helmet>
        <title>Merchandise Policy | Zero Point Meditation Center</title>
        <meta name="description" content="Read the Zero Point Meditation Center merchandise ordering, payment, cancellation, refund and delivery policy." />
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/merchandise-policy" />
      </Helmet>
      <header className="mb-10 border-b border-amber-900/20 pb-8">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-800">Zero Point Meditation Center</p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-buddhist-burgundy sm:text-4xl">Merchandise Sales, Payment, Refund &amp; Delivery Policy</h1>
        <p className="mt-4 text-sm text-stone-600">Effective date: November 20, 2026</p>
        <p className="mt-5 leading-relaxed text-stone-700">Thank you for your interest in supporting Zero Point Meditation Center (ZPMC) through our merchandise. This policy explains how merchandise enquiries, orders, payments, cancellations, refunds and deliveries are handled. Please read it before proceeding with a purchase.</p>
      </header>
      <div className="space-y-9">
        {sections.map((section) => (
          <section key={section.title} className="space-y-3">
            <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">{section.title}</h2>
            {section.paragraphs.map((paragraph, index) => <p key={index} className="text-sm leading-7 text-stone-700">{paragraph}</p>)}
          </section>
        ))}
        <section className="space-y-3">
          <h2 className="font-serif text-xl font-bold text-buddhist-burgundy">12. Contact Information</h2>
          <p className="text-sm leading-7 text-stone-700">For merchandise enquiries, order cancellations, payment questions, delivery issues or refund requests, please contact Zero Point Meditation Center through our official channels.</p>
          <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-stone-800">
            <p><strong>Website:</strong> <a className="text-buddhist-burgundy underline" href="https://www.zeropointmeditationcenter.org">zeropointmeditationcenter.org</a></p>
            <p><strong>WhatsApp:</strong> <a className="text-buddhist-burgundy underline" href="https://wa.me/16464560843">+1 (646) 456-0843</a></p>
            <p><strong>Email:</strong> <a className="text-buddhist-burgundy underline" href="mailto:info@zeropointmeditationcenter.org">info@zeropointmeditationcenter.org</a></p>
          </div>
        </section>
      </div>
      <p className="mt-10 border-t border-stone-200 pt-6 text-center text-sm italic text-stone-600">Thank you for supporting Zero Point Meditation Center. Every merchandise purchase helps support our community and the activities of our center.</p>
    </main>
  );
}
