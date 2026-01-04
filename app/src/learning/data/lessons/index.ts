// Lesson Content Registry
// Centralized, optimized access to all lesson content
// Modular structure: each topic in its own directory for maintainability

export type { LessonContent } from './types';
import type { LessonContent } from './types';

// Phase 1: Python Foundations (modular)
import { pythonEssentialsLessons } from './python-essentials/index';
import { dataManipulationLessons } from './data-manipulation/index';
import { apisHttpLessons } from './apis-http/index';

// Phase 2: LLM Fundamentals (modular)
import { openaiApiLessons } from './openai-api/index';
import { promptengineeringLessons as promptEngineeringLessons } from './prompt-engineering/index';
import { langchainLessons } from './langchain/index';
import { structuredoutputsLessons as structuredOutputsLessons } from './structured-outputs/index';
import { vectordatabasesLessons as vectorDatabasesLessons } from './vector-databases/index';
import { ragapplicationsLessons as ragApplicationsLessons } from './rag-applications/index';

// Phase 3: AI Agents (modular)
import { agentsLessons } from './agents/index';
import { langgraphLessons } from './langgraph/index';
import { multiAgentLessons } from './multi-agent/index';

// Phase 4: Production AI (modular)
import { llmopsLessons } from './llmops/index';
import { deploymentLessons } from './deployment/index';
import { advancedPatternsLessons } from './advanced-patterns/index';

// Pre-computed lesson registry for O(1) lookups
const lessonRegistry: Record<string, LessonContent> = {
  // Phase 1: Python Foundations
  ...pythonEssentialsLessons,
  ...dataManipulationLessons,
  ...apisHttpLessons,
  // Phase 2: LLM Fundamentals
  ...openaiApiLessons,
  ...promptEngineeringLessons,
  ...langchainLessons,
  ...structuredOutputsLessons,
  ...vectorDatabasesLessons,
  ...ragApplicationsLessons,
  // Phase 3: AI Agents
  ...agentsLessons,
  ...langgraphLessons,
  ...multiAgentLessons,
  // Phase 4: Production AI
  ...llmopsLessons,
  ...deploymentLessons,
  ...advancedPatternsLessons,
};

// Memoized lesson lookup
let cachedSlugs: string[] | null = null;

export function getAllLessonContent(slug: string): LessonContent | null {
  return lessonRegistry[slug] ?? null;
}

export function getAllLessonSlugs(): string[] {
  if (!cachedSlugs) {
    cachedSlugs = Object.keys(lessonRegistry);
  }
  return cachedSlugs;
}

export function hasLesson(slug: string): boolean {
  return slug in lessonRegistry;
}

export function getLessonCount(): number {
  return Object.keys(lessonRegistry).length;
}

// Re-export individual lesson collections for direct access
export {
  pythonEssentialsLessons,
  dataManipulationLessons,
  apisHttpLessons,
  openaiApiLessons,
  promptEngineeringLessons,
  langchainLessons,
  structuredOutputsLessons,
  vectorDatabasesLessons,
  ragApplicationsLessons,
  agentsLessons,
  langgraphLessons,
  multiAgentLessons,
  llmopsLessons,
  deploymentLessons,
  advancedPatternsLessons,
};

// For backwards compatibility
export { pythonEssentialsLessons as baseLessons };
export { getAllLessonContent as getLessonContent };
export const allLessonContent = lessonRegistry;
