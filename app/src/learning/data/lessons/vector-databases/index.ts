import type { LessonContent } from '../types';
import { embeddingsIntro } from './embeddings-intro';
import { vectorDbConcepts } from './vector-db-concepts';
import { chromaSetup } from './chroma-setup';
import { pineconeSetup } from './pinecone-setup';
import { metadataFiltering } from './metadata-filtering';
import { hybridSearch } from './hybrid-search';
import { vectorDbOptimization } from './vector-db-optimization';
import { projectSemanticSearch } from './project-semantic-search';

export const vectordatabasesLessons: Record<string, LessonContent> = {
  "embeddings-intro": embeddingsIntro,
  "vector-db-concepts": vectorDbConcepts,
  "chroma-setup": chromaSetup,
  "pinecone-setup": pineconeSetup,
  "metadata-filtering": metadataFiltering,
  "hybrid-search": hybridSearch,
  "vector-db-optimization": vectorDbOptimization,
  "project-semantic-search": projectSemanticSearch,
};

export {
  embeddingsIntro,
  vectorDbConcepts,
  chromaSetup,
  pineconeSetup,
  metadataFiltering,
  hybridSearch,
  vectorDbOptimization,
  projectSemanticSearch,
};
