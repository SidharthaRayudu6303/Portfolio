'use client';

import React, { useState, useEffect } from 'react';
import {
  FolderGit2,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Github,
  Star,
  Loader2,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  techStack: string[];
  githubUrl?: string | null;
  liveUrl?: string | null;
  imageUrl?: string | null;
  featured: boolean;
  order: number;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [description, setDescription] = useState('');
  const [techStackInput, setTechStackInput] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [liveUrl, setLiveUrl] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [featured, setFeatured] = useState(false);
  const [order, setOrder] = useState(0);

  // Delete modal state
  const [projectToDelete, setProjectToDelete] = useState<Project | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch projects
  useEffect(() => {
    let isMounted = true;
    fetch('/api/projects')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load projects');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setProjects(data);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Error loading projects');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  async function refreshProjects() {
    try {
      const res = await fetch('/api/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch {
      // ignore refresh error
    }
  }

  function handleOpenCreate() {
    setEditingProject(null);
    setTitle('');
    setSlug('');
    setDescription('');
    setTechStackInput('');
    setGithubUrl('');
    setLiveUrl('');
    setImageUrl('');
    setFeatured(false);
    setOrder(projects.length);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleOpenEdit(project: Project) {
    setEditingProject(project);
    setTitle(project.title);
    setSlug(project.slug);
    setDescription(project.description);
    setTechStackInput(project.techStack.join(', '));
    setGithubUrl(project.githubUrl || '');
    setLiveUrl(project.liveUrl || '');
    setImageUrl(project.imageUrl || '');
    setFeatured(project.featured);
    setOrder(project.order);
    setModalError(null);
    setIsModalOpen(true);
  }

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!editingProject) {
      // Auto-generate slug from title for new projects
      const autoSlug = val
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      setSlug(autoSlug);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setModalError(null);

    const parsedTechStack = techStackInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const payload = {
      title,
      slug,
      description,
      techStack: parsedTechStack,
      githubUrl: githubUrl.trim() ? githubUrl.trim() : undefined,
      liveUrl: liveUrl.trim() ? liveUrl.trim() : undefined,
      imageUrl: imageUrl.trim() ? imageUrl.trim() : undefined,
      featured,
      order: Number(order) || 0,
    };

    setIsSaving(true);
    try {
      const url = editingProject
        ? `/api/projects/${editingProject.id}`
        : '/api/projects';
      const method = editingProject ? 'PUT' : 'POST';

      const res = await fetchWithCsrf(url, {
        method,
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          throw new Error('A project with this slug already exists. Please choose a unique slug.');
        }
        if (Array.isArray(data.message)) {
          throw new Error(data.message.join(', '));
        }
        throw new Error(data.message || data.error || 'Failed to save project');
      }

      setIsModalOpen(false);
      refreshProjects();
    } catch (err: any) {
      setModalError(err.message || 'An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteConfirm() {
    if (!projectToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithCsrf(`/api/projects/${projectToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok && res.status !== 204) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to delete project');
      }
      setProjectToDelete(null);
      refreshProjects();
    } catch (err: any) {
      alert(err.message || 'Could not delete project');
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleQuickToggleFeatured(project: Project) {
    try {
      const res = await fetchWithCsrf(`/api/projects/${project.id}`, {
        method: 'PUT',
        body: JSON.stringify({ featured: !project.featured }),
      });
      if (res.ok) {
        refreshProjects();
      }
    } catch {
      // ignore quick toggle error
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Projects CMS</h1>
          <p className="mt-1 text-sm text-neutral-400">
            Create, update, reorder and feature portfolio engineering projects
          </p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400"
        >
          <Plus className="h-4 w-4" />
          <span>Add Project</span>
        </button>
      </div>

      {/* Main List Table */}
      {error && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-xs text-red-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex h-64 items-center justify-center rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
        </div>
      ) : projects.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-800 bg-neutral-900/20 py-16 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-800 text-neutral-400 mb-3">
            <FolderGit2 className="h-6 w-6" />
          </div>
          <h3 className="text-sm font-semibold text-white">No projects found</h3>
          <p className="mt-1 text-xs text-neutral-500 max-w-sm">
            You have not added any projects to the portfolio database yet. Click below to add your first project.
          </p>
          <button
            onClick={handleOpenCreate}
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400"
          >
            <Plus className="h-4 w-4" />
            <span>Add First Project</span>
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40 backdrop-blur-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-neutral-800 text-neutral-400">
                  <th className="py-3 px-4 font-semibold">Order</th>
                  <th className="py-3 px-4 font-semibold">Project</th>
                  <th className="py-3 px-4 font-semibold">Tech Stack</th>
                  <th className="py-3 px-4 font-semibold">Featured</th>
                  <th className="py-3 px-4 font-semibold">Links</th>
                  <th className="py-3 px-4 text-right font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {projects.map((proj) => (
                  <tr key={proj.id} className="hover:bg-neutral-850/40 transition">
                    <td className="py-3 px-4 font-mono text-neutral-500">#{proj.order}</td>
                    <td className="py-3 px-4">
                      <div>
                        <span className="font-semibold text-white text-sm block">{proj.title}</span>
                        <span className="font-mono text-[11px] text-neutral-500">/{proj.slug}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex flex-wrap gap-1 max-w-xs">
                        {proj.techStack.map((tech) => (
                          <span
                            key={tech}
                            className="rounded-md bg-neutral-800/80 px-2 py-0.5 text-[10px] text-neutral-300"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => handleQuickToggleFeatured(proj)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium transition ${
                          proj.featured
                            ? 'bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 ring-1 ring-amber-500/30'
                            : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                        }`}
                        title="Click to toggle featured status"
                      >
                        <Star className={`h-3 w-3 ${proj.featured ? 'fill-amber-400' : ''}`} />
                        <span>{proj.featured ? 'Featured' : 'Standard'}</span>
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {proj.githubUrl && (
                          <a
                            href={proj.githubUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-neutral-400 hover:text-white"
                            title="GitHub Repository"
                          >
                            <Github className="h-4 w-4" />
                          </a>
                        )}
                        {proj.liveUrl && (
                          <a
                            href={proj.liveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-cyan-400 hover:text-cyan-300"
                            title="Live Demo"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        {!proj.githubUrl && !proj.liveUrl && (
                          <span className="text-neutral-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleOpenEdit(proj)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
                          title="Edit project"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => setProjectToDelete(proj)}
                          className="rounded-lg p-1.5 text-neutral-400 hover:bg-red-500/10 hover:text-red-400 transition"
                          title="Delete project"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create / Edit Modal Dialog */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-xl rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <h2 className="text-base font-bold text-white">
                {editingProject ? 'Edit Project' : 'Create New Project'}
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
                    Project Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Distributed Task Queue"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Unique Slug * (kebab-case)
                  </label>
                  <input
                    type="text"
                    required
                    pattern="^[a-z0-9]+(?:-[a-z0-9]+)*$"
                    title="Lowercase alphanumeric separated by hyphens (e.g. distributed-task-queue)"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="e.g. distributed-task-queue"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs font-mono text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Comprehensive description of architectural details, problem solved, and implementation..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Tech Stack * (comma-separated)
                </label>
                <input
                  type="text"
                  required
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  placeholder="e.g. NestJS, PostgreSQL, Redis, Docker, TypeScript"
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    GitHub URL (optional)
                  </label>
                  <input
                    type="url"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Live Demo URL (optional)
                  </label>
                  <input
                    type="url"
                    value={liveUrl}
                    onChange={(e) => setLiveUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Cover Image URL (optional)
                  </label>
                  <input
                    type="url"
                    value={imageUrl}
                    onChange={(e) => setImageUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
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
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-3 py-2 text-xs text-white focus:border-cyan-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="featured-checkbox"
                  checked={featured}
                  onChange={(e) => setFeatured(e.target.checked)}
                  className="h-4 w-4 rounded border-neutral-800 bg-neutral-950 text-cyan-500 focus:ring-0 focus:outline-none"
                />
                <label htmlFor="featured-checkbox" className="text-xs font-medium text-neutral-300 cursor-pointer">
                  Featured Project (highlighted prominently on portfolio homepage)
                </label>
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
                  className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingProject ? 'Update Project' : 'Create Project'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {projectToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-neutral-800 bg-neutral-900 p-6 shadow-2xl">
            <h3 className="text-base font-bold text-white">Delete Project</h3>
            <p className="mt-2 text-xs text-neutral-400">
              Are you sure you want to permanently delete project{' '}
              <strong className="text-white">&ldquo;{projectToDelete.title}&rdquo;</strong>? This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setProjectToDelete(null)}
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
                <span>Delete Project</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
