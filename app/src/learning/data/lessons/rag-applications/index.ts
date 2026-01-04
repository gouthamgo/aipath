import type { LessonContent } from '../types';
import { ragOverview } from './rag-overview';
import { documentLoaders } from './document-loaders';
import { textChunking } from './text-chunking';
import { chunkingStrategies } from './chunking-strategies';
import { retrievalStrategies } from './retrieval-strategies';
import { reranking } from './reranking';
import { qaChains } from './qa-chains';
import { citationSources } from './citation-sources';
import { ragEvaluation } from './rag-evaluation';
import { projectDocQa } from './project-doc-qa';

export const ragapplicationsLessons: Record<string, LessonContent> = {
  "rag-overview": ragOverview,
  "document-loaders": documentLoaders,
  "text-chunking": textChunking,
  "chunking-strategies": chunkingStrategies,
  "retrieval-strategies": retrievalStrategies,
  "reranking": reranking,
  "qa-chains": qaChains,
  "citation-sources": citationSources,
  "rag-evaluation": ragEvaluation,
  "project-doc-qa": projectDocQa,
};

export {
  ragOverview,
  documentLoaders,
  textChunking,
  chunkingStrategies,
  retrievalStrategies,
  reranking,
  qaChains,
  citationSources,
  ragEvaluation,
  projectDocQa,
};
