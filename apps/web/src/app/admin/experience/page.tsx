'use client';

import React, { useState, useEffect } from 'react';
import {
  Briefcase,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Calendar,
  Building,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';

interface Experience {
  id: string;
  company: string;
  role: string;
  description: string;
  startDate: string;
  endDate?: string | null;
  current: boolean;
  order: number;
}

export default function AdminExperiencePage() {
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);

  // Form fields
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [current, setCurrent] = useState(false);
  const [order, setOrder] = useState(0);

  // Delete modal state
  const [experienceToDelete, setExperienceToDelete] = useState<Experience | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/experience')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load experience');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setExperiences(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error loading experience entries');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshExperience() {
    try {
      const res = await fetch('/api/experience');
      if (res.ok) {
        const data = await res.json();
        setExperiences(data);
      }
    } catch {
      // ignore
    }
  }

  function handleOpenCreate() {
    setEditingExperience(null);
    setCompany('');
    setRole('');
    setDescription('');
    setStartDate(new Date().toISOString().split('T')[0]);
    setEndDate('');
    setCurrent(false);
    setOrder(experiences.length);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(exp: Experience) {
    setEditingExperience(exp);
    setCompany(exp.company);
    setRole(exp.role);
    setDescription(exp.description);
    setStartDate(exp.startDate ? new Date(exp.startDate).toISOString().split('T')[0] : '');
    setEndDate(exp.endDate ? new Date(exp.endDate).toISOString().split('T')[0] : '');
    setCurrent(exp.current);
    setOrder(exp.order);
    setModalError(null);
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);

    const payload = {
      company: company.trim(),
      role: role.trim(),
      description: description.trim(),
      startDate: new Date(startDate).toISOString(),
      endDate: !current && endDate ? new Date(endDate).toISOString() : undefined,
      current,
      order: Number(order) || 0,
    };

    setIsSaving(true);
    try {
      const url = editingExperience
        ? `/api/experience/${editingExperience.id}`
        : '/api/experience';
      const method = editingExperience ? 'PUT' : 'POST';

      const res = await fetchWithCsrf(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (Array.isArray(data.message)) {
          throw new Error(data.message.join(', '));
        }
        throw new Error(data.message || data.error || 'Failed to save experience entry');
      }

      setIsModalOpen(false);
      refreshExperience();
    } catch (err: any) {
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!experienceToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithCsrf(`/api/experience/${experienceToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete experience');
      }
      setExperienceToDelete(null);
      refreshExperience();
    } catch (err: any) {
      alert(err.message || 'Could not delete experience');
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Experience CMS</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage career history, internships, hackathons and engineering roles
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Experience</span>
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
          <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
        </div>
      ) : experiences.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-3">
            <Briefcase className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No experience entries found</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            Add work history, internships, hackathons, or leadership milestones to display on your portfolio.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Milestone</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {experiences.map((exp) => (
            <div
              key={exp.id}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-5 backdrop-blur-sm transition hover:border-neutral-700 hover:bg-neutral-850/40"
            >
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <Building className="h-4 w-4 text-amber-400" />
                    <h3 className="text-base font-bold text-white">{exp.role}</h3>
                    <span className="text-xs text-neutral-400">at</span>
                    <span className="text-sm font-semibold text-amber-400">{exp.company}</span>
                    {exp.current && (
                      <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-medium text-emerald-400 ring-1 ring-emerald-500/30">
                        Current
                      </span>
                    )}
                  </div>

                  <div className="mt-1.5 flex items-center gap-2 text-xs text-neutral-400">
                    <Calendar className="h-3.5 w-3.5 text-neutral-500" />
                    <span>
                      {new Date(exp.startDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                      })}{' '}
                      —{' '}
                      {exp.current
                        ? 'Present'
                        : exp.endDate
                        ? new Date(exp.endDate).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'short',
                          })
                        : 'Present'}
                    </span>
                    <span className="text-neutral-600">•</span>
                    <span className="font-mono text-[11px] text-neutral-500">Order #{exp.order}</span>
                  </div>

                  <p className="mt-3 text-xs text-neutral-300 leading-relaxed whitespace-pre-line">
                    {exp.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 sm:self-start">
                  <button
                    onClick={() => handleOpenEdit(exp)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                    title="Edit entry"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setExperienceToDelete(exp)}
                    className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition"
                    title="Delete entry"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-lg rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingExperience ? 'Edit Experience' : 'Add Experience / Milestone'}
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Role / Position *
                  </label>
                  <input
                    type="text"
                    required
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Company / Organization *
                  </label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Google, Startup, Hackathon"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Start Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    End Date {!current && '*'}
                  </label>
                  <input
                    type="date"
                    disabled={current}
                    required={!current}
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white disabled:opacity-40 focus:border-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="current-checkbox"
                  checked={current}
                  onChange={(e) => setCurrent(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-amber-500 focus:ring-0"
                />
                <label htmlFor="current-checkbox" className="text-xs font-medium text-neutral-300 cursor-pointer">
                  I currently work or hold this role here
                </label>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Description / Responsibilities / Key Achievements *
                </label>
                <textarea
                  required
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Led migration of core backend to microservices architecture, reduced latency by 40%..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-amber-500 focus:outline-none"
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
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-amber-500 focus:outline-none"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-amber-400 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingExperience ? 'Update Milestone' : 'Save Milestone'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {experienceToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Experience</h3>
            <p className="mt-2 text-xs text-neutral-400">
              Are you sure you want to delete{' '}
              <strong className="text-white">&ldquo;{experienceToDelete.role}&rdquo; at {experienceToDelete.company}</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setExperienceToDelete(null)}
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
