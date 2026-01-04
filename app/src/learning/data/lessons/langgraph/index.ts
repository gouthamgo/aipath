import type { LessonContent } from '../types';
import { langgraphIntro } from './langgraph-intro';
import { nodesEdges } from './nodes-edges';
import { stateManagement } from './state-management';
import { conditionalLogic } from './conditional-logic';
import { projectWorkflowAgent } from './project-workflow-agent';

export const langgraphLessons: Record<string, LessonContent> = {
  "langgraph-intro": langgraphIntro,
  "nodes-edges": nodesEdges,
  "state-management": stateManagement,
  "conditional-logic": conditionalLogic,
  "project-workflow-agent": projectWorkflowAgent,
};

export {
  langgraphIntro,
  nodesEdges,
  stateManagement,
  conditionalLogic,
  projectWorkflowAgent,
};
