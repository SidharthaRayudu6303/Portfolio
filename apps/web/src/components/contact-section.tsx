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
  Copy,
  Check,
  Github,
  FileText,
} from 'lucide-react';
import {
  CONTACT_EMAIL,
  LINKEDIN_URL,
  GITHUB_URL,
} from '@/lib/constants';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);

  const copyEmailToClipboard = () => {
    navigator.clipboard.writeText(CONTACT_EMAIL);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSuccessMessage(null);
    setErrorMessage(null);

    if (!name.trim() || !email.trim() || !message.trim()) {
      setErrorMessage('Please fill in all fields before sending.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.trim())) {
      setErrorMessage('Please enter a valid email address.');
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

      setSuccessMessage('Thank you! Your message has been safely saved and sent to Sidhartha.');
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      setErrorMessage(
        err.message ||
          'An error occurred while sending your message. Please reach out via email directly.'
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section id="contact" className="scroll-mt-16 min-h-screen flex flex-col justify-center py-20 relative">
      <div className="mx-auto max-w-7xl px-6 w-full">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold font-mono uppercase tracking-widest">
            <Mail className="h-4 w-4" />
            <span>Get in Touch</span>
          </div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
            Let&apos;s Connect &amp; Collaborate
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Interested in discussing full-stack engineering roles, software development opportunities, or AI/ML projects? Feel free to reach out directly.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Info Cards (5 Cols) */}
          <div className="lg:col-span-5 space-y-3.5">
            {/* Email Card with 1-Click Copy Interaction */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm transition hover:border-cyan-500/40">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div className="min-w-0">
                    <span className="block text-[11px] font-mono uppercase text-neutral-500">
                      Direct Email
                    </span>
                    <a
                      href={`mailto:${CONTACT_EMAIL}`}
                      className="text-xs sm:text-sm font-semibold text-white hover:text-cyan-400 transition truncate block"
                      title={CONTACT_EMAIL}
                    >
                      {CONTACT_EMAIL}
                    </a>
                  </div>
                </div>

                {/* 1-Click Copy Button */}
                <button
                  type="button"
                  onClick={copyEmailToClipboard}
                  className={`flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs font-mono transition-all ${
                    isCopied
                      ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-400'
                      : 'border-neutral-800 bg-neutral-950/80 text-neutral-400 hover:border-cyan-500/40 hover:text-cyan-300'
                  }`}
                  title="Copy email address"
                >
                  {isCopied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* LinkedIn Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm transition hover:border-blue-500/40">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <span className="block text-[11px] font-mono uppercase text-neutral-500">
                    LinkedIn Profile
                  </span>
                  <a
                    href={LINKEDIN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs sm:text-sm font-semibold text-white hover:text-blue-400 transition truncate block"
                  >
                    linkedin.com/in/sidhartha-rayudu-madhavarapu-039b84318
                  </a>
                </div>
              </div>
            </div>

            {/* GitHub Card */}
            {GITHUB_URL && (
              <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm transition hover:border-purple-500/40">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                    <Github className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="block text-[11px] font-mono uppercase text-neutral-500">
                      GitHub Profile
                    </span>
                    <a
                      href={GITHUB_URL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs sm:text-sm font-semibold text-white hover:text-purple-400 transition truncate block"
                    >
                      github.com/SidharthaRayudu6303
                    </a>
                  </div>
                </div>
              </div>
            )}

            {/* Location Card */}
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-4 sm:p-5 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-[11px] font-mono uppercase text-neutral-500">
                    Location
                  </span>
                  <span className="text-xs sm:text-sm font-semibold text-white">
                    Kakinada, Andhra Pradesh, India
                  </span>
                </div>
              </div>
            </div>

            {/* Resume Download Card */}
            <div id="resume" className="rounded-2xl border border-cyan-500/30 bg-cyan-950/20 p-4 sm:p-5 backdrop-blur-sm scroll-mt-24">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-500/40">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div>
                    <span className="block text-[11px] font-mono uppercase text-cyan-400">
                      Verified Resume
                    </span>
                    <span className="text-xs sm:text-sm font-semibold text-white">
                      Sidhartha_Rayudu_Resume.pdf
                    </span>
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

          {/* Right Column: Working Contact Form (7 Cols) */}
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
                    rows={4}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Discuss opportunities, technical collaborations, or engineering queries..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950/80 px-4 py-2.5 text-sm text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 transition resize-none"
                  />
                </div>

                {errorMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-red-500/40 bg-red-950/20 p-3 text-xs text-red-400">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {successMessage && (
                  <div className="flex items-center gap-2 rounded-xl border border-emerald-500/40 bg-emerald-950/20 p-3 text-xs text-emerald-400">
                    <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
                    <span>{successMessage}</span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 disabled:opacity-50 hover:shadow-lg hover:shadow-cyan-500/25 cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      <span>Transmitting Message...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      <span>Transmit Message</span>
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
