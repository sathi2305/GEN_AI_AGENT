export type ProjectStatus = 'Planning' | 'Development' | 'Testing' | 'Deployment' | 'Documentation' | 'Completed' | 'in_progress';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';
export type TaskCategory = 'Research' | 'AI/GenAI' | 'Coding' | 'Testing' | 'Deployment' | 'DevOps' | 'Documentation' | 'Docs' | 'Hackathon';
export type NotificationType = 'critical' | 'high' | 'medium' | 'low' | 'info';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';

export interface ArchitectureService {
  name: string;
  type: string;
  port: number;
  status: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  category: string;
  techStack: string[];
  progress: number;
  deadline: string;
  requirements: string[];
  architectureSummary: string;
  architectureTopology?: ArchitectureService[];
  repositoryUrl?: string;
  deployedUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  priority: TaskPriority;
  status: TaskStatus;
  category: TaskCategory;
  assignee: string;
  dueDate?: string;
  dependencies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface DocumentItem {
  id: string;
  projectId?: string;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  sizeBytes?: number;
  extractedText?: string;
  content?: string;
  chunksCount: number;
  chunks?: string[];
  tags: string[];
  uploadedAt: string;
}

export interface ResearchSource {
  id: string;
  projectId?: string;
  query: string;
  title: string;
  url: string;
  snippet: string;
  relevanceScore: number;
  source: string;
  timestamp: string;
  keyFacts: string[];
}

export interface MemoryItem {
  id: string;
  projectId?: string;
  category: 'decision' | 'architecture' | 'constraint' | 'preference' | 'requirement' | 'pattern';
  content: string;
  importance: 'high' | 'medium' | 'low';
  tags: string[];
  createdAt: string;
}

export interface Approval {
  id: string;
  agentRunId?: string;
  action: string;
  target: string;
  changesCount: number;
  details: string;
  status: ApprovalStatus;
  requester: string;
  decidedAt?: string;
  decisionNotes?: string;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  link?: string;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  eventType: 'agent_run' | 'tool_call' | 'approval' | 'task_update' | 'deployment' | 'memory_update';
  action?: string;
  entity: string;
  entityId: string;
  details: string;
  user: string;
  timestamp: string;
  metadata?: Record<string, unknown>;
}

export interface Hackathon {
  id: string;
  name: string;
  organizer: string;
  registrationDeadline: string;
  submissionDeadline: string;
  problemStatement: string;
  team: string[];
  judgingCriteria: string[];
  requiredDeliverables: string[];
  submissionStatus: 'Not Started' | 'In Progress' | 'Ready' | 'Submitted';
  projectId?: string;
}

export interface EmailItem {
  id: string;
  from?: string;
  sender?: string;
  subject: string;
  preview?: string;
  body: string;
  receivedAt: string;
  isRead: boolean;
  detectedDeadlines?: string[];
  extractedDeadline?: string;
  detectedActions?: string[];
  suggestedActions?: string[];
  hasTaskCreated?: boolean;
}

export interface GitHubRepo {
  name: string;
  fullName: string;
  currentBranch: string;
  branches: string[];
  lastCommit: {
    hash: string;
    message: string;
    author: string;
    time: string;
  };
  openPRs: number;
  stars: number;
}

export interface Deployment {
  id: string;
  projectId: string;
  platform: 'Vercel' | 'Render' | 'Railway' | 'Docker' | 'AWS';
  environment: 'production' | 'staging' | 'preview';
  status: 'Deployed' | 'Building' | 'Failed' | 'Pending Approval';
  url: string;
  deployedUrl?: string;
  commitHash: string;
  deployedAt: string;
  createdAt?: string;
  logs: string[];
}

export interface PPTSlide {
  slideNumber: number;
  title: string;
  bullets: string[];
  speakerNotes: string;
  demoCue?: string;
}

export interface PPTDeck {
  id: string;
  projectId: string;
  title: string;
  slides: PPTSlide[];
  demoScript: string;
  generatedAt: string;
}

export interface AgentStep {
  id: string;
  stepNumber: number;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'waiting_approval';
  title: string;
  details: string;
  tool?: string;
  durationMs?: number;
}

export interface AgentRun {
  id: string;
  conversationId: string;
  userPrompt: string;
  intent: string;
  status: 'planning' | 'running' | 'completed' | 'failed' | 'awaiting_approval';
  plan: string[];
  steps: AgentStep[];
  toolsUsed: string[];
  verification: string;
  nextActions: string[];
  resultText: string;
  tokenUsage: number;
  estimatedCost: number;
  latencyMs: number;
  thoughtProcess?: string;
  modelUsed?: string;
  pendingApproval?: Approval;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  attachedFiles?: string[];
  agentRun?: AgentRun;
  createdAt: string;
}

export interface DashboardStats {
  activeProjects: number;
  pendingTasks: number;
  completedTasks: number;
  agentSuccessRate: number;
  upcomingDeadlines: { title: string; date: string; daysLeft: number }[];
  activeDeployments?: number;
  pendingApprovals: number;
  unreadNotifications: number;
  recentToolsUsed?: number;
  activeSchedules?: number;
}

export type ScheduleInterval = 'daily' | 'weekly' | 'biweekly' | 'monthly' | 'custom_hours';

export type ScheduledMaintenanceType =
  | 'summarize_progress'
  | 'cleanup_notifications'
  | 'consolidate_memory'
  | 'audit_health'
  | 'custom';

export interface ScheduledTaskExecution {
  id: string;
  scheduledTaskId: string;
  taskTitle: string;
  executedAt: string;
  status: 'success' | 'failed' | 'running';
  summary: string;
  details?: string;
  itemsAffected?: number;
  durationMs: number;
  agentRunId?: string;
  manualTrigger?: boolean;
}

export interface ScheduledTask {
  id: string;
  title: string;
  description: string;
  taskType: ScheduledMaintenanceType;
  interval: ScheduleInterval;
  timeOfDay: string; // "HH:MM" e.g. "09:00"
  dayOfWeek?: number; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  customHoursInterval?: number;
  nextRunAt: string; // ISO 8601 string
  lastRunAt?: string;
  enabled: boolean;
  projectId?: string; // target specific project or 'all'
  requireApproval?: boolean;
  customPrompt?: string;
  executionsCount: number;
  lastExecutionStatus?: 'success' | 'failed' | 'running';
  lastExecutionSummary?: string;
  createdAt: string;
  updatedAt: string;
}
