'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square, CornerDownLeft } from 'lucide-react';
import {
  DISPLAY_NAME,
  FULL_LEGAL_NAME,
  PROFESSIONAL_TITLE,
  CONTACT_EMAIL,
  CONTACT_PHONE,
  CONTACT_LOCATION,
  GITHUB_URL,
  LINKEDIN_URL,
  LEETCODE_URL,
  HACKERRANK_URL,
  EDUCATION_DATA,
  INTERMEDIATE_DATA,
  HACKATHONS_DATA,
} from '@/lib/constants';

interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error' | 'system';
  content: string | React.ReactNode;
}

const INITIAL_BANNER = (
  <div className="space-y-1 text-neutral-400 font-mono text-xs">
    <div className="text-cyan-400 font-bold">
      {`╔══════════════════════════════════════════════════════════════╗`}
      <br />
      {`║   ${DISPLAY_NAME} SHELL  •  v7.2.0 (x86_64-pc-portfolio)  ║`}
      <br />
      {`╚══════════════════════════════════════════════════════════════╝`}
    </div>
    <div className="text-neutral-400">
      Type <span className="text-cyan-300 font-semibold">&apos;help&apos;</span> to inspect all available system commands.
    </div>
  </div>
);

export function DeveloperTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const [input, setInput] = useState('');
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const msgCounter = useRef(0);
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: 'init-banner',
      type: 'system',
      content: INITIAL_BANNER,
    },
  ]);

  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global listener to open terminal
  useEffect(() => {
    function handleOpenTerminal() {
      setIsOpen(true);
    }
    window.addEventListener('open-developer-terminal', handleOpenTerminal);
    return () => {
      window.removeEventListener('open-developer-terminal', handleOpenTerminal);
    };
  }, []);

  // Auto scroll & focus
  useEffect(() => {
    if (isOpen) {
      terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      inputRef.current?.focus();
    }
  }, [lines, isOpen]);

  const executeCommand = (cmdStr: string) => {
    const trimmed = cmdStr.trim();
    msgCounter.current++;
    const currentId = msgCounter.current;
    if (!trimmed) {
      setLines((prev) => [
        ...prev,
        { id: `in-${currentId}`, type: 'input', content: '' },
      ]);
      return;
    }

    // Save command history
    setCommandHistory((prev) => [...prev, trimmed]);
    setHistoryIndex(-1);

    const parts = trimmed.split(' ');
    const root = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ').toLowerCase();

    const newLines: TerminalLine[] = [
      {
        id: `in-${currentId}`,
        type: 'input',
        content: trimmed,
      },
    ];

    switch (root) {
      case 'help':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Available Commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                <div><span className="text-cyan-300">about</span> - Background & engineering profile</div>
                <div><span className="text-cyan-300">skills</span> - Verified technical skill matrix</div>
                <div><span className="text-cyan-300">projects</span> - List all verified portfolio applications</div>
                <div><span className="text-cyan-300">project &lt;name&gt;</span> - Deep-dive into specific project</div>
                <div><span className="text-cyan-300">education</span> - Academic degree & coursework</div>
                <div><span className="text-cyan-300">experience</span> - Internship & work background</div>
                <div><span className="text-cyan-300">hackathons</span> - Hackathon challenges & selections</div>
                <div><span className="text-cyan-300">certifications</span> - Verified industry credentials</div>
                <div><span className="text-cyan-300">contact</span> - Email, phone, location & profiles</div>
                <div><span className="text-cyan-300">profiles</span> - LeetCode, HackerRank & LinkedIn</div>
                <div><span className="text-cyan-300">whoami</span> - Active session status</div>
                <div><span className="text-cyan-300">clear</span> - Clear terminal buffer</div>
                <div><span className="text-cyan-300">exit</span> - Close terminal window</div>
              </div>
            </div>
          ),
        });
        break;

      case 'about':
      case 'bio':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-bold">{DISPLAY_NAME} ({FULL_LEGAL_NAME})</div>
              <div className="text-neutral-400">{PROFESSIONAL_TITLE} • {CONTACT_LOCATION}</div>
              <p className="pt-1 text-neutral-300 leading-relaxed">
                Computer Science and Engineering student passionate about full-stack development, software engineering, and artificial intelligence. Transforming ideas into practical applications combining modern web technologies, backend systems, databases, and AI/ML.
              </p>
              <div className="text-neutral-400 pt-1">
                <span className="text-cyan-300">Career Objective:</span> To begin my career as a software developer where I can contribute to real-world engineering problems, build scalable applications and continuously grow as a software engineer.
              </div>
            </div>
          ),
        });
        break;

      case 'skills':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Technical Stack:</div>
              <div>• <span className="text-neutral-100">Programming Languages:</span> Python, JavaScript, TypeScript</div>
              <div>• <span className="text-neutral-100">Frontend:</span> React.js, Next.js, HTML5, CSS3, Tailwind CSS, Vite</div>
              <div>• <span className="text-neutral-100">Backend:</span> Node.js, NestJS, REST APIs</div>
              <div>• <span className="text-neutral-100">Databases:</span> MySQL, PostgreSQL, Amazon RDS</div>
              <div>• <span className="text-neutral-100">Cloud:</span> AWS, AWS EC2, AWS Amplify, Vercel</div>
              <div>• <span className="text-neutral-100">Tools:</span> Git, GitHub, GitHub Actions, VS Code, Figma, Postman</div>
              <div>• <span className="text-neutral-100">AI / ML:</span> Machine Learning, Deep Learning Fundamentals, Computer Vision, Image Classification, Geospatial Analysis, Python</div>
            </div>
          ),
        });
        break;

      case 'projects':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Portfolio Applications:</div>
              <div>1. <span className="text-cyan-300">genvision</span> - Cloud Severity-Aware Transformer-Diffusion Framework (In Development)</div>
              <div>2. <span className="text-cyan-300">bhuyanthra</span> - AI-Powered Agricultural Intelligence Platform (In Development)</div>
              <div>3. <span className="text-cyan-300">robohatch</span> - 3D Printed Products E-commerce Platform (Deployed)</div>
              <div>4. <span className="text-cyan-300">smartdonum</span> - Donation Management Platform (Deployed)</div>
              <div>5. <span className="text-cyan-300">autism-screening</span> - Web-based Autism Screening Platform (Deployed)</div>
              <div>6. <span className="text-cyan-300">smart-rental</span> - Equipment & Fleet Management Dashboard (Deployed)</div>
              <div className="pt-1 text-[11px] text-neutral-500">Tip: Run &apos;project genvision&apos; to view details for any project.</div>
            </div>
          ),
        });
        break;

      case 'project':
        if (!arg) {
          newLines.push({
            id: `err-${currentId}`,
            type: 'error',
            content: 'Usage: project <genvision | bhuyanthra | robohatch | smartdonum | autism-screening | smart-rental>',
          });
        } else if (arg.includes('genvision')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'GenVision: A Cloud Severity-Aware Transformer-Diffusion Framework for Cloud-Free Satellite Image Reconstruction and Agricultural Analysis.\nStatus: Final-year project — In Development\nFrontend: Next.js / React\nBackend: Python processing services\nTechnologies: Transformers, Diffusion Models, Computer Vision, Image Inpainting\nLive Demo: https://gen-vision-nu.vercel.app/',
          });
        } else if (arg.includes('bhuyanthra')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'BhuYanthra: AI-Powered Agricultural Intelligence Platform using satellite imagery and geospatial analysis to support agricultural monitoring and decision-making.\nStatus: In Development\nTechnologies: Next.js, React, Python, ISRO Bhuvan, Sentinel-2, Geospatial Analysis.',
          });
        } else if (arg.includes('robohatch')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'Robohatch: 3D Printed Products E-commerce Platform for showcasing and selling 3D-printed products.\nStatus: Developed / Deployed\nStack: Next.js, NestJS, TypeScript, REST APIs, AWS, Vercel\nLive Demo: https://robohatch-platform-web.vercel.app/\nGitHub: https://github.com/Chandrasekhar246800/robohatch-platform.git',
          });
        } else if (arg.includes('smartdonum')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'SmartDonum: Donation Management Platform connecting donors and beneficiaries for food, clothing and book donations.\nStatus: Developed / Deployed\nStack: React.js, Next.js, REST APIs, MySQL\nLive Demo: https://smartdonum.vercel.app/\nGitHub: https://github.com/Chandrasekhar246800/smartdonum.git',
          });
        } else if (arg.includes('autism')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'Autism Screening Platform: Web-based accessible interface for screening-related assessments and media submissions.\nStatus: Developed / Deployed\nStack: React, Vite, TypeScript\nLive Demo: https://autism-screening-platform.vercel.app/\nGitHub: https://github.com/SidharthaRayudu6303/autism_screening_platform.git',
          });
        } else if (arg.includes('rental')) {
          newLines.push({
            id: `out-${currentId}`,
            type: 'output',
            content:
              'Smart Rental Platform: Equipment and Fleet Management Dashboard for rental equipment tracking and operations.\nStatus: Developed / Deployed\nStack: React.js, Next.js, REST APIs, Vercel\nLive Demo: https://cat-hackathon-nu.vercel.app/dashboard\nGitHub: https://github.com/SidharthaRayudu6303/CAT_Hackathon.git',
          });
        } else {
          newLines.push({
            id: `err-${currentId}`,
            type: 'error',
            content: `Project '${arg}' not recognized. Run 'projects' to list all valid names.`,
          });
        }
        break;

      case 'education':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono text-neutral-300">
              <div className="border-l border-cyan-500/40 pl-2">
                <div className="text-cyan-400 font-semibold">{EDUCATION_DATA.institution}</div>
                <div>{EDUCATION_DATA.degree} — {EDUCATION_DATA.department}</div>
                <div className="text-neutral-400">{EDUCATION_DATA.startYear} – {EDUCATION_DATA.expectedGraduation} • CGPA: {EDUCATION_DATA.cgpa}</div>
                <div className="pt-0.5"><span className="text-cyan-300">Coursework:</span> {EDUCATION_DATA.coursework.join(', ')}</div>
                <div className="text-purple-300 pt-0.5"><span className="text-neutral-400">Achievement:</span> {EDUCATION_DATA.academicAchievement}</div>
              </div>
              <div className="border-l border-neutral-700 pl-2 pt-1">
                <div className="text-white font-semibold">{INTERMEDIATE_DATA.institution}</div>
                <div className="text-neutral-400">{INTERMEDIATE_DATA.board} • {INTERMEDIATE_DATA.years} • Percentage: {INTERMEDIATE_DATA.percentage}</div>
              </div>
            </div>
          ),
        });
        break;

      case 'experience':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-2 text-xs font-mono text-neutral-300">
              <div className="border-l border-amber-500/40 pl-2">
                <div className="text-amber-400 font-semibold">Robohatch • Software Developer Intern</div>
                <div className="text-neutral-400">Jan 2026 – May 2026 • Production E-Commerce Platform</div>
                <div>• Developed and maintained 20+ responsive web pages using React.js and Tailwind CSS.</div>
                <div>• Implemented core e-commerce workflows (catalogue, custom design upload, cart, checkout) and integrated REST APIs.</div>
                <div>• Tech: React.js, Tailwind CSS, REST APIs, Postman, GitHub</div>
              </div>
              <div className="border-l border-cyan-500/40 pl-2 pt-1">
                <div className="text-cyan-400 font-semibold">Navodita Infotech • Machine Learning Intern</div>
                <div className="text-neutral-400">5 June 2025 – 4 July 2025 • Remote Internship</div>
                <div>• Machine Learning internship focused on data preprocessing, feature engineering, and predictive ML models.</div>
                <div>• Tech: Python, Machine Learning, Scikit-learn, Pandas, NumPy, EDA</div>
              </div>
            </div>
          ),
        });
        break;

      case 'hackathons':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Hackathons &amp; Achievements:</div>
              {HACKATHONS_DATA.map((h, i) => (
                <div key={i} className="border-l border-cyan-500/30 pl-2">
                  <div className="font-semibold text-white">{h.title} ({h.year})</div>
                  <div className="text-cyan-300 text-[11px]">{h.status}: {h.challenge}</div>
                  <div className="text-neutral-400 text-[11px]">{h.description}</div>
                </div>
              ))}
            </div>
          ),
        });
        break;

      case 'certifications':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Certifications &amp; Achievements:</div>
              <div>1. National Coding Aptitude Test (NCAT) 2025 — Ranked 4,237 among 2.1 lakh+ participants (Jan 2025)</div>
              <div>2. Understanding Machine Learning — DataCamp (Nov 2025)</div>
              <div>3. Python Programming Course — CodeTantra &amp; Sathyabama (Oct 2025)</div>
              <div>4. Python 101 for Data Science — Cognitive Class / IBM (June 2025)</div>
              <div>5. TCS iON Career Edge: Young Professional — TCS iON (July 2025)</div>
              <div>6. Basics of Python — Infosys Springboard (June 2025)</div>
              <div>7. Email Writing Skills — Infosys Springboard (June 2025)</div>
              <div>8. AI Workshop: AI in Mobile Phones — Samsung India</div>
              <div>9. AI 2025: India&apos;s Biggest Career Aptitude Test — NxtWave Campus</div>
            </div>
          ),
        });
        break;

      case 'contact':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Contact &amp; Profiles:</div>
              <div>• Email: {CONTACT_EMAIL}</div>
              <div>• Phone: {CONTACT_PHONE}</div>
              <div>• Location: {CONTACT_LOCATION}</div>
              <div>• GitHub: {GITHUB_URL}</div>
              <div>• LinkedIn: {LINKEDIN_URL}</div>
              <div>• LeetCode: {LEETCODE_URL}</div>
              <div>• HackerRank: {HACKERRANK_URL}</div>
            </div>
          ),
        });
        break;

      case 'profiles':
      case 'coding':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Technical Profiles:</div>
              <div>• GitHub: {GITHUB_URL}</div>
              <div>• LeetCode: {LEETCODE_URL}</div>
              <div>• HackerRank: {HACKERRANK_URL}</div>
              <div>• LinkedIn: {LINKEDIN_URL}</div>
            </div>
          ),
        });
        break;

      case 'github':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: 'GitHub profile link has not been provided yet. Profile URL will be linked once confirmed.',
        });
        break;

      case 'whoami':
        newLines.push({
          id: `out-${currentId}`,
          type: 'output',
          content: 'guest@portfolio (Permissions: READ_ONLY_VERIFIED_ACCESS)',
        });
        break;

      case 'clear':
        setLines([]);
        setInput('');
        return;

      case 'exit':
      case 'quit':
        setIsOpen(false);
        setInput('');
        return;

      default:
        newLines.push({
          id: `err-${currentId}`,
          type: 'error',
          content: `Command not found: '${trimmed}'. Type 'help' for available commands.`,
        });
        break;
    }

    setLines((prev) => [...prev, ...newLines]);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      executeCommand(input);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length === 0) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx < commandHistory.length) {
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const nextIdx = historyIndex - 1;
        setHistoryIndex(nextIdx);
        setInput(commandHistory[commandHistory.length - 1 - nextIdx]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed z-50 transition-all duration-200 flex flex-col rounded-xl border border-cyan-500/40 bg-neutral-950/95 shadow-[0_0_40px_rgba(0,240,255,0.2)] backdrop-blur-xl ${
        isMaximized
          ? 'inset-4 w-auto h-auto'
          : 'bottom-6 right-6 w-full max-w-2xl h-[480px]'
      }`}
    >
      {/* Title Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/80 px-4 py-2.5 rounded-t-xl select-none">
        <div className="flex items-center gap-2 text-xs font-mono text-neutral-300">
          <TerminalIcon className="h-4 w-4 text-cyan-400" />
          <span className="font-semibold text-white">{DISPLAY_NAME} Developer Terminal</span>
          <span className="text-[10px] text-neutral-500">v7.2.0</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMaximized(!isMaximized)}
            className="rounded p-1 text-neutral-400 hover:bg-neutral-800 hover:text-white transition"
            title={isMaximized ? 'Restore' : 'Maximize'}
          >
            <Square className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="rounded p-1 text-neutral-400 hover:bg-red-500/20 hover:text-red-400 transition"
            title="Close"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono text-xs">
        {lines.map((line) => (
          <div key={line.id} className="leading-relaxed">
            {line.type === 'input' && (
              <div className="flex items-center gap-2 text-cyan-300">
                <span className="text-neutral-500">&gt;</span>
                <span className="text-white font-medium">{line.content}</span>
              </div>
            )}
            {line.type === 'output' && (
              <div className="text-neutral-300 pl-4 border-l border-neutral-800/80 whitespace-pre-wrap">
                {line.content}
              </div>
            )}
            {line.type === 'error' && (
              <div className="text-red-400 pl-4 border-l border-red-500/40">
                {line.content}
              </div>
            )}
            {line.type === 'system' && (
              <div className="text-neutral-400">{line.content}</div>
            )}
          </div>
        ))}
        <div ref={terminalEndRef} />
      </div>

      {/* Input Prompt */}
      <div className="flex items-center gap-2 border-t border-neutral-800 bg-neutral-900/60 px-4 py-2.5 rounded-b-xl">
        <span className="font-mono text-xs text-cyan-400 font-bold">&gt;</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type 'help' for commands..."
          className="flex-1 bg-transparent font-mono text-xs text-white placeholder-neutral-500 focus:outline-none"
        />
        <button
          type="button"
          onClick={() => executeCommand(input)}
          className="rounded p-1 text-neutral-400 hover:text-cyan-400 transition"
          title="Execute"
        >
          <CornerDownLeft className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
