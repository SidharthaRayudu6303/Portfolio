'use client';

import React, { useState } from 'react';
import {
  Mail,
  Send,
  Github,
  Linkedin,
  MapPin,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageSquare,
} from 'lucide-react';

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
            Let&apos;s Build Something Extraordinary
          </h2>
          <p className="mt-3 text-sm text-neutral-400 leading-relaxed">
            Have a project in mind, want to collaborate on innovative software, or looking for a dedicated full-stack developer? Feel free to reach out.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:items-start">
          {/* Left Column: Direct Info Cards */}
          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/20">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">Email</span>
                  <a
                    href="mailto:contact@sidhartha.dev"
                    className="text-sm font-semibold text-white hover:text-cyan-400 transition"
                  >
                    contact@sidhartha.dev
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400 ring-1 ring-blue-500/20">
                  <Linkedin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">LinkedIn</span>
                  <a
                    href="https://linkedin.com/in/sidhartha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-blue-400 transition"
                  >
                    linkedin.com/in/sidhartha
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-purple-400 ring-1 ring-purple-500/20">
                  <Github className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">GitHub</span>
                  <a
                    href="https://github.com/sidhartha"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-white hover:text-purple-400 transition"
                  >
                    github.com/sidhartha
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <span className="block text-xs font-mono uppercase text-neutral-500">Location</span>
                  <span className="text-sm font-semibold text-white">India (Available Worldwide Remote)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Working Contact Form */}
          <div className="lg:col-span-7">
            <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/60 p-6 sm:p-8 backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-6">
                <MessageSquare className="h-4 w-4 text-cyan-400" />
                <h3 className="text-base font-bold text-white">Send a Message</h3>
              </div>

              {successMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-xs text-emerald-300">
                  <CheckCircle2 className="h-4 w-4 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              {errorMessage && (
                <div className="mb-6 flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Honeypot field for spam prevention */}
                <div className="hidden" aria-hidden="true" style={{ display: 'none' }}>
                  <input
                    type="text"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Your Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell me about your project, idea, or inquiry..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3.5 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none transition"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                    <span>{isSubmitting ? 'Sending Message...' : 'Send Message'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

