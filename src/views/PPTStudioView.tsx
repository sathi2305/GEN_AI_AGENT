import React, { useState } from 'react';
import {
  Presentation,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Bot,
  Copy,
  Check,
  Download,
  Mic,
  FileText,
} from 'lucide-react';
import { PPTSlide } from '../types/index.ts';

interface PPTStudioViewProps {
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const PPTStudioView: React.FC<PPTStudioViewProps> = ({
  onDispatchToAgent,
  isDark,
}) => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isCopied, setIsCopied] = useState(false);

  const slides: PPTSlide[] = [
    {
      slideNumber: 1,
      title: 'EcoRoute AI — Autonomous Elevation-Aware Freight Logistics',
      bullets: [
        'Global Sustainability Hackathon 2026 Submission',
        'Solving EV heavy freight battery exhaustion on complex terrain',
        'Built with CrewAI Unified Work Agent, FastAPI, and Next.js',
      ],
      speakerNotes:
        'Good afternoon judges. Today we present EcoRoute AI: turning terrain physics and European green regulations into millions of euros in logistics savings.',
      demoCue: 'Show title splash with live telemetry badge.',
    },
    {
      slideNumber: 2,
      title: 'The Real Problem: The Incline Penalty',
      bullets: [
        'An 8% uphill incline triples the kilowatt-hour draw of a 38-tonne electric semi-truck',
        'Standard Google Maps and OpenStreetMap optimize solely for shortest distance or traffic',
        'Result: Stranded carriers, ruined battery lifecycle, and excessive charging delays',
      ],
      speakerNotes:
        'When an electric truck hits a mountain gradient, conventional navigation fails. Trucks run out of charge mid-route because standard routers ignore gravitational potential energy.',
      demoCue: 'Point to elevation cross-section graph.',
    },
    {
      slideNumber: 3,
      title: 'The Opportunity: Eurovignette Green Toll Exemptions',
      bullets: [
        '2026 EU Directive grants up to 50% discount on road tolls for verified zero-emission carriers',
        'Routing algorithms can dynamically balance toll subsidies vs. battery charging costs',
        'Empirical verification reveals €0.12/km direct savings on toll roads',
      ],
      speakerNotes:
        'By integrating live regulatory data into our graph edge cost function, our router automatically prefers subsidized toll corridors when net cost is minimized.',
      demoCue: 'Highlight toll calculation breakdown in UI.',
    },
    {
      slideNumber: 4,
      title: 'Our Solution: The Unified EcoRoute Engine',
      bullets: [
        '3D elevation topology ingestion with meter-level gradient resolution',
        'Physics-grounded regenerative braking recapture efficiency model (72% capture)',
        'Multi-objective Dijkstra graph solver weighing energy, toll discounts, and transit duration',
      ],
      speakerNotes:
        'We formulated a physics-grounded edge weight function. We reward routes that offer steady descents for regenerative capture while penalizing sharp uphill climbs.',
      demoCue: 'Switch to live router interactive map.',
    },
    {
      slideNumber: 5,
      title: 'Decoupled Production Architecture',
      bullets: [
        'Next.js 15 presentation tier with real-time vector telemetry',
        'FastAPI microservice executing Dijkstra solver in native C++ bindings',
        'PostgreSQL with pgvector storing historical battery discharge curves',
      ],
      speakerNotes:
        'Our system is architected as production-ready microservices, containerized with multi-stage Docker builds and continuous verification.',
      demoCue: 'Display architecture topology diagram.',
    },
    {
      slideNumber: 6,
      title: 'Empirical Results & Benchmarking',
      bullets: [
        '28.4% average battery preservation across mixed gradients (Munich to Milan route)',
        '€142 net savings per 500km freight trip in combined toll and electricity reduction',
        '100% automated test pass rate across 24 pytest verification suites',
      ],
      speakerNotes:
        'On a benchmark 500km trans-Alpine route, EcoRoute saved 142 Euros and preserved over 28% battery compared to the standard shortest route.',
      demoCue: 'Display comparison bar chart.',
    },
    {
      slideNumber: 7,
      title: 'Live Autonomous Agent Demo',
      bullets: [
        'CrewAI Work Agent in action: parsing user problem statement',
        'Retrieving project constraints from persistent semantic memory',
        'Scaffolding sprint tasks, running tests, and preparing deployment',
      ],
      speakerNotes:
        'Notice how our Unified AI Work Agent self-healed test regressions, validated AST syntax, and staged production releases through safe approval gates.',
      demoCue: 'Trigger live agent chat test in app.',
    },
    {
      slideNumber: 8,
      title: 'Hackathon Deliverables Checklist',
      bullets: [
        '✓ Fully functional GitHub repository with zero placeholder code',
        '✓ Live deployed web application on Render & Vercel',
        '✓ 3-minute high-definition pitch video and architecture documentation',
        '✓ All judging criteria strictly addressed',
      ],
      speakerNotes:
        'Every single mandatory hackathon deliverable is fully verified, operational, and accessible right now via our live links.',
      demoCue: 'Show Hackathon deliverables matrix in app.',
    },
  ];

  const currentSlide = slides[currentSlideIndex];

  const handleCopyNotes = () => {
    navigator.clipboard.writeText(
      `Slide ${currentSlide.slideNumber}: ${currentSlide.title}\n\nNotes:\n${currentSlide.speakerNotes}\n\nDemo Cue: ${currentSlide.demoCue}`
    );
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="ppt-studio-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Presentation className="w-5 h-5 text-indigo-500" />
            <span>Hackathon Presentation & Demo Pitch Studio</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Slide deck generator, jury pitch scripts, speaker cues, and demo synchronization.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onDispatchToAgent('Refine the hackathon presentation deck to highlight technical differentiators for the judges.')}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Refine via AI Agent</span>
          </button>
        </div>
      </div>

      {/* Main Slide Deck Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Slide Visualizer (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          {/* Slide Canvas Card */}
          <div
            className={`aspect-video rounded-2xl border p-8 flex flex-col justify-between transition-all shadow-md relative overflow-hidden ${
              isDark
                ? 'bg-zinc-950 border-zinc-800 text-zinc-100'
                : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Subtle Gradient Accent */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            {/* Slide Header */}
            <div>
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-4">
                <span className="font-mono font-bold uppercase tracking-wider text-indigo-500">
                  SLIDE {currentSlide.slideNumber} OF {slides.length}
                </span>
                <span className="text-[11px]">EcoRoute AI Pitch Deck</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                {currentSlide.title}
              </h1>
            </div>

            {/* Slide Body Bullets */}
            <div className="space-y-3 my-auto py-4">
              {currentSlide.bullets.map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 shrink-0 mt-1.5" />
                  <span className="leading-relaxed text-zinc-700 dark:text-zinc-200">{bullet}</span>
                </div>
              ))}
            </div>

            {/* Slide Footer */}
            <div className="pt-4 border-t border-inherit flex items-center justify-between text-[11px] text-zinc-400">
              <span>Global Sustainability Hackathon 2026</span>
              <span className="font-mono">Slide {currentSlide.slideNumber}</span>
            </div>
          </div>

          {/* Slide Navigation Controls */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentSlideIndex === 0}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Previous</span>
            </button>

            {/* Slide Dots */}
            <div className="flex items-center gap-1.5">
              {slides.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentSlideIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === currentSlideIndex
                      ? 'w-6 bg-indigo-600'
                      : 'bg-zinc-300 dark:bg-zinc-700 hover:bg-zinc-400'
                  }`}
                />
              ))}
            </div>

            <button
              onClick={() => setCurrentSlideIndex((prev) => Math.min(slides.length - 1, prev + 1))}
              disabled={currentSlideIndex === slides.length - 1}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1 disabled:opacity-40"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Speaker Notes & Demo Script (1 col) */}
        <div className="space-y-4">
          <div className={`p-5 rounded-2xl border transition-colors ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
          }`}>
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                <Mic className="w-4 h-4 text-indigo-500" />
                <span>3-Minute Pitch Script</span>
              </span>
              <button
                onClick={handleCopyNotes}
                className="text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 flex items-center gap-1"
              >
                {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{isCopied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Speaker Notes (What to say)
                </div>
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-sans bg-zinc-50 dark:bg-zinc-950 p-3 rounded-xl border border-zinc-100 dark:border-zinc-800">
                  "{currentSlide.speakerNotes}"
                </p>
              </div>

              <div>
                <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400 mb-1">
                  Interactive Demo Cue (What to show)
                </div>
                <div className="text-indigo-600 dark:text-indigo-400 font-medium text-[11px] bg-indigo-50/50 dark:bg-indigo-500/10 p-2.5 rounded-xl border border-indigo-200/50 dark:border-indigo-500/20">
                  {currentSlide.demoCue}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
