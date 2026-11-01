'use client';

import React, { useState, useEffect } from 'react';
import {
  FileText,
  Upload,
  CheckCircle2,
  AlertCircle,
  Trash2,
  Download,
  Calendar,
  HardDrive,
  RefreshCw,
  Eye,
  ShieldCheck,
  Edit2,
  Save,
} from 'lucide-react';
import { getCsrfToken } from '@/lib/api-client';

interface ResumeVersion {
  id: string;
  filename: string;
  label: string;
  mimeType: string;
  fileSize: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminResumePage() {
  const [resumes, setResumes] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Upload Form state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [label, setLabel] = useState('Sidhartha Rayudu Resume');
  const [dragActive, setDragActive] = useState(false);

  // Edit Meta state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editLabel, setEditLabel] = useState('');
  const [editFilename, setEditFilename] = useState('');

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/resume');
      if (res.ok) {
        const data = await res.json();
        setResumes(Array.isArray(data) ? data : []);
      }
    } catch {
      setFeedback({ type: 'error', message: 'Failed to retrieve resume versions.' });
    } finally {
      setIsLoading(false);
    }
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  function handleFileSelect(file: File) {
    setFeedback(null);
    if (!file.name.toLowerCase().endsWith('.pdf') && file.type !== 'application/pdf') {
      setFeedback({ type: 'error', message: 'Validation Error: Only PDF files (.pdf) are permitted.' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setFeedback({ type: 'error', message: 'File Size Limit: Resume PDF must not exceed 5 MB.' });
      return;
    }

    setSelectedFile(file);
  }

  async function handleUpload(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedFile) {
      setFeedback({ type: 'error', message: 'Please select a PDF resume file to upload.' });
      return;
    }

    setIsUploading(true);
    setFeedback(null);

    try {
      const csrfToken = (await getCsrfToken()) || '';
      const reader = new FileReader();

      reader.onload = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];

          const res = await fetch('/api/admin/resume', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'x-csrf-token': csrfToken,
            },
            body: JSON.stringify({
              filename: selectedFile.name,
              label: label.trim() || 'Sidhartha Rayudu Resume',
              fileBase64: base64Data,
            }),
          });

          const result = await res.json();
          if (!res.ok) {
            throw new Error(result.error || result.message || 'Upload rejected by server.');
          }

          setFeedback({
            type: 'success',
            message: `Resume "${selectedFile.name}" successfully uploaded and activated!`,
          });
          setSelectedFile(null);
          fetchResumes();
        } catch (err: any) {
          setFeedback({ type: 'error', message: err.message || 'Failed to upload resume.' });
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setIsUploading(false);
        setFeedback({ type: 'error', message: 'Failed to read local PDF file.' });
      };

      reader.readAsDataURL(selectedFile);
    } catch (err: any) {
      setIsUploading(false);
      setFeedback({ type: 'error', message: err.message || 'Error initializing upload.' });
    }
  }

  async function handleActivate(id: string) {
    try {
      const csrfToken = (await getCsrfToken()) || '';
      const res = await fetch(`/api/admin/resume/${id}?action=activate`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to activate resume version.');
      }

      setFeedback({ type: 'success', message: 'Resume version successfully activated for public download.' });
      fetchResumes();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  }

  async function handleDelete(id: string, filename: string) {
    if (!window.confirm(`Are you sure you want to permanently delete resume version "${filename}"?`)) {
      return;
    }

    try {
      const csrfToken = (await getCsrfToken()) || '';
      const res = await fetch(`/api/admin/resume/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to delete resume version.');
      }

      setFeedback({ type: 'success', message: `Resume version "${filename}" deleted.` });
      fetchResumes();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  }

  async function handleSaveMeta(id: string) {
    try {
      const csrfToken = (await getCsrfToken()) || '';
      const res = await fetch(`/api/admin/resume/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-csrf-token': csrfToken,
        },
        body: JSON.stringify({
          label: editLabel.trim(),
          filename: editFilename.trim(),
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to update metadata.');
      }

      setFeedback({ type: 'success', message: 'Resume metadata updated.' });
      setEditingId(null);
      fetchResumes();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message });
    }
  }

  const activeResume = resumes.find((r) => r.isActive);

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Page Header */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-neutral-800 pb-5">
        <div>
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
            <FileText className="h-4 w-4" />
            <span>Document Management</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
            Resume &amp; CV Management
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Upload, version, and manage your official PDF resume stored persistently in PostgreSQL (Neon) without external cloud costs.
          </p>
        </div>
        <button
          onClick={fetchResumes}
          className="inline-flex items-center gap-2 rounded-xl border border-neutral-800 bg-neutral-900/60 px-3.5 py-2 text-xs font-medium text-neutral-300 hover:text-white hover:border-cyan-500/40 transition"
        >
          <RefreshCw className="h-3.5 w-3.5 text-cyan-400" />
          <span>Refresh</span>
        </button>
      </div>

      {/* Feedback Banner */}
      {feedback && (
        <div
          className={`flex items-center gap-2.5 rounded-xl border p-4 text-xs ${
            feedback.type === 'success'
              ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
              : 'border-red-500/30 bg-red-500/10 text-red-400'
          }`}
        >
          {feedback.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 shrink-0" />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Active Resume Status Card */}
      <div className="rounded-2xl border border-cyan-500/30 bg-neutral-900/40 p-6 backdrop-blur-sm relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-cyan-500/10 px-3 py-0.5 text-xs font-semibold text-cyan-400 ring-1 ring-cyan-500/30">
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Currently Active Public Resume</span>
              </span>
            </div>
            {activeResume ? (
              <div className="pt-2">
                <h3 className="text-lg font-bold text-white">{activeResume.label}</h3>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-neutral-400 pt-1">
                  <span>File: {activeResume.filename}</span>
                  <span>•</span>
                  <span>Size: {formatBytes(activeResume.fileSize)}</span>
                  <span>•</span>
                  <span>Uploaded: {new Date(activeResume.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-neutral-400 italic pt-2">
                No active resume published yet. Upload your PDF below to make it available for visitors.
              </p>
            )}
          </div>

          {activeResume && (
            <div className="flex items-center gap-3">
              <a
                href="/api/resume/download"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition shadow-lg shadow-cyan-500/20"
              >
                <Download className="h-4 w-4" />
                <span>Download / Preview</span>
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Upload New Resume Version Section */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
        <h2 className="text-base font-bold text-white mb-2">Upload New Resume Version</h2>
        <p className="text-xs text-neutral-400 mb-6">
          Uploading a new PDF replaces the previous active resume on your public portfolio while preserving historical versions.
        </p>

        <form onSubmit={handleUpload} className="space-y-5">
          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-2">
              Display Label
            </label>
            <input
              type="text"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder="e.g. Sidhartha Rayudu — Full-Stack & AI Engineer Resume"
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:border-cyan-500 focus:outline-none"
            />
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragActive(true);
            }}
            onDragLeave={() => setDragActive(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragActive(false);
              if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                handleFileSelect(e.dataTransfer.files[0]);
              }
            }}
            className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center transition ${
              dragActive
                ? 'border-cyan-400 bg-cyan-950/20'
                : 'border-neutral-800 bg-neutral-950/60 hover:border-neutral-700'
            }`}
          >
            <Upload className="h-8 w-8 text-cyan-400 mb-3" />
            <p className="text-sm font-medium text-white mb-1">
              Drag and drop your PDF resume here, or click to browse
            </p>
            <p className="text-xs text-neutral-500 mb-4">
              Accepts .pdf files only • Maximum file size: 5 MB
            </p>

            <label className="cursor-pointer rounded-xl bg-neutral-800 px-4 py-2 text-xs font-semibold text-white hover:bg-neutral-700 transition">
              <span>Select PDF File</span>
              <input
                type="file"
                accept="application/pdf,.pdf"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    handleFileSelect(e.target.files[0]);
                  }
                }}
                className="hidden"
              />
            </label>

            {selectedFile && (
              <div className="mt-4 flex items-center gap-2 rounded-lg border border-cyan-500/30 bg-cyan-950/30 px-3 py-1.5 text-xs font-mono text-cyan-300">
                <FileText className="h-4 w-4" />
                <span>Selected: {selectedFile.name} ({formatBytes(selectedFile.size)})</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!selectedFile || isUploading}
            className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-2.5 text-xs font-bold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition"
          >
            {isUploading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Uploading &amp; Activating...</span>
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                <span>Upload &amp; Set as Active</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Version History Table */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
        <h2 className="text-base font-bold text-white mb-4">Resume Version History</h2>

        {isLoading ? (
          <div className="py-8 text-center text-xs text-neutral-400">Loading versions...</div>
        ) : resumes.length === 0 ? (
          <div className="py-8 text-center text-xs text-neutral-500">
            No resume versions found. Upload your first PDF above.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-neutral-800 text-neutral-400 uppercase text-[11px]">
                <tr>
                  <th className="pb-3 pl-2">Status</th>
                  <th className="pb-3">Label &amp; Filename</th>
                  <th className="pb-3">Size</th>
                  <th className="pb-3">Uploaded</th>
                  <th className="pb-3 text-right pr-2">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60 text-neutral-300">
                {resumes.map((resume) => (
                  <tr key={resume.id} className="hover:bg-neutral-850/40 transition">
                    <td className="py-3.5 pl-2">
                      {resume.isActive ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-semibold text-emerald-400 ring-1 ring-emerald-500/30">
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-neutral-800 px-2.5 py-0.5 text-[10px] text-neutral-400">
                          Inactive
                        </span>
                      )}
                    </td>

                    <td className="py-3.5">
                      {editingId === resume.id ? (
                        <div className="space-y-1">
                          <input
                            type="text"
                            value={editLabel}
                            onChange={(e) => setEditLabel(e.target.value)}
                            placeholder="Label"
                            className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                          />
                          <input
                            type="text"
                            value={editFilename}
                            onChange={(e) => setEditFilename(e.target.value)}
                            placeholder="Filename"
                            className="w-full rounded border border-neutral-700 bg-neutral-950 px-2 py-1 text-xs text-white"
                          />
                        </div>
                      ) : (
                        <div>
                          <div className="font-semibold text-white">{resume.label}</div>
                          <div className="text-[11px] text-neutral-400">{resume.filename}</div>
                        </div>
                      )}
                    </td>

                    <td className="py-3.5 text-neutral-400">
                      {formatBytes(resume.fileSize)}
                    </td>

                    <td className="py-3.5 text-neutral-400">
                      {new Date(resume.createdAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 text-right pr-2">
                      <div className="inline-flex items-center gap-2">
                        {editingId === resume.id ? (
                          <button
                            onClick={() => handleSaveMeta(resume.id)}
                            className="rounded p-1.5 text-emerald-400 hover:bg-neutral-800 transition"
                            title="Save"
                          >
                            <Save className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setEditingId(resume.id);
                              setEditLabel(resume.label);
                              setEditFilename(resume.filename);
                            }}
                            className="rounded p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                            title="Edit Details"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                        )}

                        <a
                          href={`/api/resume/download`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="rounded p-1.5 text-cyan-400 hover:bg-neutral-800 transition"
                          title="Preview"
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </a>

                        {!resume.isActive && (
                          <button
                            onClick={() => handleActivate(resume.id)}
                            className="rounded px-2 py-1 text-[11px] font-semibold text-cyan-300 hover:bg-cyan-500/20 transition"
                          >
                            Set Active
                          </button>
                        )}

                        {!resume.isActive && (
                          <button
                            onClick={() => handleDelete(resume.id, resume.filename)}
                            className="rounded p-1.5 text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition"
                            title="Delete"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
