import React, { useState } from 'react';
import {
  FolderGit2,
  Plus,
  CheckCircle2,
  Clock,
  Layers,
  Server,
  Code2,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';
import { Project } from '../types/index.ts';

interface ProjectsViewProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  onCreateProject: (proj: Partial<Project>) => Promise<void>;
  isDark: boolean;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  onCreateProject,
  isDark,
}) => {
  const [showCreate, setShowCreate] = useState(false);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [techStackInput, setTechStackInput] = useState('Python 3.12, FastAPI, React 19, Tailwind CSS, PostgreSQL, pgvector');
  const [deadline, setDeadline] = useState('2026-09-28');

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await onCreateProject({
      name,
      description: desc,
      techStack: techStackInput.split(',').map((s) => s.trim()).filter(Boolean),
      deadline,
      status: 'in_progress',
      progress: 10,
      requirements: ['Core MVP implementation', 'Unit test coverage > 85%', 'Production deployment staging'],
      architectureTopology: [
        { name: 'API Gateway', type: 'FastAPI Service', port: 8000, status: 'healthy' },
        { name: 'Vector DB', type: 'PostgreSQL + pgvector', port: 5432, status: 'healthy' },
      ],
    });
    setName('');
    setDesc('');
    setShowCreate(false);
  };

  return (
    <div id="projects-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50">
            Project Architecture & Service Topology
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Decoupled services, requirements matrix, and engineering milestones.
          </p>
        </div>

        <button
          onClick={() => setShowCreate(true)}
          className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Project Switcher Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {projects.map((proj) => {
          const isSelected = proj.id === activeProjectId;
          return (
            <div
              key={proj.id}
              onClick={() => onSelectProject(proj.id)}
              className={`p-4 rounded-xl border cursor-pointer transition-all ${
                isSelected
                  ? 'border-indigo-500 ring-2 ring-indigo-500/20 shadow-md bg-indigo-500/5'
                  : isDark
                  ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                  : 'bg-white border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-zinc-900 dark:text-zinc-100 truncate">
                  {proj.name}
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500">
                  {proj.status}
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 mb-3">
                {proj.description}
              </p>
              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-2 border-t border-inherit">
                <span>{proj.progress}% Sprint complete</span>
                <span>Deadline: {new Date(proj.deadline).toLocaleDateString()}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Project Detailed Architectural Inspection */}
      {activeProject && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Info (2 cols) */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tech Stack Matrix */}
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-indigo-500" />
                <span>Verified Technology Stack</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {activeProject.techStack.map((tech) => (
                  <span
                    key={tech}
                    className="px-3 py-1.5 rounded-lg border text-xs font-mono font-medium bg-zinc-100 dark:bg-zinc-800 border-zinc-200 dark:border-zinc-700 text-zinc-800 dark:text-zinc-200"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Architecture Services Topology */}
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                <Server className="w-4 h-4 text-emerald-500" />
                <span>Decoupled Service Architecture</span>
              </h3>
              <div className="space-y-2.5">
                {(activeProject.architectureTopology || []).map((svc, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-xl bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <div>
                        <div className="font-semibold text-zinc-900 dark:text-zinc-100">{svc.name}</div>
                        <div className="text-[11px] text-zinc-400 font-mono">{svc.type}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 font-mono text-[11px]">
                      <span className="px-2 py-0.5 rounded bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300">
                        Port :{svc.port}
                      </span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold uppercase text-[10px]">
                        {svc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Functional Requirements Checklist */}
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-500" />
                <span>Core Functional Requirements</span>
              </h3>
              <div className="space-y-2">
                {activeProject.requirements.map((req, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-2.5 text-xs text-zinc-700 dark:text-zinc-300 p-2 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-950 transition-colors"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Metadata (1 col) */}
          <div className="space-y-4">
            <div className={`p-5 rounded-2xl border transition-colors ${isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200'}`}>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-3">
                Project Sprint Governance
              </h3>
              <div className="space-y-3 text-xs">
                <div>
                  <div className="text-zinc-400 text-[11px]">Repository</div>
                  <div className="font-mono text-zinc-800 dark:text-zinc-200 text-[11px] mt-0.5">
                    {activeProject.repositoryUrl || 'github.com/organization/ecoroute-ai'}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 text-[11px]">Live Preview URL</div>
                  <div className="font-mono text-indigo-500 text-[11px] mt-0.5">
                    {activeProject.deployedUrl || 'https://ecoroute-ai.render.com'}
                  </div>
                </div>

                <div>
                  <div className="text-zinc-400 text-[11px]">Submission Deadline</div>
                  <div className="text-rose-500 font-semibold mt-0.5">
                    {new Date(activeProject.deadline).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                </div>

                <div className="pt-3 border-t border-inherit">
                  <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold text-[11px]">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Autonomous CrewAI Agent Active</span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-1 leading-relaxed">
                    Agent continuously synchronizes tasks, memory, research findings, and testing benchmarks.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Create Project */}
      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-lg rounded-2xl border p-5 shadow-2xl transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-sm font-semibold">Initialize Project Architecture</h3>
              <button onClick={() => setShowCreate(false)} className="text-xs text-zinc-400 hover:text-zinc-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Project Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. EcoRoute AI Logistics Engine"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Problem Statement / Description
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Provide the primary problem statement and scope..."
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Tech Stack (comma separated)
                </label>
                <input
                  type="text"
                  value={techStackInput}
                  onChange={(e) => setTechStackInput(e.target.value)}
                  className={`w-full p-2 rounded-lg border font-mono text-[11px] ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Submission Deadline
                </label>
                <input
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-3 py-1.5 rounded-lg border text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                >
                  Scaffold Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
