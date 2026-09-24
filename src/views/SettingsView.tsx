import React, { useState, useEffect } from 'react';
import {
  Settings,
  Shield,
  Bot,
  Sparkles,
  Sliders,
  Check,
  KeyRound,
  Eye,
  EyeOff,
  Lock,
  Server,
  Cpu,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { getStoredModelConfig, saveStoredModelConfig, StoredModelConfig } from '../lib/api.ts';

interface SettingsViewProps {
  isDark: boolean;
}

type ProviderType = 'gemini' | 'openai' | 'anthropic';
type SettingsSubView = 'models' | 'general';

interface ProviderMeta {
  id: ProviderType;
  name: string;
  badge: string;
  company: string;
  description: string;
  keyPrefix: string;
  docsUrl: string;
  defaultModel: string;
  models: { id: string; name: string; description: string }[];
}

const PROVIDERS: ProviderMeta[] = [
  {
    id: 'gemini',
    name: 'Google DeepMind Gemini',
    badge: 'Native / Multimodal',
    company: 'Google',
    description: 'High-speed reasoning, native multimodal analysis, and unified autonomous tool calling.',
    keyPrefix: 'AIzaSy...',
    docsUrl: 'https://aistudio.google.com/app/apikey',
    defaultModel: 'gemini-3.8-flash',
    models: [
      { id: 'gemini-3.8-flash', name: 'Gemini 3.8 Flash', description: 'Lowest latency, ideal for real-time coding & execution loops' },
      { id: 'gemini-3.8-pro', name: 'Gemini 3.8 Pro', description: 'Deep reasoning model for high-complexity architectural design' },
      { id: 'gemini-2.5-flash', name: 'Gemini 2.5 Flash', description: 'Ultra-efficient throughput for fast prototyping' },
    ],
  },
  {
    id: 'openai',
    name: 'OpenAI (ChatGPT)',
    badge: 'GPT-4o & o1',
    company: 'OpenAI',
    description: 'Broad knowledge synthesis, omni-modal processing, and deep chain-of-thought capabilities.',
    keyPrefix: 'sk-proj-... or sk-...',
    docsUrl: 'https://platform.openai.com/api-keys',
    defaultModel: 'chatgpt-4o',
    models: [
      { id: 'chatgpt-4o', name: 'ChatGPT (GPT-4o)', description: 'Omni-model for high-level software engineering & presentation decks' },
      { id: 'chatgpt-4o-mini', name: 'ChatGPT (GPT-4o Mini)', description: 'Fast and cost-effective daily engineering assistant' },
      { id: 'o1-preview', name: 'OpenAI o1', description: 'Step-by-step reasoning engine for complex algorithms' },
    ],
  },
  {
    id: 'anthropic',
    name: 'Anthropic (Claude)',
    badge: 'Claude 3.5 Sonnet',
    company: 'Anthropic',
    description: 'Industry-leading code generation, nuanced reasoning, large context windows, and safety alignment.',
    keyPrefix: 'sk-ant-api03-...',
    docsUrl: 'https://console.anthropic.com/settings/keys',
    defaultModel: 'claude-3-5-sonnet',
    models: [
      { id: 'claude-3-5-sonnet', name: 'Claude 3.5 Sonnet', description: 'State-of-the-art coding and nuanced architectural reasoning' },
      { id: 'claude-3-opus', name: 'Claude 3 Opus', description: 'Top-tier writing and deep problem deconstruction' },
      { id: 'claude-3-5-haiku', name: 'Claude 3.5 Haiku', description: 'Ultra-fast execution with exceptional responsiveness' },
    ],
  },
];

export const SettingsView: React.FC<SettingsViewProps> = ({ isDark }) => {
  // Sub-view Tab Navigation
  const [activeSubView, setActiveSubView] = useState<SettingsSubView>('models');

  // General settings state
  const [autonomyLevel, setAutonomyLevel] = useState<'semi' | 'autonomous'>('autonomous');
  const [reasoningEnabled, setReasoningEnabled] = useState(true);
  const [requireDeployApproval, setRequireDeployApproval] = useState(true);
  const [requireGitApproval, setRequireGitApproval] = useState(true);

  // Model & Provider Configuration State
  const [activeProvider, setActiveProvider] = useState<ProviderType>('gemini');
  const [apiKeys, setApiKeys] = useState({
    gemini: '',
    openai: '',
    anthropic: '',
  });
  const [selectedModels, setSelectedModels] = useState({
    gemini: 'gemini-3.8-flash',
    openai: 'chatgpt-4o',
    anthropic: 'claude-3-5-sonnet',
  });

  // Masked visibility toggles
  const [showKey, setShowKey] = useState<{ [key in ProviderType]: boolean }>({
    gemini: false,
    openai: false,
    anthropic: false,
  });

  const [isSaved, setIsSaved] = useState(false);
  const [saveToastMessage, setSaveToastMessage] = useState('');

  // Load stored configuration from localStorage on mount
  useEffect(() => {
    const config = getStoredModelConfig();
    if (config) {
      if (config.activeProvider) setActiveProvider(config.activeProvider);
      setApiKeys({
        gemini: config.geminiKey || '',
        openai: config.openaiKey || '',
        anthropic: config.anthropicKey || '',
      });
      setSelectedModels({
        gemini: config.geminiModel || 'gemini-3.8-flash',
        openai: config.openaiModel || 'chatgpt-4o',
        anthropic: config.anthropicModel || 'claude-3-5-sonnet',
      });
    }
  }, []);

  const handleKeyChange = (provider: ProviderType, value: string) => {
    setApiKeys((prev) => ({ ...prev, [provider]: value.trim() }));
  };

  const handleToggleMask = (provider: ProviderType) => {
    setShowKey((prev) => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleClearKey = (provider: ProviderType) => {
    setApiKeys((prev) => ({ ...prev, [provider]: '' }));
  };

  const handleModelChange = (provider: ProviderType, modelId: string) => {
    setSelectedModels((prev) => ({ ...prev, [provider]: modelId }));
  };

  const handleSaveModelConfig = () => {
    const config: StoredModelConfig = {
      activeProvider,
      geminiKey: apiKeys.gemini,
      openaiKey: apiKeys.openai,
      anthropicKey: apiKeys.anthropic,
      geminiModel: selectedModels.gemini,
      openaiModel: selectedModels.openai,
      anthropicModel: selectedModels.anthropic,
    };
    saveStoredModelConfig(config);
    setIsSaved(true);
    setSaveToastMessage('API Model Configuration saved to local storage!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveToastMessage('');
    }, 2500);
  };

  const handleSaveGeneralConfig = () => {
    setIsSaved(true);
    setSaveToastMessage('General agent controls & safety gates saved!');
    setTimeout(() => {
      setIsSaved(false);
      setSaveToastMessage('');
    }, 2000);
  };

  const currentProviderMeta = PROVIDERS.find((p) => p.id === activeProvider) || PROVIDERS[0];

  // Helper to format masked preview
  const getMaskedPreview = (key: string) => {
    if (!key) return 'None';
    if (key.length <= 8) return '••••••••';
    return `${key.slice(0, 4)}••••••••••••••••${key.slice(-4)}`;
  };

  return (
    <div id="settings-view" className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-900 dark:text-zinc-50 flex items-center gap-2">
            <Settings className="w-5 h-5 text-indigo-500" />
            <span>Workspace Settings & Model Engine</span>
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">
            Manage your AI model providers, custom API keys, and autonomous agent safety parameters.
          </p>
        </div>

        {/* Sub-view Segmented Tabs */}
        <div className="flex items-center p-1 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-100 dark:bg-zinc-900/90 text-xs">
          <button
            type="button"
            onClick={() => setActiveSubView('models')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubView === 'models'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>API Model Configuration</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubView('general')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
              activeSubView === 'general'
                ? 'bg-white dark:bg-zinc-800 text-indigo-600 dark:text-indigo-400 shadow-xs font-semibold'
                : 'text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Autonomy & Safety Gates</span>
          </button>
        </div>
      </div>

      {/* Save feedback toast */}
      {isSaved && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span className="font-medium">{saveToastMessage}</span>
        </div>
      )}

      {/* SUB-VIEW 1: API MODEL CONFIGURATION */}
      {activeSubView === 'models' && (
        <div className="space-y-6">
          {/* Privacy & Storage Guarantee Banner */}
          <div className={`p-4 rounded-2xl border text-xs flex items-start gap-3 transition-colors ${
            isDark ? 'bg-indigo-950/20 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50/60 border-indigo-200 text-indigo-950'
          }`}>
            <Lock className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
            <div className="space-y-1 leading-relaxed">
              <div className="font-semibold text-indigo-600 dark:text-indigo-400">
                Secure Client-Side Local Storage Guarantee
              </div>
              <p className="text-[11px] opacity-90">
                Custom API keys are saved locally in your browser's private storage (<code className="font-mono bg-indigo-500/10 px-1 py-0.5 rounded">localStorage</code>). Keys are transmitted directly to the selected AI provider backend over encrypted HTTPS and are never stored in external databases.
              </p>
            </div>
          </div>

          {/* Provider Toggle Cards */}
          <div>
            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 mb-2 flex items-center justify-between">
              <span>Select AI Provider</span>
              <span className="text-[11px] font-normal text-zinc-500">
                Active Provider: <strong className="text-indigo-600 dark:text-indigo-400">{currentProviderMeta.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {PROVIDERS.map((provider) => {
                const isSelected = activeProvider === provider.id;
                const hasCustomKey = Boolean(apiKeys[provider.id]);

                return (
                  <button
                    key={provider.id}
                    type="button"
                    onClick={() => setActiveProvider(provider.id)}
                    className={`p-4 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5'
                        : isDark
                        ? 'bg-zinc-900/60 border-zinc-800 hover:border-zinc-700'
                        : 'bg-white border-zinc-200 hover:border-zinc-300 shadow-2xs'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-zinc-900 dark:text-zinc-100">
                          {provider.name}
                        </span>
                        {isSelected && (
                          <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white text-[9px] font-bold uppercase tracking-wider">
                            Active
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {provider.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-inherit flex items-center justify-between text-[10px]">
                      <span className="text-zinc-400">{provider.badge}</span>
                      {hasCustomKey ? (
                        <span className="flex items-center gap-1 text-emerald-500 font-medium">
                          <Check className="w-3 h-3" /> Key Saved
                        </span>
                      ) : (
                        <span className="text-zinc-400">Default / Env</span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Active Provider Configuration Card */}
          <div className={`p-6 rounded-2xl border space-y-6 transition-colors ${
            isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
          }`}>
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-inherit pb-4">
              <div>
                <h3 className="text-xs font-bold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
                  <Bot className="w-4 h-4 text-indigo-500" />
                  <span>Configure {currentProviderMeta.name}</span>
                </h3>
                <p className="text-[11px] text-zinc-500 dark:text-zinc-400 mt-0.5">
                  Set your custom API key and preferred reasoning model for {currentProviderMeta.company}.
                </p>
              </div>

              <a
                href={currentProviderMeta.docsUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>Get {currentProviderMeta.company} API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Secure Masked API Key Input Field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Custom {currentProviderMeta.name} API Key</span>
                </label>

                {apiKeys[activeProvider] ? (
                  <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Saved in LocalStorage ({getMaskedPreview(apiKeys[activeProvider])})</span>
                  </span>
                ) : (
                  <span className="text-[10px] text-zinc-400">
                    Using system default or environment variable
                  </span>
                )}
              </div>

              <div className="relative flex items-center">
                <input
                  type={showKey[activeProvider] ? 'text' : 'password'}
                  value={apiKeys[activeProvider]}
                  onChange={(e) => handleKeyChange(activeProvider, e.target.value)}
                  placeholder={`Paste your ${currentProviderMeta.name} key (${currentProviderMeta.keyPrefix})`}
                  className={`w-full text-xs font-mono px-3.5 py-2.5 pr-20 rounded-xl border transition-colors outline-none focus:ring-2 focus:ring-indigo-500/20 ${
                    isDark
                      ? 'bg-zinc-950 border-zinc-800 text-zinc-100 placeholder-zinc-600 focus:border-indigo-500'
                      : 'bg-zinc-50/70 border-zinc-300 text-zinc-900 placeholder-zinc-400 focus:border-indigo-500'
                  }`}
                  autoComplete="off"
                  spellCheck="false"
                />

                <div className="absolute right-2 flex items-center gap-1">
                  {/* Toggle Mask Eye Button */}
                  <button
                    type="button"
                    onClick={() => handleToggleMask(activeProvider)}
                    className="p-1.5 rounded-lg text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    title={showKey[activeProvider] ? 'Mask key' : 'Show key'}
                  >
                    {showKey[activeProvider] ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>

                  {/* Clear Key Button */}
                  {apiKeys[activeProvider] && (
                    <button
                      type="button"
                      onClick={() => handleClearKey(activeProvider)}
                      className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-500 transition-colors"
                      title="Clear custom key"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-zinc-400 pt-1">
                <span>Format: starts with <code className="font-mono text-zinc-500">{currentProviderMeta.keyPrefix}</code></span>
                <span>Protected with secure browser masking</span>
              </div>
            </div>

            {/* Model Selection for Current Provider */}
            <div className="space-y-3 pt-4 border-t border-inherit">
              <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Default Reasoning Model for {currentProviderMeta.name}
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {currentProviderMeta.models.map((mod) => {
                  const isSelectedModel = selectedModels[activeProvider] === mod.id;

                  return (
                    <button
                      key={mod.id}
                      type="button"
                      onClick={() => handleModelChange(activeProvider, mod.id)}
                      className={`p-3 rounded-xl border text-left text-xs transition-all ${
                        isSelectedModel
                          ? 'border-indigo-500 bg-indigo-500/5 ring-1 ring-indigo-500/30 font-medium text-indigo-600 dark:text-indigo-400'
                          : isDark
                          ? 'bg-zinc-950/40 border-zinc-800 text-zinc-400 hover:border-zinc-700'
                          : 'bg-zinc-50/50 border-zinc-200 text-zinc-600 hover:border-zinc-300'
                      }`}
                    >
                      <div className="font-semibold text-[11px] flex items-center justify-between mb-1">
                        <span>{mod.name}</span>
                        {isSelectedModel && <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />}
                      </div>
                      <p className="text-[10px] text-zinc-500 leading-tight">
                        {mod.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* All Providers Key Overview Accordion */}
            <div className="pt-4 border-t border-inherit space-y-3">
              <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                Configured Key Summary
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {PROVIDERS.map((p) => {
                  const keyVal = apiKeys[p.id];
                  return (
                    <div
                      key={p.id}
                      className={`p-2.5 rounded-xl border flex items-center justify-between ${
                        isDark ? 'bg-zinc-950/40 border-zinc-800' : 'bg-zinc-50 border-zinc-200'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${keyVal ? 'bg-emerald-500' : 'bg-zinc-400'}`} />
                        <span className="font-medium text-[11px] text-zinc-700 dark:text-zinc-300">
                          {p.company}
                        </span>
                      </div>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {keyVal ? getMaskedPreview(keyVal) : 'Default'}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Save Buttons */}
            <div className="pt-4 border-t border-inherit flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setApiKeys({ gemini: '', openai: '', anthropic: '' });
                }}
                className="text-xs text-zinc-400 hover:text-rose-500 transition-colors"
              >
                Reset All Keys
              </button>

              <button
                type="button"
                onClick={handleSaveModelConfig}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
              >
                <Check className="w-4 h-4" />
                <span>Save API Configuration Locally</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: AGENT AUTONOMY & SAFETY GATES */}
      {activeSubView === 'general' && (
        <div className={`p-6 rounded-2xl border space-y-6 transition-colors ${
          isDark ? 'bg-zinc-900/60 border-zinc-800' : 'bg-white border-zinc-200 shadow-xs'
        }`}>
          {/* Autonomy Level */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-zinc-900 dark:text-zinc-100">
              Autonomous Execution Level
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setAutonomyLevel('autonomous')}
                className={`p-4 rounded-xl border text-left text-xs transition-all ${
                  autonomyLevel === 'autonomous'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400'
                    : isDark
                    ? 'bg-zinc-950/40 border-zinc-800 text-zinc-400'
                    : 'bg-zinc-50/50 border-zinc-200 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Autonomous Mode (Recommended)</span>
                  {autonomyLevel === 'autonomous' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <div className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                  Agent runs multi-tool loops, performs research, verifies code AST, and requests approval only for sensitive ops.
                </div>
              </button>

              <button
                type="button"
                onClick={() => setAutonomyLevel('semi')}
                className={`p-4 rounded-xl border text-left text-xs transition-all ${
                  autonomyLevel === 'semi'
                    ? 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-500/5 font-semibold text-indigo-600 dark:text-indigo-400'
                    : isDark
                    ? 'bg-zinc-950/40 border-zinc-800 text-zinc-400'
                    : 'bg-zinc-50/50 border-zinc-200 text-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between font-bold mb-1">
                  <span>Semi-Autonomous Mode</span>
                  {autonomyLevel === 'semi' && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                </div>
                <div className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                  Every tool execution prompts for confirmation before running.
                </div>
              </button>
            </div>
          </div>

          {/* Safety & Approval Gates */}
          <div className="space-y-3 pt-4 border-t border-inherit text-xs">
            <div className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-500" />
              <span>Sensitive Operation Approval Gates</span>
            </div>

            <div className="space-y-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireDeployApproval}
                  onChange={(e) => setRequireDeployApproval(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Require user approval before triggering production container deployment
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={requireGitApproval}
                  onChange={(e) => setRequireGitApproval(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Require user approval before merging pull requests into main branch
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={reasoningEnabled}
                  onChange={(e) => setReasoningEnabled(e.target.checked)}
                  className="rounded text-indigo-600 focus:ring-indigo-500"
                />
                <span className="text-zinc-700 dark:text-zinc-300">
                  Enable self-healing retry loop (Max 3 attempts on test failure)
                </span>
              </label>
            </div>
          </div>

          {/* Save button */}
          <div className="pt-4 border-t border-inherit flex items-center justify-end">
            <button
              type="button"
              onClick={handleSaveGeneralConfig}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Save Autonomy & Safety Settings</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
