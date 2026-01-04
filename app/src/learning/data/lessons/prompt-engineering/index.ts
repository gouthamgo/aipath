import type { LessonContent } from '../types';
import { chainOfThought } from './chain-of-thought';
import { systemPrompts } from './system-prompts';
import { rolePrompting } from './role-prompting';
import { structuredPrompts } from './structured-prompts';
import { promptChaining } from './prompt-chaining';
import { promptDebugging } from './prompt-debugging';
import { projectPromptLib } from './project-prompt-lib';

export const promptengineeringLessons: Record<string, LessonContent> = {
  "chain-of-thought": chainOfThought,
  "system-prompts": systemPrompts,
  "role-prompting": rolePrompting,
  "structured-prompts": structuredPrompts,
  "prompt-chaining": promptChaining,
  "prompt-debugging": promptDebugging,
  "project-prompt-lib": projectPromptLib,
};

export {
  chainOfThought,
  systemPrompts,
  rolePrompting,
  structuredPrompts,
  promptChaining,
  promptDebugging,
  projectPromptLib,
};
