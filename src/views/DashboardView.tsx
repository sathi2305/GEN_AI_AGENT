import React from 'react';
import {
  FolderGit2,
  CheckCircle2,
  Clock,
  Zap,
  ShieldAlert,
  ArrowRight,
  TrendingUp,
  Sparkles,
  Bot,
  ExternalLink,
  Code2,
  Search,
  Rocket,
  CalendarClock,
  Play,
  Bell,
  FileText,
  Database,
} from 'lucide-react';
import { Project, Task, Approval, ActivityLog, DashboardStats, Hackathon, ScheduledTask } from '../types/index.ts';
import { NavItemKey } from '../components/Sidebar.tsx';

interface DashboardViewProps {
  stats: DashboardStats;
  projects: Project[];
  tasks: Task[];
  approvals: Approval[];
  activities: ActivityLog[];
  hackathons: Hackathon[];
  scheduledTasks?: ScheduledTask[];
  onNavigate: (view: NavItemKey) => void;
  onQuickPrompt: (prompt: string) => void;
  onSelectProject: (id: string) => void;
  onRunScheduledTask?: (id: string) => Promise<void>;
  isDark: boolean;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  projects,
  tasks,
  approvals,
  activities,
  hackathons,
  scheduledTasks = [],
  onNavigate,
  onQuickPrompt,
  onSelectProject,
  onRunScheduledTask,
  isDark,
}) => {
  const pendingApprovals = approvals.filter((a) => a.status === 'pending');
  const activeHackathon = hackathons[0];
  const activeSchedules = scheduledTasks.filter((t) => t.enabled);

  const quickPrompts = [
    {
      title: 'Ask Gen: Take Care of Project',
      prompt: 'Gen, here is my problem statement. Take care of the project.',
      desc: 'Ingests problem statement, loads memory, scaffolds sprint, and runs tests.',
      icon: Bot,
      color: 'from-indigo-600 to-blue-600',
    },
    {
      title: 'Analyze EV Truck Incline Formulas',
      prompt: 'Research electric heavy freight battery drain on 8% uphill inclines and compare with Eurovignette toll exemptions.',
      desc: 'Searches scientific papers and commits findings to project memory.',
      icon: Search,
      color: 'from-emerald-600 to-teal-600',
    },
    {
      title: 'Generate Hackathon Pitch Deck',
      prompt: 'Generate a 10-slide presentation deck and 3-minute demo script for the Global Sustainability Hackathon.',
      desc: 'Creates presentation slides, speaker notes, and jury Q&A prep.',
      icon: Sparkles,
      color: 'from-amber-600 to-orange-600',
    },
    {
      title: 'Prepare Docker & Render Deploy',
      prompt: 'Audit current dependencies and prepare production Dockerfile and Render deployment blueprint.',
      desc: 'Build verification, environment audit, and sensitive approval gate.',
      icon: Rocket,
      color: 'from-rose-600 to-pink-600',
    },
  ];

  return (
    <div id="dashboard-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Banner: Sensitive Approval Alert if present */}
      {pendingApprovals.length > 0 && (
        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-500/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-amber-700 dark:text-amber-300">
                Action Approval Required
              </div>
              <div className="text-sm font-medium text-zinc-900 dark:text-zinc-100 mt-0.5">
                {pendingApprovals[0].action} on target <code className="font-mono text-xs px-1 rounded bg-amber-500/20">{pendingApprovals[0].target}</code>
              </div>
              <div className="text-xs text-zinc-600 dark:text-zinc-400 mt-0.5">
                {pendingApprovals[0].details}
              </div>
            </div>
          </div>
          <button
            onClick={() => onNavigate('agent')}
            className="px-4 py-2 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs flex items-center justify-center gap-1.5 shrink-0 transition-colors shadow-xs"
          >
            <span>Review & Approve</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Active Projects</span>
            <FolderGit2 className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {stats.activeProjects}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>2 sprints in progress</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Pending Tasks</span>
            <CheckCircle2 className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {stats.pendingTasks}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>{stats.completedTasks} completed by Gen</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Gen Maintenance</span>
            <CalendarClock className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {activeSchedules.length > 0 ? activeSchedules.length : stats.activeSchedules || 3}
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Recurring schedules active</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Hackathon Deadline</span>
            <Clock className="w-4 h-4 text-rose-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
            {stats.upcomingDeadlines[0]?.daysLeft ?? 6} Days
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            <span>Sept 28, 2026 (23:59 UTC)</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Agent Verification</span>
            <Zap className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {stats.agentSuccessRate}%
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400">
            <span>Zero unverified claims</span>
          </div>
        </div>
      </div>

      {/* Quick Launchpad: "Here is my problem statement. Take care of the project." */}
      <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <Bot className="w-4 h-4 text-indigo-500" />
              <span>Gen Autonomous Work Agent Launchpad</span>
            </h2>
            <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
              Select a pre-engineered autonomous directive or launch the Gen Agent chat.
            </p>
          </div>
          <button
            onClick={() => onNavigate('agent')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
          >
            <span>Open Agent Workspace</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {quickPrompts.map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                onQuickPrompt(item.prompt);
                onNavigate('agent');
              }}
              className={`p-3.5 rounded-xl border text-left flex flex-col justify-between group transition-all ${
                isDark
                  ? 'bg-zinc-950/60 border-zinc-800 hover:border-indigo-500/50 hover:bg-zinc-800/50'
                  : 'bg-zinc-50 border-zinc-200 hover:border-indigo-500/50 hover:bg-indigo-50/20'
              }`}
            >
              <div>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${item.color} text-white flex items-center justify-center mb-2.5 shadow-xs`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-500 transition-colors">
                  {item.title}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 leading-relaxed">
                  {item.desc}
                </p>
              </div>
              <div className="mt-3 text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Dispatch to Agent</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Autonomous Scheduled Maintenance Showcase */}
      <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
              <CalendarClock className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
                  Gen Autonomous Maintenance Schedules
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                  Active Recurring Runner
                </span>
              </div>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Automated recurring tasks executed by Gen: summarizing weekly progress, cleaning stale alerts, and consolidating memory.
              </p>
            </div>
          </div>

          <button
            onClick={() => onNavigate('schedules')}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-semibold self-start sm:self-auto"
          >
            <span>Manage All Schedules ({scheduledTasks.length || 4})</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {(scheduledTasks.length > 0 ? scheduledTasks.slice(0, 3) : [
            {
              id: 'sched-1',
              title: 'Weekly Project Progress Summary',
              interval: 'weekly',
              timeOfDay: '09:00',
              taskType: 'summarize_progress' as const,
              enabled: true,
              nextRunAt: new Date(Date.now() + 50400000).toISOString(),
              lastExecutionSummary: 'Compiled weekly progress report for EcoRoute AI. Analyzed 4 completed tasks, 1 production deployment, and 68% milestone completion.',
            },
            {
              id: 'sched-2',
              title: 'Stale Notifications & Cache Cleanup',
              interval: 'daily',
              timeOfDay: '02:00',
              taskType: 'cleanup_notifications' as const,
              enabled: true,
              nextRunAt: new Date(Date.now() + 25200000).toISOString(),
              lastExecutionSummary: 'Scanned 12 notifications. Purged 8 read alerts older than 24 hours while preserving critical security and approval flags.',
            },
            {
              id: 'sched-3',
              title: 'Sprint Memory & Knowledge Consolidation',
              interval: 'weekly',
              timeOfDay: '17:00',
              taskType: 'consolidate_memory' as const,
              enabled: true,
              nextRunAt: new Date(Date.now() + 136800000).toISOString(),
              lastExecutionSummary: 'Consolidated sprint memories into unified high-importance patterns.',
            },
          ]).map((task) => (
            <div
              key={task.id}
              className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all ${
                isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <div>
                <div className="flex items-center justify-between text-[11px] mb-2">
                  <span className="font-semibold text-indigo-600 dark:text-indigo-400 capitalize">
                    {task.interval}
                  </span>
                  <span className="text-zinc-500 font-mono text-[10px]">
                    {task.timeOfDay} UTC
                  </span>
                </div>

                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 line-clamp-1">
                  {task.title}
                </h3>

                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                  {task.lastExecutionSummary || 'Recurring maintenance schedule managed by Gen agent.'}
                </p>
              </div>

              <div className="mt-3 pt-2.5 border-t border-inherit flex items-center justify-between">
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span>Next: Soon</span>
                </span>

                <button
                  onClick={() => onRunScheduledTask ? onRunScheduledTask(task.id) : onNavigate('schedules')}
                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
                >
                  <Play className="w-3 h-3 fill-current" />
                  <span>Run Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Grid: Projects Matrix & Live Agent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Active Projects (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
              Active Projects & Workspaces
            </h2>
            <button
              onClick={() => onNavigate('projects')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              View All ({projects.length})
            </button>
          </div>

          <div className="space-y-3">
            {projects.map((project) => (
              <div
                key={project.id}
                onClick={() => {
                  onSelectProject(project.id);
                  onNavigate('projects');
                }}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  isDark
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900'
                    : 'bg-white border-zinc-200 hover:border-zinc-300 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                        {project.name}
                      </h3>
                      <span className="text-[10px] px-2 py-0.5 rounded-full font-medium bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
                        {project.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2">
                      {project.description}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {project.progress}%
                    </span>
                    <div className="text-[10px] text-zinc-400">Complete</div>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="w-full bg-zinc-100 dark:bg-zinc-800 h-1.5 rounded-full overflow-hidden mt-3">
                  <div
                    className="bg-indigo-600 h-full rounded-full transition-all duration-500"
                    style={{ width: `${project.progress}%` }}
                  />
                </div>

                {/* Tech Stack Pills & Milestone count */}
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[10px]">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {project.techStack.slice(0, 4).map((tech) => (
                      <span
                        key={tech}
                        className="px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-mono"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-zinc-400 font-medium">
                    Deadline: {new Date(project.deadline).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Hackathon Deliverables Summary */}
          {activeHackathon && (
            <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold text-xs">
                    🏆
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                      {activeHackathon.name}
                    </h3>
                    <p className="text-[10px] text-zinc-400">Organizer: {activeHackathon.organizer}</p>
                  </div>
                </div>
                <button
                  onClick={() => onNavigate('hackathons')}
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
                >
                  Manage Deliverables
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {activeHackathon.requiredDeliverables.map((d, i) => (
                  <div
                    key={i}
                    className="p-2 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800/80 flex items-center gap-2 text-[11px]"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    <span className="truncate">{d}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Live Agent Observability Stream (1 Col) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Agent Activity Stream</span>
            </h2>
            <button
              onClick={() => onNavigate('activity')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline font-medium"
            >
              Full Logs
            </button>
          </div>

          <div className={`p-4 rounded-xl border divide-y divide-zinc-100 dark:divide-zinc-800/60 max-h-[520px] overflow-y-auto space-y-3 transition-colors ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
          }`}>
            {activities.slice(0, 7).map((act) => (
              <div key={act.id} className="pt-3 first:pt-0">
                <div className="flex items-center justify-between text-[10px] text-zinc-400 mb-1">
                  <span className="font-semibold uppercase px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                    {act.entity}
                  </span>
                  <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
                <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-snug">
                  {act.details}
                </p>
              </div>
            ))}
          </div>

          {/* Quick Action Button */}
          <button
            onClick={() => onNavigate('tasks')}
            className={`w-full p-3 rounded-xl border flex items-center justify-between text-xs font-semibold transition-colors ${
              isDark
                ? 'bg-zinc-900 hover:bg-zinc-800 border-zinc-800 text-zinc-200'
                : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-700'
            }`}
          >
            <span>View All {tasks.length} Sprint Tasks</span>
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
