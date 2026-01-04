import type { LessonContent } from '../types';
import { variablesTypes } from './variables-types';
import { controlFlow } from './control-flow';
import { functions } from './functions';
import { classesObjects } from './classes-objects';
import { errorHandling } from './error-handling';
import { fileIO } from './file-io';
import { projectCLI } from './project-cli-tool';
import { openaiSetup } from './openai-setup';
import { chatCompletions } from './chat-completions';
import { modelSelection } from './model-selection';
import { promptingBasics } from './prompting-basics';
import { zeroFewShot } from './zero-few-shot';
import { langchainSetup } from './langchain-setup';

export const pythonEssentialsLessons: Record<string, LessonContent> = {
  "variables-types": variablesTypes,
  "control-flow": controlFlow,
  "functions": functions,
  "classes-objects": classesObjects,
  "error-handling": errorHandling,
  "file-io": fileIO,
  "project-cli-tool": projectCLI,
  "openai-setup": openaiSetup,
  "chat-completions": chatCompletions,
  "model-selection": modelSelection,
  "prompting-basics": promptingBasics,
  "zero-few-shot": zeroFewShot,
  "langchain-setup": langchainSetup,
};

export {
  variablesTypes,
  controlFlow,
  functions,
  classesObjects,
  errorHandling,
  fileIO,
  projectCLI,
  openaiSetup,
  chatCompletions,
  modelSelection,
  promptingBasics,
  zeroFewShot,
  langchainSetup,
};
