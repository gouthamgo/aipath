import type { LessonContent } from '../types';
import { structuredOutputsBasics } from './structured-outputs-basics';
import { pydanticModels } from './pydantic-models';
import { functionCalling } from './function-calling';
import { langchainStructured } from './langchain-structured';
import { outputValidation } from './output-validation';
import { projectDataExtractor } from './project-data-extractor';

export const structuredoutputsLessons: Record<string, LessonContent> = {
  "structured-outputs-basics": structuredOutputsBasics,
  "pydantic-models": pydanticModels,
  "function-calling": functionCalling,
  "langchain-structured": langchainStructured,
  "output-validation": outputValidation,
  "project-data-extractor": projectDataExtractor,
};

export {
  structuredOutputsBasics,
  pydanticModels,
  functionCalling,
  langchainStructured,
  outputValidation,
  projectDataExtractor,
};
