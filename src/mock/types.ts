export interface Agent {
  id: string;
  name: string;
  emoji: string;
  description: string;
  category: string;
  categoryColor: string;
  tools: Array<{ label: string; color: string }>;
  demo?: boolean;
  demoPath?: string;
}

export interface ConversationStep {
  id: string;
  type: 'user' | 'agent' | 'system';
  content: string;
  delay?: number;
}

export interface WorkflowNode {
  label: string;
  status: 'pending' | 'active' | 'done';
  icon: string;
  detail?: string;
  color?: string;
}

export interface DemoSession {
  id: string;
  agentId: string;
  title: string;
  steps: DemoStep[];
}

export interface DemoStep {
  id: number;
  conversation: ConversationEntry;
  workflow: WorkflowNode[];
}

export interface ConversationEntry {
  user?: string;
  agent?: string;
}

export interface CostRecord {
  id: string;
  user: string;
  department: string;
  agent: string;
  model: string;
  tokens: number;
  cost: number;
  time: string;
}

export interface ArchitectureLayer {
  name: string;
  nameEn: string;
  icon: string;
  color: string;
  items: Array<{ title: string; desc: string }>;
}
