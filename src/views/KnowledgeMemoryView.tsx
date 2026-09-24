import React, { useState } from 'react';
import {
  Database,
  Plus,
  Bot,
  Brain,
  Filter,
  Check,
  Tag,
  ShieldCheck,
} from 'lucide-react';
import { MemoryItem } from '../types/index.ts';

interface KnowledgeMemoryViewProps {
  memories: MemoryItem[];
  activeProjectId: string;
  onAddMemory: (data: Partial<MemoryItem>) => Promise<void>;
  onDispatchToAgent: (prompt: string) => void;
  isDark: boolean;
}

export const KnowledgeMemoryView: React.FC<KnowledgeMemoryViewProps> = ({
  memories,
  activeProjectId,
  onAddMemory,
  onDispatchToAgent,
  isDark,
}) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<MemoryItem['category']>('decision');
  const [importance, setImportance] = useState<MemoryItem['importance']>('high');

  const filteredMemories = memories.filter((m) => {
    if (filterCategory !== 'all' && m.category !== filterCategory) return false;
    return true;
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    await onAddMemory({
      projectId: activeProjectId,
      category,
      content,
      importance,
    });
    setContent('');
    setShowAddModal(false);
  };

  const getCategoryColor = (cat: MemoryItem['category']) => {
    switch (cat) {
      case 'architecture':
        return 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20';
      case 'decision':
        return 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20';
      case 'constraint':
        return 'bg-rose-500/10 text-rose-500 border-rose-500/20';
      default:
        return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    }
  };

  return (
    <div id="knowledge-memory-view" className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Brain className="w-5 h-5 text-indigo-500" />
            <span>Persistent Project Memory & Knowledge Graph</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Architectural decisions, physical constraints, and learned patterns indexed for autonomous agent reasoning.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <select
            aria-label="Filter memory category"
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className={`text-xs font-medium py-1.5 px-3 rounded-lg border ${
              isDark ? 'bg-zinc-900 border-zinc-700 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-700'
            }`}
          >
            <option value="all">All Memory Types</option>
            <option value="architecture">Architecture</option>
            <option value="decision">Decision</option>
            <option value="constraint">Constraint</option>
            <option value="pattern">Pattern</option>
          </select>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-1.5 shadow-xs transition-colors shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Add Memory</span>
          </button>
        </div>
      </div>

      {/* Memory Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMemories.map((mem) => (
          <div
            key={mem.id}
            className={`p-4 rounded-xl border flex flex-col justify-between transition-colors ${
              isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span
                  className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${getCategoryColor(
                    mem.category
                  )}`}
                >
                  {mem.category}
                </span>
                <span
                  className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                    mem.importance === 'high'
                      ? 'bg-rose-500/10 text-rose-500'
                      : 'bg-zinc-500/10 text-zinc-500'
                  }`}
                >
                  {mem.importance} Priority
                </span>
              </div>

              <p className="text-xs text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans mt-2">
                {mem.content}
              </p>
            </div>

            <div className="pt-3 border-t border-inherit flex items-center justify-between text-[11px] text-zinc-400 mt-4">
              <span>{new Date(mem.createdAt).toLocaleDateString()}</span>
              <button
                onClick={() => onDispatchToAgent(`Recall constraint: "${mem.content}" and confirm project code complies.`)}
                className="text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <Bot className="w-3 h-3" />
                <span>Verify in Code</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Add Memory */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div
            className={`w-full max-w-md rounded-2xl border p-5 shadow-2xl transition-colors ${
              isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-100' : 'bg-white border-zinc-200 text-zinc-900'
            }`}
          >
            <div className="flex items-center justify-between pb-3 border-b border-inherit mb-4">
              <h3 className="text-sm font-semibold">Store Knowledge or Constraint</h3>
              <button onClick={() => setShowAddModal(false)} className="text-xs text-zinc-400">
                ✕
              </button>
            </div>

            <form onSubmit={handleAdd} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Memory Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as MemoryItem['category'])}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                >
                  <option value="decision">Decision</option>
                  <option value="architecture">Architecture</option>
                  <option value="constraint">Constraint</option>
                  <option value="pattern">Pattern</option>
                </select>
              </div>

              <div>
                <label className="block font-medium mb-1 text-zinc-600 dark:text-zinc-400">
                  Content / Fact / Constraint
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="e.g. Always cap truck regenerative deceleration to 72% to prevent battery thermal degradation..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className={`w-full p-2 rounded-lg border ${
                    isDark ? 'bg-zinc-950 border-zinc-700' : 'bg-zinc-50 border-zinc-200'
                  }`}
                />
              </div>

              <div className="pt-3 border-t border-inherit flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-1.5 rounded-lg border text-zinc-600 dark:text-zinc-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-xs"
                >
                  Save to Memory
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
