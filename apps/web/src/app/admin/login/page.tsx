'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Shield, Lock, Mail, AlertCircle, Loader2 } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const returnUrl = searchParams.get('from') || '/admin';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLockedOut, setIsLockedOut] = useState(false);

  // Fetch CSRF token on component mount
  useEffect(() => {
    let isMounted = true;
    async function loadCsrf() {
      try {
        const res = await fetch('/api/auth/csrf');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setCsrfToken(data.csrfToken);
        }
      } catch {
        if (isMounted) setErrorMessage('Failed to initialize security token. Please refresh.');
      }
    }
    loadCsrf();
    return () => {
      isMounted = false;
    };
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsLockedOut(false);

    if (!csrfToken) {
      setErrorMessage('Security token missing. Please refresh the page.');
      return;
    }

    if (!email || !password) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 429) {
          setIsLockedOut(true);
          setErrorMessage(
            data.error || 'Too many failed login attempts. IP temporarily restricted for 15 minutes.',
          );
        } else {
          setErrorMessage(data.error || 'Invalid email or password.');
        }
        setIsLoading(false);
        return;
      }

      // Successful login: navigate to dashboard
      router.push(returnUrl);
      router.refresh();
    } catch {
      setErrorMessage('Connection error. Please check your network and try again.');
      setIsLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-950 px-4 py-12 text-neutral-100">
      <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 shadow-2xl backdrop-blur-xl">
        <div className="mb-8 flex flex-col items-center text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 ring-1 ring-cyan-500/30">
            <Shield className="h-7 w-7" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Admin Authentication</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Secure, encrypted access to Portfolio Administration
          </p>
        </div>

        {errorMessage && (
          <div
            className={`mb-6 flex items-start gap-3 rounded-xl border p-4 text-sm ${
              isLockedOut
                ? 'border-amber-500/40 bg-amber-500/10 text-amber-200'
                : 'border-red-500/40 bg-red-500/10 text-red-200'
            }`}
            role="alert"
          >
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <div className="flex-1">
              <span className="font-semibold">{isLockedOut ? 'Security Lockout' : 'Authentication Error'}</span>
              <p className="mt-0.5 leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@portfolio.dev"
                disabled={isLoading}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Password
            </label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950/60 py-2.5 pl-10 pr-4 text-sm text-white placeholder-neutral-600 transition focus:border-cyan-500 focus:outline-none focus:ring-1 focus:ring-cyan-500 disabled:opacity-50"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !csrfToken}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/20 transition hover:from-cyan-400 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-offset-2 focus:ring-offset-neutral-900 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying credentials...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-neutral-800/80 pt-4 text-center">
          <p className="text-xs text-neutral-500">
            Protected by Same-Origin BFF, Double-Submit CSRF & Rate Limiting.
          </p>
        </div>
      </div>
    </div>
  );
}

