import type { LessonContent } from '../types';

export const reranking: LessonContent = {
  slug: "reranking",
  problemContent: `# Reranking for Better Retrieval

Improve retrieval quality by reranking results!

## Reranking Methods

| Method | Tool | Speed | Quality |
|--------|------|-------|---------|
| LLM Rerank | GPT-4 | Slow | High |
| Cohere Rerank | Cohere API | Fast | High |
| Cross-Encoder | sentence-transformers | Medium | Good |
| BM25 Fusion | rank-bm25 | Fast | Medium |

## The Problem

Initial retrieval might not be perfectly ordered:
\`\`\`python
# Vector search returns 10 results
# But order might not be optimal for your specific query
\`\`\`

## What is Reranking?

1. Retrieve more candidates than needed (e.g., 20)
2. Rerank them with a better model
3. Return top k (e.g., 5)

\`\`\`
Query → Retrieve 20 → Rerank → Top 5
\`\`\`

## Basic Reranking

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")
compressor = LLMChainExtractor.from_llm(llm)

compression_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=retriever
)

# Returns compressed, relevant content
docs = compression_retriever.get_relevant_documents(query)
\`\`\`

## Cohere Reranker

\`\`\`python
from langchain.retrievers.document_compressors import CohereRerank

compressor = CohereRerank(
    model="rerank-english-v2.0",
    top_n=3
)
# Specialized reranking model
\`\`\`

## Your Task

1. Create a retriever
2. Add reranking
3. Compare with and without reranking`,

  solutionContent: `# Solution: Reranking

\`\`\`python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Sample documents
docs = [
    Document(page_content="The company refund policy allows returns within 30 days."),
    Document(page_content="Customer support is available 24/7."),
    Document(page_content="Refunds are processed within 5-7 business days."),
    Document(page_content="We offer free shipping on orders over $50."),
    Document(page_content="All refunds are credited to the original payment method."),
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 5})

query = "How long does a refund take?"

# Without reranking
print("=== Without Reranking ===")
basic_results = base_retriever.get_relevant_documents(query)
for i, doc in enumerate(basic_results):
    print(f"{i+1}. {doc.page_content}")

# With reranking
print("\\n=== With Reranking ===")
llm = ChatOpenAI(model="gpt-4o-mini")
compressor = LLMChainExtractor.from_llm(llm)

reranking_retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)

reranked_results = reranking_retriever.get_relevant_documents(query)
for i, doc in enumerate(reranked_results):
    print(f"{i+1}. {doc.page_content}")
\`\`\``,

  explanationContent: `# Deep Dive: Reranking

## Why Rerank?

Vector similarity isn't perfect:
- May prioritize keyword matches over semantic relevance
- Doesn't understand query intent well
- Better models exist for relevance

## Reranking Pipeline

\`\`\`
1. Vector Search → Get 20 candidates
2. Rerank Model → Score each for query relevance
3. Sort by new scores
4. Return top 5
\`\`\`

## Types of Rerankers

| Type | Pros | Cons |
|------|------|------|
| LLM-based | Very accurate | Slow, expensive |
| Cohere Rerank | Fast, accurate | Requires API |
| Cross-encoders | Good quality | Moderate speed |

## LLM Compressor

\`\`\`python
from langchain.retrievers.document_compressors import LLMChainExtractor

compressor = LLMChainExtractor.from_llm(llm)
# Uses LLM to extract relevant parts
\`\`\`

## Cohere Reranker

\`\`\`python
from langchain.retrievers.document_compressors import CohereRerank

compressor = CohereRerank(
    model="rerank-english-v2.0",
    top_n=5
)
# Specialized reranking model, fast and accurate
\`\`\``,

  realworldContent: `# Real-World Reranking

## Production Setup

\`\`\`python
# Retrieve more, return less
base_retriever = vectorstore.as_retriever(
    search_kwargs={"k": 20}  # Get 20 candidates
)

compressor = CohereRerank(top_n=5)  # Return top 5

retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)
\`\`\`

## Multi-Stage Retrieval

\`\`\`python
# Stage 1: Fast vector search (get 50)
# Stage 2: Rerank to 10
# Stage 3: LLM final selection (top 5)

base = vectorstore.as_retriever(search_kwargs={"k": 50})
stage1 = ContextualCompressionRetriever(
    base_compressor=CohereRerank(top_n=10),
    base_retriever=base
)
final = ContextualCompressionRetriever(
    base_compressor=LLMChainExtractor.from_llm(llm),
    base_retriever=stage1
)
\`\`\`

## Cost Optimization

\`\`\`python
# Use reranking only for important queries
def get_retriever(query_importance):
    if query_importance == "high":
        # Use reranking
        return reranking_retriever
    else:
        # Basic retrieval
        return base_retriever
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Retrieving Enough Candidates

\`\`\`python
# Wrong - rerank only 3 documents
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 3})
# Nothing to rerank!

# Right - retrieve more, rerank to fewer
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 20})
compressor = CohereRerank(top_n=5)
\`\`\`

## 2. Using LLM Reranker for Every Query

\`\`\`python
# Wrong - expensive and slow
compressor = LLMChainExtractor.from_llm(llm)
# Use for every query

# Right - use efficient reranker
compressor = CohereRerank()  # Faster
# Or only rerank important queries
\`\`\`

## 3. Forgetting to Compare

\`\`\`python
# Always test if reranking helps!
# Compare results with and without
# Measure: relevance, latency, cost
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is reranking and why use it?

**Answer:** Reranking rescores retrieved documents with a better model. Vector search is fast but not always accurate. Reranking improves relevance by using specialized models (Cohere, cross-encoders, LLMs) on a smaller candidate set.

## Q2: How does reranking pipeline work?

**Answer:** Retrieve many candidates with fast vector search (e.g., 20), rerank with better model, return top few (e.g., 5). Balances speed and quality.

## Q3: LLM vs Cohere reranker?

**Answer:** LLM (LLMChainExtractor) is very accurate but slow and expensive. Cohere Rerank is specialized, fast, and cost-effective. Use Cohere for production, LLM for highest accuracy when needed.`,

  starterCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Create some sample docs
docs = [
    Document(page_content="Python is a programming language."),
    Document(page_content="Python snakes are reptiles."),
    Document(page_content="Python was created by Guido van Rossum."),
    Document(page_content="Anaconda is a Python distribution."),
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Base retriever
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# Create reranker
llm = ChatOpenAI(model="gpt-4o-mini")
compressor = LLMChainExtractor.from_llm(llm)

reranker = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)

# Test
query = "Who created the Python programming language?"
results = reranker.get_relevant_documents(query)

for doc in results:
    print(doc.page_content)`,

  solutionCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.schema import Document
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import LLMChainExtractor

# Create some sample docs
docs = [
    Document(page_content="Python is a programming language."),
    Document(page_content="Python snakes are reptiles."),
    Document(page_content="Python was created by Guido van Rossum."),
    Document(page_content="Anaconda is a Python distribution."),
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Base retriever
base_retriever = vectorstore.as_retriever(search_kwargs={"k": 4})

# Create reranker
llm = ChatOpenAI(model="gpt-4o-mini")
compressor = LLMChainExtractor.from_llm(llm)

reranker = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)

# Test
query = "Who created the Python programming language?"
results = reranker.get_relevant_documents(query)

print("Reranked results:")
for i, doc in enumerate(results):
    print(f"{i+1}. {doc.page_content}")`,

  hints: [
    "Retrieve more candidates (k=20), rerank to fewer (top_n=5)",
    "ContextualCompressionRetriever wraps a base retriever",
    "LLMChainExtractor uses LLM for reranking (accurate but slow)",
    "Cohere Rerank is faster and good for production"
  ]
};
