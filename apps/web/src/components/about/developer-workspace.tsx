'use client';

import React, { useState } from 'react';
import {
  Terminal,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  ShieldCheck,
  Activity,
  Laptop,
} from 'lucide-react';

export function DeveloperWorkspace() {
  const [activeTab, setActiveTab] = useState<'editor' | 'terminal'>('editor');

  return (
    <div className="relative rounded-2xl border border-cyan-500/30 bg-gradient-to-b from-neutral-900/90 to-neutral-950/95 p-5 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl overflow-hidden group">
      {/* Ambient Lighting Orbs (Dark blue lighting & subtle cyan highlights) */}
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-blue-600/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-cyan-500/20 blur-3xl pointer-events-none" />

      {/* Top Workstation Bar */}
      <div className="relative z-10 flex items-center justify-between border-b border-neutral-800 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-red-500/80" />
            <span className="h-3 w-3 rounded-full bg-amber-500/80" />
            <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
          </div>
          <span className="ml-2 font-mono text-[11px] text-neutral-400">
            sidhartha-rayudu@workspace
          </span>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-1 rounded-lg border border-neutral-800 bg-neutral-950/80 p-0.5 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => setActiveTab('editor')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              activeTab === 'editor'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Code2 className="h-3 w-3 text-cyan-400" />
            <span>GenVision.py</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('terminal')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-md transition ${
              activeTab === 'terminal'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="h-3 w-3 text-cyan-400" />
            <span>bash</span>
          </button>
        </div>
      </div>

      {/* Interactive Main Display */}
      <div className="relative z-10">
        {activeTab === 'editor' ? (
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/80 p-4 font-mono text-xs text-neutral-300 space-y-1.5 leading-relaxed overflow-x-auto">
            <div className="text-neutral-500">{`# GenVision AI — Temporal Remote Sensing Inpainting`}</div>
            <div>
              <span className="text-purple-400">import</span>{' '}
              <span className="text-cyan-300">torch</span>
              <span className="text-neutral-400">,</span>{' '}
              <span className="text-cyan-300">torchvision</span>
            </div>
            <div>
              <span className="text-purple-400">from</span>{' '}
              <span className="text-blue-400">models.diffusion</span>{' '}
              <span className="text-purple-400">import</span>{' '}
              <span className="text-amber-300">TemporalInpainter</span>
            </div>
            <div className="pt-1">
              <span className="text-blue-400">class</span>{' '}
              <span className="text-amber-300">SatelliteInpaintingPipeline</span>
              <span className="text-neutral-400">:</span>
            </div>
            <div className="pl-4">
              <span className="text-purple-400">def</span>{' '}
              <span className="text-cyan-300">__init__</span>
              <span className="text-neutral-400">(self, checkpoint=</span>
              <span className="text-emerald-400">&quot;isro_bah_ch12.pt&quot;</span>
              <span className="text-neutral-400">):</span>
            </div>
            <div className="pl-8 text-neutral-300">
              <span>self.model = TemporalInpainter.from_pretrained(checkpoint)</span>
            </div>
            <div className="pl-8 text-cyan-400">
              <span>self.device = torch.device(&quot;cuda&quot; if torch.cuda.is_available() else &quot;cpu&quot;)</span>
            </div>
            <div className="pl-4 pt-1">
              <span className="text-purple-400">def</span>{' '}
              <span className="text-cyan-300">reconstruct_missing_regions</span>
              <span className="text-neutral-400">(self, masked_raster, cloud_mask):</span>
            </div>
            <div className="pl-8 text-neutral-400">
              <span className="text-emerald-400">&quot;&quot;&quot;Synthesizes temporal gaps across multispectral imagery.&quot;&quot;&quot;</span>
            </div>
            <div className="pl-8 text-neutral-200">
              <span className="text-purple-400">return</span>{' '}
              <span>self.model.predict(masked_raster, mask=cloud_mask)</span>
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-neutral-800/80 bg-neutral-950/80 p-4 font-mono text-xs text-neutral-300 space-y-2.5">
            <div className="flex items-center justify-between text-neutral-500 pb-1 border-b border-neutral-900">
              <span>sidhartha@devbox:~/projects/portfolio</span>
              <span className="text-emerald-400 flex items-center gap-1">
                <Activity className="h-3 w-3" />
                <span>ONLINE</span>
              </span>
            </div>
            <div>
              <span className="text-cyan-400">$</span> pnpm run verify:system
            </div>
            <div className="text-neutral-400 text-[11px] space-y-1 pl-2 border-l border-cyan-500/30">
              <div className="text-emerald-400">✓ NestJS 11 Microservices operational (Port 4000)</div>
              <div className="text-emerald-400">✓ Next.js 16 App Router BFF connected</div>
              <div className="text-emerald-400">✓ Neon PostgreSQL connection pool verified</div>
              <div className="text-cyan-300">ℹ Active Projects: GenVision, BhuYanthra, Robohatch</div>
            </div>
            <div className="pt-1 text-neutral-400">
              <span className="text-cyan-400">$</span> git status
            </div>
            <div className="text-neutral-300 text-[11px] pl-2">
              On branch main: Working tree clean. Ready to deploy.
            </div>
          </div>
        )}

        {/* Lower Multi-Monitor Telemetry Panel */}
        <div className="mt-3 grid grid-cols-3 gap-2 text-center font-mono">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
            <span className="block text-[10px] uppercase text-neutral-500">ENVIRONMENT</span>
            <span className="block text-xs font-bold text-cyan-400">Multi-Screen Rig</span>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
            <span className="block text-[10px] uppercase text-neutral-500">PRIMARY STACK</span>
            <span className="block text-xs font-bold text-blue-400">Next.js • NestJS • ML</span>
          </div>
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/60 p-2">
            <span className="block text-[10px] uppercase text-neutral-500">COMPUTE STATE</span>
            <span className="block text-xs font-bold text-emerald-400">Zero-Trust BFF</span>
          </div>
        </div>

        {/* Developer Workspace Atmosphere Callout */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-neutral-400 pt-2 border-t border-neutral-850">
          <div className="flex items-center gap-1.5 text-cyan-300">
            <Laptop className="h-3.5 w-3.5 text-cyan-400" />
            <span>Active Engineering Station</span>
          </div>
          <span className="text-neutral-500">Building scalable software daily</span>
        </div>
      </div>
    </div>
  );
}

