'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  Linkedin,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
  Phone,
  FileText,
  Code,
} from 'lucide-react';
import {
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
} from '@/lib/constants';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          message: message.trim(),
          website: honeypot,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || data.error || 'Failed to deliver message.');
      }

      setSuccessMessage('Thank you! Your message has been received. I will get back to you shortly.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(err.message || 'An error occurred while sending your message. Please reach out via email directly.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-24 py-20">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <Mail className="h-4 w-4" />
            <span>Get in Touch</span>
          </div>
          <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Let&apos;s Connect &amp; Collaborate
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Interested in discussing full-stack engineering roles, software development opportunities, or AI/ML projects? Feel free to reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            {/* Email Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">Email</span>
                  <a
                    href={`mailto:${CONTACT_EMAIL}`}
                    className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                </div>
              </div>
            </div>

            {/* Phone Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">Phone</span>
                  <a
                    href={`tel:${CONTACT_PHONE.replace(/\s+/g, '')}`}
                    className="text-sm font-semibold text-white hover:text-emerald-400 transition"
                  >
                    {CONTACT_PHONE}
                  </a>
                </div>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">LinkedIn</span>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-blue-400 transition"
                  >
                    sidhartha-rayudu-madhavarapu
                  </a>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">Location</span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    {CONTACT_LOCATION}
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Download Card */}
            <div className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-5 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-xs font-mono uppercase text-cyan-400">Curriculum Vitae</span>
                    <span className="text-sm font-semibold text-white">Verified Resume PDF</span>
                  </div>
                </div>
                <a
                  href="/api/resume/download"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-xl bg-cyan-500 px-3.5 py-1.5 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition"
                >
                  Download
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Send a Direct Message</h3>
              </div>

              {/* Bot Honeypot */}
              <input
                type="text"
                name="website"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                className="hidden"
                aria-hidden="true"
              />

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="contact-name" className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Your Name
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-email" className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Your Email Address
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition"
                  />
                </div>

                <div>
                  <label htmlFor="contact-message" className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                    Your Message
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your role, project, or collaboration..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                  />
                </div>

                {successMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition shadow-lg shadow-cyan-500/20"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
