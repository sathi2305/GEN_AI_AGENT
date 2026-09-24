import React, { useState } from 'react';
import {
  CalendarClock,
  Play,
  Pause,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  RotateCw,
  Trash2,
  Edit2,
  FileText,
  Bell,
  Database,
  ShieldCheck,
  Sparkles,
  ChevronDown,
  ChevronUp,
  X,
  History,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ScheduledTask,
  ScheduledTaskExecution,
  ScheduledMaintenanceType,
  ScheduleInterval,
  Project,
} from '../types/index.ts';

interface ScheduledTasksViewProps {
  tasks: ScheduledTask[];
  projects: Project[];
  executions: ScheduledTaskExecution[];
  activeProjectId?: string;
  isDark: boolean;
  onRunNow: (id: string) => Promise<void>;
  onToggleEnabled: (id: string, enabled: boolean) => Promise<void>;
  onCreateTask: (task: Partial<ScheduledTask>) => Promise<void>;
  onUpdateTask: (id: string, task: Partial<ScheduledTask>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onRefresh: () => Promise<void>;
  onNavigate?: (view: any) => void;
  onDispatchToAgent?: (prompt: string) => void;
}

const PRESET_TEMPLATES = [
  {
    type: 'summarize_progress' as ScheduledMaintenanceType,
    title: 'Weekly Project Progress Summary',
    description: 'Autonomous Gen agent inspects active milestones, sprint velocity, completed tasks, and deployments. Synthesizes a structured briefing document and updates project memory.',
    interval: 'weekly' as ScheduleInterval,
    dayOfWeek: 1, // Monday
    timeOfDay: '09:00',
    icon: FileText,
    color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
  },
  {
    type: 'cleanup_notifications' as ScheduledMaintenanceType,
    title: 'Stale Notifications & Cache Cleanup',
    description: 'Scans notification center and alert buffers. Archives or purges read alerts older than 24 hours while preserving critical system flags and unread items.',
    interval: 'daily' as ScheduleInterval,
    dayOfWeek: 1,
    timeOfDay: '02:00',
    icon: Bell,
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    type: 'consolidate_memory' as ScheduledMaintenanceType,
    title: 'Sprint Memory & Architectural Knowledge Consolidation',
    description: 'Consolidates scattered architectural notes, decisions, and constraints into unified high-importance patterns, eliminating temporary notes.',
    interval: 'weekly' as ScheduleInterval,
    dayOfWeek: 5, // Friday
    timeOfDay: '17:00',
    icon: Database,
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  },
  {
    type: 'audit_health' as ScheduledMaintenanceType,
    title: 'Codebase & Dependency Health Audit',
    description: 'Runs automated AST syntax checks, verifies unit test suites, audits package vulnerabilities, and reports drift.',
    interval: 'weekly' as ScheduleInterval,
    dayOfWeek: 3, // Wednesday
    timeOfDay: '03:00',
    icon: ShieldCheck,
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];

const DAYS_OF_WEEK = [
  { value: 0, label: 'Sunday' },
  { value: 1, label: 'Monday' },
  { value: 2, label: 'Tuesday' },
  { value: 3, label: 'Wednesday' },
  { value: 4, label: 'Thursday' },
  { value: 5, label: 'Friday' },
  { value: 6, label: 'Saturday' },
];

export const ScheduledTasksView: React.FC<ScheduledTasksViewProps> = ({
  tasks,
  projects,
  executions,
  isDark,
  onRunNow,
  onToggleEnabled,
  onCreateTask,
  onUpdateTask,
  onDeleteTask,
  onRefresh,
  onNavigate,
}) => {
  const [filterType, setFilterType] = useState<string>('all');
  const [runningTaskId, setRunningTaskId] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [expandedSummaryId, setExpandedSummaryId] = useState<string | null>(null);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<ScheduledTask | null>(null);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedTaskHistoryId, setSelectedTaskHistoryId] = useState<string | null>(null);

  // Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formType, setFormType] = useState<ScheduledMaintenanceType>('summarize_progress');
  const [formInterval, setFormInterval] = useState<ScheduleInterval>('weekly');
  const [formDayOfWeek, setFormDayOfWeek] = useState<number>(1);
  const [formTimeOfDay, setFormTimeOfDay] = useState<string>('09:00');
  const [formCustomHours, setFormCustomHours] = useState<number>(4);
  const [formProjectId, setFormProjectId] = useState<string>('proj-1');
  const [formRequireApproval, setFormRequireApproval] = useState<boolean>(false);
  const [formCustomPrompt, setFormCustomPrompt] = useState<string>('');
  const [formEnabled, setFormEnabled] = useState<boolean>(true);

  const activeCount = tasks.filter((t) => t.enabled).length;
  const totalExecutions = tasks.reduce((sum, t) => sum + (t.executionsCount || 0), 0);

  // Find next upcoming task
  const upcomingTasks = [...tasks]
    .filter((t) => t.enabled && t.nextRunAt)
    .sort((a, b) => new Date(a.nextRunAt).getTime() - new Date(b.nextRunAt).getTime());
  const nextUpcoming = upcomingTasks[0];

  const handleOpenCreateModal = (preset?: typeof PRESET_TEMPLATES[0]) => {
    setEditingTask(null);
    if (preset) {
      setFormTitle(preset.title);
      setFormDescription(preset.description);
      setFormType(preset.type);
      setFormInterval(preset.interval);
      setFormDayOfWeek(preset.dayOfWeek);
      setFormTimeOfDay(preset.timeOfDay);
    } else {
      setFormTitle('');
      setFormDescription('');
      setFormType('summarize_progress');
      setFormInterval('weekly');
      setFormDayOfWeek(1);
      setFormTimeOfDay('09:00');
    }
    setFormCustomHours(4);
    setFormProjectId(projects[0]?.id || 'all');
    setFormRequireApproval(false);
    setFormCustomPrompt('');
    setFormEnabled(true);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task: ScheduledTask) => {
    setEditingTask(task);
    setFormTitle(task.title);
    setFormDescription(task.description);
    setFormType(task.taskType);
    setFormInterval(task.interval);
    setFormDayOfWeek(task.dayOfWeek !== undefined ? task.dayOfWeek : 1);
    setFormTimeOfDay(task.timeOfDay || '09:00');
    setFormCustomHours(task.customHoursInterval || 4);
    setFormProjectId(task.projectId || 'all');
    setFormRequireApproval(!!task.requireApproval);
    setFormCustomPrompt(task.customPrompt || '');
    setFormEnabled(task.enabled);
    setIsModalOpen(true);
  };

  const handleSaveModal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const payload: Partial<ScheduledTask> = {
      title: formTitle.trim(),
      description: formDescription.trim(),
      taskType: formType,
      interval: formInterval,
      dayOfWeek: formDayOfWeek,
      timeOfDay: formTimeOfDay,
      customHoursInterval: formCustomHours,
      projectId: formProjectId,
      requireApproval: formRequireApproval,
      customPrompt: formCustomPrompt.trim() || undefined,
      enabled: formEnabled,
    };

    if (editingTask) {
      await onUpdateTask(editingTask.id, payload);
    } else {
      await onCreateTask(payload);
    }
    setIsModalOpen(false);
  };

  const handleTriggerRun = async (taskId: string) => {
    setRunningTaskId(taskId);
    try {
      await onRunNow(taskId);
    } finally {
      setRunningTaskId(null);
    }
  };

  const handleManualRefresh = async () => {
    setIsRefreshing(true);
    try {
      await onRefresh();
    } finally {
      setIsRefreshing(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (filterType === 'active') return t.enabled;
    if (filterType === 'paused') return !t.enabled;
    if (filterType === 'summaries') return t.taskType === 'summarize_progress';
    if (filterType === 'cleanups') return t.taskType === 'cleanup_notifications';
    if (filterType === 'memory') return t.taskType === 'consolidate_memory';
    if (filterType === 'audits') return t.taskType === 'audit_health';
    return true;
  });

  const getTaskTypeIcon = (type: ScheduledMaintenanceType) => {
    switch (type) {
      case 'summarize_progress':
        return <FileText className="w-4 h-4 text-indigo-500" />;
      case 'cleanup_notifications':
        return <Bell className="w-4 h-4 text-emerald-500" />;
      case 'consolidate_memory':
        return <Database className="w-4 h-4 text-violet-500" />;
      case 'audit_health':
        return <ShieldCheck className="w-4 h-4 text-amber-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-sky-500" />;
    }
  };

  const getTaskTypeBadge = (type: ScheduledMaintenanceType) => {
    switch (type) {
      case 'summarize_progress':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20">
            Weekly Progress Briefing
          </span>
        );
      case 'cleanup_notifications':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            Stale Notification Purge
          </span>
        );
      case 'consolidate_memory':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-violet-500/10 text-violet-600 dark:text-violet-400 border border-violet-500/20">
            Sprint Memory Consolidation
          </span>
        );
      case 'audit_health':
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            Health & Dependency Audit
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
            Custom Routine
          </span>
        );
    }
  };

  const formatIntervalText = (task: ScheduledTask) => {
    const dayName = DAYS_OF_WEEK.find((d) => d.value === task.dayOfWeek)?.label || 'Monday';
    switch (task.interval) {
      case 'daily':
        return `Daily at ${task.timeOfDay} UTC`;
      case 'weekly':
        return `Weekly on ${dayName}s at ${task.timeOfDay} UTC`;
      case 'biweekly':
        return `Every 2 weeks on ${dayName} at ${task.timeOfDay} UTC`;
      case 'monthly':
        return `Monthly on the 1st at ${task.timeOfDay} UTC`;
      case 'custom_hours':
        return `Recurring every ${task.customHoursInterval || 4} hours`;
      default:
        return task.interval;
    }
  };

  const formatRelativeNextRun = (dateStr: string) => {
    const target = new Date(dateStr);
    const diffMs = target.getTime() - Date.now();
    if (diffMs <= 0) return 'Due now (running soon)';
    const hours = Math.floor(diffMs / 3600000);
    const minutes = Math.floor((diffMs % 3600000) / 60000);
    const days = Math.floor(hours / 24);

    if (days > 0) {
      return `In ${days} day${days > 1 ? 's' : ''}, ${hours % 24} hr (${target.toLocaleDateString([], { month: 'short', day: 'numeric' })})`;
    }
    if (hours > 0) {
      return `In ${hours} hr, ${minutes} min`;
    }
    return `In ${Math.max(1, minutes)} minutes`;
  };

  const filteredHistory = selectedTaskHistoryId
    ? executions.filter((e) => e.scheduledTaskId === selectedTaskHistoryId)
    : executions;

  return (
    <div id="scheduled-tasks-view" className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Gen Agent Task Scheduler & Maintenance
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
                Automate future recurring maintenance: weekly project progress summaries, stale notification purging, and sprint memory consolidation.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="scheduler-refresh-btn"
            onClick={handleManualRefresh}
            disabled={isRefreshing}
            className={`p-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
            }`}
            title="Refresh Schedules"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          <button
            id="scheduler-history-btn"
            onClick={() => {
              setSelectedTaskHistoryId(null);
              setIsHistoryModalOpen(true);
            }}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 hover:bg-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 hover:bg-zinc-50 text-zinc-700'
            }`}
          >
            <History className="w-3.5 h-3.5 text-zinc-400" />
            <span>Execution Logs</span>
          </button>

          <button
            id="scheduler-create-btn"
            onClick={() => handleOpenCreateModal()}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>New Schedule</span>
          </button>
        </div>
      </div>

      {/* Top Telemetry KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Active Schedules</span>
            <CalendarClock className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {activeCount} <span className="text-xs font-normal text-zinc-400">/ {tasks.length} total</span>
          </div>
          <div className="mt-1 text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Background runner active</span>
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Maintenance Executions</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {totalExecutions}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            100% automated pass rate
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Next Scheduled Trigger</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="mt-2 text-sm font-bold tracking-tight text-zinc-900 dark:text-zinc-50 truncate">
            {nextUpcoming ? nextUpcoming.title : 'None scheduled'}
          </div>
          <div className="mt-1 text-[11px] text-amber-600 dark:text-amber-400 font-medium">
            {nextUpcoming ? formatRelativeNextRun(nextUpcoming.nextRunAt) : 'All schedules paused'}
          </div>
        </div>

        <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
          <div className="flex items-center justify-between text-zinc-500 dark:text-zinc-400 text-xs">
            <span>Target Projects</span>
            <Layers className="w-4 h-4 text-violet-500" />
          </div>
          <div className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
            {projects.length}
          </div>
          <div className="mt-1 text-[11px] text-zinc-500 dark:text-zinc-400">
            Cross-project coverage
          </div>
        </div>
      </div>

      {/* Recommended Quick-Add Presets Banner */}
      <div className={`p-4 rounded-xl border transition-colors ${isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-50/80 border-zinc-200'}`}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-500" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-700 dark:text-zinc-300">
              Recommended Gen Maintenance Presets
            </h2>
          </div>
          <span className="text-[11px] text-zinc-400">Click any preset to configure instantly</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {PRESET_TEMPLATES.map((preset, idx) => {
            const Icon = preset.icon;
            return (
              <button
                key={idx}
                onClick={() => handleOpenCreateModal(preset)}
                className={`p-3 rounded-lg border text-left flex flex-col justify-between transition-all hover:scale-[1.01] active:scale-[0.99] ${
                  isDark
                    ? 'bg-zinc-900/80 hover:bg-zinc-800/80 border-zinc-800 text-zinc-200'
                    : 'bg-white hover:bg-zinc-100/80 border-zinc-200 text-zinc-800'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className={`w-6 h-6 rounded-md flex items-center justify-center ${preset.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400">
                      {preset.interval}
                    </span>
                  </div>
                  <h4 className="text-xs font-semibold leading-tight line-clamp-1">{preset.title}</h4>
                  <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-1 line-clamp-2 leading-relaxed">
                    {preset.description}
                  </p>
                </div>
                <div className="mt-2.5 pt-2 border-t border-inherit flex items-center justify-between text-[11px] text-indigo-600 dark:text-indigo-400 font-medium">
                  <span>Use Template</span>
                  <ArrowRight className="w-3 h-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-inherit pb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          {[
            { id: 'all', label: `All (${tasks.length})` },
            { id: 'active', label: `Active (${activeCount})` },
            { id: 'paused', label: `Paused (${tasks.length - activeCount})` },
            { id: 'summaries', label: '📊 Summaries' },
            { id: 'cleanups', label: '🧹 Cleanups' },
            { id: 'memory', label: '🧠 Knowledge' },
            { id: 'audits', label: '🛡️ Audits' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterType === tab.id
                  ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 shadow-xs'
                  : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Scheduled Task Cards Grid */}
      {filteredTasks.length === 0 ? (
        <div className={`p-12 text-center rounded-2xl border border-dashed ${isDark ? 'border-zinc-800 text-zinc-400' : 'border-zinc-300 text-zinc-600'}`}>
          <CalendarClock className="w-10 h-10 mx-auto text-zinc-400 mb-3 opacity-60" />
          <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">No scheduled tasks match the filter</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Create a recurring schedule for Gen to automatically summarize weekly progress or purge stale notifications.
          </p>
          <button
            onClick={() => handleOpenCreateModal()}
            className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs inline-flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Schedule</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredTasks.map((task) => {
            const isRunning = runningTaskId === task.id;
            const isExpanded = expandedSummaryId === task.id;
            const project = projects.find((p) => p.id === task.projectId);

            return (
              <div
                key={task.id}
                id={`task-card-${task.id}`}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all duration-200 ${
                  task.enabled
                    ? isDark
                      ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                      : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs'
                    : isDark
                    ? 'bg-zinc-900/20 border-zinc-800/50 opacity-70'
                    : 'bg-zinc-50/50 border-zinc-200/60 opacity-70'
                }`}
              >
                <div>
                  {/* Top Bar: Badges and Toggle Switch */}
                  <div className="flex items-start justify-between gap-3 mb-2.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {getTaskTypeBadge(task.taskType)}
                      <span className="text-[11px] px-2 py-0.5 rounded font-mono bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        {project ? project.name.split('—')[0].trim() : 'All Projects'}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleEnabled(task.id, !task.enabled)}
                        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                          task.enabled ? 'bg-emerald-600' : 'bg-zinc-300 dark:bg-zinc-700'
                        }`}
                        title={task.enabled ? 'Click to Pause' : 'Click to Enable'}
                      >
                        <span
                          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                            task.enabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </button>
                    </div>
                  </div>

                  {/* Title and Description */}
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 leading-snug">
                    {task.title}
                  </h3>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1 leading-relaxed">
                    {task.description}
                  </p>

                  {/* Schedule Details Strip */}
                  <div className={`mt-3.5 p-2.5 rounded-xl border text-xs space-y-1.5 ${
                    isDark ? 'bg-zinc-950/60 border-zinc-800/80' : 'bg-zinc-50 border-zinc-200/80'
                  }`}>
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-zinc-400" />
                        <span>Schedule:</span>
                      </span>
                      <span className="font-semibold text-zinc-800 dark:text-zinc-200">
                        {formatIntervalText(task)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-zinc-500 dark:text-zinc-400 flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${task.enabled ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                        <span>Next Run:</span>
                      </span>
                      <span className={`font-medium ${task.enabled ? 'text-indigo-600 dark:text-indigo-400 font-semibold' : 'text-zinc-400'}`}>
                        {task.enabled ? formatRelativeNextRun(task.nextRunAt) : 'Paused'}
                      </span>
                    </div>

                    {task.lastRunAt && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-inherit">
                        <span className="text-zinc-400">Last executed:</span>
                        <span className="text-zinc-600 dark:text-zinc-300">
                          {new Date(task.lastRunAt).toLocaleDateString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                          <span className="ml-1 text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">
                            (✓ Success)
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Latest Execution Summary Callout */}
                  {task.lastExecutionSummary && (
                    <div className="mt-3">
                      <button
                        onClick={() => setExpandedSummaryId(isExpanded ? null : task.id)}
                        className="w-full flex items-center justify-between text-[11px] text-zinc-500 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 transition-colors"
                      >
                        <span className="flex items-center gap-1 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                          <span>Latest Gen Maintenance Output</span>
                        </span>
                        {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                      </button>

                      <div className={`mt-1.5 p-2.5 rounded-lg border text-xs leading-relaxed transition-all ${
                        isDark ? 'bg-zinc-950/80 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-700'
                      }`}>
                        <p className={isExpanded ? '' : 'line-clamp-2'}>
                          {task.lastExecutionSummary}
                        </p>
                        {task.taskType === 'summarize_progress' && (
                          <div className="mt-2 pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
                            <span className="text-zinc-400">Briefing saved in Documents</span>
                            <button
                              onClick={() => onNavigate?.('documents')}
                              className="text-indigo-600 dark:text-indigo-400 hover:underline font-semibold flex items-center gap-1"
                            >
                              <span>View Briefings</span>
                              <ArrowRight className="w-3 h-3" />
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Footer */}
                <div className="mt-4 pt-3 border-t border-inherit flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => {
                        setSelectedTaskHistoryId(task.id);
                        setIsHistoryModalOpen(true);
                      }}
                      className="px-2.5 py-1.5 rounded-lg text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1"
                      title="View execution logs"
                    >
                      <History className="w-3.5 h-3.5" />
                      <span>{task.executionsCount} runs</span>
                    </button>

                    <button
                      onClick={() => handleOpenEditModal(task)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors"
                      title="Edit schedule"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                      title="Delete schedule"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    id={`run-now-btn-${task.id}`}
                    onClick={() => handleTriggerRun(task.id)}
                    disabled={isRunning}
                    className={`px-3 py-1.5 rounded-xl font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs ${
                      isRunning
                        ? 'bg-zinc-200 dark:bg-zinc-800 text-zinc-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-500 text-white active:scale-95'
                    }`}
                  >
                    {isRunning ? (
                      <>
                        <RotateCw className="w-3 h-3 animate-spin" />
                        <span>Running Gen...</span>
                      </>
                    ) : (
                      <>
                        <Play className="w-3 h-3 fill-current" />
                        <span>Run Now</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Schedule Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="scheduler-modal-dialog"
            className={`w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-2xl border shadow-2xl transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-inherit flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                  <CalendarClock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {editingTask ? 'Edit Maintenance Schedule' : 'Create Gen Maintenance Schedule'}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Configure future recurring maintenance triggers for the Gen agent.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveModal} className="p-5 space-y-4 text-xs">
              {/* Preset Selector if creating new */}
              {!editingTask && (
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-2">
                    Quick Preset Template
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {PRESET_TEMPLATES.map((p, idx) => (
                      <button
                        type="button"
                        key={idx}
                        onClick={() => {
                          setFormTitle(p.title);
                          setFormDescription(p.description);
                          setFormType(p.type);
                          setFormInterval(p.interval);
                          setFormDayOfWeek(p.dayOfWeek);
                          setFormTimeOfDay(p.timeOfDay);
                        }}
                        className={`p-2 rounded-lg border text-left flex items-center gap-2 transition-all ${
                          formType === p.type
                            ? 'border-indigo-500 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                            : isDark
                            ? 'border-zinc-800 hover:bg-zinc-800 text-zinc-300'
                            : 'border-zinc-200 hover:bg-zinc-100 text-zinc-700'
                        }`}
                      >
                        <p.icon className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate font-medium">{p.title.split(' ')[0]} {p.title.split(' ')[1]}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Title */}
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Task Title *
                </label>
                <input
                  id="schedule-title-input"
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Weekly Project Progress Summary"
                  className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              {/* Description */}
              <div>
                <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                  Description
                </label>
                <textarea
                  id="schedule-description-input"
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Explain what actions Gen will perform during this maintenance run..."
                  className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                    isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                  }`}
                />
              </div>

              {/* Maintenance Type & Target Project */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Maintenance Action Type
                  </label>
                  <select
                    id="schedule-type-select"
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ScheduledMaintenanceType)}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="summarize_progress">📊 Weekly Progress Summary</option>
                    <option value="cleanup_notifications">🧹 Stale Notifications Cleanup</option>
                    <option value="consolidate_memory">🧠 Sprint Memory Consolidation</option>
                    <option value="audit_health">🛡️ Code & Dependency Health Audit</option>
                    <option value="custom">⚙️ Custom Maintenance Task</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Target Project
                  </label>
                  <select
                    id="schedule-project-select"
                    value={formProjectId}
                    onChange={(e) => setFormProjectId(e.target.value)}
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  >
                    <option value="all">🌐 All Active Projects</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name.split('—')[0].trim()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recurrence Interval & Timing Settings */}
              <div className="p-3.5 rounded-xl border bg-zinc-50/50 dark:bg-zinc-950/40 space-y-3">
                <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  Recurrence Schedule Configuration
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                      Frequency
                    </label>
                    <select
                      id="schedule-interval-select"
                      value={formInterval}
                      onChange={(e) => setFormInterval(e.target.value as ScheduleInterval)}
                      className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                        isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                      }`}
                    >
                      <option value="daily">Daily (Every Day)</option>
                      <option value="weekly">Weekly</option>
                      <option value="biweekly">Bi-Weekly (Every 2 Weeks)</option>
                      <option value="monthly">Monthly (1st of Month)</option>
                      <option value="custom_hours">Custom Hourly Interval</option>
                    </select>
                  </div>

                  {formInterval === 'custom_hours' ? (
                    <div>
                      <label className="block font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                        Repeat Every (Hours)
                      </label>
                      <input
                        type="number"
                        min={1}
                        max={72}
                        value={formCustomHours}
                        onChange={(e) => setFormCustomHours(parseInt(e.target.value, 10) || 4)}
                        className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>
                  ) : (
                    <div>
                      <label className="block font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                        Scheduled Time (UTC)
                      </label>
                      <input
                        type="time"
                        value={formTimeOfDay}
                        onChange={(e) => setFormTimeOfDay(e.target.value)}
                        className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                          isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                        }`}
                      />
                    </div>
                  )}
                </div>

                {(formInterval === 'weekly' || formInterval === 'biweekly') && (
                  <div>
                    <label className="block font-medium mb-1 text-zinc-700 dark:text-zinc-300">
                      Day of the Week
                    </label>
                    <div className="grid grid-cols-7 gap-1">
                      {DAYS_OF_WEEK.map((d) => (
                        <button
                          type="button"
                          key={d.value}
                          onClick={() => setFormDayOfWeek(d.value)}
                          className={`py-1.5 rounded-lg text-center font-medium transition-colors ${
                            formDayOfWeek === d.value
                              ? 'bg-indigo-600 text-white'
                              : isDark
                              ? 'bg-zinc-900 hover:bg-zinc-800 text-zinc-300'
                              : 'bg-zinc-100 hover:bg-zinc-200 text-zinc-700'
                          }`}
                        >
                          {d.label.slice(0, 3)}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Custom Prompt if Custom */}
              {formType === 'custom' && (
                <div>
                  <label className="block font-semibold mb-1 text-zinc-700 dark:text-zinc-300">
                    Custom Gen Prompt Instructions
                  </label>
                  <textarea
                    rows={2}
                    value={formCustomPrompt}
                    onChange={(e) => setFormCustomPrompt(e.target.value)}
                    placeholder="Specific maintenance tasks to instruct Gen (e.g. 'Audit all API endpoints and compile benchmark')..."
                    className={`w-full px-3 py-2 rounded-xl border transition-colors ${
                      isDark ? 'bg-zinc-950 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-300 text-zinc-900'
                    }`}
                  />
                </div>
              )}

              {/* Toggles */}
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formEnabled}
                    onChange={(e) => setFormEnabled(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Enable schedule immediately
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formRequireApproval}
                    onChange={(e) => setFormRequireApproval(e.target.checked)}
                    className="rounded text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-zinc-700 dark:text-zinc-300 font-medium">
                    Require approval gate
                  </span>
                </label>
              </div>

              {/* Modal Buttons */}
              <div className="pt-4 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={`px-4 py-2 rounded-xl border text-xs font-medium transition-colors ${
                    isDark ? 'border-zinc-700 hover:bg-zinc-800 text-zinc-300' : 'border-zinc-300 hover:bg-zinc-100 text-zinc-700'
                  }`}
                >
                  Cancel
                </button>
                <button
                  id="schedule-submit-btn"
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-colors shadow-xs"
                >
                  {editingTask ? 'Save Changes' : 'Create Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Execution Logs Drawer / Modal */}
      {isHistoryModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            id="scheduler-history-modal"
            className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl border shadow-2xl transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            {/* Header */}
            <div className="p-5 border-b border-inherit flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <History className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-50">
                    {selectedTaskHistoryId ? 'Task Execution History' : 'Gen Maintenance Execution Logs'}
                  </h3>
                  <p className="text-[11px] text-zinc-500">
                    Audit trail of all recurring automated maintenance and instant executions.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="p-5 overflow-y-auto space-y-3 grow">
              {filteredHistory.length === 0 ? (
                <div className="p-8 text-center text-zinc-400">
                  <Clock className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-xs">No execution history recorded yet.</p>
                </div>
              ) : (
                filteredHistory.map((item) => (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-xl border text-xs space-y-2 transition-colors ${
                      isDark ? 'bg-zinc-950/60 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${item.status === 'success' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
                        <span className="font-bold text-zinc-900 dark:text-zinc-100">{item.taskTitle}</span>
                        {item.manualTrigger && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium">
                            Manual Trigger
                          </span>
                        )}
                      </div>
                      <span className="text-[11px] text-zinc-400 font-mono">
                        {new Date(item.executedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>

                    <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed font-medium">
                      {item.summary}
                    </p>

                    {item.details && (
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 leading-snug">
                        {item.details}
                      </p>
                    )}

                    <div className="flex items-center justify-between text-[10px] text-zinc-400 pt-1.5 border-t border-inherit">
                      <span>Duration: {item.durationMs}ms</span>
                      {item.itemsAffected !== undefined && (
                        <span>Items affected: {item.itemsAffected}</span>
                      )}
                      <span>Status: {item.status.toUpperCase()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-inherit flex items-center justify-between shrink-0 text-xs">
              <span className="text-zinc-400">Total logs: {filteredHistory.length}</span>
              <button
                onClick={() => setIsHistoryModalOpen(false)}
                className="px-4 py-1.5 rounded-lg bg-zinc-800 text-white font-medium hover:bg-zinc-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
