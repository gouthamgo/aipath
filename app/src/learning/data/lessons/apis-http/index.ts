import type { LessonContent } from '../types';
import { httpBasics } from './http-basics';
import { requestsLibrary } from './requests-library';
import { jsonHandling } from './json-handling';
import { apiAuthentication } from './api-authentication';
import { projectApiClient } from './project-api-client';

export const apisHttpLessons: Record<string, LessonContent> = {
  "http-basics": httpBasics,
  "requests-library": requestsLibrary,
  "json-handling": jsonHandling,
  "api-authentication": apiAuthentication,
  "project-api-client": projectApiClient,
};

export {
  httpBasics,
  requestsLibrary,
  jsonHandling,
  apiAuthentication,
  projectApiClient,
};
