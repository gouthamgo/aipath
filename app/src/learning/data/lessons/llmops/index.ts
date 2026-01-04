import type { LessonContent } from '../types';
import { llmopsIntro } from './llmops-intro';
import { tracingObservability } from './tracing-observability';
import { evaluation } from './evaluation';
import { costOptimization } from './cost-optimization';
import { projectMonitoring } from './project-monitoring';

export const llmopsLessons: Record<string, LessonContent> = {
  "llmops-intro": llmopsIntro,
  "tracing-observability": tracingObservability,
  "evaluation": evaluation,
  "cost-optimization": costOptimization,
  "project-monitoring": projectMonitoring,
};

export {
  llmopsIntro,
  tracingObservability,
  evaluation,
  costOptimization,
  projectMonitoring,
};
