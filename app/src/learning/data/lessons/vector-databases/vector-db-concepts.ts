import type { LessonContent } from '../types';

export const vectorDbConcepts: LessonContent = {
  slug: "vector-db-concepts",
  problemContent: `# Vector Database Concepts

How do you search millions of vectors efficiently? Vector databases!

## Popular Vector Databases

| Database | Type | Best For |
|----------|------|----------|
| Pinecone | Cloud | Production, scale |
| Chroma | Local/Cloud | Prototyping |
| Weaviate | Self-hosted | Custom deployments |
| Qdrant | Self-hosted | Performance |
| pgvector | Postgres ext | Existing Postgres |

## The Challenge

\`\`\`python
# Brute force: O(n) comparisons
for vector in million_vectors:
    similarity(query, vector)  # Too slow!
\`\`\`

## Vector Database Solution

Special data structures for fast similarity search:
- Store millions/billions of vectors
- Search in milliseconds
- Support filtering and metadata

## Your Task

1. Understand vector database components (indexing, storage, querying)
2. Learn about approximate nearest neighbor (ANN) algorithms
3. Compare different vector database options
4. Identify which database fits different use cases`,
  solutionContent: `# Solution: Understanding Vector DB Architecture

\`\`\`python
# Conceptual view of vector database operations

# 1. INDEXING (done once when adding vectors)
# Creates special data structures for fast search

# Without index: Linear scan O(n)
def brute_force_search(query, vectors):
    return sorted(vectors, key=lambda v: similarity(query, v))

# With index: Approximate nearest neighbor O(log n)
# Uses techniques like:
# - HNSW (Hierarchical Navigable Small World graphs)
# - IVF (Inverted File Index)
# - LSH (Locality Sensitive Hashing)

# 2. QUERYING
class VectorDB:
    def search(
        self,
        query_vector: list[float],
        top_k: int = 10,
        filter: dict = None  # Metadata filtering
    ):
        # 1. Navigate index structure
        # 2. Find approximate nearest neighbors
        # 3. Apply metadata filters
        # 4. Return top_k results
        pass

# 3. METADATA STORAGE
# Each vector can have associated metadata
document = {
    "vector": [0.1, 0.2, ...],
    "metadata": {
        "source": "docs/guide.pdf",
        "page": 5,
        "category": "tutorial"
    }
}
\`\`\``,
  explanationContent: `# How Vector Databases Work

## 1. Indexing Algorithms

### HNSW (Most Popular)

Creates a graph where:
- Nodes = vectors
- Edges = connect similar vectors
- Multiple layers for fast navigation

\`\`\`
Layer 2:  A ---- B
          |      |
Layer 1:  A - C - B - D
          |   |   |   |
Layer 0:  A-E-C-F-B-G-D-H
\`\`\`

### IVF (Inverted File)

- Clusters vectors into buckets
- Only searches relevant buckets

## 2. Trade-offs

| Factor | More Accuracy | Faster Search |
|--------|---------------|---------------|
| Index size | Larger | Smaller |
| Build time | Longer | Shorter |
| Memory | More | Less |

## 3. Recall vs Speed

- 100% recall = find THE best match (slow)
- 95% recall = find A good match (fast)`,
  realworldContent: `# Real-World: Scaling Semantic Search

## Scenario: E-commerce Product Search

10 million products, 100ms latency requirement.

## Architecture

\`\`\`
User Query: "comfortable running shoes"
    ↓
Embed query (50ms)
    ↓
Vector DB search (30ms)
    ↓
Metadata filter: in_stock=true, category="shoes"
    ↓
Return top 20 products (20ms)
\`\`\`

## Production Considerations

1. **Sharding**: Split index across machines
2. **Replication**: Multiple copies for availability
3. **Caching**: Cache frequent queries
4. **Batch embedding**: Pre-compute product embeddings`,
  mistakesContent: `# Common Mistakes

## 1. Wrong Distance Metric

\`\`\`python
# WRONG - Using L2 for normalized vectors
index.create(metric="L2")

# RIGHT - Cosine for text embeddings
index.create(metric="cosine")
\`\`\`

## 2. Not Using Metadata Filters

\`\`\`python
# WRONG - Filter after retrieval
results = db.search(query_vec, top_k=1000)
filtered = [r for r in results if r.category == "news"][:10]

# RIGHT - Filter during retrieval
results = db.search(
    query_vec,
    top_k=10,
    filter={"category": "news"}
)
\`\`\`

## 3. Ignoring Index Warm-up

\`\`\`python
# First queries after restart may be slow
# Warm up with sample queries
for sample in warmup_queries:
    db.search(sample)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How does HNSW achieve fast search?

**Answer**: HNSW builds a multi-layer graph. Upper layers have few, long-range connections for fast navigation. Lower layers have many local connections for precision. Search starts at top, navigates down.

## Q2: When would you choose exact vs approximate search?

**Answer**:
- Exact: Small datasets (<10k), critical accuracy needed
- Approximate: Large scale, can tolerate 95%+ recall

## Q3: How do you handle vector updates?

**Answer**:
1. Delete old vector by ID
2. Insert new vector
3. Some DBs support in-place updates
4. Periodic reindexing for optimal performance`,
  starterCode: `# This is a conceptual exercise
# Understand the trade-offs in vector database design

# TODO: Answer these questions:

# 1. Why can't we just use a regular database for vectors?
answer_1 = """
"""

# 2. What does "approximate" mean in approximate nearest neighbor?
answer_2 = """
"""

# 3. When would you choose Chroma vs Pinecone?
answer_3 = """
"""

print("Question 1:", answer_1)
print("Question 2:", answer_2)
print("Question 3:", answer_3)`,
  solutionCode: `# Understanding vector database concepts

# 1. Why can't we just use a regular database for vectors?
answer_1 = """
Regular databases use B-trees optimized for exact matches and range queries.
Vector similarity search needs to find SIMILAR items, not exact matches.
Comparing every vector is O(n) which is too slow for millions of vectors.
Vector DBs use special indexes (HNSW, IVF) for O(log n) approximate search.
"""

# 2. What does "approximate" mean in approximate nearest neighbor?
answer_2 = """
Instead of guaranteeing THE closest vector (expensive),
we find vectors that are VERY LIKELY to be among the closest.
This trade-off gives 100x+ speedup with 95%+ accuracy.
For most applications, finding a "good enough" match is acceptable.
"""

# 3. When would you choose Chroma vs Pinecone?
answer_3 = """
Chroma: Local development, prototyping, small datasets, no cloud costs
- Runs in-process, easy setup, great for learning

Pinecone: Production, scale, managed infrastructure
- Handles billions of vectors, high availability, enterprise features
- Pay-per-use pricing
"""

print("Question 1:", answer_1)
print("Question 2:", answer_2)
print("Question 3:", answer_3)`,
  hints: [
    "Think about algorithmic complexity - O(n) vs O(log n)",
    "Consider the trade-off between accuracy and speed",
    "Think about use cases: prototype vs production"
  ]
};
