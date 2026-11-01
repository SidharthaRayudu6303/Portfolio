import React from 'react';
import Link from 'next/link';
import { cookies } from 'next/headers';
import {
  ShieldCheck,
  Activity,
  UserCheck,
  AlertTriangle,
  CheckCircle2,
  FolderGit2,
  Sparkles,
  Briefcase,
  Award,
  ArrowUpRight,
  BookOpen,
  Mail,
  BarChart3,
  Eye,
  Globe,
  Smartphone,
  Laptop,
} from 'lucide-react';
import { ADMIN_SESSION_COOKIE, BACKEND_API_URL } from '@/lib/constants';

interface SecurityAuditLog {
  id: string;
  action: string;
  ipHash: string;
  details: string | null;
  createdAt: string;
}

interface LoginAttempt {
  id: string;
  ipHash: string;
  success: boolean;
  createdAt: string;
}

interface AuditData {
  auditLogs: SecurityAuditLog[];
  recentAttempts: LoginAttempt[];
}

interface DashboardStats {
  projects: number;
  skills: number;
  experience: number;
  certifications: number;
  contactMessages: number;
  unreadMessages?: number;
  pageViews: number;
}

interface AnalyticsSummary {
  totalViews: number;
  topPages: { path: string; visits: number }[];
  recentViews: {
    id: string;
    path: string;
    referrer: string | null;
    device: string | null;
    createdAt: string;
  }[];
}

async function getDashboardStats(): Promise<DashboardStats> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return { projects: 0, skills: 0, experience: 0, certifications: 0, contactMessages: 0, pageViews: 0 };
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/analytics/stats`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { projects: 0, skills: 0, experience: 0, certifications: 0, contactMessages: 0, pageViews: 0 };
    }

    return await res.json();
  } catch {
    return { projects: 0, skills: 0, experience: 0, certifications: 0, contactMessages: 0, pageViews: 0 };
  }
}

async function getAnalyticsSummary(): Promise<AnalyticsSummary> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return { totalViews: 0, topPages: [], recentViews: [] };
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/analytics/summary`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { totalViews: 0, topPages: [], recentViews: [] };
    }

    return await res.json();
  } catch {
    return { totalViews: 0, topPages: [], recentViews: [] };
  }
}

async function getSecurityAuditData(): Promise<AuditData> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return { auditLogs: [], recentAttempts: [] };
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/audit-logs`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });

    if (!res.ok) {
      return { auditLogs: [], recentAttempts: [] };
    }

    return await res.json();
  } catch {
    return { auditLogs: [], recentAttempts: [] };
  }
}

export default async function AdminDashboardPage() {
  const [stats, analytics, { auditLogs, recentAttempts }] = await Promise.all([
    getDashboardStats(),
    getAnalyticsSummary(),
    getSecurityAuditData(),
  ]);

  const failedAttempts = recentAttempts.filter((a) => !a.success);
  const successfulLogins = recentAttempts.filter((a) => a.success);

  const cmsCards = [
    {
      title: 'Projects',
      count: stats.projects,
      description: 'Showcase portfolio projects',
      href: '/admin/projects',
      icon: FolderGit2,
      accent: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
    },
    {
      title: 'Skills',
      count: stats.skills,
      description: 'Technical competencies & categories',
      href: '/admin/skills',
      icon: Sparkles,
      accent: 'text-purple-400 bg-purple-500/10 border-purple-500/20',
    },
    {
      title: 'Blog Articles',
      count: 'Manage',
      description: 'Technical logs and breakdowns',
      href: '/admin/blog',
      icon: BookOpen,
      accent: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    },
    {
      title: 'Inquiries',
      count: stats.contactMessages,
      description: `${stats.unreadMessages || 0} unread messages`,
      href: '/admin/messages',
      icon: Mail,
      accent: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    },
  ];

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Portfolio Content Management, Audience Analytics & Security Telemetry — Phase 6
        </p>
      </div>

      {/* Content Overview KPI Grid */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Portfolio Content Overview (Live Database)
          </h2>
          <span className="text-xs text-neutral-500">PostgreSQL (Neon)</span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cmsCards.map((card) => {
            const Icon = card.icon;
            return (
              <Link
                key={card.title}
                href={card.href}
                className="group relative rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 transition hover:border-neutral-700 hover:bg-neutral-850/60"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                    {card.title}
                  </span>
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${card.accent}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </div>
                <div className="mt-3 flex items-baseline justify-between">
                  <div>
                    <span className="text-3xl font-extrabold text-white">{card.count}</span>
                    <span className="block mt-1 text-xs text-neutral-400">{card.description}</span>
                  </div>
                  <div className="flex items-center text-xs text-neutral-500 group-hover:text-cyan-400 transition">
                    <span>Manage</span>
                    <ArrowUpRight className="ml-1 h-3.5 w-3.5 transition transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Portfolio Audience Analytics Section */}
      <section className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <BarChart3 className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Portfolio Traffic & Analytics</h2>
              <p className="text-xs text-neutral-400">
                Privacy-conscious, zero-cookie session metrics and popular section exploration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-mono font-medium text-cyan-300">
              Total Page Views: {analytics.totalViews || stats.pageViews}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Pages / Sections */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4">
            <h3 className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="h-3.5 w-3.5 text-cyan-400" />
              <span>Most Visited Routes</span>
            </h3>

            {analytics.topPages.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">
                Route metrics are aggregated daily as visitors browse the portfolio.
              </p>
            ) : (
              <div className="space-y-3">
                {analytics.topPages.map((page, idx) => (
                  <div key={idx} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="font-mono text-neutral-200">{page.path}</span>
                      <span className="font-mono text-cyan-400 font-semibold">{page.visits} views</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.max(10, (page.visits / Math.max(1, analytics.totalViews)) * 100),
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Visitor Streams */}
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/60 p-4">
            <h3 className="text-xs font-mono font-semibold text-neutral-300 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Activity className="h-3.5 w-3.5 text-cyan-400" />
              <span>Recent Visitor Activity</span>
            </h3>

            {analytics.recentViews.length === 0 ? (
              <p className="text-xs text-neutral-500 py-6 text-center">
                No recent views recorded yet.
              </p>
            ) : (
              <div className="space-y-2 max-h-56 overflow-y-auto scrollbar-thin">
                {analytics.recentViews.slice(0, 10).map((view) => (
                  <div
                    key={view.id}
                    className="flex items-center justify-between rounded-lg border border-neutral-900 bg-neutral-900/40 px-3 py-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      {view.device === 'mobile' ? (
                        <Smartphone className="h-3.5 w-3.5 text-neutral-400" />
                      ) : (
                        <Laptop className="h-3.5 w-3.5 text-cyan-400" />
                      )}
                      <span className="font-mono text-neutral-300">{view.path}</span>
                    </div>
                    <span className="font-mono text-[10px] text-neutral-500">
                      {new Date(view.createdAt).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Security & Health Status Grid */}
      <section>
        <div className="mb-4">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-neutral-300">
            Security & Session Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* Session Status */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Session Status
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400">
                <CheckCircle2 className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">Active</span>
              <span className="block mt-1 text-xs text-neutral-500">HttpOnly / 8h Expiry</span>
            </div>
          </div>

          {/* Security Tier */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Security Tier
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
                <ShieldCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">Phase 6</span>
              <span className="block mt-1 text-xs text-neutral-500">BFF + CSRF + TokenVersion</span>
            </div>
          </div>

          {/* Failed Attempts Monitor */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Recent Failures
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400">
                <AlertTriangle className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">{failedAttempts.length}</span>
              <span className="block mt-1 text-xs text-neutral-500">Lockout threshold: 5/15m</span>
            </div>
          </div>

          {/* Verified Logins */}
          <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                Verified Logins
              </span>
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400">
                <UserCheck className="h-4 w-4" />
              </div>
            </div>
            <div className="mt-3">
              <span className="text-2xl font-bold text-white">{successfulLogins.length}</span>
              <span className="block mt-1 text-xs text-neutral-500">In audit history</span>
            </div>
          </div>
        </div>
      </section>

      {/* Security Audit Visibility Section */}
      <section id="security" className="rounded-2xl border border-neutral-800 bg-neutral-900/30 p-6">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400">
              <Activity className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">Security Audit Log</h2>
              <p className="text-xs text-neutral-400">
                Tamper-evident authentication events and IP-hashed attempt monitoring
              </p>
            </div>
          </div>
          <span className="rounded-full bg-neutral-800 px-3 py-1 text-xs font-medium text-neutral-300">
            {auditLogs.length} Events Logged
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-neutral-800 text-neutral-400">
                <th className="pb-3 font-semibold">Action</th>
                <th className="pb-3 font-semibold">Hashed IP (HMAC)</th>
                <th className="pb-3 font-semibold">Details</th>
                <th className="pb-3 font-semibold">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-mono text-neutral-300">
              {auditLogs.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-6 text-center font-sans text-neutral-500">
                    No security events recorded yet in the active database.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log) => {
                  const isSuccess = log.action === 'LOGIN_SUCCESS';
                  const isFailure = log.action === 'LOGIN_FAILURE';
                  const isLogout = log.action === 'LOGOUT';

                  return (
                    <tr key={log.id} className="hover:bg-neutral-850/40">
                      <td className="py-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-sans font-medium ${
                            isSuccess
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : isFailure
                              ? 'bg-red-500/10 text-red-400'
                              : isLogout
                              ? 'bg-amber-500/10 text-amber-400'
                              : 'bg-neutral-700 text-neutral-200'
                          }`}
                        >
                          {log.action}
                        </span>
                      </td>
                      <td className="py-3 text-[11px] text-neutral-400">
                        {log.ipHash ? `${log.ipHash.slice(0, 16)}...` : 'N/A'}
                      </td>
                      <td className="py-3 text-neutral-300 font-sans">
                        {log.details || '—'}
                      </td>
                      <td className="py-3 text-neutral-400 font-sans text-[11px]">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
