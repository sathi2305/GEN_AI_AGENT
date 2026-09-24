import React, { useState } from 'react';
import {
  CheckSquare,
  Plus,
  Bot,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
  Filter,
  User,
  CalendarClock,
  ArrowRight,
  Play,
} from 'lucide-react';
import { Task, Project, ScheduledTask } from '../types/index.ts';

interface TasksViewProps {
  tasks: Task[];
  projects: Project[];
  activeProjectId: string;
  scheduledTasks?: ScheduledTask[];
  onUpdateTask: (id: string, data: Partial<Task>) => Promise<void>;
  onCreateTask: (task: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
  onDispatchToAgent: (prompt: string) => void;
  onNavigateToSchedules?: () => void;
  onRunScheduledTask?: (id: string) => Promise<void>;
  isDark: boolean;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  activeProjectId,
  scheduledTasks = [],
  onUpdateTask,
  onCreateTask,
  onDeleteTask,
  onDispatchToAgent,
  onNavigateToSchedules,
  onRunScheduledTask,
  isDark,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPriority, setNewPriority] = useState<Task['priority']>('high');
  const [newCategory, setNewCategory] = useState<Task['category']>('Coding');

  const filteredTasks = tasks.filter((t) => {
    if (filterCategory !== 'all' && t.category !== filterCategory) return false;
    return true;
  });

  const columns: { status: Task['status']; label: string; count: number }[] = [
    { status: 'todo', label: 'To Do', count: filteredTasks.filter((t) => t.status === 'todo').length },
    { status: 'in_progress', label: 'In Progress', count: filteredTasks.filter((t) => t.status === 'in_progress').length },
    { status: 'review', label: 'Review & Verify', count: filteredTasks.filter((t) => t.status === 'review').length },
    { status: 'done', label: 'Completed', count: filteredTasks.filter((t) => t.status === 'done').length },
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    await onCreateTask({
      projectId: activeProjectId,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      category: newCategory,
      status: 'todo',
      assignee: 'CrewAI Work Agent',
    });
    setNewTitle('');
    setNewDescription('');
    setShowCreateModal(false);
  };

  const getPriorityBadge = (p: Task['priority']) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      case 'high':
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
      case 'medium':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
      default:
        return 'bg-zinc-500/10 text-zinc-500 border-zinc-500/20';
    }
  };

  return (
    <div id="tasks-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Gen Scheduled Maintenance Highlight Banner */}
      <div className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors ${
        isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-600/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <CalendarClock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                Gen Autonomous Recurring Maintenance
              </span>
              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                {scheduledTasks.filter((t) => t.enabled).length || 3} Active
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
              Weekly project summaries, stale notification purging, and sprint memory consolidation run automatically on schedules.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToSchedules && (
            <button
              onClick={onNavigateToSchedules}
              className="px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-colors hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <span>Manage Schedules</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              aria-label="Filter category"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={`text-xs font-medium py-1.5 px-3 rounded-lg border appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-700'
              }`}
            >
              <option value="all">All Categories</option>
              <option value="Coding">Coding</option>
              <option value="Research">Research</option>
              <option value="Testing">Testing</option>
              <option value="DevOps">DevOps</option>
              <option value="Hackathon">Hackathon</option>
              <option value="Docs">Docs</option>
            </select>
          </div>
          <span className="text-xs text-zinc-500 dark:text-zinc-400">
            {filteredTasks.length} tasks in pipeline
          </span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);
          return (
            <div
              key={col.status}
              className={`p-3 rounded-2xl border flex flex-col transition-colors ${
                isDark ? 'bg-zinc-900/40 border-zinc-800' : 'bg-zinc-100/60 border-zinc-200'
              }`}
            >
              {/* Column Header */}
              <div className="flex items-center justify-between pb-3 border-b border-inherit mb-3">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-wider">
                  {col.label}
                </span>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 font-bold">
                  {col.count}
                </span>
              </div>

              {/* Tasks List */}
              <div className="space-y-3 flex-1 overflow-y-auto max-h-[600px] pr-1">
                {colTasks.length === 0 ? (
                  <div className="text-center py-8 text-xs text-zinc-400">No tasks</div>
                ) : (
                  colTasks.map((task) => (
                    <div
                      key={task.id}
                      className={`p-3.5 rounded-xl border text-xs transition-all ${
                        isDark
                          ? 'bg-zinc-900 border-zinc-800 hover:border-zinc-700'
                          : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${getPriorityBadge(
                            task.priority
                          )}`}
                        >
                          {task.priority}
                        </span>
                        <span className="text-[10px] text-zinc-400 font-mono px-1 rounded bg-zinc-100 dark:bg-zinc-800">
                          {task.category}
                        </span>
                      </div>

                      <div className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 leading-snug">
                        {task.title}
                      </div>
                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mb-3 leading-relaxed">
                        {task.description}
                      </p>

                      {/* Footer Actions */}
                      <div className="pt-2 border-t border-inherit flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5 text-zinc-500 dark:text-zinc-400">
                          <Bot className="w-3.5 h-3.5 text-indigo-500" />
                          <span className="truncate max-w-[90px]">{task.assignee}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          {/* Status cycle button */}
                          <select
                            aria-label="Change task status"
                            value={task.status}
                            onChange={(e) => onUpdateTask(task.id, { status: e.target.value as Task['status'] })}
                            className="text-[10px] py-0.5 px-1.5 rounded border bg-transparent font-medium cursor-pointer"
                          >
                            <option value="todo">To Do</option>
                            <option value="in_progress">In Prog</option>
                            <option value="review">Review</option>
                            <option value="done">Done</option>
                          </select>

                          {/* Agent Run button */}
                          <button
                            onClick={() => onDispatchToAgent(`Work on task: "${task.title}". Context: ${task.description}`)}
                            title="Execute task via AI Work Agent"
                            aria-label="Execute task via AI Work Agent"
                            className="p-1 rounded text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Bot className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDeleteTask(task.id)}
                            title="Delete task"
                            aria-label="Delete task"
                            className="p-1 rounded text-zinc-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-zinc-800 transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Task */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-sm font-semibold">Create Autonomous Sprint Task</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-xs text-zinc-400 hover:text-zinc-600"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Task Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Implement Dijkstra Elevation Weight Matrix"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Detailed functional instructions for the CrewAI Work Agent..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className={`w-full p-2 rounded-lg border focus:outline-none focus:ring-1 focus:ring-indigo-500 ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                    Priority
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as Task['priority'])}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <option value="critical">Critical</option>
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                    Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as Task['category'])}
                    className={`w-full p-2 rounded-lg border ${
                      isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                    }`}
                  >
                    <option value="Coding">Coding</option>
                    <option value="Research">Research</option>
                    <option value="Testing">Testing</option>
                    <option value="DevOps">DevOps</option>
                    <option value="Hackathon">Hackathon</option>
                    <option value="Docs">Docs</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
