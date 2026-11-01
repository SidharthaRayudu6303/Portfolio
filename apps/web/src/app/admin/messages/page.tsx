'use client';

import React, { useState, useEffect } from 'react';
import {
  Mail,
  Trash2,
  CheckCircle,
  ExternalLink,
  Loader2,
  AlertCircle,
  Clock,
  User,
  Inbox,
  Send,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';
import { ContactMessageItemDto } from '@portfolio/types';

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<ContactMessageItemDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchMessages = async () => {
    try {
      const res = await fetch('/api/admin/messages');
      if (!res.ok) throw new Error('Failed to load contact messages');
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Error fetching messages');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/admin/messages')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load contact messages');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setMessages(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Error fetching messages');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleMarkAsRead = async (id: string) => {
    try {
      const res = await fetchWithCsrf(`/api/admin/messages/${id}`, {
        method: 'PUT',
      });
      if (res.ok) {
        setMessages((prev) =>
          prev.map((m) => (m.id === id ? { ...m, read: true } : m)),
        );
      }
    } catch {
      // Safe handle
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    setDeletingId(id);
    try {
      const res = await fetchWithCsrf(`/api/admin/messages/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== id));
      }
    } catch (err: any) {
      alert(err?.message || 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredMessages = messages.filter((m) =>
    filter === 'unread' ? !m.read : true,
  );

  const unreadCount = messages.filter((m) => !m.read).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <Mail className="h-6 w-6 text-cyan-400" />
            <span>Contact Form Inquiries</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Persisted messages sent by recruiters, collaborators, and visitors.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilter('all')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition ${
              filter === 'all'
                ? 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            All ({messages.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`rounded-xl px-3.5 py-1.5 text-xs font-medium transition flex items-center gap-1.5 ${
              filter === 'unread'
                ? 'border border-cyan-500/40 bg-cyan-500/15 text-cyan-300'
                : 'border border-neutral-800 bg-neutral-900 text-neutral-400 hover:text-white'
            }`}
          >
            <span>Unread</span>
            {unreadCount > 0 && (
              <span className="rounded-full bg-cyan-400 text-neutral-950 px-1.5 py-0.2 text-[10px] font-bold">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Messages List */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-500 flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span>Loading messages from Neon DB...</span>
        </div>
      ) : filteredMessages.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <Inbox className="mx-auto h-8 w-8 text-neutral-500 mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">
            {filter === 'unread' ? 'No Unread Messages' : 'Inbox Is Empty'}
          </h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto">
            {filter === 'unread'
              ? 'All received contact messages have been reviewed.'
              : 'Messages submitted through the on-site contact form will be displayed here.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredMessages.map((msg) => (
            <div
              key={msg.id}
              className={`rounded-2xl border p-5 transition-all duration-200 ${
                msg.read
                  ? 'border-neutral-800/80 bg-neutral-900/30 opacity-80 hover:opacity-100'
                  : 'border-cyan-500/40 bg-neutral-900/70 shadow-lg shadow-cyan-950/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-neutral-800/60 pb-3 mb-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-xl border ${
                      msg.read
                        ? 'border-neutral-800 bg-neutral-900 text-neutral-400'
                        : 'border-cyan-500/30 bg-cyan-500/10 text-cyan-400'
                    }`}
                  >
                    <User className="h-4 w-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-white text-xs sm:text-sm">
                        {msg.name}
                      </span>
                      {!msg.read && (
                        <span className="rounded bg-cyan-400/20 px-1.5 py-0.5 text-[9px] font-mono text-cyan-300 font-bold border border-cyan-400/30">
                          NEW
                        </span>
                      )}
                    </div>
                    <a
                      href={`mailto:${msg.email}`}
                      className="text-[11px] font-mono text-cyan-400/90 hover:underline flex items-center gap-1"
                    >
                      <span>{msg.email}</span>
                      <ExternalLink className="h-2.5 w-2.5" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-neutral-400">
                  <span className="flex items-center gap-1 font-mono text-[11px]">
                    <Clock className="h-3 w-3 text-cyan-400" />
                    {new Date(msg.createdAt).toLocaleString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {!msg.read && (
                      <button
                        onClick={() => handleMarkAsRead(msg.id)}
                        className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[11px] text-neutral-300 transition hover:border-cyan-500/40 hover:text-cyan-300 flex items-center gap-1"
                        title="Mark as read"
                      >
                        <CheckCircle className="h-3 w-3 text-cyan-400" />
                        <span>Mark Read</span>
                      </button>
                    )}

                    <a
                      href={`mailto:${msg.email}?subject=Re:%20Portfolio%20Inquiry`}
                      className="rounded-lg border border-neutral-800 bg-neutral-900 px-2.5 py-1 text-[11px] text-cyan-300 transition hover:border-cyan-500 hover:bg-cyan-500/10 flex items-center gap-1"
                    >
                      <Send className="h-3 w-3" />
                      <span>Reply</span>
                    </a>

                    <button
                      onClick={() => handleDelete(msg.id)}
                      disabled={deletingId === msg.id}
                      className="rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-400 transition hover:border-rose-500/40 hover:text-rose-400 disabled:opacity-50"
                      title="Delete message"
                    >
                      {deletingId === msg.id ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Trash2 className="h-3.5 w-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Message Content */}
              <div className="text-xs text-neutral-200 leading-relaxed whitespace-pre-wrap pl-1 sm:pl-12">
                {msg.message}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
