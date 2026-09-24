import React, { useState } from 'react';
import {
  Search,
  BookOpen,
  ExternalLink,
  Plus,
  Sparkles,
  Bot,
  Database,
  Check,
  TrendingUp,
} from 'lucide-react';
import { ResearchSource } from '../types/index.ts';

interface ResearchViewProps {
  research: ResearchSource[];
  activeProjectId: string;
  onAddResearchSource: (data: Partial<ResearchSource>) => Promise<void>;
  onCommitToMemory: (content: string) => Promise<void>;
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const ResearchView: React.FC<ResearchViewProps> = ({
  research,
  activeProjectId,
  onAddResearchSource,
  onCommitToMemory,
  onDispatchToAgent,
  isDark,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [committedId, setCommittedId] = useState<string | null>(null);

  const handleExecuteResearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setIsSearching(true);

    try {
      // Direct agent research tool execution
      onDispatchToAgent(`Use Research Tool to find authoritative research and regulatory facts on: "${searchQuery}"`);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCommit = async (source: ResearchSource) => {
    const memoryContent = `[Research Finding] ${source.title}: ${source.snippet} (Facts: ${source.keyFacts.join('; ')})`;
    await onCommitToMemory(memoryContent);
    setCommittedId(source.id);
    setTimeout(() => setCommittedId(null), 2500);
  };

  return (
    <div id="research-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header & Query Bar */}
      <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Search className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Autonomous Web & Scientific Research Engine
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Queries authoritative government databases, arXiv, IEEE papers, and technical APIs with verified citations and mathematical facts.
        </p>

        <form onSubmit={handleExecuteResearch} className="flex gap-2">
          <input
            id="research-query-input"
            type="text"
            placeholder="e.g. Eurovignette directive 2026 EV truck toll reductions, or EV elevation resistance formulas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`flex-1 p-2.5 rounded-xl border text-xs sm:text-sm font-medium focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
              isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-zinc-50 border-zinc-200 text-zinc-900'
            }`}
          />
          <button
            type="submit"
            disabled={!searchQuery.trim() || isSearching}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>Research via Agent</span>
          </button>
        </form>
      </div>

      {/* Sources Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span>Authoritative Sources & Extracted Facts ({research.length})</span>
          <span className="text-[11px] font-mono text-emerald-500">Live Citations Verified</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {research.map((source) => (
            <div
              key={source.id}
              className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
                isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-bold">
                    Relevance: {(source.relevanceScore * 100).toFixed(0)}%
                  </span>
                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-indigo-500 hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Source</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>

                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                  {source.title}
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                  {source.snippet}
                </p>

                {/* Key Facts List */}
                <div className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 mb-3 space-y-1.5">
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
                    Verified Key Facts
                  </div>
                  {source.keyFacts.map((fact, i) => (
                    <div key={i} className="text-[11px] text-zinc-700 dark:text-zinc-300 flex items-start gap-1.5">
                      <span className="text-indigo-500 font-bold">•</span>
                      <span>{fact}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-inherit flex items-center justify-between text-xs">
                <button
                  onClick={() => onDispatchToAgent(`Use research findings from "${source.title}" to update the project plan and algorithm code.`)}
                  className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium text-[11px]"
                >
                  <Bot className="w-3.5 h-3.5" />
                  <span>Synthesize into Sprint</span>
                </button>

                <button
                  onClick={() => handleCommit(source)}
                  className={`px-2.5 py-1 rounded-md text-[11px] font-medium border flex items-center gap-1 transition-colors ${
                    committedId === source.id
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : isDark
                      ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300'
                      : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  {committedId === source.id ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Committed</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3 h-3" />
                      <span>Commit to Memory</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
