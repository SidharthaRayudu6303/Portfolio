'use client';

import React from 'react';
import {
  Award,
  ShieldCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate?: string | null;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

interface CertificationsSectionProps {
  certifications?: Certification[];
}

const DEFAULT_CERTIFICATIONS: Certification[] = [
  {
    id: 'cert-1',
    title: 'Understanding Machine Learning',
    issuer: 'DataCamp',
    issueDate: '2025-11-08',
    credentialUrl: null, // Left empty until proof provided
    order: 1,
  },
  {
    id: 'cert-2',
    title: 'Python Programming Course',
    issuer: 'CodeTantra in association with Sathyabama Institute of Science and Technology',
    issueDate: '2025-10-14',
    credentialUrl: null,
    order: 2,
  },
  {
    id: 'cert-3',
    title: 'Python 101 for Data Science',
    issuer: 'Cognitive Class — IBM Developer Skills Network',
    issueDate: '2025-06-24',
    credentialUrl: null,
    order: 3,
  },
  {
    id: 'cert-4',
    title: 'Basics of Python',
    issuer: 'Infosys Springboard',
    issueDate: '2025-06-19',
    credentialUrl: null,
    order: 4,
  },
  {
    id: 'cert-5',
    title: 'Email Writing Skills',
    issuer: 'Infosys Springboard',
    issueDate: '2025-06-23',
    credentialUrl: null,
    order: 5,
  },
  {
    id: 'cert-6',
    title: 'AI Workshop — AI in Mobile Phones',
    issuer: 'Samsung India — Learn with Samsung',
    issueDate: null,
    credentialUrl: null,
    order: 6,
  },
  {
    id: 'cert-7',
    title: "AI 2025 — India's Biggest Career Aptitude Test",
    issuer: 'NxtWave Campus',
    issueDate: '2025-01-01',
    credentialUrl: null,
    order: 7,
  },
];

export function CertificationsSection({ certifications }: CertificationsSectionProps) {
  const items =
    certifications && certifications.length > 0
      ? certifications
      : DEFAULT_CERTIFICATIONS;

  return (
    <section id="certifications" className="scroll-mt-24 py-20 border-b border-neutral-800/80">
      <div className="mx-auto max-w-7xl px-6">
        {/* Section Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold font-mono uppercase tracking-widest">
              <Award className="h-4 w-4" />
              <span>Certificates &amp; Learning</span>
            </div>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Verified Learning &amp; Certifications
            </h2>
            <p className="mt-2 text-xs sm:text-sm text-neutral-400">
              Verified coursework and technical workshops in machine learning, Python programming, and professional communication.
            </p>
          </div>
          <span className="font-mono text-xs text-neutral-500">
            {items.length} Verified Credentials
          </span>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((cert) => (
            <div
              key={cert.id}
              className="group flex flex-col justify-between rounded-2xl border border-neutral-800/80 bg-neutral-900/40 p-6 backdrop-blur-sm transition hover:border-emerald-500/40 hover:bg-neutral-850/50 hover:shadow-lg hover:shadow-emerald-950/20"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20">
                    <Award className="h-5 w-5" />
                  </div>
                  {cert.issueDate ? (
                    <span className="font-mono text-[11px] text-neutral-500 flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-neutral-400" />
                      <span>
                        {new Date(cert.issueDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })}
                      </span>
                    </span>
                  ) : (
                    <span className="font-mono text-[10px] text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      Participation
                    </span>
                  )}
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-emerald-400 transition">
                  {cert.title}
                </h3>

                <div className="mt-2 flex items-start gap-1.5 text-xs text-neutral-400">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
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
      </div>
    </section>
  );
}
