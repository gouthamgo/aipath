import type { LessonContent } from '../types';
import { numpyBasics } from './numpy-basics';
import { pandasIntro } from './pandas-intro';
import { dataCleaning } from './data-cleaning';
import { dataTransformation } from './data-transformation';
import { projectDataAnalyzer } from './project-data-analyzer';

export const dataManipulationLessons: Record<string, LessonContent> = {
  "numpy-basics": numpyBasics,
  "pandas-intro": pandasIntro,
  "data-cleaning": dataCleaning,
  "data-transformation": dataTransformation,
  "project-data-analyzer": projectDataAnalyzer,
};

export {
  numpyBasics,
  pandasIntro,
  dataCleaning,
  dataTransformation,
  projectDataAnalyzer,
};
