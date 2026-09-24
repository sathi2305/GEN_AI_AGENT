import React, { useState } from 'react';
import {
  BookOpen,
  FileCode,
  Copy,
  Check,
  Bot,
  Sparkles,
} from 'lucide-react';

interface DocumentationViewProps {
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const DocumentationView: React.FC<DocumentationViewProps> = ({
  onDispatchToAgent,
  isDark,
}) => {
  const [selectedDoc, setSelectedDoc] = useState<'readme' | 'architecture' | 'api'>('readme');
  const [isCopied, setIsCopied] = useState(false);

  const docs = {
    readme: `# EcoRoute AI — Autonomous Freight Logistics Engine

> Real-time elevation topology routing and Eurovignette toll optimization for heavy EV carriers.

## Overview
EcoRoute AI solves the electric freight "gradient penalty": standard commercial navigation models route through high-elevation mountain passes that deplete 38-tonne electric semi batteries 3.2x faster than flat terrain.

EcoRoute AI incorporates meter-level Digital Elevation Models (DEM), 72% regenerative braking recapture models, and 2026 Eurovignette zero-emission toll subsidies directly into edge costs.

## Key Performance Indicators
- **28.4%** battery conservation on mixed gradient terrain.
- **€142** average savings per 500km trans-Alpine freight leg.
- **100%** verifiable automated test coverage across all graph heuristics.

## Quickstart
\`\`\`bash
# Run automated pytest verification
pytest tests/ -v

# Start FastAPI microservice
uvicorn main:app --host 0.0.0.0 --port 8000
\`\`\`
`,
    architecture: `# Architectural Specification & Decoupled Topology

## 1. System Topology
The application is structured into decoupled autonomous services:
- **Presentation Tier**: Next.js 15 App Router, React 19, Tailwind CSS.
- **Computation Engine**: Python 3.12 FastAPI microservice executing Dijkstra with custom C++ graph accelerators.
- **Knowledge & Persistence**: PostgreSQL with pgvector storing historical battery discharge curves.
- **Agent Orchestrator**: CrewAI Unified Work Agent coordinating tools and memory.

## 2. Security Boundaries & Approval Gates
Sensitive operations are guarded by explicit user authorization gates:
- Production Docker container deployments.
- Pull request merges into primary production branches.
- Database drop/truncate operations.
`,
    api: `# EcoRoute AI — REST API Reference

### POST /api/v1/routes/optimize
Computes optimal battery and toll pathing between origin and destination.

**Request Payload:**
\`\`\`json
{
  "origin": "Munich_Hub_North",
  "destination": "Milan_Terminal_South",
  "truck_mass_kg": 38000.0,
  "battery_capacity_kwh": 600.0
}
\`\`\`

**Response:**
\`\`\`json
{
  "status": "success",
  "route": {
    "path": ["Munich_Hub_North", "Brenner_Pass_Subsidized", "Milan_Terminal_South"],
    "total_cost_eur": 184.20,
    "energy_kwh": 348.6,
    "regen_kwh_captured": 92.4,
    "toll_subsidy_applied_eur": 48.0
  }
}
\`\`\`
`,
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(docs[selectedDoc]);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div id="documentation-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-indigo-500" />
            <span>Technical Documentation Studio</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Automated README generation, architectural specifications, and OpenAPI references.
          </p>
        </div>

        <button
          onClick={() => onDispatchToAgent('Generate complete API documentation and architecture diagrams for the current project.')}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Update Docs via Agent</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 pb-2 border-b border-inherit">
        <button
          onClick={() => setSelectedDoc('readme')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDoc === 'readme'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          README.md
        </button>
        <button
          onClick={() => setSelectedDoc('architecture')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDoc === 'architecture'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          ARCHITECTURE.md
        </button>
        <button
          onClick={() => setSelectedDoc('api')}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
            selectedDoc === 'api'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100'
          }`}
        >
          API_REFERENCE.md
        </button>
      </div>

      {/* Doc Preview */}
      <div className={`p-6 rounded-2xl border transition-colors relative group ${
        isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <button
          onClick={handleCopy}
          className="absolute top-4 right-4 p-2 rounded-lg border text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors flex items-center gap-1.5"
        >
          {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{isCopied ? 'Copied' : 'Copy Markdown'}</span>
        </button>

        <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
          {docs[selectedDoc]}
        </div>
      </div>
    </div>
  );
};
