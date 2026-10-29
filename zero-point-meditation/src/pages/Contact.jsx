import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Clock, Send, Sparkles, HeartHandshake } from 'lucide-react';
import AssistantChat from '../components/AssistantChat';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: 'General Inquiry', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');
  const [website, setWebsite] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (website.trim()) return;
    if (sending) return;

    setSending(true);
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, website })
      });
      const result = await response.json().catch(() => ({}));
      if (!response.ok || !result.ok) {
        throw new Error(result.error || 'We could not send your message. Please try again or email the center directly.');
      }
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: 'General Inquiry', message: '' });
      setWebsite('');
    } catch (err) {
      setError(err.message || 'We could not send your message. Please try again or email the center directly.');
    } finally {
      setSending(false);
    }
  };

  return (
    
      <div className="max-w-6xl mx-auto px-6 py-12 space-y-12">
      <Helmet>
        <title>Contact Zero Point Meditation Center | Classes & Enquiries</title>
        <meta name="description" content="Contact Zero Point Meditation Center with questions about meditation sessions, Buddhist teachings, events, spiritual support and community activities."/>
        <link rel="canonical" href="https://www.zeropointmeditationcenter.org/contact"/>
        <meta property="og:type" content="website"/>
        <meta property="og:site_name" content="Zero Point Meditation Center"/>
        <meta property="og:url" content="https://www.zeropointmeditationcenter.org/contact"/>
        <meta property="og:title" content="Contact Zero Point Meditation Center | Classes & Enquiries"/>
        <meta property="og:description" content="Contact Zero Point Meditation Center with questions about meditation sessions, Buddhist teachings, events, spiritual support and community activities."/>
        <meta name="twitter:card" content="summary"/>
        <meta name="twitter:title" content="Contact Zero Point Meditation Center | Classes & Enquiries"/>
        <meta name="twitter:description" content="Contact Zero Point Meditation Center with questions about meditation sessions, Buddhist teachings, events, spiritual support and community activities."/>
      </Helmet>
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-buddhist-gold font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles size={14} /> Connect With Our Sangha
        </span>
        <h1 className="font-serif text-4xl font-bold text-buddhist-burgundy">Get in Touch</h1>
        <p className="text-stone-600 text-xs sm:text-sm leading-relaxed">
          Have questions about our meditation retreats, weekly prayer sessions, or teachings? We welcome your message.
        </p>
      </motion.div>

      <AssistantChat />

      <div className="grid md:grid-cols-12 gap-10">
        {/* Left Column: Contact Info */}
        <div className="md:col-span-5 bg-stone-900 text-amber-50 p-8 rounded-3xl border border-stone-800 space-y-8 flex flex-col justify-between">
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-amber-50">Sanctuary Information</h2>
            <div className="space-y-4 text-xs text-stone-300">
              <div className="flex items-start gap-3">
                <MapPin className="text-buddhist-gold shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-amber-50">Zero Point meditation Center</p>
                  <p>New York, United States</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="text-buddhist-gold shrink-0" size={18} />
                <a href="mailto:info@zeropointmeditationcenter.org" className="hover:text-buddhist-gold transition-colors">
                  info@zeropointmeditationcenter.org
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="text-buddhist-gold shrink-0" size={18} />
                <span>+1 (732) 619-5329</span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-buddhist-gold shrink-0 mt-0.5" size={18} />
                <div>
                  <p className="font-bold text-amber-50">Meditation Hall Hours</p>
                  <p>Mon – Sat: 6:00 AM – 7:00 PM</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-stone-800/80 p-5 rounded-2xl border border-stone-700/60 space-y-2">
            <span className="text-buddhist-gold font-bold text-xs uppercase tracking-wider flex items-center gap-1.5">
              <HeartHandshake size={14} /> Volunteer Outreach
            </span>
            <p className="text-stone-300 text-xs leading-relaxed">
              Interested in offering service or helping organize peace rallies? Mention it in your message!
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Form */}
        <div className="md:col-span-7 bg-white p-8 rounded-3xl border border-stone-200 shadow-sm">
          {submitted ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                <Sparkles size={28} />
              </div>
              <h3 className="font-serif text-2xl font-bold text-stone-900">Message sent successfully</h3>
              <p className="text-stone-600 text-xs max-w-sm">
                Thank you for contacting Zero Point Meditation Center. Your message has been emailed to our team at info@zeropointmeditationcenter.org.
              </p>
              <button onClick={() => setSubmitted(false)} className="text-xs font-bold text-buddhist-burgundy underline">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div aria-hidden="true" className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden">
                <label htmlFor="contact-website">Leave this field empty</label>
                <input id="contact-website" type="text" tabIndex={-1} autoComplete="off" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-bold text-stone-700 uppercase tracking-wider">Your Name</label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-buddhist-gold focus:outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-bold text-stone-700 uppercase tracking-wider">Email Address</label>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    required
                    placeholder="email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-buddhist-gold focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-subject" className="text-xs font-bold text-stone-700 uppercase tracking-wider">Subject</label>
                <select
                  id="contact-subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-buddhist-gold focus:outline-none"
                >
                  <option>General Inquiry</option>
                  <option>Retreat & Event Registration</option>
                  <option>Volunteer Opportunities</option>
                  <option>Merchandise & Order Query</option>
                  <option>Classes</option>
                  
                </select>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-bold text-stone-700 uppercase tracking-wider">Your Message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  rows={5}
                  required
                  placeholder="How can we assist your spiritual journey?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-buddhist-gold focus:outline-none"
                />
              </div>

              
              {error && <p role="alert" className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-xl p-3">{error}</p>}
              <button
                type="submit"
                disabled={sending}
                className="w-full py-4 bg-buddhist-burgundy hover:bg-red-900 disabled:opacity-60 disabled:cursor-not-allowed text-amber-50 font-bold rounded-xl text-xs uppercase tracking-wider shadow-md transition-all flex items-center justify-center gap-2"
              >
                {sending ? 'Sending message…' : 'Send message by email'} <Send size={14} />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}