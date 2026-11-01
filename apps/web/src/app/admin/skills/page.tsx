'use client';

import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Edit2,
  Trash2,
  Loader2,
  AlertCircle,
  X,
  Layers,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';

interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  order: number;
}

const COMMON_CATEGORIES = [
  'Languages',
  'Backend & Architecture',
  'Frontend & Mobile',
  'Databases & Caching',
  'Cloud & DevOps',
  'AI & ML',
  'Security & Tooling',
];

export default function AdminSkillsPage() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState(COMMON_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [useCustomCategory, setUseCustomCategory] = useState(false);
  const [level, setLevel] = useState(85);
  const [order, setOrder] = useState(0);

  // Delete modal state
  const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    fetch('/api/skills')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load skills');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setSkills(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error loading skills');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshSkills() {
    try {
      const res = await fetch('/api/skills');
      if (res.ok) {
        const data = await res.json();
        setSkills(data);
      }
    } catch {
      // ignore
    }
  }

  function handleOpenCreate() {
    setEditingSkill(null);
    setName('');
    setCategory(COMMON_CATEGORIES[0]);
    setCustomCategory('');
    setUseCustomCategory(false);
    setLevel(85);
    setOrder(skills.length);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(skill: Skill) {
    setEditingSkill(skill);
    setName(skill.name);
    if (COMMON_CATEGORIES.includes(skill.category)) {
      setCategory(skill.category);
      setUseCustomCategory(false);
      setCustomCategory('');
    } else {
      setUseCustomCategory(true);
      setCustomCategory(skill.category);
    }
    setLevel(skill.level);
    setOrder(skill.order);
    setModalError(null);
    setIsModalOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);

    const resolvedCategory = useCustomCategory
      ? customCategory.trim()
      : category;

    if (!resolvedCategory) {
      setModalError('Please specify a category for this skill.');
      return;
    }

    const payload = {
      name: name.trim(),
      category: resolvedCategory,
      level: Number(level),
      order: Number(order) || 0,
    };

    setIsSaving(true);
    try {
      const url = editingSkill ? `/api/skills/${editingSkill.id}` : '/api/skills';
      const method = editingSkill ? 'PUT' : 'POST';

      const res = await fetchWithCsrf(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('A skill with this name already exists.');
        }
        if (Array.isArray(data.message)) {
          throw new Error(data.message.join(', '));
        }
        throw new Error(data.message || data.error || 'Failed to save skill');
      }

      setIsModalOpen(false);
      refreshSkills();
    } catch (err: any) {
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!skillToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithCsrf(`/api/skills/${skillToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete skill');
      }
      setSkillToDelete(null);
      refreshSkills();
    } catch (err: any) {
      alert(err.message || 'Could not delete skill');
    } finally {
      setIsDeleting(false);
    }
  }

  // Group skills by category
  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Skills CMS</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Manage technical proficiencies, categories and ordering
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Skill</span>
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
          <Loader2 className="h-6 w-6 animate-spin text-purple-400" />
        </div>
      ) : skills.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No skills added yet</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            Populate your technical skill set to render interactive category proficiencies on your portfolio.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-400"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Skill</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {categories.map((cat) => {
            const categorySkills = skills
              .filter((s) => s.category === cat)
              .sort((a, b) => a.order - b.order);

            return (
              <div
                key={cat}
                className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm"
              >
                <div className="border-b border-neutral-800 bg-neutral-900/60 px-6 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-purple-400" />
                    <h2 className="text-xs font-bold uppercase tracking-wider text-white">
                      {cat}
                    </h2>
                  </div>
                  <span className="text-[11px] text-neutral-500">
                    {categorySkills.length} {categorySkills.length === 1 ? 'skill' : 'skills'}
                  </span>
                </div>

                <div className="divide-y divide-neutral-800/60 p-4">
                  {categorySkills.map((skill) => (
                    <div
                      key={skill.id}
                      className="flex items-center justify-between py-3 px-2 hover:bg-neutral-850/40 rounded-xl transition"
                    >
                      <div className="flex-1 pr-6">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">{skill.name}</span>
                            <span className="text-[10px] font-mono text-neutral-500">#{skill.order}</span>
                          </div>
                          <span className="text-xs font-mono text-purple-400">{skill.level}%</span>
                        </div>
                        {/* Progress Bar */}
                        <div className="h-1.5 w-full rounded-full bg-neutral-800 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-500 to-cyan-400"
                            style={{ width: `${skill.level}%` }}
                          />
                        </div>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleOpenEdit(skill)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                          title="Edit skill"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setSkillToDelete(skill)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition"
                          title="Delete skill"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
                  Skill Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Go, PostgreSQL, Kubernetes"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-purple-500 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">
                    Category *
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomCategory(!useCustomCategory)}
                    className="text-[11px] text-purple-400 hover:underline"
                  >
                    {useCustomCategory ? 'Choose from list' : '+ Custom category'}
                  </button>
                </div>

                {useCustomCategory ? (
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="e.g. Distributed Consensus"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-purple-500 focus:outline-none"
                  />
                ) : (
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
                  >
                    {COMMON_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-medium text-neutral-300">
                    Proficiency Level (1 - 100%)
                  </label>
                  <span className="text-xs font-mono font-bold text-purple-400">{level}%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="100"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full accent-purple-500 cursor-pointer"
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
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-purple-500 focus:outline-none"
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
                  className="inline-flex items-center gap-2 rounded-xl bg-purple-500 px-4 py-2 text-xs font-semibold text-white transition hover:bg-purple-400 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingSkill ? 'Update Skill' : 'Create Skill'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {skillToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Skill</h3>
            <p className="mt-2 text-xs text-neutral-400">
              Are you sure you want to delete skill{' '}
              <strong className="text-white">&ldquo;{skillToDelete.name}&rdquo;</strong>?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setSkillToDelete(null)}
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
                <span>Delete Skill</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
