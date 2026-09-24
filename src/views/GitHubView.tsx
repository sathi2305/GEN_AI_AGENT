import React, { useState } from 'react';
import {
  GitPullRequest,
  GitBranch,
  GitCommit,
  CheckCircle2,
  Clock,
  ExternalLink,
  Bot,
  ShieldAlert,
} from 'lucide-react';

interface GitHubViewProps {
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const GitHubView: React.FC<GitHubViewProps> = ({
  onDispatchToAgent,
  isDark,
}) => {
  const pullRequests = [
    {
      id: 'PR #14',
      title: 'feat(router): Integrate elevation Dijkstra energy weight matrix and Eurovignette toll calculations',
      branch: 'feature/elevation-dijkstra',
      author: 'CrewAI Work Agent',
      status: 'Ready for Review',
      checks: '6/6 Passed (Pytest, AST, Docker Lint)',
      filesChanged: 7,
      additions: 420,
      deletions: 18,
    },
    {
      id: 'PR #15',
      title: 'chore(ci): Add multi-stage Docker build pipeline and healthcheck probe',
      branch: 'ci/docker-pipeline',
      author: 'CrewAI Work Agent',
      status: 'Awaiting User Approval',
      checks: 'All checks passed',
      filesChanged: 3,
      additions: 110,
      deletions: 4,
    },
  ];

  return (
    <div id="github-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <GitPullRequest className="w-5 h-5 text-indigo-500" />
            <span>GitHub Version Control & Automated Pull Requests</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Branches, commit staging, AST safety inspection, and pull requests managed by the unified agent.
          </p>
        </div>

        <button
          onClick={() => onDispatchToAgent('Prepare a clean pull request for the latest elevation routing changes and run verification checks.')}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-xs transition-colors"
        >
          <Bot className="w-3.5 h-3.5" />
          <span>Stage Pull Request via Agent</span>
        </button>
      </div>

      {/* PR Cards */}
      <div className="space-y-3">
        {pullRequests.map((pr, idx) => (
          <div
            key={idx}
            className={`p-5 rounded-2xl border transition-colors ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-indigo-500">{pr.id}</span>
                <h3 className="text-xs sm:text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {pr.title}
                </h3>
              </div>
              <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 shrink-0">
                {pr.status}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px] text-zinc-500 dark:text-zinc-400 font-mono mb-4">
              <span className="flex items-center gap-1">
                <GitBranch className="w-3 h-3 text-zinc-400" />
                <span>{pr.branch}</span>
              </span>
              <span>Author: {pr.author}</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">{pr.checks}</span>
              <span className="text-zinc-400">+{pr.additions} / -{pr.deletions} lines</span>
            </div>

            <div className="pt-3 border-t border-inherit flex items-center justify-between text-xs">
              <span className="text-zinc-400 text-[11px]">Merging into <code className="font-mono text-zinc-700 dark:text-zinc-300">main</code> requires approval gate</span>
              <button
                onClick={() => onDispatchToAgent(`Review and merge ${pr.id} on branch ${pr.branch}.`)}
                className="px-3 py-1.5 rounded-lg border text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors text-xs font-medium"
              >
                Inspect Diffs & Merge
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
