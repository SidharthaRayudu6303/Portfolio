'use client';

import React, { useState, useEffect } from 'react';
import {
  Award,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  ShieldCheck,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  issueDate: string;
  credentialUrl?: string | null;
  imageUrl?: string | null;
  order: number;
}

export default function AdminCertificationsPage() {
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingCert, setEditingCert] = useState<Certification | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [issuer, setIssuer] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [credentialUrl, setCredentialUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [order, setOrder] = useState(0);

  // Delete modal state
  const [certToDelete, setCertToDelete] = useState<Certification | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/certifications')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load certifications');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setCertifications(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error loading certifications');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshCertifications() {
    try {
      const res = await fetch('/api/certifications');
      if (res.ok) {
        const data = await res.json();
        setCertifications(data);
      }
    } catch {
      // ignore
    }
  }

  function handleOpenCreate() {
    setEditingCert(null);
    setTitle('');
    setIssuer('');
    setIssueDate(new Date().toISOString().split('T')[0]);
    setCredentialUrl('');
    setImageUrl('');
    setOrder(certifications.length);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(cert: Certification) {
    setEditingCert(cert);
    setTitle(cert.title);
    setIssuer(cert.issuer);
    setIssueDate(cert.issueDate ? new Date(cert.issueDate).toISOString().split('T')[0] : '');
    setCredentialUrl(cert.credentialUrl || '');
    setImageUrl(cert.imageUrl || '');
    setOrder(cert.order);
    setModalError(null);
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);

    const payload = {
      title: title.trim(),
      issuer: issuer.trim(),
      issueDate: new Date(issueDate).toISOString(),
      credentialUrl: credentialUrl.trim() ? credentialUrl.trim() : undefined,
      imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
      order: Number(order) || 0,
    };

    setIsSaving(true);
    try {
      const url = editingCert
        ? `/api/certifications/${editingCert.id}`
        : '/api/certifications';
      const method = editingCert ? 'PUT' : 'POST';

      const res = await fetchWithCsrf(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.message)) {
          throw new Error(data.message.join(', '));
        }
        throw new Error(data.message || data.error || 'Failed to save certification');
      }

      setIsModalOpen(false);
      refreshCertifications();
    } catch (err: any) {
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!certToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithCsrf(`/api/certifications/${certToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete certification');
      }
      setCertToDelete(null);
      refreshCertifications();
    } catch (err: any) {
      alert(err.message || 'Could not delete certification');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Certifications CMS</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage professional accreditations, verified credentials, and licenses
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-emerald-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Certification</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <Loader2 className="h-6 w-6 animate-spin text-emerald-400" />
        </div>
      ) : certifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-3">
            <Award className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No certifications recorded</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            Showcase AWS, GCP, CKA, or security certifications with verified credential links on your portfolio.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-emerald-400"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Certification</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/40"
            >
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30">
                    <Award className="h-5 w-5" />
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleOpenEdit(cert)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                      title="Edit certification"
                    >
                      <Edit2 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => setCertToDelete(cert)}
                      className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition"
                      title="Delete certification"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-4">
                  <h3 className="text-sm font-bold text-white group-hover:text-emerald-400 transition">
                    {cert.title}
                  </h3>
                  <div className="mt-1 flex items-center gap-1.5 text-xs text-neutral-400">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                    <span>{cert.issuer}</span>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-[11px] text-neutral-500">
                  <Calendar className="h-3 w-3" />
                  <span>
                    Issued{' '}
                    {new Date(cert.issueDate).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'short',
                    })}
                  </span>
                  <span>•</span>
                  <span>Order #{cert.order}</span>
                </div>
              </div>

              {cert.credentialUrl && (
                <div className="mt-5 border-t border-neutral-800/80 pt-3">
                  <a
                    href={cert.credentialUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-400 hover:underline"
                  >
                    <span>Verify Credential</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingCert ? 'Edit Certification' : 'Add Certification'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalError && (
              <div className="mt-4 flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-300">
                <AlertCircle className="h-4 w-4 shrink-0" />
                <span>{modalError}</span>
              </div>
            )}

            <form onSubmit={handleSave} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Certificate Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. AWS Certified Solutions Architect - Associate"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Issuing Organization *
                </label>
                <input
                  type="text"
                  required
                  value={issuer}
                  onChange={(e) => setIssuer(e.target.value)}
                  placeholder="e.g. Amazon Web Services, CNCF, Google Cloud"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Issue Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={issueDate}
                    onChange={(e) => setIssueDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Display Order
                  </label>
                  <input
                    type="number"
                    value={order}
                    onChange={(e) => setOrder(parseInt(e.target.value, 10) || 0)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-emerald-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Credential Verification URL (optional)
                </label>
                <input
                  type="url"
                  value={credentialUrl}
                  onChange={(e) => setCredentialUrl(e.target.value)}
                  placeholder="https://www.credly.com/badges/..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Badge / Certificate Image URL (optional)
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-emerald-500 focus:outline-none"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3 border-t border-neutral-800 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-emerald-400 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingCert ? 'Update Certificate' : 'Save Certificate'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {certToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Certification</h3>
            <p className="mt-2 text-xs text-neutral-400">
              Are you sure you want to delete certificate{' '}
              <strong className="text-white">&ldquo;{certToDelete.title}&rdquo;</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCertToDelete(null)}
                className="rounded-xl border border-neutral-800 px-4 py-2 text-xs font-medium text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleDeleteConfirm}
                className="inline-flex items-center gap-2 rounded-xl bg-red-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
