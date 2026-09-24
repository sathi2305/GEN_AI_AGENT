import React, { useState } from 'react';
import {
  Mail,
  Send,
  Plus,
  Bot,
  Calendar,
  AlertCircle,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import { EmailItem } from '../types/index.ts';

interface EmailsViewProps {
  emails: EmailItem[];
  onSimulateEmail: (email: Partial<EmailItem>) => Promise<void>;
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const EmailsView: React.FC<EmailsViewProps> = ({
  emails,
  onSimulateEmail,
  onDispatchToAgent,
  isDark,
}) => {
  const [selectedEmail, setSelectedEmail] = useState<EmailItem>(emails[0]);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleSimulateNew = async () => {
    setIsSimulating(true);
    try {
      await onSimulateEmail({
        from: 'organizers@globalhackathon2026.org',
        sender: 'organizers@globalhackathon2026.org',
        subject: 'URGENT UPDATE: Submission Link Verification & Live Pitch Window',
        preview: 'Judges will commence live scoring at 09:00 UTC on September 29. Please verify deployment URL.',
        body: `Dear EcoRoute AI Team,

We have verified your repository. Please note that the final live submission window closes strictly at 23:59 UTC on September 28, 2026. 

Ensure your production deployment on Render and your 10-slide deck in PPT Studio are fully finalized.

Best of luck!
Hackathon Organizing Committee`,
        extractedDeadline: '2026-09-28T23:59:00Z',
        detectedDeadlines: ['2026-09-28T23:59:00Z'],
        suggestedActions: [
          'Run automated pre-flight testing suite',
          'Audit live production URL on Render',
          'Review 3-minute jury pitch script',
        ],
        detectedActions: [
          'Run automated pre-flight testing suite',
          'Audit live production URL on Render',
          'Review 3-minute jury pitch script',
        ],
      });
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div id="emails-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-500" />
            <span>Email Intelligence & Organizer Update Extractor</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Parses organizer announcements, schedules deadlines, and extracts automated sprint tasks.
          </p>
        </div>

        <button
          onClick={handleSimulateNew}
          disabled={isSimulating}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0 disabled:opacity-50"
        >
          <Sparkles className="w-4 h-4" />
          <span>Simulate Inbound Organizer Email</span>
        </button>
      </div>

      {/* Main Mailbox Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Email Inbox List (1 col) */}
        <div className="space-y-2">
          {emails.map((em) => {
            const isSelected = selectedEmail?.id === em.id;
            return (
              <div
                key={em.id}
                onClick={() => setSelectedEmail(em)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all text-xs ${
                  isSelected
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                    : isDark
                    ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                    : 'bg-white border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[160px]">
                    {em.from || em.sender}
                  </span>
                  <span>{new Date(em.receivedAt).toLocaleDateString()}</span>
                </div>
                <div className="font-semibold text-zinc-900 dark:text-zinc-100 truncate mb-1">
                  {em.subject}
                </div>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                  {em.preview || em.body.slice(0, 120)}
                </p>
              </div>
            );
          })}
        </div>

        {/* Selected Email Reader & Extractor (2 cols) */}
        <div className="lg:col-span-2">
          {selectedEmail ? (
            <div className={`p-5 rounded-2xl border space-y-4 transition-colors ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}>
              <div className="pb-3 border-b border-inherit">
                <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                  <span>From: {selectedEmail.from || selectedEmail.sender}</span>
                  <span>{new Date(selectedEmail.receivedAt).toLocaleString()}</span>
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100">
                  {selectedEmail.subject}
                </h3>
              </div>

              {/* Extracted Intelligence Callout */}
              <div className="p-3.5 rounded-xl bg-indigo-50/60 dark:bg-indigo-500/10 border border-indigo-200/50 dark:border-indigo-500/20 space-y-2 text-xs">
                <div className="font-semibold text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5 text-[11px] uppercase tracking-wider">
                  <Bot className="w-3.5 h-3.5" />
                  <span>AI Extracted Intelligence</span>
                </div>

                {(selectedEmail.extractedDeadline || (selectedEmail.detectedDeadlines && selectedEmail.detectedDeadlines[0])) && (
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-semibold text-xs">
                    <Calendar className="w-4 h-4" />
                    <span>Extracted Deadline: {new Date(selectedEmail.extractedDeadline || selectedEmail.detectedDeadlines![0]).toLocaleString()}</span>
                  </div>
                )}

                <div className="space-y-1 pt-1">
                  <div className="text-[10px] uppercase font-bold text-zinc-500 dark:text-zinc-400">
                    Recommended Actions
                  </div>
                  {(selectedEmail.suggestedActions || selectedEmail.detectedActions || []).map((act: string, i: number) => (
                    <div key={i} className="flex items-center gap-2 text-zinc-700 dark:text-zinc-300 text-[11px]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                      <span>{act}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Email Body */}
              <div className={`p-4 rounded-xl border text-xs leading-relaxed whitespace-pre-wrap font-sans ${
                isDark ? 'bg-zinc-950 border-zinc-800 text-zinc-300' : 'bg-zinc-50 border-zinc-200 text-zinc-800'
              }`}>
                {selectedEmail.body}
              </div>

              {/* Action Button */}
              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => onDispatchToAgent(`Process email "${selectedEmail.subject}" and dispatch the recommended actions into sprint tasks.`)}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <Bot className="w-4 h-4" />
                  <span>Execute Recommended Actions via Agent</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-xs text-zinc-400">
              Select an email from the inbox.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
