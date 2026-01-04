import type { LessonContent } from '../types';
import { whatAreAgents } from './what-are-agents';
import { reactPattern } from './react-pattern';
import { buildingTools } from './building-tools';
import { agentLoop } from './agent-loop';
import { agentMemory } from './agent-memory';
import { agentPlanning } from './agent-planning';
import { errorRecovery } from './error-recovery';
import { langchainAgents } from './langchain-agents';
import { projectResearchAgent } from './project-research-agent';

export const agentsLessons: Record<string, LessonContent> = {
  "what-are-agents": whatAreAgents,
  "react-pattern": reactPattern,
  "building-tools": buildingTools,
  "agent-loop": agentLoop,
  "agent-memory": agentMemory,
  "agent-planning": agentPlanning,
  "error-recovery": errorRecovery,
  "langchain-agents": langchainAgents,
  "project-research-agent": projectResearchAgent,
};

export {
  whatAreAgents,
  reactPattern,
  buildingTools,
  agentLoop,
  agentMemory,
  agentPlanning,
  errorRecovery,
  langchainAgents,
  projectResearchAgent,
};
