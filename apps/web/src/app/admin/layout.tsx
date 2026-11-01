import React from 'react';
import Link from 'next/link';
import { cookies, headers } from 'next/headers';
import { redirect } from 'next/navigation';
import {
  LayoutDashboard,
  FolderGit2,
  BookOpen,
  Sparkles,
  Briefcase,
  Award,
  ShieldCheck,
  Lock,
  Mail,
} from 'lucide-react';
import { ADMIN_SESSION_COOKIE, BACKEND_API_URL } from '@/lib/constants';
import { LogoutButton } from './logout-button';

interface AdminUserSession {
  id: string;
  email: string;
  role: string;
}

async function getAuthenticatedAdmin(): Promise<AdminUserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_SESSION_COOKIE)?.value;

  if (!token) {
    return null;
  }

  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    return await res.json();
  } catch {
    // If backend is unreachable or connection fails, do not allow bypass
    return null;
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const headerList = await headers();
  const pathname = headerList.get('x-pathname');

  // Allow login page to render without admin layout or authentication check
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  const admin = await getAuthenticatedAdmin();

  if (!admin) {
    redirect('/admin/login');
  }

  const navItems = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Projects', href: '/admin/projects', icon: FolderGit2 },
    { label: 'Skills', href: '/admin/skills', icon: Sparkles },
    { label: 'Experience', href: '/admin/experience', icon: Briefcase },
    { label: 'Certifications', href: '/admin/certifications', icon: Award },
    { label: 'Blog Posts', href: '/admin/blog', icon: BookOpen },
    { label: 'Messages', href: '/admin/messages', icon: Mail },
  ];

  return (
    <div className="flex min-h-screen bg-neutral-950 text-neutral-100">
      {/* Sidebar Navigation */}
      <aside className="w-64 shrink-0 border-r border-neutral-800/80 bg-neutral-900/40 p-5 flex flex-col justify-between">
        <div>
          {/* Logo / Title */}
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <span className="text-sm font-bold tracking-tight text-white">Portfolio Admin</span>
              <span className="block text-[11px] font-medium text-cyan-400">Security Phase 2</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-medium text-neutral-400 transition hover:bg-neutral-800/60 hover:text-white"
                >
                  <Icon className="h-4 w-4 shrink-0 text-neutral-500" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Security badge at bottom of sidebar */}
        <div className="rounded-xl border border-neutral-800/80 bg-neutral-900/60 p-3 text-[11px] text-neutral-400">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
            <Lock className="h-3.5 w-3.5" />
            <span>Encrypted Session</span>
          </div>
          <p className="text-[10px] text-neutral-500 leading-normal">
            BFF HttpOnly + Double Submit CSRF Active
          </p>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navbar */}
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-800/80 bg-neutral-900/30 px-8">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
              Authenticated
            </span>
            <span className="text-xs text-neutral-400">
              Role: <strong className="text-neutral-200 capitalize">{admin.role}</strong>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <span className="block text-xs font-medium text-white">{admin.email}</span>
              <span className="block text-[10px] text-neutral-500">ID: {admin.id.slice(0, 12)}...</span>
            </div>
            <LogoutButton />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

