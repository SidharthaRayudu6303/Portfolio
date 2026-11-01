'use client';

import React from 'react';
import {
  Award,
  ShieldCheck,
  Calendar,
  ExternalLink,
  BookOpen,
} from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

interface CertificationsSectionProps {
  certifications: Certification[];
}

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  return (
    <section id="certifications" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Award className="h-4 w-4" />
              <span>Credentials</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Certifications &amp; Accreditations
            </h2>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {certifications.length > 0 ? `${certifications.length} Verified` : 'Verified Learning'}
          </span>
        </div>

        {certifications.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert.id}
                className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-emerald-500/40 hover:bg-neutral-850/50 hover:shadow-lg hover:shadow-emerald-950/20"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                      <Award className="h-5 w-5" />
                    </div>
                    <span className="font-mono text-[11px] text-neutral-500">
                      {new Date(cert.issueDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                    {cert.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-1.5 text-xs text-neutral-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>

                {cert.credentialUrl && (
                  <div className="mt-6 border-t border-neutral-800/80 pt-4">
                    <a
                      href={cert.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 hover:underline"
                    >
                      <span>Verify Credential</span>
                      <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          // Honest empty / active learning state
          <div className="rounded-2xl border border-neutral-800/80 bg-neutral-900/30 p-8 sm:p-12 text-center max-w-2xl mx-auto">
            <div className="flex h-12 w-12 mx-auto items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-4">
              <BookOpen className="h-6 w-6 text-emerald-400" />
            </div>
            <h3 className="text-lg font-bold text-white">Continuous Learning &amp; Upskilling</h3>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400 leading-relaxed">
              Active pursuit of industry-recognized cloud architecture, modern full-stack development, and machine learning credentials. Authentic certificates will be uploaded and verified via the Admin CMS once finalized.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

