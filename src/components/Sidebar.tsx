import React from 'react';
import {
  LayoutDashboard,
  Bot,
  FolderGit2,
  CheckSquare,
  Search,
  FileText,
  Code2,
  FlaskConical,
  Rocket,
  BookOpen,
  Presentation,
  Trophy,
  Mail,
  Bell,
  GitPullRequest,
  Database,
  Activity,
  Settings,
  ShieldAlert,
  Sparkles,
  CalendarClock,
} from 'lucide-react';

export type NavItemKey =
  | 'dashboard'
  | 'agent'
  | 'projects'
  | 'tasks'
  | 'schedules'
  | 'research'
  | 'documents'
  | 'coding'
  | 'testing'
  | 'deployments'
  | 'documentation'
  | 'ppt'
  | 'hackathons'
  | 'emails'
  | 'notifications'
  | 'github'
  | 'knowledge'
  | 'activity'
  | 'settings';

interface SidebarProps {
  currentView: NavItemKey;
  onNavigate: (view: NavItemKey) => void;
  pendingApprovalsCount: number;
  unreadNotificationsCount: number;
  pendingTasksCount: number;
  activeSchedulesCount?: number;
  isDark: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  pendingApprovalsCount,
  unreadNotificationsCount,
  pendingTasksCount,
  activeSchedulesCount,
  isDark,
}) => {
  const navSections = [
    {
      group: 'Core',
      items: [
        { key: 'dashboard' as NavItemKey, label: 'Dashboard', icon: LayoutDashboard },
        {
          key: 'agent' as NavItemKey,
          label: 'Gen Agent',
          icon: Bot,
          badge: pendingApprovalsCount > 0 ? `${pendingApprovalsCount} req` : undefined,
          badgeColor: 'bg-amber-500 text-white',
        },
        { key: 'projects' as NavItemKey, label: 'Projects', icon: FolderGit2 },
        {
          key: 'tasks' as NavItemKey,
          label: 'Tasks',
          icon: CheckSquare,
          badge: pendingTasksCount > 0 ? `${pendingTasksCount}` : undefined,
          badgeColor: 'bg-indigo-500 text-white',
        },
        {
          key: 'schedules' as NavItemKey,
          label: 'Scheduled Tasks',
          icon: CalendarClock,
          badge: activeSchedulesCount && activeSchedulesCount > 0 ? `${activeSchedulesCount}` : undefined,
          badgeColor: 'bg-emerald-600 text-white',
        },
      ],
    },
    {
      group: 'Intelligence & Research',
      items: [
        { key: 'research' as NavItemKey, label: 'Research', icon: Search },
        { key: 'documents' as NavItemKey, label: 'Documents & RAG', icon: FileText },
        { key: 'knowledge' as NavItemKey, label: 'Knowledge & Memory', icon: Database },
      ],
    },
    {
      group: 'Engineering & DevOps',
      items: [
        { key: 'coding' as NavItemKey, label: 'Coding Sandbox', icon: Code2 },
        { key: 'testing' as NavItemKey, label: 'Testing Engine', icon: FlaskConical },
        {
          key: 'deployments' as NavItemKey,
          label: 'Deployments',
          icon: Rocket,
          badge: pendingApprovalsCount > 0 ? 'Gate' : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        { key: 'github' as NavItemKey, label: 'GitHub', icon: GitPullRequest },
      ],
    },
    {
      group: 'Hackathon & Deliverables',
      items: [
        { key: 'hackathons' as NavItemKey, label: 'Hackathons', icon: Trophy },
        { key: 'ppt' as NavItemKey, label: 'PPT Studio', icon: Presentation },
        { key: 'documentation' as NavItemKey, label: 'Documentation', icon: BookOpen },
        { key: 'emails' as NavItemKey, label: 'Email Intel', icon: Mail },
      ],
    },
    {
      group: 'System',
      items: [
        {
          key: 'notifications' as NavItemKey,
          label: 'Notifications',
          icon: Bell,
          badge: unreadNotificationsCount > 0 ? `${unreadNotificationsCount}` : undefined,
          badgeColor: 'bg-rose-500 text-white',
        },
        { key: 'activity' as NavItemKey, label: 'Activity Logs', icon: Activity },
        { key: 'settings' as NavItemKey, label: 'Settings', icon: Settings },
      ],
    },
  ];

  return (
    <aside
      id="main-sidebar"
      className={`w-64 shrink-0 border-r flex flex-col transition-colors duration-200 ${
        isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-800'
      }`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-inherit flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-400 flex items-center justify-center text-white shadow-sm font-bold text-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <div className="font-semibold text-sm tracking-tight flex items-center gap-1.5">
              <span>Gen</span>
              <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 font-mono">
                3.8
              </span>
            </div>
            <div className="text-[11px] text-zinc-400">Autonomous AI Work Agent</div>
          </div>
        </div>
      </div>

      {/* Nav List */}
      <div className="flex-1 overflow-y-auto px-3 py-3 space-y-4 text-xs font-medium">
        {navSections.map((section) => (
          <div key={section.group} className="space-y-1">
            <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400">
              {section.group}
            </div>
            {section.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentView === item.key;
              return (
                <button
                  key={item.key}
                  id={`nav-${item.key}`}
                  onClick={() => onNavigate(item.key)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md transition-all text-left group ${
                    isActive
                      ? isDark
                        ? 'bg-zinc-800 text-white font-semibold shadow-xs'
                        : 'bg-zinc-100 text-zinc-900 font-semibold shadow-xs'
                      : isDark
                      ? 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900'
                      : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 transition-colors ${
                        isActive
                          ? 'text-indigo-500'
                          : isDark
                          ? 'text-zinc-500 group-hover:text-zinc-300'
                          : 'text-zinc-400 group-hover:text-zinc-600'
                      }`}
                    />
                    <span className="text-[12px]">{item.label}</span>
                  </div>
                  {item.badge && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold uppercase tracking-tight ${item.badgeColor}`}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Pending Approvals Warning Banner in Sidebar if any */}
      {pendingApprovalsCount > 0 && (
        <div className="p-3 border-t border-inherit">
          <button
            id="sidebar-approvals-alert"
            onClick={() => onNavigate('agent')}
            className="w-full p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center gap-2.5 text-left text-amber-700 dark:text-amber-300 hover:bg-amber-500/20 transition-colors"
          >
            <ShieldAlert className="w-4 h-4 shrink-0 text-amber-500" />
            <div className="text-[11px] leading-tight">
              <div className="font-semibold">{pendingApprovalsCount} Action Staged</div>
              <div className="opacity-80 text-[10px]">Awaiting your review</div>
            </div>
          </button>
        </div>
      )}

      {/* Footer Info */}
      <div className="p-3 border-t border-inherit text-[11px] text-zinc-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>Unified Agent Ready</span>
        </div>
        <span className="text-[10px] font-mono opacity-70">v2.4-MVP</span>
      </div>
    </aside>
  );
};
