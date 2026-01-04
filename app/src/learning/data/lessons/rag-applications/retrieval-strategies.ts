import type { LessonContent } from '../types';

export const retrievalStrategies: LessonContent = {
  slug: "retrieval-strategies",
  problemContent: `# Retrieval Strategies

Find the most relevant chunks for your query!

## What is Retrieval?

Finding which document chunks are most relevant to a user's question.

## Basic Similarity Search

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

# Find similar chunks
query = "What is machine learning?"
results = vectorstore.similarity_search(query, k=3)

for doc in results:
    print(doc.page_content)
\`\`\`

## Retrieval Methods

| Method | Description |
|--------|-------------|
| Similarity Search | Find k most similar chunks |
| MMR | Max Marginal Relevance (diverse results) |
| Similarity with Score | Include similarity scores |
| Threshold | Only chunks above similarity threshold |

## Maximum Marginal Relevance (MMR)

Get diverse, relevant results:
\`\`\`python
results = vectorstore.max_marginal_relevance_search(
    query,
    k=4,
    fetch_k=10  # Fetch 10, return 4 diverse ones
)
\`\`\`

## Your Task

1. Create a vector store from documents
2. Try different retrieval methods
3. Compare the results`,

  solutionContent: `# Solution: Retrieval Strategies

\`\`\`python
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Sample documents
docs_text = [
    "Python is a programming language used for web development and data science.",
    "JavaScript is mainly used for web development and front-end applications.",
    "Machine learning is a subset of AI that learns from data.",
    "Deep learning uses neural networks with multiple layers.",
    "Data science involves statistics, programming, and domain knowledge."
]

# Create Document objects
from langchain.schema import Document
docs = [Document(page_content=text) for text in docs_text]

# Create embeddings and vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

query = "Tell me about programming languages"

# 1. Basic similarity search
print("=== Similarity Search ===")
results = vectorstore.similarity_search(query, k=2)
for i, doc in enumerate(results):
    print(f"{i+1}. {doc.page_content}")

# 2. With scores
print("\\n=== With Similarity Scores ===")
results_with_scores = vectorstore.similarity_search_with_score(query, k=2)
for doc, score in results_with_scores:
    print(f"Score {score:.3f}: {doc.page_content}")

# 3. MMR (diverse results)
print("\\n=== MMR (Diverse Results) ===")
mmr_results = vectorstore.max_marginal_relevance_search(query, k=2)
for i, doc in enumerate(mmr_results):
    print(f"{i+1}. {doc.page_content}")
\`\`\``,

  explanationContent: `# Deep Dive: Retrieval Methods

## Similarity Search

Finds k nearest neighbors:
\`\`\`python
results = vectorstore.similarity_search(query, k=3)
# Returns 3 most similar chunks
\`\`\`

## Similarity with Score

Shows how similar each result is:
\`\`\`python
results = vectorstore.similarity_search_with_score(query, k=3)
for doc, score in results:
    print(f"Similarity: {score}")
# Lower score = more similar (distance metric)
\`\`\`

## MMR (Maximum Marginal Relevance)

Balances relevance and diversity:
\`\`\`python
results = vectorstore.max_marginal_relevance_search(
    query,
    k=4,           # Return 4 results
    fetch_k=20,    # Consider top 20
    lambda_mult=0.5  # Balance: 0=diverse, 1=relevant
)
\`\`\`

**Why MMR?**
- Prevents redundant results
- Gets diverse perspectives
- Better coverage

## Threshold-Based

Only return chunks above similarity threshold:
\`\`\`python
results = vectorstore.similarity_search_with_relevance_scores(
    query,
    score_threshold=0.8  # Only if >80% similar
)
\`\`\``,

  realworldContent: `# Real-World Retrieval

## As a Retriever

\`\`\`python
# Convert to retriever for chains
retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 4}
)

# Use in QA chain
from langchain.chains import RetrievalQA
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever
)
\`\`\`

## MMR Retriever

\`\`\`python
retriever = vectorstore.as_retriever(
    search_type="mmr",
    search_kwargs={"k": 4, "fetch_k": 10}
)
# Diverse results for better coverage
\`\`\`

## Filtered Search

\`\`\`python
# Only search specific documents
results = vectorstore.similarity_search(
    query,
    k=3,
    filter={"source": "technical_docs"}
)
\`\`\`

## Multi-Query Retrieval

\`\`\`python
from langchain.retrievers.multi_query import MultiQueryRetriever

retriever = MultiQueryRetriever.from_llm(
    retriever=vectorstore.as_retriever(),
    llm=llm
)
# Generates multiple queries, combines results
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Using k Too Small

\`\`\`python
# Wrong - might miss important context
results = vectorstore.similarity_search(query, k=1)

# Right - get enough context
results = vectorstore.similarity_search(query, k=4)
\`\`\`

## 2. Not Using MMR for Diverse Topics

\`\`\`python
# Wrong - all results about same thing
results = vectorstore.similarity_search(query, k=5)
# All 5 might be very similar

# Right - use MMR for diversity
results = vectorstore.max_marginal_relevance_search(query, k=5)
\`\`\`

## 3. Ignoring Similarity Scores

\`\`\`python
# Wrong - using low-relevance results
results = vectorstore.similarity_search(query, k=10)
# Might include irrelevant chunks

# Right - check scores or use threshold
results = vectorstore.similarity_search_with_relevance_scores(
    query,
    score_threshold=0.7
)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between similarity search and MMR?

**Answer:** Similarity search returns k most similar chunks (may be redundant). MMR balances relevance and diversity - fetches more candidates, returns diverse subset. Use MMR to avoid repetitive results.

## Q2: What's a good k value for retrieval?

**Answer:** Depends on use case. Typically 3-5 for QA, more for comprehensive answers. Too small misses context, too large adds noise. Test and adjust.

## Q3: How to handle low-quality retrievals?

**Answer:** Use similarity score thresholds, try MMR for diversity, improve chunking strategy, add metadata filters, or use multi-query retrieval.`,

  starterCode: `from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

# Sample documents
docs = [
    Document(page_content="Python is great for data science and ML."),
    Document(page_content="JavaScript is used for web development."),
    Document(page_content="Machine learning models learn from data."),
    Document(page_content="Web development uses HTML, CSS, and JS.")
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Try different retrievals
query = "programming languages"

# 1. Basic search
results = vectorstore.similarity_search(query, k=2)
print("=== Similarity Search ===")
for doc in results:
    print(doc.page_content)

# 2. With scores
print("\\n=== With Scores ===")
results = vectorstore.similarity_search_with_score(query, k=2)
for doc, score in results:
    print(f"{score:.3f}: {doc.page_content}")`,

  solutionCode: `from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.schema import Document

# Sample documents
docs = [
    Document(page_content="Python is great for data science and ML."),
    Document(page_content="JavaScript is used for web development."),
    Document(page_content="Machine learning models learn from data."),
    Document(page_content="Web development uses HTML, CSS, and JS.")
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Try different retrievals
query = "programming languages"

# 1. Basic search
results = vectorstore.similarity_search(query, k=2)
print("=== Similarity Search ===")
for doc in results:
    print(doc.page_content)

# 2. With scores
print("\\n=== With Scores ===")
results = vectorstore.similarity_search_with_score(query, k=2)
for doc, score in results:
    print(f"{score:.3f}: {doc.page_content}")

# 3. MMR
print("\\n=== MMR (Diverse) ===")
results = vectorstore.max_marginal_relevance_search(query, k=2)
for doc in results:
    print(doc.page_content)`,

  hints: [
    "similarity_search(query, k=N) returns N most similar chunks",
    "MMR provides diverse results to avoid redundancy",
    "similarity_search_with_score() shows relevance scores",
    "Typical k values: 3-5 for most use cases"
  ]
};
