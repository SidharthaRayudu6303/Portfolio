'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';

export function LogoutButton() {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  async function handleLogout() {
    setIsLoggingOut(true);
    try {
      // 1. Fetch fresh CSRF token
      let csrfToken: string | undefined;
      try {
        const csrfRes = await fetch('/api/auth/csrf');
        if (csrfRes.ok) {
          const csrfData = await csrfRes.json();
          csrfToken = csrfData.csrfToken;
        }
      } catch {
        // Proceed with attempt
      }

      // 2. Perform logout request
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(csrfToken ? { 'x-csrf-token': csrfToken } : {}),
        },
      });

      // 3. Clear client view and redirect to login
      router.push('/admin/login');
      router.refresh();
    } catch {
      router.push('/admin/login');
    } finally {
      setIsLoggingOut(false);
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={isLoggingOut}
      className="flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-900/60 px-3 py-1.5 text-xs font-medium text-neutral-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-300 disabled:opacity-50"
      title="Sign out of Admin Session"
    >
      {isLoggingOut ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <LogOut className="h-3.5 w-3.5" />
      )}
      <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
    </button>
  );
}

