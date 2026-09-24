import React, { useState } from 'react';
import {
  Search,
  Moon,
  Sun,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  PlusCircle,
  ExternalLink,
} from 'lucide-react';
import { Project, NotificationItem } from '../types/index.ts';

interface TopBarProps {
  currentView: string;
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onOpenCommand: () => void;
  onQuickPrompt: (prompt: string) => void;
  isDark: boolean;
  onToggleTheme: () => void;
  notifications: NotificationItem[];
  onMarkNotificationRead: (id: string) => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  currentView,
  projects,
  activeProjectId,
  onSelectProject,
  onOpenCommand,
  onQuickPrompt,
  isDark,
  onToggleTheme,
  notifications,
  onMarkNotificationRead,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const viewTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Executive Engineering Dashboard', subtitle: 'Real-time telemetry, active sprints, deadlines, and agent operations' },
    agent: { title: 'Unified AI Work Agent Workspace', subtitle: 'One intelligent assistant orchestrating research, code, testing, deployment, and memory' },
    projects: { title: 'Project Workspace & Architecture', subtitle: 'Decoupled services, requirements, tech stack, and milestone matrix' },
    tasks: { title: 'Autonomous Task Pipeline', subtitle: 'Direct agent dispatch, Kanban stages, and priority management' },
    research: { title: 'Autonomous Research Engine', subtitle: 'Live scientific & regulatory source synthesis, verified citations, and fact extraction' },
    documents: { title: 'Document Intelligence & RAG', subtitle: 'PDF/DOCX text extraction, chunking inspector, and semantic retrieval' },
    coding: { title: 'Code Generation & AST Sandbox', subtitle: 'Python, TypeScript, React, and FastAPI synthesis with static safety verification' },
    testing: { title: 'Automated Testing Engine', subtitle: 'Unit, integration, and E2E test suites with live pass/fail reports' },
    deployments: { title: 'Multi-Cloud Deployment Center', subtitle: 'Vercel, Render, Railway, Docker, and AWS staging with sensitive approval gates' },
    documentation: { title: 'Technical Documentation Studio', subtitle: 'Automated SRS, README, API references, and architecture guides' },
    ppt: { title: 'Hackathon PPT Studio', subtitle: 'Slide deck generator, jury pitch scripts, speaker notes, and Q&A preparation' },
    hackathons: { title: 'Hackathon Command Center', subtitle: 'Deliverables tracking, judging criteria alignment, and submission deadlines' },
    emails: { title: 'Email Intelligence & Task Extractor', subtitle: 'Inbound organizer updates, deadline extraction, and auto-scheduling' },
    notifications: { title: 'Notification & Alert Center', subtitle: 'Priority-sorted operational alerts, failure warnings, and approvals' },
    github: { title: 'GitHub Version Control & PR Review', subtitle: 'Repository inspection, branch creation, commit staging, and pull requests' },
    knowledge: { title: 'Project Memory & Knowledge Base', subtitle: 'Persistent architectural decisions, constraints, and semantic memory graph' },
    activity: { title: 'Observability & Audit Logs', subtitle: 'Tool execution telemetry, token usage, latency, and system audit trail' },
    settings: { title: 'Workspace Settings & Model Controls', subtitle: 'Autonomy level, Gemini 3.8 Flash model selection, and safety rules' },
  };

  const headerInfo = viewTitles[currentView] || { title: 'AI Work Agent Workspace', subtitle: 'Autonomous Software Engineering Assistant' };

  return (
    <header
      id="main-topbar"
      className={`h-16 px-6 border-b flex items-center justify-between shrink-0 transition-colors duration-200 ${
        isDark ? 'bg-zinc-950/90 border-zinc-800 text-zinc-100' : 'bg-white/90 border-zinc-200 text-zinc-800'
      } backdrop-blur-md sticky top-0 z-30`}
    >
      {/* Left: View title or project switcher */}
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-sm font-semibold tracking-tight leading-none text-zinc-900 dark:text-zinc-50">
            {headerInfo.title}
          </h1>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-none">
            {headerInfo.subtitle}
          </p>
        </div>

        {/* Active Project Dropdown */}
        <div className="hidden lg:flex items-center pl-4 border-l border-zinc-200 dark:border-zinc-800">
          <div className="relative">
            <select
              id="topbar-project-select"
              aria-label="Active Project"
              value={activeProjectId}
              onChange={(e) => onSelectProject(e.target.value)}
              className={`text-xs font-medium py-1.5 pl-2.5 pr-7 rounded-md border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-600'
                  : 'bg-zinc-50 border-zinc-200 text-zinc-700 hover:border-zinc-300'
              }`}
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name.length > 32 ? `${p.name.slice(0, 32)}...` : p.name}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2.5 pointer-events-none opacity-50" />
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* Global Search / Command Bar Trigger */}
        <button
          id="command-palette-trigger"
          onClick={onOpenCommand}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors ${
            isDark ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700' : 'bg-zinc-50 border-zinc-200 hover:border-zinc-300'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Search or command...</span>
          <kbd className="hidden sm:inline-block text-[10px] px-1.5 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 font-mono">
            ⌘K
          </kbd>
        </button>

        {/* Model & Orchestration Badge */}
        <div
          id="agent-model-status"
          className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20"
          title="Server-side Gemini 3.8 Flash model with CrewAI reasoning loop"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          <span>Gemini 3.8 Flash</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-0.5" />
        </div>

        {/* Quick Agent Takeover Button */}
        <button
          id="topbar-quick-takeover-btn"
          onClick={() =>
            onQuickPrompt(
              'Gen, analyze the hackathon problem statement, verify project architecture, and take care of the next critical deliverables.'
            )
          }
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-semibold shadow-xs transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5 text-white" />
          <span>Ask Gen to Take Care</span>
        </button>

        {/* Notifications Popover Toggle */}
        <div className="relative">
          <button
            id="topbar-notifications-btn"
            onClick={() => setShowNotifications(!showNotifications)}
            aria-label="Toggle notifications"
            className={`p-2 rounded-lg border relative transition-colors ${
              isDark ? 'border-zinc-800 hover:bg-zinc-900 text-zinc-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'
            }`}
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-zinc-950" />
            )}
          </button>

          {showNotifications && (
            <div
              className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-xl p-3 z-50 transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'
              }`}
            >
              <div className="flex items-center justify-between pb-2 border-b border-inherit mb-2">
                <span className="text-xs font-semibold">Notifications</span>
                <span className="text-[10px] text-zinc-400">{unreadCount} unread</span>
              </div>
              <div className="max-h-72 overflow-y-auto space-y-2">
                {notifications.length === 0 ? (
                  <div className="text-center py-4 text-xs text-zinc-400">No notifications</div>
                ) : (
                  notifications.slice(0, 5).map((n) => (
                    <div
                      key={n.id}
                      onClick={() => onMarkNotificationRead(n.id)}
                      className={`p-2 rounded-lg text-xs cursor-pointer transition-colors ${
                        n.isRead
                          ? 'opacity-60 hover:opacity-100'
                          : isDark
                          ? 'bg-zinc-800/80 font-medium'
                          : 'bg-zinc-100/90 font-medium'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[11px] mb-0.5">
                        <span className="font-semibold">{n.title}</span>
                        <span
                          className={`text-[9px] uppercase px-1 rounded font-bold ${
                            n.type === 'critical'
                              ? 'bg-rose-500/20 text-rose-500'
                              : n.type === 'high'
                              ? 'bg-amber-500/20 text-amber-500'
                              : 'bg-blue-500/20 text-blue-500'
                          }`}
                        >
                          {n.type}
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-tight">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark / Light Toggle */}
        <button
          id="theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label="Toggle dark mode"
          className={`p-2 rounded-lg border transition-colors ${
            isDark ? 'border-zinc-800 hover:bg-zinc-900 text-amber-400' : 'border-zinc-200 hover:bg-zinc-100 text-zinc-600'
          }`}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
