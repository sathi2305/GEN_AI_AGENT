import React, { useState, useEffect } from 'react';
import {
  Search,
  Bot,
  FolderPlus,
  CheckCircle2,
  Rocket,
  SearchCode,
  FileUp,
  Presentation,
  ShieldAlert,
  CalendarClock,
  X,
} from 'lucide-react';
import { NavItemKey } from './Sidebar.tsx';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (view: NavItemKey) => void;
  onRunPrompt: (prompt: string) => void;
  isDark: boolean;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onNavigate,
  onRunPrompt,
  isDark,
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else onClose(); // parent handles toggle
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const quickCommands = [
    {
      title: 'Open Scheduled Maintenance Tasks',
      description: 'Manage automated recurring tasks for Gen: weekly progress summaries, cleanups, and memory audits',
      icon: CalendarClock,
      action: () => {
        onNavigate('schedules');
        onClose();
      },
    },
    {
      title: 'Run Maintenance: Summarize Weekly Project Progress',
      description: 'Instruct Gen to analyze milestones and generate a weekly synthesis briefing document',
      icon: CalendarClock,
      action: () => {
        onRunPrompt('Gen, run the weekly project progress summary maintenance routine now and record briefing.');
        onNavigate('agent');
        onClose();
      },
    },
    {
      title: 'Run Maintenance: Clean Up Stale Notifications',
      description: 'Instruct Gen to scan alert log and purge obsolete system notifications',
      icon: CalendarClock,
      action: () => {
        onRunPrompt('Gen, perform notification cleanup maintenance to purge read alerts older than 24 hours.');
        onNavigate('agent');
        onClose();
      },
    },
    {
      title: 'Take care of this project',
      description: 'Unified agent analyzes requirements, generates plan, and updates memory',
      icon: Bot,
      action: () => {
        onRunPrompt('Here is my problem statement. Take care of the project.');
        onNavigate('agent');
        onClose();
      },
    },
    {
      title: 'Run research on green logistics regulations',
      description: 'Search EU Eurovignette toll exemptions and energy dissipation formulas',
      icon: SearchCode,
      action: () => {
        onRunPrompt('Research current European toll subsidies and EV truck battery consumption curves.');
        onNavigate('agent');
        onClose();
      },
    },
    {
      title: 'Generate Hackathon Presentation (10 slides)',
      description: 'Create slide deck outline, demo script, and speaker notes in PPT Studio',
      icon: Presentation,
      action: () => {
        onNavigate('ppt');
        onClose();
      },
    },
    {
      title: 'Deploy to Production (Render)',
      description: 'Stage multi-stage Docker build and request sensitive approval gate',
      icon: Rocket,
      action: () => {
        onNavigate('deployments');
        onClose();
      },
    },
    {
      title: 'Review Staged Sensitive Approvals',
      description: 'Inspect pending pull requests and container deployment requests',
      icon: ShieldAlert,
      action: () => {
        onNavigate('agent');
        onClose();
      },
    },
    {
      title: 'Open Tasks Kanban Board',
      description: 'Inspect active milestones, status transitions, and agent assignees',
      icon: CheckCircle2,
      action: () => {
        onNavigate('tasks');
        onClose();
      },
    },
    {
      title: 'Upload Document / Problem Statement',
      description: 'Ingest PDF, DOCX, TXT, or markdown into RAG semantic index',
      icon: FileUp,
      action: () => {
        onNavigate('documents');
        onClose();
      },
    },
  ];

  const filteredCommands = query
    ? quickCommands.filter(
        (c) =>
          c.title.toLowerCase().includes(query.toLowerCase()) ||
          c.description.toLowerCase().includes(query.toLowerCase())
      )
    : quickCommands;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        id="command-palette-modal"
        className={`w-full max-w-xl rounded-2xl border shadow-2xl overflow-hidden transition-colors ${
          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
        }`}
      >
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-inherit gap-3">
          <Search className="w-5 h-5 text-zinc-400" />
          <input
            id="command-palette-input"
            type="text"
            autoFocus
            placeholder="Type a command, ask agent, or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && query.trim()) {
                onRunPrompt(query);
                onNavigate('agent');
                onClose();
              }
            }}
            className="flex-1 bg-transparent text-sm font-medium focus:outline-none placeholder:text-zinc-400"
          />
          <button
            onClick={onClose}
            aria-label="Close command palette"
            className="p-1 rounded-md text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Command List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-6 text-center text-xs text-zinc-400">
              No matching commands. Press Enter to dispatch custom prompt to AI Work Agent:
              <div className="mt-2 text-indigo-500 font-semibold">"{query}"</div>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              return (
                <button
                  key={idx}
                  onClick={cmd.action}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl text-left transition-colors ${
                    isDark ? 'hover:bg-zinc-800' : 'hover:bg-zinc-100'
                  }`}
                >
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                      isDark ? 'bg-zinc-800 text-indigo-400' : 'bg-zinc-100 text-indigo-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold leading-tight">{cmd.title}</div>
                    <div className="text-[11px] text-zinc-400 truncate mt-0.5">{cmd.description}</div>
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-4 py-2.5 bg-zinc-50 dark:bg-zinc-950 border-t border-inherit flex items-center justify-between text-[11px] text-zinc-400">
          <div className="flex items-center gap-2">
            <span>Navigation:</span>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">↑</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">↓</kbd>
            <kbd className="px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 font-mono text-[10px]">↵ to select</kbd>
          </div>
          <div>AI Work Agent v2.4</div>
        </div>
      </div>
    </div>
  );
};
