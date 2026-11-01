'use client';

import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Loader2,
  AlertCircle,
  X,
  Check,
  Calendar,
  Clock,
  Eye,
  EyeOff,
} from 'lucide-react';
import { fetchWithCsrf } from '@/lib/api-client';
import { BlogPostDto } from '@portfolio/types';

export default function AdminBlogPage() {
  const [posts, setPosts] = useState<BlogPostDto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPostDto | null>(null);

  // Form fields
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [content, setContent] = useState('');
  const [tagsInput, setTagsInput] = useState('');
  const [published, setPublished] = useState(false);

  // Delete modal
  const [postToDelete, setPostToDelete] = useState<BlogPostDto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/blog/admin');
      if (!res.ok) throw new Error('Failed to load blog posts');
      const data = await res.json();
      setPosts(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || 'Error loading articles');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetch('/api/blog/admin')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load blog posts');
        return res.json();
      })
      .then((data) => {
        if (isMounted) {
          setPosts(Array.isArray(data) ? data : []);
          setIsLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err?.message || 'Error loading articles');
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const openCreateModal = () => {
    setEditingPost(null);
    setTitle('');
    setSlug('');
    setExcerpt('');
    setContent('');
    setTagsInput('');
    setPublished(false);
    setModalError(null);
    setIsModalOpen(true);
  };

  const openEditModal = (post: BlogPostDto) => {
    setEditingPost(post);
    setTitle(post.title);
    setSlug(post.slug);
    setExcerpt(post.excerpt);
    setContent(post.content);
    setTagsInput(post.tags?.join(', ') || '');
    setPublished(post.published);
    setModalError(null);
    setIsModalOpen(true);
  };

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!editingPost) {
      setSlug(
        val
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, ''),
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !slug.trim() || !excerpt.trim() || !content.trim()) {
      setModalError('Title, slug, excerpt, and content are required.');
      return;
    }

    setIsSaving(true);
    setModalError(null);

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: title.trim(),
      slug: slug.trim(),
      excerpt: excerpt.trim(),
      content: content.trim(),
      tags,
      published,
      publishedAt: published ? new Date().toISOString() : null,
    };

    try {
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const res = await fetchWithCsrf(url, {
        method,
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || data.error || 'Failed to save article');
      }

      setIsModalOpen(false);
      fetchPosts();
    } catch (err: any) {
      setModalError(err?.message || 'Failed to save article');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!postToDelete) return;
    setIsDeleting(true);
    try {
      const res = await fetchWithCsrf(`/api/blog/${postToDelete.id}`, {
        method: 'DELETE',
      });
      if (!res.ok) throw new Error('Failed to delete article');
      setPostToDelete(null);
      fetchPosts();
    } catch (err: any) {
      alert(err?.message || 'Delete operation failed');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleTogglePublish = async (post: BlogPostDto) => {
    try {
      const updatedStatus = !post.published;
      const res = await fetchWithCsrf(`/api/blog/${post.id}`, {
        method: 'PUT',
        body: JSON.stringify({
          published: updatedStatus,
          publishedAt: updatedStatus ? new Date().toISOString() : post.publishedAt,
        }),
      });
      if (res.ok) {
        fetchPosts();
      }
    } catch {
      // Safe handle
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title & Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-3">
            <BookOpen className="h-6 w-6 text-cyan-400" />
            <span>Technical Blog Management</span>
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Author, edit, publish, and manage engineering deep dives and architectural logs.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 transition hover:bg-cyan-400 hover:shadow-lg hover:shadow-cyan-500/20"
        >
          <Plus className="h-4 w-4" />
          <span>New Article</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Blog Posts Table */}
      {isLoading ? (
        <div className="py-20 text-center text-xs text-neutral-500 flex flex-col items-center gap-3">
          <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
          <span>Loading articles from Neon DB...</span>
        </div>
      ) : posts.length === 0 ? (
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/40 p-12 text-center">
          <BookOpen className="mx-auto h-8 w-8 text-neutral-500 mb-3" />
          <h3 className="text-sm font-semibold text-white mb-1">No Articles Found</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto mb-6">
            You haven’t created any blog posts yet. Click &apos;New Article&apos; above to publish your first engineering breakdown.
          </p>
          <button
            onClick={openCreateModal}
            className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-semibold text-cyan-300 hover:bg-cyan-500/20"
          >
            Create First Post
          </button>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-neutral-800 bg-neutral-900/40">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="border-b border-neutral-800 bg-neutral-900/80 font-mono text-[11px] text-neutral-400 uppercase tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Title & Slug</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Tags</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {posts.map((post) => (
                <tr key={post.id} className="hover:bg-neutral-800/30 transition">
                  <td className="px-5 py-4">
                    <div className="font-semibold text-white">{post.title}</div>
                    <div className="font-mono text-[11px] text-cyan-400/80">/{post.slug}</div>
                  </td>
                  <td className="px-5 py-4">
                    <button
                      onClick={() => handleTogglePublish(post)}
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-mono font-medium transition ${
                        post.published
                          ? 'border border-emerald-500/30 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'
                          : 'border border-amber-500/30 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20'
                      }`}
                    >
                      {post.published ? (
                        <>
                          <Eye className="h-3 w-3" />
                          <span>Published</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3" />
                          <span>Draft</span>
                        </>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {post.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded bg-neutral-800 px-1.5 py-0.5 text-[10px] font-mono text-neutral-300"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-neutral-400">
                    {post.publishedAt
                      ? new Date(post.publishedAt).toLocaleDateString()
                      : new Date(post.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => openEditModal(post)}
                        className="rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-300 transition hover:border-cyan-500/40 hover:text-cyan-300"
                        title="Edit article"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setPostToDelete(post)}
                        className="rounded-lg border border-neutral-800 bg-neutral-900 p-1.5 text-neutral-300 transition hover:border-rose-500/40 hover:text-rose-400"
                        title="Delete article"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setIsModalOpen(false)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />

          <div className="relative z-10 w-full max-w-2xl overflow-hidden rounded-2xl border border-cyan-500/30 bg-neutral-950 shadow-2xl backdrop-blur-xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/60 px-6 py-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-cyan-400" />
                <span>{editingPost ? 'Edit Blog Article' : 'New Blog Article'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="rounded-lg p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-4 flex-1">
              {modalError && (
                <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="e.g. Scaling Neural Vision Pipelines with Python"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    URL Slug *
                  </label>
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="scaling-neural-vision-pipelines"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Excerpt / Short Summary *
                </label>
                <textarea
                  rows={2}
                  required
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="A concise synopsis of the post for preview cards..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1">
                  Content (Markdown / Text) *
                </label>
                <textarea
                  rows={8}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write full article body. Supports headings (##, ###), bullet lists, and code blocks (```)..."
                  className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1">
                    Tags (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Machine Learning, Python, Full-Stack"
                    className="w-full rounded-xl border border-neutral-800 bg-neutral-900 px-3.5 py-2 text-xs text-neutral-100 placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
                  />
                </div>

                <div className="pt-4 sm:pt-0">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={published}
                      onChange={(e) => setPublished(e.target.checked)}
                      className="h-4 w-4 rounded border-neutral-800 text-cyan-500 focus:ring-cyan-500/40 bg-neutral-900"
                    />
                    <span className="text-xs font-medium text-neutral-300">
                      Publish publicly immediately
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="inline-flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-semibold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50"
                >
                  {isSaving && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  <span>{editingPost ? 'Save Changes' : 'Create Article'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {postToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            onClick={() => setPostToDelete(null)}
            className="fixed inset-0 bg-neutral-950/80 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-rose-500/30 bg-neutral-950 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-white mb-2">Delete Article?</h3>
            <p className="text-xs text-neutral-400 mb-6 leading-relaxed">
              Are you sure you want to delete <span className="font-semibold text-neutral-200">&apos;{postToDelete.title}&apos;</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setPostToDelete(null)}
                className="rounded-xl border border-neutral-800 bg-neutral-900 px-4 py-2 text-xs font-medium text-neutral-300 hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="inline-flex items-center gap-1.5 rounded-xl bg-rose-500 px-4 py-2 text-xs font-semibold text-white hover:bg-rose-600 disabled:opacity-50"
              >
                {isDeleting && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                <span>Delete Permanently</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
