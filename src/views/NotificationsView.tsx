import React from 'react';
import {
  Bell,
  CheckCheck,
  ShieldAlert,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { NotificationItem } from '../types/index.ts';

interface NotificationsViewProps {
  notifications: NotificationItem[];
  onMarkRead: (id: string) => Promise<void>;
  onMarkAllRead: () => Promise<void>;
  isDark: boolean;
}

export const NotificationsView: React.FC<NotificationsViewProps> = ({
  notifications,
  onMarkRead,
  onMarkAllRead,
  isDark,
}) => {
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  return (
    <div id="notifications-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Bell className="w-5 h-5 text-indigo-500" />
            <span>Notification & Operational Alert Center</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            System alerts, approval notifications, and deadline reminders.
          </p>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={onMarkAllRead}
            className="px-3.5 py-1.5 rounded-lg border text-xs font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4 text-emerald-500" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className={`rounded-2xl border divide-y divide-inherit transition-colors overflow-hidden ${
        isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
      }`}>
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-zinc-400">No notifications</div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              onClick={() => onMarkRead(n.id)}
              className={`p-4 flex items-start gap-3.5 cursor-pointer transition-colors ${
                n.isRead
                  ? 'opacity-70 hover:opacity-100'
                  : isDark
                  ? 'bg-zinc-800/40 hover:bg-zinc-800/60'
                  : 'bg-indigo-50/20 hover:bg-indigo-50/40'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  n.type === 'critical'
                    ? 'bg-rose-500/10 text-rose-500'
                    : n.type === 'high'
                    ? 'bg-amber-500/10 text-amber-500'
                    : 'bg-blue-500/10 text-blue-500'
                }`}
              >
                {n.type === 'critical' ? (
                  <ShieldAlert className="w-4 h-4" />
                ) : n.type === 'high' ? (
                  <AlertTriangle className="w-4 h-4" />
                ) : (
                  <Info className="w-4 h-4" />
                )}
              </div>

              <div className="flex-1 min-w-0 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-zinc-900 dark:text-zinc-100">{n.title}</span>
                    <span
                      className={`text-[9px] uppercase font-bold px-1.5 py-0.2 rounded ${
                        n.type === 'critical'
                          ? 'bg-rose-500/20 text-rose-600'
                          : n.type === 'high'
                          ? 'bg-amber-500/20 text-amber-600'
                          : 'bg-blue-500/20 text-blue-600'
                      }`}
                    >
                      {n.type}
                    </span>
                  </div>
                  <span className="text-[11px] text-zinc-400 font-mono">
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-zinc-600 dark:text-zinc-400 text-[11px] leading-relaxed">
                  {n.message}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
