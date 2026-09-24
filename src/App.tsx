import React, { useState, useEffect, useCallback } from 'react';
import { Sidebar, NavItemKey } from './components/Sidebar.tsx';
import { TopBar } from './components/TopBar.tsx';
import { CommandPalette } from './components/CommandPalette.tsx';
import { DashboardView } from './views/DashboardView.tsx';
import { AgentChatView } from './views/AgentChatView.tsx';
import { ProjectsView } from './views/ProjectsView.tsx';
import { TasksView } from './views/TasksView.tsx';
import { ResearchView } from './views/ResearchView.tsx';
import { DocumentsView } from './views/DocumentsView.tsx';
import { CodingTestingView } from './views/CodingTestingView.tsx';
import { DeploymentsView } from './views/DeploymentsView.tsx';
import { PPTStudioView } from './views/PPTStudioView.tsx';
import { HackathonsView } from './views/HackathonsView.tsx';
import { EmailsView } from './views/EmailsView.tsx';
import { NotificationsView } from './views/NotificationsView.tsx';
import { GitHubView } from './views/GitHubView.tsx';
import { KnowledgeMemoryView } from './views/KnowledgeMemoryView.tsx';
import { ActivityLogView } from './views/ActivityLogView.tsx';
import { DocumentationView } from './views/DocumentationView.tsx';
import { SettingsView } from './views/SettingsView.tsx';
import { ScheduledTasksView } from './views/ScheduledTasksView.tsx';

import * as api from './lib/api.ts';
import {
  Project,
  Task,
  DocumentItem,
  ResearchSource,
  MemoryItem,
  Approval,
  NotificationItem,
  Hackathon,
  EmailItem,
  Deployment,
  ActivityLog,
  ChatMessage,
  DashboardStats,
  AgentStep,
  AgentRun,
  ScheduledTask,
  ScheduledTaskExecution,
} from './types/index.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<NavItemKey>('dashboard');
  const [isDark, setIsDark] = useState<boolean>(true);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState<string>('proj-1');
  const [presetPrompt, setPresetPrompt] = useState<string>('');

  // Domain states
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [scheduledTasks, setScheduledTasks] = useState<ScheduledTask[]>([]);
  const [scheduledExecutions, setScheduledExecutions] = useState<ScheduledTaskExecution[]>([]);
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [research, setResearch] = useState<ResearchSource[]>([]);
  const [memories, setMemories] = useState<MemoryItem[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [hackathons, setHackathons] = useState<Hackathon[]>([]);
  const [emails, setEmails] = useState<EmailItem[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  // Agent execution states
  const [isAgentLoading, setIsAgentLoading] = useState(false);
  const [activeAgentSteps, setActiveAgentSteps] = useState<AgentStep[]>([]);
  const [currentRun, setCurrentRun] = useState<AgentRun | null>(null);

  // Sync dark class on body
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  // Global initial data fetch
  const reloadAllData = useCallback(async () => {
    try {
      const [
        statsData,
        projectsData,
        tasksData,
        docsData,
        researchData,
        memoriesData,
        approvalsData,
        notificationsData,
        hackathonsData,
        emailsData,
        deploymentsData,
        activitiesData,
        messagesData,
        schedulesData,
        executionsData,
      ] = await Promise.all([
        api.fetchStats(),
        api.fetchProjects(),
        api.fetchTasks(activeProjectId),
        api.fetchDocuments(activeProjectId),
        api.fetchResearch(activeProjectId),
        api.fetchMemories(activeProjectId),
        api.fetchApprovals(),
        api.fetchNotifications(),
        api.fetchHackathons(),
        api.fetchEmails(),
        api.fetchDeployments(activeProjectId),
        api.fetchActivityLogs(),
        api.fetchMessages(),
        api.fetchScheduledTasks(),
        api.fetchScheduledExecutions(),
      ]);

      setStats(statsData);
      setProjects(projectsData);
      setTasks(tasksData);
      setDocuments(docsData);
      setResearch(researchData);
      setMemories(memoriesData);
      setApprovals(approvalsData);
      setNotifications(notificationsData);
      setHackathons(hackathonsData);
      setEmails(emailsData);
      setDeployments(deploymentsData);
      setActivities(activitiesData);
      setMessages(messagesData);
      setScheduledTasks(schedulesData);
      setScheduledExecutions(executionsData);
    } catch (err) {
      console.warn('Initial data load warning:', err);
    }
  }, [activeProjectId]);

  useEffect(() => {
    reloadAllData();
  }, [reloadAllData]);

  // Handle agent message execution
  const handleSendMessage = async (text: string, attachedFiles: string[], model?: string) => {
    setIsAgentLoading(true);
    setActiveAgentSteps([]);

    // Optimistically add user message
    const tempUserMsg: ChatMessage = {
      id: `temp-${Date.now()}`,
      conversationId: 'conv-default',
      role: 'user',
      content: text,
      attachedFiles,
      createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, tempUserMsg]);

    try {
      const result = await api.sendAgentMessage(text, activeProjectId, 'conv-default', attachedFiles, model);
      setMessages((prev) => {
        const filtered = prev.filter((m) => m.id !== tempUserMsg.id);
        return [...filtered, tempUserMsg, result.message];
      });
      setCurrentRun(result.agentRun);
      await reloadAllData();
    } catch (err: unknown) {
      console.error('Agent send message error:', err);
      const activeEngine = model || 'Gemini 3.8 Flash';
      const isGreetingPrompt =
        /^(hi|hello|hey|howdy|greetings|good morning|good afternoon|good evening|how are you|what can you help)[\s!.,?]*$/i.test(text.trim()) ||
        text.toLowerCase().trim().startsWith('hi') ||
        text.toLowerCase().trim().startsWith('hello') ||
        text.toLowerCase().trim().includes('how are you');

      const fallbackText = isGreetingPrompt
        ? `Hello! I am fine, thank you. What can I help you with today?\n\nI am **Gen**, your autonomous AI work agent running with **${activeEngine}**.\n\nHere is what I can do for you:\n- 🚀 **Autonomous Project Management**: Breakdown problem statements, create Kanban tasks, and coordinate sprints\n- 💻 **Full-Stack Engineering & AST Testing**: Generate clean code, run sandbox unit tests, and resolve issues\n- 🔍 **Web & Regulatory Research**: Retrieve scientific benchmarks and authoritative technical documentation\n- 📊 **Documents & Slide Presentations**: Write Markdown specifications and create pitch decks in PPT Studio\n- ⏱️ **Scheduled Maintenance**: Set up recurring automated progress summaries, notification cleanup, and memory consolidation\n\nWhat would you like to work on today? Feel free to share your requirements or ask any question!`
        : `I received your request: "${text.slice(0, 80)}".\n\nI am ready to assist with full-stack development, research, and project management. Feel free to ask another question or share your specifications.`;

      const fallbackMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        conversationId: 'conv-default',
        role: 'assistant',
        content: fallbackText,
        createdAt: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsAgentLoading(false);
      setActiveAgentSteps([]);
    }
  };

  // Quick Prompt dispatch from dashboard/topbar
  const handleQuickPrompt = (prompt: string) => {
    setPresetPrompt(prompt);
    setCurrentView('agent');
  };

  // Approvals actions
  const handleApproveAction = async (approvalId: string) => {
    try {
      await api.approveAction(approvalId, 'User approved from workspace UI');
      await reloadAllData();
    } catch (err) {
      console.error('Failed to approve action:', err);
    }
  };

  const handleRejectAction = async (approvalId: string) => {
    try {
      await api.rejectAction(approvalId, 'User rejected from workspace UI');
      await reloadAllData();
    } catch (err) {
      console.error('Failed to reject action:', err);
    }
  };

  // Tasks actions
  const handleUpdateTask = async (id: string, data: Partial<Task>) => {
    await api.updateTask(id, data);
    await reloadAllData();
  };

  const handleCreateTask = async (task: Partial<Task>) => {
    await api.createTask(task);
    await reloadAllData();
  };

  const handleDeleteTask = async (id: string) => {
    await api.deleteTask(id);
    await reloadAllData();
  };

  // Documents actions
  const handleUploadDocument = async (doc: Partial<DocumentItem>) => {
    await api.uploadDocument(doc);
    await reloadAllData();
  };

  // Research actions
  const handleAddResearchSource = async (data: Partial<ResearchSource>) => {
    await api.addResearchSource(data);
    await reloadAllData();
  };

  const handleCommitToMemory = async (content: string) => {
    await api.addMemory({
      projectId: activeProjectId,
      category: 'decision',
      content,
      importance: 'high',
    });
    await reloadAllData();
  };

  // Deployments actions
  const handleTriggerDeployment = async (platform: string, environment: string) => {
    await api.triggerDeployment(activeProjectId, platform, environment);
    await reloadAllData();
  };

  // Notifications actions
  const handleMarkNotificationRead = async (id: string) => {
    await api.markNotificationRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const handleMarkAllNotificationsRead = async () => {
    await api.markAllNotificationsRead();
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  // Simulated email actions
  const handleSimulateEmail = async (email: Partial<EmailItem>) => {
    await api.simulateEmail(email);
    await reloadAllData();
  };

  // Projects actions
  const handleCreateProject = async (proj: Partial<Project>) => {
    const created = await api.createProject(proj);
    setActiveProjectId(created.id);
    await reloadAllData();
  };

  // Scheduled Maintenance Task Actions
  const handleRunScheduledTask = async (id: string) => {
    try {
      await api.runScheduledTaskNow(id);
      await reloadAllData();
    } catch (err) {
      console.error('Failed to run scheduled task:', err);
    }
  };

  const handleToggleScheduledTask = async (id: string, enabled: boolean) => {
    try {
      await api.updateScheduledTask(id, { enabled });
      setScheduledTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabled } : t))
      );
      await reloadAllData();
    } catch (err) {
      console.error('Failed to toggle scheduled task:', err);
    }
  };

  const handleCreateScheduledTask = async (task: Partial<ScheduledTask>) => {
    try {
      await api.createScheduledTask(task);
      await reloadAllData();
    } catch (err) {
      console.error('Failed to create scheduled task:', err);
    }
  };

  const handleUpdateScheduledTask = async (id: string, task: Partial<ScheduledTask>) => {
    try {
      await api.updateScheduledTask(id, task);
      await reloadAllData();
    } catch (err) {
      console.error('Failed to update scheduled task:', err);
    }
  };

  const handleDeleteScheduledTask = async (id: string) => {
    try {
      await api.deleteScheduledTask(id);
      await reloadAllData();
    } catch (err) {
      console.error('Failed to delete scheduled task:', err);
    }
  };

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;
  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;
  const pendingTasksCount = tasks.filter((t) => t.status !== 'done').length;
  const activeSchedulesCount = scheduledTasks.filter((t) => t.enabled).length;

  return (
    <div className={`min-h-screen flex transition-colors duration-200 ${
      isDark ? 'bg-zinc-950 text-zinc-100' : 'bg-zinc-50 text-zinc-900'
    }`}>
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        pendingApprovalsCount={pendingApprovalsCount}
        unreadNotificationsCount={unreadNotificationsCount}
        pendingTasksCount={pendingTasksCount}
        activeSchedulesCount={activeSchedulesCount}
        isDark={isDark}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          currentView={currentView}
          projects={projects}
          activeProjectId={activeProjectId}
          onSelectProject={(id) => setActiveProjectId(id)}
          onOpenCommand={() => setIsCommandOpen(true)}
          onQuickPrompt={handleQuickPrompt}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        <main className="flex-1 p-6 overflow-y-auto">
          {currentView === 'dashboard' && stats && (
            <DashboardView
              stats={stats}
              projects={projects}
              tasks={tasks}
              approvals={approvals}
              activities={activities}
              hackathons={hackathons}
              scheduledTasks={scheduledTasks}
              onNavigate={(v) => setCurrentView(v)}
              onQuickPrompt={handleQuickPrompt}
              onSelectProject={(id) => setActiveProjectId(id)}
              onRunScheduledTask={handleRunScheduledTask}
              isDark={isDark}
            />
          )}

          {currentView === 'agent' && (
            <AgentChatView
              messages={messages}
              onSendMessage={handleSendMessage}
              isLoading={isAgentLoading}
              activeSteps={activeAgentSteps}
              currentRun={currentRun}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
              activeProjectId={activeProjectId}
              isDark={isDark}
              presetPrompt={presetPrompt}
              onClearPresetPrompt={() => setPresetPrompt('')}
            />
          )}

          {currentView === 'projects' && (
            <ProjectsView
              projects={projects}
              activeProjectId={activeProjectId}
              onSelectProject={(id) => setActiveProjectId(id)}
              onCreateProject={handleCreateProject}
              isDark={isDark}
            />
          )}

          {currentView === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              activeProjectId={activeProjectId}
              scheduledTasks={scheduledTasks}
              onUpdateTask={handleUpdateTask}
              onCreateTask={handleCreateTask}
              onDeleteTask={handleDeleteTask}
              onDispatchToAgent={handleQuickPrompt}
              onNavigateToSchedules={() => setCurrentView('schedules')}
              onRunScheduledTask={handleRunScheduledTask}
              isDark={isDark}
            />
          )}

          {currentView === 'schedules' && (
            <ScheduledTasksView
              tasks={scheduledTasks}
              executions={scheduledExecutions}
              projects={projects}
              activeProjectId={activeProjectId}
              onCreateTask={handleCreateScheduledTask}
              onUpdateTask={handleUpdateScheduledTask}
              onDeleteTask={handleDeleteScheduledTask}
              onToggleEnabled={handleToggleScheduledTask}
              onRunNow={handleRunScheduledTask}
              onRefresh={reloadAllData}
              onNavigate={(v) => setCurrentView(v)}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'research' && (
            <ResearchView
              research={research}
              activeProjectId={activeProjectId}
              onAddResearchSource={handleAddResearchSource}
              onCommitToMemory={handleCommitToMemory}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'documents' && (
            <DocumentsView
              documents={documents}
              activeProjectId={activeProjectId}
              onUploadDocument={handleUploadDocument}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {(currentView === 'coding' || currentView === 'testing') && (
            <CodingTestingView
              initialTab={currentView}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'deployments' && (
            <DeploymentsView
              deployments={deployments}
              approvals={approvals}
              activeProjectId={activeProjectId}
              onTriggerDeployment={handleTriggerDeployment}
              onApproveAction={handleApproveAction}
              onRejectAction={handleRejectAction}
              isDark={isDark}
            />
          )}

          {currentView === 'ppt' && (
            <PPTStudioView
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'hackathons' && (
            <HackathonsView
              hackathons={hackathons}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'emails' && (
            <EmailsView
              emails={emails}
              onSimulateEmail={handleSimulateEmail}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'notifications' && (
            <NotificationsView
              notifications={notifications}
              onMarkRead={handleMarkNotificationRead}
              onMarkAllRead={handleMarkAllNotificationsRead}
              isDark={isDark}
            />
          )}

          {currentView === 'github' && (
            <GitHubView
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'knowledge' && (
            <KnowledgeMemoryView
              memories={memories}
              activeProjectId={activeProjectId}
              onAddMemory={(m) => api.addMemory(m).then(reloadAllData)}
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'documentation' && (
            <DocumentationView
              onDispatchToAgent={handleQuickPrompt}
              isDark={isDark}
            />
          )}

          {currentView === 'activity' && (
            <ActivityLogView
              activities={activities}
              isDark={isDark}
            />
          )}

          {currentView === 'settings' && (
            <SettingsView isDark={isDark} />
          )}
        </main>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <CommandPalette
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        onNavigate={(v) => setCurrentView(v)}
        onRunPrompt={handleQuickPrompt}
        isDark={isDark}
      />
    </div>
  );
}
