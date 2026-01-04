import type { LessonContent } from '../types';

export const projectSemanticSearch: LessonContent = {
  slug: "project-semantic-search",
  problemContent: `# Project: Build a Semantic Search Engine

Build a complete semantic search system from scratch!

## Engine Components

| Component | Purpose | Method |
|-----------|---------|--------|
| Indexer | Store documents | \`index(doc)\` |
| Embedder | Convert to vectors | \`embed(text)\` |
| Searcher | Find similar docs | \`search(query)\` |
| Filterer | Apply constraints | \`filter(metadata)\` |

## Project Overview

Create a search engine that:
1. Indexes documents with embeddings
2. Supports semantic search
3. Includes metadata filtering
4. Has a simple API

## Requirements

- Index documents from multiple sources
- Search with natural language queries
- Filter by metadata (date, category, source)
- Return ranked results with scores

## Example

\`\`\`python
# Index
engine.index({
    "text": "Python is great for data science",
    "source": "blog",
    "date": "2024-01-15"
})

# Search
results = engine.search(
    query="programming for machine learning",
    filters={"source": "blog"},
    top_k=5
)
\`\`\`

## Your Task

1. Create a SemanticSearchEngine class with indexing methods
2. Implement document loading with chunking
3. Build search with similarity scoring
4. Add a reranking step to improve result quality`,
  solutionContent: `# Solution: Complete Semantic Search Engine

\`\`\`python
import chromadb
from openai import OpenAI
from datetime import datetime
from typing import Optional
import uuid

class SemanticSearchEngine:
    def __init__(self, db_path: str = "./search_db"):
        self.client = chromadb.PersistentClient(path=db_path)
        self.openai = OpenAI()
        self.collection = self.client.get_or_create_collection(
            name="documents",
            metadata={"hnsw:space": "cosine"}
        )

    def _get_embedding(self, text: str) -> list[float]:
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def index(self, document: dict) -> str:
        """Index a single document."""
        doc_id = document.get("id", str(uuid.uuid4()))
        text = document["text"]

        metadata = {
            "source": document.get("source", "unknown"),
            "date": document.get("date", datetime.now().isoformat()),
            "category": document.get("category", "general")
        }

        self.collection.add(
            documents=[text],
            ids=[doc_id],
            metadatas=[metadata]
        )
        return doc_id

    def index_batch(self, documents: list[dict]) -> list[str]:
        """Index multiple documents efficiently."""
        ids = [d.get("id", str(uuid.uuid4())) for d in documents]
        texts = [d["text"] for d in documents]
        metadatas = [{
            "source": d.get("source", "unknown"),
            "date": d.get("date", datetime.now().isoformat()),
            "category": d.get("category", "general")
        } for d in documents]

        self.collection.add(
            documents=texts,
            ids=ids,
            metadatas=metadatas
        )
        return ids

    def search(
        self,
        query: str,
        top_k: int = 10,
        filters: Optional[dict] = None
    ) -> list[dict]:
        """Search for documents matching the query."""
        where = None
        if filters:
            where_clauses = []
            for key, value in filters.items():
                where_clauses.append({key: {"$eq": value}})

            if len(where_clauses) == 1:
                where = where_clauses[0]
            else:
                where = {"$and": where_clauses}

        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"]
        )

        output = []
        for i, doc in enumerate(results["documents"][0]):
            output.append({
                "text": doc,
                "metadata": results["metadatas"][0][i],
                "score": 1 - results["distances"][0][i],  # Convert distance to similarity
                "id": results["ids"][0][i]
            })
        return output

    def delete(self, doc_id: str):
        """Delete a document by ID."""
        self.collection.delete(ids=[doc_id])

    def stats(self) -> dict:
        """Get collection statistics."""
        return {
            "total_documents": self.collection.count()
        }

# Usage
engine = SemanticSearchEngine()

# Index documents
docs = [
    {"text": "Python is excellent for data science and ML", "category": "tech", "source": "blog"},
    {"text": "JavaScript powers modern web applications", "category": "tech", "source": "tutorial"},
    {"text": "Healthy breakfast recipes for busy mornings", "category": "lifestyle", "source": "blog"},
]

engine.index_batch(docs)
print(f"Indexed {engine.stats()['total_documents']} documents")

# Search
results = engine.search("programming languages", top_k=2)
for r in results:
    print(f"Score: {r['score']:.3f} - {r['text'][:50]}...")

# Filtered search
results = engine.search(
    "programming",
    filters={"source": "tutorial"}
)
print(f"\\nFiltered results: {len(results)}")
\`\`\``,
  explanationContent: `# Architecture Overview

## Components

\`\`\`
SemanticSearchEngine
├── ChromaDB (vector storage)
├── OpenAI (embeddings)
└── API Methods
    ├── index()      → Add single document
    ├── index_batch() → Add many documents
    ├── search()     → Query with filters
    ├── delete()     → Remove document
    └── stats()      → Get metrics
\`\`\`

## Design Decisions

1. **Auto-generated IDs**: UUID if not provided
2. **Default metadata**: Sensible defaults for missing fields
3. **Score normalization**: Convert distance to similarity
4. **Filter building**: Dynamic where clause construction

## Extending the System

\`\`\`python
# Add hybrid search
def hybrid_search(self, query, alpha=0.5):
    # Combine with BM25
    pass

# Add re-ranking
def search_with_rerank(self, query, top_k=10):
    # Get candidates, rerank with cross-encoder
    pass

# Add caching
@lru_cache(maxsize=100)
def cached_search(self, query_hash):
    pass
\`\`\``,
  realworldContent: `# Real-World: Production Deployment

## Scenario: Company Document Search

Deploy for 1000 users, 100k documents:

\`\`\`python
# Add rate limiting
from ratelimit import limits

class ProductionSearchEngine(SemanticSearchEngine):
    @limits(calls=100, period=60)  # 100 calls/minute
    def search(self, *args, **kwargs):
        return super().search(*args, **kwargs)

# Add logging
import logging

class LoggedSearchEngine(SemanticSearchEngine):
    def search(self, query, **kwargs):
        start = time.time()
        results = super().search(query, **kwargs)
        logging.info(f"Query: {query}, Latency: {time.time()-start:.3f}s")
        return results
\`\`\`

## Production Checklist

- [ ] Rate limiting
- [ ] Request logging
- [ ] Error handling
- [ ] Health checks
- [ ] Monitoring dashboard
- [ ] Backup strategy`,
  mistakesContent: `# Common Mistakes

## 1. No Error Handling

\`\`\`python
# WRONG
def search(self, query):
    return self.collection.query(query_texts=[query])

# RIGHT
def search(self, query):
    try:
        return self.collection.query(query_texts=[query])
    except Exception as e:
        logger.error(f"Search failed: {e}")
        return []
\`\`\`

## 2. Inconsistent Metadata

\`\`\`python
# WRONG - Missing fields cause filter failures
metadatas = [{"source": "blog"}]  # No category!
# Later: filter={"category": "tech"} finds nothing

# RIGHT - Consistent schema
metadatas = [{
    "source": d.get("source", "unknown"),
    "category": d.get("category", "general")
}]
\`\`\`

## 3. Not Validating Input

\`\`\`python
# WRONG
def index(self, document):
    self.collection.add(documents=[document["text"]])

# RIGHT
def index(self, document):
    if not document.get("text"):
        raise ValueError("Document must have 'text' field")
    # ... proceed
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How would you handle document updates?

**Answer**:
\`\`\`python
def update(self, doc_id, new_text):
    self.delete(doc_id)
    self.index({"id": doc_id, "text": new_text})
\`\`\`
Or use upsert if supported.

## Q2: How would you add search result highlighting?

**Answer**:
1. Get search results
2. Find query terms in result text
3. Wrap matches in highlight tags
\`\`\`python
def highlight(text, query):
    for term in query.split():
        text = text.replace(term, f"**{term}**")
    return text
\`\`\`

## Q3: How would you implement "more like this"?

**Answer**:
\`\`\`python
def more_like_this(self, doc_id, top_k=5):
    # Get the document's embedding
    doc = self.collection.get(ids=[doc_id], include=["embeddings"])
    embedding = doc["embeddings"][0]
    # Search with that embedding
    return self.collection.query(
        query_embeddings=[embedding],
        n_results=top_k + 1  # +1 to exclude self
    )
\`\`\``,
  starterCode: `import chromadb
from openai import OpenAI
from typing import Optional
import uuid

class SemanticSearchEngine:
    def __init__(self, db_path: str = "./my_search_db"):
        # TODO: Initialize ChromaDB client and collection
        pass

    def _get_embedding(self, text: str) -> list[float]:
        # TODO: Get embedding from OpenAI
        pass

    def index(self, document: dict) -> str:
        """Index a single document with text and metadata."""
        # TODO: Add document to collection
        pass

    def search(
        self,
        query: str,
        top_k: int = 10,
        filters: Optional[dict] = None
    ) -> list[dict]:
        """Search for documents matching the query."""
        # TODO: Query collection with optional filters
        pass

# Test your implementation
engine = SemanticSearchEngine()

# Index some documents
docs = [
    {"text": "Python programming basics", "category": "tech"},
    {"text": "Cooking Italian pasta", "category": "food"},
    {"text": "Machine learning with Python", "category": "tech"},
]

for doc in docs:
    engine.index(doc)

# Search
results = engine.search("programming language")
print("All results:", len(results))

# Filtered search
results = engine.search("programming", filters={"category": "tech"})
print("Tech results:", len(results))`,
  solutionCode: `import chromadb
from openai import OpenAI
from typing import Optional
import uuid

class SemanticSearchEngine:
    def __init__(self, db_path: str = "./my_search_db"):
        self.client = chromadb.PersistentClient(path=db_path)
        self.openai = OpenAI()
        self.collection = self.client.get_or_create_collection(name="documents")

    def _get_embedding(self, text: str) -> list[float]:
        response = self.openai.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def index(self, document: dict) -> str:
        """Index a single document with text and metadata."""
        doc_id = document.get("id", str(uuid.uuid4()))
        text = document["text"]
        metadata = {
            "category": document.get("category", "general"),
            "source": document.get("source", "unknown")
        }

        self.collection.add(
            documents=[text],
            ids=[doc_id],
            metadatas=[metadata]
        )
        return doc_id

    def search(
        self,
        query: str,
        top_k: int = 10,
        filters: Optional[dict] = None
    ) -> list[dict]:
        """Search for documents matching the query."""
        where = None
        if filters:
            conditions = [{k: {"$eq": v}} for k, v in filters.items()]
            where = conditions[0] if len(conditions) == 1 else {"$and": conditions}

        results = self.collection.query(
            query_texts=[query],
            n_results=top_k,
            where=where,
            include=["documents", "metadatas", "distances"]
        )

        return [
            {
                "text": results["documents"][0][i],
                "metadata": results["metadatas"][0][i],
                "score": 1 - results["distances"][0][i]
            }
            for i in range(len(results["documents"][0]))
        ]

# Test
engine = SemanticSearchEngine()

docs = [
    {"text": "Python programming basics", "category": "tech"},
    {"text": "Cooking Italian pasta", "category": "food"},
    {"text": "Machine learning with Python", "category": "tech"},
]

for doc in docs:
    engine.index(doc)

print("All results:", len(engine.search("programming language")))
print("Tech results:", len(engine.search("programming", filters={"category": "tech"})))`,
  hints: [
    "Initialize PersistentClient and get_or_create_collection in __init__",
    "Build where clause from filters dict using $eq operator",
    "Convert distances to scores using 1 - distance"
  ]
};
