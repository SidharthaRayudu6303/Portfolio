'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Square, CornerDownLeft } from 'lucide-react';

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
      {`║   SIDHARTHA DEVELOPER SHELL  •  v7.2.0 (x86_64-pc-portfolio) ║`}
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
    if (!trimmed) {
      setLines((prev) => [
        ...prev,
        { id: `in-${Date.now()}`, type: 'input', content: '' },
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
        id: `in-${Date.now()}`,
        type: 'input',
        content: trimmed,
      },
    ];

    switch (root) {
      case 'help':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-1 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Available Commands:</div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 pt-1">
                <div><span className="text-cyan-300">about</span> - Background & engineering summary</div>
                <div><span className="text-cyan-300">skills</span> - Verified technical skill matrix</div>
                <div><span className="text-cyan-300">projects</span> - List all verified portfolio applications</div>
                <div><span className="text-cyan-300">project &lt;name&gt;</span> - Inspect specific project details</div>
                <div><span className="text-cyan-300">education</span> - Academic background & degree</div>
                <div><span className="text-cyan-300">contact</span> - Direct contact channels</div>
                <div><span className="text-cyan-300">github</span> - GitHub repository link</div>
                <div><span className="text-cyan-300">whoami</span> - Inspect active session credentials</div>
                <div><span className="text-cyan-300">date</span> - Display current UTC system timestamp</div>
                <div><span className="text-cyan-300">clear</span> - Clear terminal buffer</div>
                <div><span className="text-cyan-300">exit</span> - Close interactive terminal window</div>
              </div>
            </div>
          ),
        });
        break;

      case 'about':
      case 'bio':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content:
            'Sidhartha is a Full-Stack Software Engineer & AI / 3D Web Developer specializing in scalable cloud platforms, responsive reactive frontends (React, Next.js, TypeScript), high-throughput backend services (NestJS, Node.js, SQL), and machine learning applications.',
        });
        break;

      case 'skills':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Technical Stack:</div>
              <div>• <span className="text-neutral-100">Frontend:</span> React, Next.js, TypeScript, JavaScript, Tailwind CSS</div>
              <div>• <span className="text-neutral-100">Backend:</span> Node.js, NestJS, REST APIs, Microservices</div>
              <div>• <span className="text-neutral-100">Database & Cloud:</span> PostgreSQL (Neon), Prisma ORM, SQL, AWS</div>
              <div>• <span className="text-neutral-100">AI / ML:</span> Python, Machine Learning, Computer Vision</div>
            </div>
          ),
        });
        break;

      case 'projects':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: (
            <div className="space-y-1.5 text-xs font-mono text-neutral-300">
              <div className="text-cyan-400 font-semibold">Verified Portfolio Applications:</div>
              <div>1. <span className="text-cyan-300">genvision</span> - Computer Vision & Generative AI Platform (Python, ML, Next.js)</div>
              <div>2. <span className="text-cyan-300">bhuyanthra</span> - Geospatial Analytics & Telemetry Platform (TypeScript, React, SQL, AWS)</div>
              <div>3. <span className="text-cyan-300">robohatch</span> - Robotics Hardware/Software Orchestration (Python, ML, Node.js)</div>
              <div>4. <span className="text-cyan-300">smartdonum</span> - Transparent Resource Allocation Platform (Next.js, SQL, AWS)</div>
              <div>5. <span className="text-cyan-300">autism-screening</span> - Early Behavioral ML Screening (Machine Learning, Python, React)</div>
              <div>6. <span className="text-cyan-300">smart-rental</span> - Property Management Platform (Next.js, TypeScript, NestJS, SQL)</div>
              <div className="pt-1 text-[11px] text-neutral-500">Tip: Run &apos;project genvision&apos; to view deep dive on any application.</div>
            </div>
          ),
        });
        break;

      case 'project':
        if (!arg) {
          newLines.push({
            id: `err-${Date.now()}`,
            type: 'error',
            content: 'Usage: project <genvision | bhuyanthra | robohatch | smartdonum | autism-screening | smart-rental>',
          });
        } else if (arg.includes('genvision')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'GenVision: Advanced computer vision and generative AI platform engineered for high-accuracy image processing, intelligent analysis, and automated neural visual workflows.\nStack: Python, Machine Learning, Next.js, TypeScript, FastAPI.',
          });
        } else if (arg.includes('bhuyanthra')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'BhuYanthra: Geospatial intelligence and mapping analytics platform leveraging location telemetry, spatial queries, and high-performance data processing.\nStack: TypeScript, React, Next.js, SQL, AWS.',
          });
        } else if (arg.includes('robohatch')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'Robohatch: Robotics automation and hardware/software orchestration system engineered for intelligent monitoring, control loops, and autonomous task execution.\nStack: Python, Machine Learning, Node.js, TypeScript.',
          });
        } else if (arg.includes('smartdonum')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'SmartDonum: Transparent resource allocation and donation management platform featuring automated verification workflows, real-time status tracking, and secure auditability.\nStack: Next.js, React, Node.js, SQL, AWS.',
          });
        } else if (arg.includes('autism')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'Autism Screening Platform: Early digital developmental screening platform utilizing behavioral evaluation metrics and machine learning models for accessible assessment.\nStack: Machine Learning, Python, React, Next.js, SQL.',
          });
        } else if (arg.includes('rental')) {
          newLines.push({
            id: `out-${Date.now()}`,
            type: 'output',
            content:
              'Smart Rental Platform: Modern end-to-end property management and rental system featuring verified tenant workflows, dynamic listings, and secure agreement management.\nStack: Next.js, TypeScript, NestJS, SQL, AWS.',
          });
        } else {
          newLines.push({
            id: `err-${Date.now()}`,
            type: 'error',
            content: `Project '${arg}' not recognized in verified records. Run 'projects' to list all.`,
          });
        }
        break;

      case 'education':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content:
            'Bachelor of Technology in Computer Science & Engineering. Focused on distributed systems, algorithm design, software architecture, and machine learning.',
        });
        break;

      case 'contact':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content:
            'Direct Contact Channels:\n• Email: sidhartha.contact.dev@gmail.com\n• Website: Form on #contact section\n• Availability: Open for full-stack engineering roles and high-impact technical collaborations.',
        });
        break;

      case 'github':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: 'GitHub: https://github.com (Explore source repositories and project architectures)',
        });
        break;

      case 'whoami':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: 'guest@portfolio (Permissions: READ_ONLY_VERIFIED_ACCESS)',
        });
        break;

      case 'date':
        newLines.push({
          id: `out-${Date.now()}`,
          type: 'output',
          content: `UTC System Time: ${new Date().toUTCString()}`,
        });
        break;

      case 'clear':
        setLines([
          {
            id: `init-${Date.now()}`,
            type: 'system',
            content: INITIAL_BANNER,
          },
        ]);
        setInput('');
        return;

      case 'sudo':
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          content: 'Permission denied: Guest user is not permitted to escalate to root privileges.',
        });
        break;

      case 'exit':
        setIsOpen(false);
        setInput('');
        return;

      default:
        newLines.push({
          id: `err-${Date.now()}`,
          type: 'error',
          content: `bash: command not found: '${root}'. Type 'help' for available commands.`,
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
      const nextIdx = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIdx);
      setInput(commandHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (commandHistory.length === 0 || historyIndex === -1) return;
      const nextIdx = historyIndex + 1;
      if (nextIdx >= commandHistory.length) {
        setHistoryIndex(-1);
        setInput('');
      } else {
        setHistoryIndex(nextIdx);
        setInput(commandHistory[nextIdx]);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Developer Terminal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6"
    >
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md"
      />

      {/* Terminal Window */}
      <div
        className={`relative z-10 flex flex-col overflow-hidden rounded-2xl border border-cyan-500/40 bg-neutral-950 shadow-2xl shadow-cyan-950/60 backdrop-blur-2xl transition-all duration-200 ${
          isMaximized
            ? 'h-[92vh] w-[96vw]'
            : 'h-[500px] w-full max-w-3xl'
        }`}
      >
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/90 px-4 py-2.5 select-none">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsOpen(false)}
              className="h-3 w-3 rounded-full bg-rose-500 transition hover:opacity-80"
              title="Close terminal"
            />
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="h-3 w-3 rounded-full bg-amber-500 transition hover:opacity-80"
              title="Toggle size"
            />
            <button
              onClick={() => {
                setLines([
                  {
                    id: `init-${Date.now()}`,
                    type: 'system',
                    content: INITIAL_BANNER,
                  },
                ]);
              }}
              className="h-3 w-3 rounded-full bg-emerald-500 transition hover:opacity-80"
              title="Clear buffer"
            />
            <span className="ml-3 font-mono text-xs text-neutral-400">
              sidhartha@portfolio:~ (bash)
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-neutral-400">
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="rounded p-1 hover:bg-neutral-800 hover:text-white"
            >
              <Square className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="rounded p-1 hover:bg-neutral-800 hover:text-white"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Body */}
        <div
          onClick={() => inputRef.current?.focus()}
          className="flex-1 overflow-y-auto p-4 font-mono text-xs space-y-2 select-text"
        >
          {lines.map((line) => {
            if (line.type === 'system') {
              return <div key={line.id}>{line.content}</div>;
            }

            if (line.type === 'input') {
              return (
                <div key={line.id} className="flex items-center gap-2 text-neutral-300">
                  <span className="text-cyan-400 font-semibold">sidhartha@portfolio:~$</span>
                  <span className="text-white">{line.content}</span>
                </div>
              );
            }

            if (line.type === 'error') {
              return (
                <div key={line.id} className="text-rose-400 pl-4 whitespace-pre-wrap">
                  {line.content}
                </div>
              );
            }

            return (
              <div key={line.id} className="text-neutral-300 pl-4 whitespace-pre-wrap leading-relaxed">
                {line.content}
              </div>
            );
          })}

          {/* Active Input Line */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-cyan-400 font-semibold shrink-0">sidhartha@portfolio:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              autoFocus
              className="flex-1 bg-transparent text-white font-mono text-xs focus:outline-none caret-cyan-400"
            />
          </div>

          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Footer Bar */}
        <div className="flex items-center justify-between border-t border-neutral-800/80 bg-neutral-900/60 px-4 py-2 font-mono text-[10px] text-neutral-500">
          <div>
            Type <span className="text-cyan-400">&apos;help&apos;</span> for commands • <span className="text-cyan-400">&apos;exit&apos;</span> to close
          </div>
          <div className="flex items-center gap-2 text-neutral-400">
            <span>bash 5.2</span>
            <span>•</span>
            <span className="text-emerald-400 font-bold">ONLINE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

