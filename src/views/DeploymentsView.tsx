import React, { useState } from 'react';
import {
  Rocket,
  ShieldAlert,
  Server,
  ExternalLink,
  CheckCircle2,
  Clock,
  RotateCw,
  Plus,
  AlertTriangle,
} from 'lucide-react';
import { Deployment, Approval } from '../types/index.ts';

interface DeploymentsViewProps {
  deployments: Deployment[];
  approvals: Approval[];
  activeProjectId: string;
  onTriggerDeployment: (platform: string, env: string) => Promise<void>;
  onApproveAction: (approvalId: string) => Promise<void>;
  onRejectAction: (approvalId: string) => Promise<void>;
  isDark: boolean;
}

export const DeploymentsView: React.FC<DeploymentsViewProps> = ({
  deployments,
  approvals,
  activeProjectId,
  onTriggerDeployment,
  onApproveAction,
  onRejectAction,
  isDark,
}) => {
  const [selectedPlatform, setSelectedPlatform] = useState('Render');
  const [selectedEnv, setSelectedEnv] = useState<'production' | 'staging'>('production');
  const [isDeploying, setIsDeploying] = useState(false);

  const pendingDeployApprovals = approvals.filter(
    (a) => a.status === 'pending' && a.action.toLowerCase().includes('deploy')
  );

  const handleTrigger = async () => {
    setIsDeploying(true);
    try {
      await onTriggerDeployment(selectedPlatform, selectedEnv);
    } finally {
      setIsDeploying(false);
    }
  };

  return (
    <div id="deployments-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Sensitive Operations Approval Banner */}
      {pendingDeployApprovals.length > 0 && (
        <div className="p-4 rounded-xl border border-rose-500/40 bg-rose-500/10 space-y-3">
          <div className="flex items-center gap-2 text-rose-700 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            <span>Sensitive Operation Approval Gate</span>
          </div>
          <p className="text-xs text-zinc-700 dark:text-zinc-300">
            A production container deployment has been staged. Under autonomous safety rules, this action requires explicit user sign-off.
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onApproveAction(pendingDeployApprovals[0].id)}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs transition-colors shadow-xs"
            >
              Approve Production Deploy
            </button>
            <button
              onClick={() => onRejectAction(pendingDeployApprovals[0].id)}
              className="px-3.5 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Deployment Trigger Control */}
      <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'}`}>
        <div className="flex items-center gap-2 mb-2">
          <Rocket className="w-5 h-5 text-indigo-500" />
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Multi-Cloud Continuous Delivery Pipeline
          </h2>
        </div>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mb-4">
          Prepare, verify Docker container builds, lint environment variables, and trigger preview or production releases.
        </p>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Target Platform:</span>
            <select
              aria-label="Target platform"
              value={selectedPlatform}
              onChange={(e) => setSelectedPlatform(e.target.value)}
              className={`text-xs p-2 rounded-lg border font-medium ${
                isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <option value="Render">Render (Docker Web Service)</option>
              <option value="Vercel">Vercel (Edge SPA Frontend)</option>
              <option value="Railway">Railway (Full Stack + PostgreSQL)</option>
              <option value="AWS">AWS ECS / Fargate</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-medium text-zinc-400">Environment:</span>
            <select
              aria-label="Environment"
              value={selectedEnv}
              onChange={(e) => setSelectedEnv(e.target.value as 'production' | 'staging')}
              className={`text-xs p-2 rounded-lg border font-medium ${
                isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
              }`}
            >
              <option value="production">Production</option>
              <option value="staging">Staging / Preview</option>
            </select>
          </div>

          <button
            onClick={handleTrigger}
            disabled={isDeploying}
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors shrink-0 disabled:opacity-50"
          >
            {isDeploying ? <RotateCw className="w-4 h-4 animate-spin" /> : <Rocket className="w-4 h-4" />}
            <span>{isDeploying ? 'Staging Release...' : 'Stage & Deploy'}</span>
          </button>
        </div>
      </div>

      {/* Deployment History Table */}
      <div className="space-y-3">
        <div className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          Deployment History & Status ({deployments.length})
        </div>

        <div className="space-y-3">
          {deployments.map((dep) => (
            <div
              key={dep.id}
              className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors ${
                isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                    dep.status === 'Deployed'
                      ? 'bg-emerald-500/10 text-emerald-500'
                      : dep.status === 'Building'
                      ? 'bg-amber-500/10 text-amber-500 animate-spin'
                      : 'bg-rose-500/10 text-rose-500'
                  }`}
                >
                  <Server className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100">
                      {dep.platform} Release
                    </span>
                    <span className="text-[10px] uppercase font-mono px-1.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                      {dep.environment}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 rounded ${
                        dep.status === 'Deployed'
                          ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                          : dep.status === 'Building'
                          ? 'bg-amber-500/20 text-amber-600'
                          : 'bg-rose-500/20 text-rose-600'
                      }`}
                    >
                      {dep.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                    Commit: <span className="font-semibold text-zinc-700 dark:text-zinc-300">{dep.commitHash}</span> •{' '}
                    {new Date(dep.deployedAt || dep.createdAt || Date.now()).toLocaleString()}
                  </div>
                </div>
              </div>

              {(dep.url || dep.deployedUrl) && (
                <a
                  href={dep.url || dep.deployedUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center justify-center gap-1.5 text-indigo-600 dark:text-indigo-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
                >
                  <span>Visit Deployment</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
