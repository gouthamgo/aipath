import type { LessonContent } from '../types';
import { apiDesign } from './api-design';
import { fastapiBasics } from './fastapi-basics';
import { dockerContainerization } from './docker-containerization';
import { cloudDeployment } from './cloud-deployment';
import { projectDeployAI } from './project-deploy-ai';

export const deploymentLessons: Record<string, LessonContent> = {
  "api-design": apiDesign,
  "fastapi-basics": fastapiBasics,
  "docker-containerization": dockerContainerization,
  "cloud-deployment": cloudDeployment,
  "project-deploy-ai": projectDeployAI,
};

export {
  apiDesign,
  fastapiBasics,
  dockerContainerization,
  cloudDeployment,
  projectDeployAI,
};
