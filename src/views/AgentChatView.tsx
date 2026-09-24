import React, { useState, useRef, useEffect } from 'react';
import {
  Send,
  Paperclip,
  Bot,
  User,
  CheckCircle2,
  Clock,
  RotateCw,
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  FileText,
  X,
  ChevronDown,
  ChevronUp,
  Cpu,
  Layers,
  CheckCheck,
  Brain,
} from 'lucide-react';
import { ChatMessage, AgentRun, AgentStep, Approval } from '../types/index.ts';
import { getStoredModelConfig } from '../lib/api.ts';

interface AgentChatViewProps {
  messages: ChatMessage[];
  onSendMessage: (text: string, attachedFiles: string[], model?: string) => Promise<void>;
  isLoading: boolean;
  activeSteps?: AgentStep[];
  currentRun?: AgentRun | null;
  onApproveAction: (approvalId: string) => Promise<void>;
  onRejectAction: (approvalId: string) => Promise<void>;
  activeProjectId: string;
  isDark: boolean;
  presetPrompt?: string;
  onClearPresetPrompt?: () => void;
}

export const AgentChatView: React.FC<AgentChatViewProps> = ({
  messages,
  onSendMessage,
  isLoading,
  activeSteps,
  currentRun,
  onApproveAction,
  onRejectAction,
  activeProjectId,
  isDark,
  presetPrompt,
  onClearPresetPrompt,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFiles, setAttachedFiles] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>({});
  const [expandedThoughts, setExpandedThoughts] = useState<Record<string, boolean>>({});
  const [selectedModel, setSelectedModel] = useState<string>('gemini-3.8-flash');
  const [isModelDropdownOpen, setIsModelDropdownOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const modelOptions = [
    { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', provider: 'Google DeepMind', badge: 'Default', tag: 'Gemini' },
    { id: 'gemini-3.8-pro', name: 'Gemini 3.8 Pro', provider: 'Google DeepMind', badge: 'Reasoning', tag: 'Gemini' },
    { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', provider: 'Google DeepMind', badge: 'Fast', tag: 'Gemini' },
    { id: 'chatgpt-4o', name: 'ChatGPT (GPT-4o)', provider: 'OpenAI', badge: 'Omni', tag: 'ChatGPT' },
    { id: 'chatgpt-4o-mini', name: 'ChatGPT (GPT-4o Mini)', provider: 'OpenAI', badge: 'Speed', tag: 'ChatGPT' },
    { id: 'o1-preview', name: 'OpenAI o1', provider: 'OpenAI', badge: 'Deep Thought', tag: 'ChatGPT' },
    { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', provider: 'Anthropic', badge: 'Top Code', tag: 'Claude' },
    { id: 'claude-3-opus', name: 'Claude 3 Opus', provider: 'Anthropic', badge: 'Deep Research', tag: 'Claude' },
    { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', provider: 'Anthropic', badge: 'Ultra Fast', tag: 'Claude' },
  ];

  const currentModelObj = modelOptions.find((m) => m.id === selectedModel) || modelOptions[0];

  useEffect(() => {
    const config = getStoredModelConfig();
    if (config) {
      if (config.activeProvider === 'openai' && config.openaiModel) {
        setSelectedModel(config.openaiModel);
      } else if (config.activeProvider === 'anthropic' && config.anthropicModel) {
        setSelectedModel(config.anthropicModel);
      } else if (config.geminiModel) {
        setSelectedModel(config.geminiModel);
      }
    }
  }, []);

  useEffect(() => {
    if (presetPrompt) {
      setInputText(presetPrompt);
      onClearPresetPrompt?.();
    }
  }, [presetPrompt, onClearPresetPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeSteps, isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    const files = [...attachedFiles];
    setInputText('');
    setAttachedFiles([]);
    await onSendMessage(text, files, selectedModel);
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const names = Array.from(files).map((f) => f.name);
    setAttachedFiles((prev) => [...prev, ...names]);
  };

  const toggleStepDetails = (id: string) => {
    setExpandedSteps((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleThoughtDetails = (id: string) => {
    setExpandedThoughts((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const quickActionChips = [
    'Hi Gen! How are you? What can you help me with?',
    'Gen: Here is my problem statement. Take care of the project.',
    'Gen: Deep architectural breakdown & state topology',
    'Research Eurovignette toll subsidies & EV elevation formulas',
    'Generate Dijkstra elevation router code and run tests',
    'Prepare 10-slide Hackathon pitch deck and demo script',
    'Stage Render production deployment for approval',
  ];

  return (
    <div id="agent-chat-view" className="h-[calc(100vh-8rem)] flex flex-col max-w-5xl mx-auto">
      {/* Top Agent Context Header */}
      <div className={`p-3 rounded-xl border mb-3 flex flex-wrap items-center justify-between gap-3 text-xs transition-colors shrink-0 ${
        isDark ? 'bg-zinc-900/80 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-700 shadow-xs'
      }`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
              <span>Gen Work Agent</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </div>
            <div className="text-[11px] text-zinc-400">
              Autonomous AI Work Agent • ChatGPT, Gemini & Claude Models
            </div>
          </div>
        </div>

        {/* Multi-Model Engine Selector */}
        <div className="flex items-center gap-2 relative">
          <div className="relative">
            <button
              type="button"
              onClick={() => setIsModelDropdownOpen((prev) => !prev)}
              className={`px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-2 transition-all ${
                isDark
                  ? 'bg-zinc-900 border-zinc-700 text-zinc-200 hover:border-zinc-600'
                  : 'bg-white border-zinc-200 text-zinc-800 hover:border-zinc-300 shadow-2xs'
              }`}
            >
              <div className="w-2 h-2 rounded-full bg-indigo-500" />
              <span className="font-semibold">{currentModelObj.name}</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-500 font-medium">
                {currentModelObj.tag}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
            </button>

            {isModelDropdownOpen && (
              <div
                className={`absolute right-0 mt-1.5 w-72 rounded-xl border p-2 shadow-xl z-50 transition-all ${
                  isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-200' : 'bg-white border-zinc-200 text-zinc-800'
                }`}
              >
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  Select AI Reasoning Model
                </div>

                {['Gemini', 'ChatGPT', 'Claude'].map((providerGroup) => (
                  <div key={providerGroup} className="mt-1.5">
                    <div className="px-2 py-0.5 text-[10px] font-semibold text-zinc-500 flex items-center justify-between">
                      <span>{providerGroup === 'Gemini' ? 'Google Gemini' : providerGroup === 'ChatGPT' ? 'OpenAI ChatGPT' : 'Anthropic Claude'}</span>
                    </div>
                    <div className="space-y-0.5 mt-0.5">
                      {modelOptions
                        .filter((m) => m.tag === providerGroup)
                        .map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                              setSelectedModel(opt.id);
                              setIsModelDropdownOpen(false);
                            }}
                            className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex items-center justify-between transition-colors ${
                              selectedModel === opt.id
                                ? 'bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 font-semibold'
                                : 'hover:bg-zinc-100 dark:hover:bg-zinc-800/80 text-zinc-600 dark:text-zinc-300'
                            }`}
                          >
                            <div>
                              <div className="font-medium">{opt.name}</div>
                              <div className="text-[10px] text-zinc-400">{opt.provider}</div>
                            </div>
                            <span className="text-[9px] px-1.5 py-0.5 rounded bg-zinc-100 dark:bg-zinc-800 text-zinc-500">
                              {opt.badge}
                            </span>
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <span className="hidden sm:inline-flex px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[10px] font-medium">
            14 Tools Ready
          </span>
        </div>
      </div>

      {/* Message Stream */}
      <div className={`flex-1 overflow-y-auto p-4 rounded-xl border space-y-6 transition-colors ${
        isDark ? 'bg-zinc-950 border-zinc-800' : 'bg-zinc-50/60 border-zinc-200'
      }`}>
        {messages.map((msg) => (
          <div key={msg.id} className="space-y-3">
            {/* Header: User / Assistant badge */}
            <div className="flex items-start gap-3">
              <div
                className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.role === 'user'
                    ? 'bg-zinc-700 text-white'
                    : 'bg-gradient-to-tr from-indigo-600 via-violet-600 to-sky-500 text-white shadow-xs'
                }`}
              >
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between text-[11px] text-zinc-400 mb-1">
                  <span className="font-semibold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                    {msg.role === 'user' ? (
                      'You (Architect)'
                    ) : (
                      <>
                        <span>Gen</span>
                        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-medium">
                          {msg.agentRun?.modelUsed || '3.8 Flash'}
                        </span>
                      </>
                    )}
                  </span>
                  <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                </div>

                {/* Attached files badge if user uploaded */}
                {msg.attachedFiles && msg.attachedFiles.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {msg.attachedFiles.map((fn, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-[10px]"
                      >
                        <FileText className="w-3 h-3" />
                        <span>{fn}</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Agent Run Telemetry & Execution Cards */}
                {msg.agentRun && (
                  <div className="mb-3 space-y-2">
                    {/* Gemini Thought Process Collapsible */}
                    {msg.agentRun.thoughtProcess && (
                      <div className={`p-3 rounded-xl border text-xs transition-colors ${
                        isDark ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50/50 border-indigo-200 text-indigo-900 shadow-xs'
                      }`}>
                        <div
                          onClick={() => toggleThoughtDetails(msg.id)}
                          className="flex items-center justify-between cursor-pointer select-none font-semibold text-[11px]"
                        >
                          <div className="flex items-center gap-2">
                            <Brain className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
                            <span>Gen Thought Process ({msg.agentRun.modelUsed || selectedModel})</span>
                            <span className="text-[10px] font-mono px-1.5 rounded bg-indigo-500/10 text-indigo-500">
                              {msg.agentRun.latencyMs ? `${(msg.agentRun.latencyMs / 1000).toFixed(1)}s reasoning` : 'Completed'}
                            </span>
                          </div>
                          {expandedThoughts[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </div>

                        {expandedThoughts[msg.id] && (
                          <div className="mt-2.5 pt-2.5 border-t border-indigo-500/20 font-mono text-[11px] whitespace-pre-wrap leading-relaxed opacity-90">
                            {msg.agentRun.thoughtProcess}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Execution Steps Collapsible */}
                    <div className={`p-3 rounded-xl border text-xs transition-colors ${
                      isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
                    }`}>
                      <div
                        onClick={() => toggleStepDetails(msg.id)}
                        className="flex items-center justify-between cursor-pointer select-none font-semibold text-[11px] text-zinc-500 dark:text-zinc-400"
                      >
                        <div className="flex items-center gap-2">
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
                          <span>Agent Execution Plan ({msg.agentRun.steps.length} Steps Completed)</span>
                          <span className="text-[10px] font-mono px-1.5 rounded bg-zinc-100 dark:bg-zinc-800">
                            {msg.agentRun.latencyMs}ms
                          </span>
                        </div>
                        {expandedSteps[msg.id] ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </div>

                      {expandedSteps[msg.id] && (
                        <div className="mt-3 pt-3 border-t border-inherit space-y-2 font-mono text-[11px]">
                          {msg.agentRun.steps.map((st) => (
                            <div key={st.id} className="flex items-start gap-2">
                              {st.status === 'completed' && <span className="text-emerald-500 font-bold shrink-0">✓</span>}
                              {st.status === 'running' && <span className="text-indigo-500 font-bold shrink-0 animate-spin">⟳</span>}
                              {st.status === 'waiting_approval' && <span className="text-amber-500 font-bold shrink-0">○</span>}
                              {st.status === 'failed' && <span className="text-rose-500 font-bold shrink-0">✗</span>}
                              <div className="flex-1">
                                <span className="font-semibold text-zinc-900 dark:text-zinc-100">{st.title}:</span>{' '}
                                <span className="text-zinc-500 dark:text-zinc-400">{st.details}</span>
                                {st.tool && (
                                  <span className="ml-2 text-[9px] uppercase px-1 rounded bg-indigo-500/10 text-indigo-500 font-bold">
                                    {st.tool}
                                  </span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Pending Approval Gate Card if needed */}
                    {msg.agentRun.pendingApproval && msg.agentRun.pendingApproval.status === 'pending' && (
                      <div className="p-4 rounded-xl border border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-100 space-y-2.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 font-bold text-amber-700 dark:text-amber-300">
                            <ShieldAlert className="w-4 h-4 text-amber-500" />
                            <span>APPROVAL REQUIRED</span>
                          </div>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-500/20 font-mono">
                            Target: {msg.agentRun.pendingApproval.target}
                          </span>
                        </div>
                        <div className="text-xs font-semibold">
                          Action: {msg.agentRun.pendingApproval.action}
                        </div>
                        <p className="text-[11px] text-zinc-600 dark:text-zinc-300">
                          {msg.agentRun.pendingApproval.details}
                        </p>
                        <div className="flex items-center gap-2 pt-1">
                          <button
                            onClick={() => onApproveAction(msg.agentRun!.pendingApproval!.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-xs transition-colors"
                          >
                            Approve Action
                          </button>
                          <button
                            onClick={() => onRejectAction(msg.agentRun!.pendingApproval!.id)}
                            className="px-3 py-1.5 rounded-lg bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 text-zinc-800 dark:text-zinc-200 font-medium text-xs transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Body Content */}
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-[13px] leading-relaxed relative group ${
                    msg.role === 'user'
                      ? isDark
                        ? 'bg-zinc-800 text-zinc-100 font-medium'
                        : 'bg-zinc-200 text-zinc-900 font-medium'
                      : isDark
                      ? 'bg-zinc-900 border border-zinc-800 text-zinc-200'
                      : 'bg-white border border-zinc-200 text-zinc-800 shadow-xs'
                  }`}
                >
                  <div className="prose prose-sm dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                    {msg.content}
                  </div>

                  {/* Copy Button */}
                  <button
                    onClick={() => handleCopy(msg.id, msg.content)}
                    aria-label="Copy message"
                    className="absolute top-2 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-opacity text-zinc-400"
                  >
                    {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Live Active Running Steps Card */}
        {isLoading && (
          <div className="flex items-start gap-3 animate-in fade-in duration-200">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-xs animate-pulse">
              <Bot className="w-4 h-4" />
            </div>

            <div className="flex-1 space-y-2">
              <div className="text-[11px] font-semibold text-indigo-500 flex items-center gap-1.5">
                <RotateCw className="w-3 h-3 animate-spin" />
                <span>AI Work Agent Reasoning & Executing Tools...</span>
              </div>

              <div className={`p-4 rounded-2xl border text-xs space-y-2 transition-colors ${
                isDark ? 'bg-zinc-900 border-zinc-800 text-zinc-300' : 'bg-white border-zinc-200 text-zinc-800 shadow-xs'
              }`}>
                {activeSteps && activeSteps.length > 0 ? (
                  activeSteps.map((st) => (
                    <div key={st.id} className="flex items-center gap-2 font-mono text-[11px]">
                      {st.status === 'completed' && <span className="text-emerald-500 font-bold shrink-0">✓</span>}
                      {st.status === 'running' && <span className="text-indigo-500 font-bold shrink-0 animate-spin">⟳</span>}
                      {st.status === 'waiting_approval' && <span className="text-amber-500 font-bold shrink-0">○</span>}
                      <span>{st.title}</span>
                      <span className="text-zinc-400 truncate">— {st.details}</span>
                    </div>
                  ))
                ) : (
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-500">
                      <span>✓</span>
                      <span>Request understood & verified</span>
                    </div>
                    <div className="flex items-center gap-2 text-indigo-400 animate-pulse">
                      <span>⟳</span>
                      <span>Querying project memory & selecting internal tools...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="py-2 overflow-x-auto flex items-center gap-2 shrink-0">
        <span className="text-[11px] font-semibold text-zinc-400 shrink-0">Quick prompts:</span>
        {quickActionChips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => setInputText(chip)}
            className={`text-[11px] px-2.5 py-1 rounded-full border whitespace-nowrap transition-colors ${
              isDark
                ? 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-indigo-500/50 hover:bg-zinc-800'
                : 'bg-white border-zinc-200 text-zinc-700 hover:border-indigo-500/50 hover:bg-indigo-50/30'
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Attachment Pill Drawer */}
      {attachedFiles.length > 0 && (
        <div className="px-2 py-1.5 flex flex-wrap gap-2 shrink-0">
          {attachedFiles.map((fn, idx) => (
            <div
              key={idx}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 dark:bg-zinc-800 border border-indigo-200 dark:border-zinc-700 text-xs text-indigo-700 dark:text-indigo-300"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{fn}</span>
              <button
                type="button"
                onClick={() => setAttachedFiles(attachedFiles.filter((_, i) => i !== idx))}
                aria-label="Remove attachment"
                className="hover:text-rose-500"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Box Form */}
      <form
        onSubmit={handleSubmit}
        className={`p-2.5 rounded-2xl border flex items-end gap-2 shrink-0 transition-colors shadow-sm ${
          isDark ? 'bg-zinc-900 border-zinc-800' : 'bg-white border-zinc-200'
        }`}
      >
        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.docx,.txt,.md,.py,.ts,.tsx,.json"
          onChange={handleFileUpload}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          title="Attach problem statement, PDF, DOCX, or code file"
          aria-label="Attach file"
          className="p-2 rounded-xl text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors shrink-0"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <textarea
          id="agent-chat-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Ask Gen... (e.g. 'Gen, here is my problem statement. Take care of the project.')"
          rows={1}
          className="flex-1 max-h-32 bg-transparent text-xs sm:text-sm font-medium focus:outline-none resize-none py-1.5 text-zinc-900 dark:text-zinc-100 placeholder:text-zinc-400"
        />

        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          aria-label="Send message to Gen"
          className="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-white font-semibold transition-colors shrink-0 shadow-xs"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
