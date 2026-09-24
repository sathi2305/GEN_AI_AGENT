import React, { useState } from 'react';
import {
  Activity,
  Filter,
  CheckCircle2,
  Clock,
  Zap,
  Terminal,
  Search,
} from 'lucide-react';
import { ActivityLog } from '../types/index.ts';

interface ActivityLogViewProps {
  activities: ActivityLog[];
  isDark: boolean;
}

export const ActivityLogView: React.FC<ActivityLogViewProps> = ({
  activities,
  isDark,
}) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [filterEntity, setFilterEntity] = useState('all');

  const filtered = activities.filter((act) => {
    if (filterEntity !== 'all' && act.entity.toLowerCase() !== filterEntity.toLowerCase()) return false;
    const actionText = act.action || act.eventType;
    if (
      filterQuery &&
      !act.details.toLowerCase().includes(filterQuery.toLowerCase()) &&
      !actionText.toLowerCase().includes(filterQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  });

  return (
    <div id="activity-log-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-500" />
            <span>Autonomous Agent Observability & Telemetry Audit</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Real-time tool execution logs, latency tracking, token usage, and system state transitions.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search audit trail..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className={`text-xs py-1.5 px-3 rounded-lg border ${
              isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-700'
            }`}
          />
          <select
            aria-label="Filter entity"
            value={filterEntity}
            onChange={(e) => setFilterEntity(e.target.value)}
            className={`text-xs font-medium py-1.5 px-3 rounded-lg border ${
              isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-700'
            }`}
          >
            <option value="all">All Entities</option>
            <option value="agent">Agent</option>
            <option value="task">Task</option>
            <option value="research">Research</option>
            <option value="deployment">Deployment</option>
            <option value="approval">Approval</option>
          </select>
        </div>
      </div>

      {/* Logs Table */}
      <div className={`rounded-2xl border overflow-hidden transition-colors ${
        isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        <div className="divide-y divide-inherit">
          {filtered.map((act) => (
            <div
              key={act.id}
              className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/30"
            >
              <div className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">
                      {act.action || act.eventType.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-500">
                      {act.entity}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-600 dark:text-zinc-400 font-sans leading-relaxed">
                    {act.details}
                  </p>
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 shrink-0 sm:text-right font-sans">
                {new Date(act.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
