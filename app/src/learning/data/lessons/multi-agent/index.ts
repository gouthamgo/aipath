import type { LessonContent } from '../types';
import { multiAgentIntro } from './multi-agent-intro';
import { crewaiBasics } from './crewai-basics';
import { agentRoles } from './agent-roles';
import { taskDelegation } from './task-delegation';
import { projectAgentTeam } from './project-agent-team';

export const multiAgentLessons: Record<string, LessonContent> = {
  "multi-agent-intro": multiAgentIntro,
  "crewai-basics": crewaiBasics,
  "agent-roles": agentRoles,
  "task-delegation": taskDelegation,
  "project-agent-team": projectAgentTeam,
};

export {
  multiAgentIntro,
  crewaiBasics,
  agentRoles,
  taskDelegation,
  projectAgentTeam,
};
