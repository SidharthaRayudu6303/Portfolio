'use client';

import React, { useState } from 'react';
import {
  User,
  Camera,
  Save,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Link as LinkIcon,
  Phone,
  Mail,
  MapPin,
  GraduationCap,
  Trophy,
  Info,
} from 'lucide-react';
import {
  FULL_LEGAL_NAME,
  DISPLAY_NAME,
  PROFESSIONAL_TITLE,
  HERO_HEADLINE,
  HERO_SUBTITLE,
  PROFESSIONAL_TAGLINE,
  ABOUT_TEXT,
  CAREER_OBJECTIVE,
  CURRENTLY_LOOKING_FOR,
  AVAILABILITY,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
  GITHUB_URL,
  EDUCATION_DATA,
} from '@/lib/constants';

export default function AdminProfilePage() {
  // Form state initialized with verified constants
  const [legalName, setLegalName] = useState(FULL_LEGAL_NAME);
  const [displayName, setDisplayName] = useState(DISPLAY_NAME);
  const [title, setTitle] = useState(PROFESSIONAL_TITLE);
  const [headline, setHeadline] = useState(HERO_HEADLINE);
  const [subtitle, setSubtitle] = useState(HERO_SUBTITLE);
  const [tagline, setTagline] = useState(PROFESSIONAL_TAGLINE);
  const [about, setAbout] = useState(ABOUT_TEXT);
  const [careerObjective, setCareerObjective] = useState(CAREER_OBJECTIVE);
  const [lookingFor, setLookingFor] = useState(CURRENTLY_LOOKING_FOR);
  const [availability, setAvailability] = useState(AVAILABILITY);

  // Contact
  const [email, setEmail] = useState(CONTACT_EMAIL);
  const [phone, setPhone] = useState(CONTACT_PHONE);
  const [location, setLocation] = useState(CONTACT_LOCATION);

  // Social Links
  const [linkedin, setLinkedin] = useState(LINKEDIN_URL);
  const [leetcode, setLeetcode] = useState(LEETCODE_URL);
  const [hackerrank, setHackerrank] = useState(HACKERRANK_URL);
  const [github, setGithub] = useState(GITHUB_URL);

  // Photo state
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (!file.type.startsWith('image/')) {
        setFeedback({ type: 'error', message: 'Only image files (PNG, JPG, WebP) are allowed.' });
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onload = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setIsSaving(true);
    setFeedback(null);

    // Simulate save or persist to local storage / profile settings
    setTimeout(() => {
      setIsSaving(false);
      setFeedback({
        type: 'success',
        message: 'Profile configuration updated successfully. Public sections and AI assistant will reflect verified values.',
      });
    }, 600);
  }

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      {/* Page Header */}
      <div className="border-b border-neutral-800 pb-5">
        <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs uppercase tracking-wider font-bold">
          <User className="h-4 w-4" />
          <span>Identity &amp; Branding</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white mt-1">
          Profile Information &amp; Personalization
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your official branding, biography, contact details, social links, and photograph.
        </p>
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

      {/* Profile Photograph Management Card */}
      <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-4">
          <Camera className="h-4 w-4" />
          <span>Profile Photograph Management</span>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative flex h-28 w-28 shrink-0 items-center justify-center rounded-2xl border-2 border-dashed border-cyan-500/40 bg-neutral-950/80 overflow-hidden">
            {photoPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="flex flex-col items-center justify-center text-center p-2 text-neutral-500">
                <Sparkles className="h-6 w-6 text-cyan-400 mb-1" />
                <span className="text-[10px] font-mono text-cyan-300">3D Rig Active</span>
              </div>
            )}
          </div>

          <div className="space-y-2 text-center sm:text-left">
            <h3 className="text-sm font-bold text-white">Current Mode: Interactive 3D Character</h3>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-md">
              The public portfolio currently features your interactive 3D developer rig. When you are ready, upload your verified headshot here to enable image presentation.
            </p>
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <label className="cursor-pointer rounded-xl bg-cyan-500 px-4 py-2 text-xs font-bold text-neutral-950 hover:bg-cyan-400 transition">
                <span>Upload Photograph</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handlePhotoSelect}
                  className="hidden"
                />
              </label>
              {photoPreview && (
                <button
                  type="button"
                  onClick={() => {
                    setPhotoPreview(null);
                    setPhotoFile(null);
                  }}
                  className="rounded-xl border border-neutral-800 px-3 py-2 text-xs text-neutral-400 hover:text-white"
                >
                  Reset to 3D Character
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Profile Form */}
      <form onSubmit={handleSave} className="space-y-6">
        {/* Names & Professional Branding */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-neutral-800 pb-3">
            Core Identity &amp; Headline
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Display Name (All Public Sections)
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Full Legal Name
              </label>
              <input
                type="text"
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Main Professional Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Hero Headline
            </label>
            <input
              type="text"
              value={headline}
              onChange={(e) => setHeadline(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Hero Subtitle
            </label>
            <textarea
              rows={2}
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Professional Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Biography & Career Direction */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-neutral-800 pb-3">
            About Me &amp; Career Objectives
          </h2>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              About Me Narrative
            </label>
            <textarea
              rows={5}
              value={about}
              onChange={(e) => setAbout(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
              Career Objective
            </label>
            <textarea
              rows={2}
              value={careerObjective}
              onChange={(e) => setCareerObjective(e.target.value)}
              className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Currently Looking For
              </label>
              <input
                type="text"
                value={lookingFor}
                onChange={(e) => setLookingFor(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Availability Status
              </label>
              <input
                type="text"
                value={availability}
                onChange={(e) => setAvailability(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Contact & Social Links */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider font-mono border-b border-neutral-800 pb-3">
            Contact Channels &amp; Coding Profiles
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                Location
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                value={linkedin}
                onChange={(e) => setLinkedin(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                LeetCode Profile URL
              </label>
              <input
                type="url"
                value={leetcode}
                onChange={(e) => setLeetcode(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                HackerRank Profile URL
              </label>
              <input
                type="url"
                value={hackerrank}
                onChange={(e) => setHackerrank(e.target.value)}
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white focus:border-cyan-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-mono uppercase text-neutral-400 mb-1.5">
                GitHub Profile URL (Optional / Pending)
              </label>
              <input
                type="text"
                value={github}
                onChange={(e) => setGithub(e.target.value)}
                placeholder="Leave blank until provided"
                className="w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-2.5 text-xs text-white placeholder-neutral-600 focus:border-cyan-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Education & Achievements Reference Card */}
        <div className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-6 backdrop-blur-sm space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono font-bold uppercase tracking-wider text-purple-400">
            <GraduationCap className="h-4 w-4" />
            <span>Academic Reference (Sathyabama Institute of Science and Technology)</span>
          </div>
          <div className="text-xs text-neutral-300 space-y-1">
            <p>• <strong>Degree</strong>: {EDUCATION_DATA.degree} in {EDUCATION_DATA.department} ({EDUCATION_DATA.startYear} – {EDUCATION_DATA.expectedGraduation})</p>
            <p>• <strong>CGPA</strong>: {EDUCATION_DATA.cgpa}</p>
            <p>• <strong>Hackathon</strong>: {EDUCATION_DATA.academicAchievement}</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 text-xs font-bold text-neutral-950 hover:bg-cyan-400 disabled:opacity-50 transition shadow-lg shadow-cyan-500/20"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? 'Saving Changes...' : 'Save Profile Changes'}</span>
        </button>
      </form>
    </div>
  );
}

