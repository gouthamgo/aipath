import type { LessonContent } from '../types';

export const vectorDbOptimization: LessonContent = {
  slug: "vector-db-optimization",
  problemContent: `# Optimizing Vector Database Performance

Make your vector search faster and more efficient!

## Performance Factors

| Factor | Impact |
|--------|--------|
| Index type | 10x speed difference |
| Embedding dimension | Memory + latency |
| Batch size | Throughput |
| Filtering | Query time |

## Optimization Areas

1. **Indexing**: Choose right algorithm
2. **Embeddings**: Dimension vs quality
3. **Queries**: Batching and caching
4. **Infrastructure**: Sharding, replicas

## Your Task

1. Implement batch processing for large datasets
2. Configure HNSW index parameters (ef, M values)
3. Add caching for frequently accessed embeddings
4. Monitor and measure search performance`,
  solutionContent: `# Solution: Optimization Techniques

\`\`\`python
import chromadb
from chromadb.config import Settings
import time

# 1. CHOOSE RIGHT EMBEDDING DIMENSION
# Smaller = faster, slightly less accurate

# Option A: Use smaller model
# text-embedding-3-small (1536) vs text-embedding-3-large (3072)

# Option B: Reduce dimensions
from openai import OpenAI
client = OpenAI()

def get_embedding(text, dimensions=512):
    """Get lower-dimensional embedding."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text,
        dimensions=dimensions  # Reduce from 1536!
    )
    return response.data[0].embedding

# 2. BATCH OPERATIONS
def batch_upsert(collection, documents, batch_size=100):
    """Upsert in batches for better throughput."""
    for i in range(0, len(documents), batch_size):
        batch = documents[i:i + batch_size]
        collection.add(
            documents=[d["text"] for d in batch],
            ids=[d["id"] for d in batch],
            metadatas=[d["metadata"] for d in batch]
        )
        print(f"Upserted batch {i // batch_size + 1}")

# 3. QUERY CACHING
from functools import lru_cache
import hashlib

@lru_cache(maxsize=1000)
def cached_search(query_hash):
    """Cache frequent queries."""
    # In practice, store query text separately
    pass

def search_with_cache(collection, query, n_results=10):
    query_hash = hashlib.md5(query.encode()).hexdigest()
    # Check cache, query if miss
    return collection.query(query_texts=[query], n_results=n_results)

# 4. PARALLEL QUERIES
import asyncio

async def parallel_search(queries):
    """Run multiple searches in parallel."""
    tasks = [search_async(q) for q in queries]
    return await asyncio.gather(*tasks)
\`\`\``,
  explanationContent: `# Optimization Deep Dive

## Embedding Dimensions

\`\`\`python
# OpenAI allows dimension reduction
response = client.embeddings.create(
    model="text-embedding-3-small",
    input="text",
    dimensions=256  # Default 1536, min 256
)

# Trade-offs:
# 256 dims: 6x less memory, ~5% accuracy drop
# 512 dims: 3x less memory, ~2% accuracy drop
# 1536 dims: Full accuracy, full memory
\`\`\`

## Index Parameters (Chroma/Pinecone)

\`\`\`python
# Chroma HNSW settings
collection = client.get_or_create_collection(
    name="optimized",
    metadata={
        "hnsw:M": 32,  # Connections per node (default 16)
        "hnsw:efConstruction": 200,  # Build quality (default 100)
        "hnsw:efSearch": 100  # Search quality (default 10)
    }
)

# Higher M, ef = better recall, slower build/search
\`\`\`

## Pinecone Pod Sizing

| Scenario | Recommendation |
|----------|---------------|
| < 100k vectors | s1 (starter) |
| 100k - 1M | p1 (standard) |
| > 1M | p2 (high performance) |
| Cost sensitive | s1 with replicas |`,
  realworldContent: `# Real-World: Scaling to Millions

## Scenario: Enterprise Document Search

10 million documents, <100ms latency requirement.

## Architecture

\`\`\`
Load Balancer
    ↓
Multiple Query Nodes
    ↓
Sharded Vector Index
    ↓
    [Shard 1]  [Shard 2]  [Shard 3]
\`\`\`

## Optimizations Applied

1. **Reduced dimensions**: 1536 → 512 (3x memory savings)
2. **Batch indexing**: 500 docs per batch
3. **Query caching**: LRU cache for common queries
4. **Metadata pre-filtering**: Filter before vector search
5. **Read replicas**: 3 replicas for high availability

## Results

- Index size: 15GB → 5GB
- Query latency: 200ms → 60ms
- Throughput: 100 → 500 QPS`,
  mistakesContent: `# Common Mistakes

## 1. Over-Engineering Early

\`\`\`python
# WRONG - Premature optimization
# Setting up sharding for 1000 documents

# RIGHT - Start simple
client = chromadb.PersistentClient()  # Good enough for <1M docs
\`\`\`

## 2. Wrong Batch Size

\`\`\`python
# WRONG - Too small (slow)
for doc in documents:
    collection.add([doc])  # One at a time!

# WRONG - Too large (memory issues)
collection.add(million_docs)  # All at once!

# RIGHT - Reasonable batches
for batch in chunks(documents, 500):
    collection.add(batch)
\`\`\`

## 3. Not Monitoring

\`\`\`python
# WRONG - No visibility
collection.query(query_texts=[q])

# RIGHT - Track metrics
start = time.time()
results = collection.query(query_texts=[q])
latency = time.time() - start
log_metric("query_latency", latency)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How would you reduce query latency?

**Answer**:
1. Reduce embedding dimensions
2. Add query caching
3. Use metadata pre-filtering
4. Add read replicas
5. Optimize HNSW parameters

## Q2: How do you handle embedding updates when changing models?

**Answer**:
1. Create new collection with new embeddings
2. Run both in parallel during transition
3. Switch traffic to new collection
4. Delete old collection

## Q3: What's the memory footprint of 1M vectors?

**Answer**:
- 1M × 1536 dims × 4 bytes = ~6GB just for vectors
- Plus index overhead (~1.5x)
- Total: ~9GB for 1M vectors with text-embedding-3-small`,
  starterCode: `import time

# Simulate a vector database with basic operations
class SimpleVectorDB:
    def __init__(self):
        self.vectors = []
        self.documents = []

    def add(self, documents, vectors):
        self.documents.extend(documents)
        self.vectors.extend(vectors)

    def search(self, query_vector, top_k=5):
        # Brute force search
        similarities = []
        for i, vec in enumerate(self.vectors):
            sim = sum(a * b for a, b in zip(query_vector, vec))
            similarities.append((i, sim))
        similarities.sort(key=lambda x: x[1], reverse=True)
        return similarities[:top_k]

# TODO: Add timing to measure performance
db = SimpleVectorDB()

# TODO: Add documents in batches and measure time

# TODO: Query and measure latency`,
  solutionCode: `import time
import random

class SimpleVectorDB:
    def __init__(self):
        self.vectors = []
        self.documents = []

    def add(self, documents, vectors):
        self.documents.extend(documents)
        self.vectors.extend(vectors)

    def add_batch(self, documents, vectors, batch_size=100):
        """Add in batches with timing."""
        total_time = 0
        for i in range(0, len(documents), batch_size):
            start = time.time()
            batch_docs = documents[i:i + batch_size]
            batch_vecs = vectors[i:i + batch_size]
            self.add(batch_docs, batch_vecs)
            total_time += time.time() - start
        return total_time

    def search(self, query_vector, top_k=5):
        start = time.time()
        similarities = []
        for i, vec in enumerate(self.vectors):
            sim = sum(a * b for a, b in zip(query_vector, vec))
            similarities.append((i, sim))
        similarities.sort(key=lambda x: x[1], reverse=True)
        latency = time.time() - start
        return similarities[:top_k], latency

# Create DB and sample data
db = SimpleVectorDB()

# Generate sample data
n_docs = 10000
dim = 128  # Small for demo
docs = [f"Document {i}" for i in range(n_docs)]
vecs = [[random.random() for _ in range(dim)] for _ in range(n_docs)]

# Add in batches
add_time = db.add_batch(docs, vecs, batch_size=500)
print(f"Added {n_docs} documents in {add_time:.2f}s")
print(f"Rate: {n_docs/add_time:.0f} docs/sec")

# Query performance
query = [random.random() for _ in range(dim)]
results, latency = db.search(query, top_k=10)
print(f"Search latency: {latency*1000:.1f}ms")`,
  hints: [
    "Use time.time() before and after operations to measure duration",
    "Process documents in batches of 100-500 for better throughput",
    "Track both indexing time and query latency"
  ]
};
