import type { LessonContent } from '../types';
import { cachingStrategies } from './caching-strategies';
import { streamingResponses } from './streaming-responses';
import { fallbacksRetries } from './fallbacks-retries';
import { rateLimiting } from './rate-limiting';
import { projectProductionApp } from './project-production-app';

export const advancedPatternsLessons: Record<string, LessonContent> = {
  "caching-strategies": cachingStrategies,
  "streaming-responses": streamingResponses,
  "fallbacks-retries": fallbacksRetries,
  "rate-limiting": rateLimiting,
  "project-production-app": projectProductionApp,
};

export {
  cachingStrategies,
  streamingResponses,
  fallbacksRetries,
  rateLimiting,
  projectProductionApp,
};
