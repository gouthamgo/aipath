import type { LessonContent } from '../types';
import { tokenManagement } from './token-management';
import { apiParameters } from './api-parameters';
import { errorHandlingApi } from './error-handling-api';
import { streamingBasics } from './streaming-basics';
import { projectAiAssistant } from './project-ai-assistant';

export const openaiApiLessons: Record<string, LessonContent> = {
  "token-management": tokenManagement,
  "api-parameters": apiParameters,
  "error-handling-api": errorHandlingApi,
  "streaming-basics": streamingBasics,
  "project-ai-assistant": projectAiAssistant,
};

export {
  tokenManagement,
  apiParameters,
  errorHandlingApi,
  streamingBasics,
  projectAiAssistant,
};
