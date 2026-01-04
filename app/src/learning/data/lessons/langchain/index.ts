import type { LessonContent } from '../types';
import { langchainSetup } from './langchain-setup';
import { llmModels } from './llm-models';
import { promptTemplates } from './prompt-templates';
import { outputParsers } from './output-parsers';
import { lcelIntro } from './lcel-intro';
import { chains } from './chains';
import { runnables } from './runnables';
import { memory } from './memory';
import { callbacks } from './callbacks';
import { projectChatbot } from './project-chatbot';

export const langchainLessons: Record<string, LessonContent> = {
  "langchain-setup": langchainSetup,
  "llm-models": llmModels,
  "prompt-templates": promptTemplates,
  "output-parsers": outputParsers,
  "lcel-intro": lcelIntro,
  "chains": chains,
  "runnables": runnables,
  "memory": memory,
  "callbacks": callbacks,
  "project-chatbot": projectChatbot,
};

export {
  langchainSetup,
  llmModels,
  promptTemplates,
  outputParsers,
  lcelIntro,
  chains,
  runnables,
  memory,
  callbacks,
  projectChatbot,
};
