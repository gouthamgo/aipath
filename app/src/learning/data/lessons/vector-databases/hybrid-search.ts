import type { LessonContent } from '../types';

export const hybridSearch: LessonContent = {
  slug: "hybrid-search",
  problemContent: `# Hybrid Search

Combine the best of both worlds: keyword AND semantic search!

## Keyword vs Semantic Search

| Search Type | Good At | Bad At |
|-------------|---------|--------|
| Keyword (BM25) | Exact terms, names | Synonyms, meaning |
| Semantic | Meaning, concepts | Exact phrases |

## The Solution: Hybrid Search

Combine scores from both methods:

\`\`\`
final_score = α × semantic_score + (1-α) × keyword_score
\`\`\`

## When to Use Hybrid

- Document search with technical terms
- Product search with brand names
- Legal/medical with specific terminology

## Your Task

1. Implement keyword search using BM25
2. Implement semantic search using embeddings
3. Combine results using score fusion (RRF)
4. Compare hybrid search results with individual methods`,
  solutionContent: `# Solution: Hybrid Search

\`\`\`python
from rank_bm25 import BM25Okapi
import numpy as np
from openai import OpenAI

client = OpenAI()

class HybridSearch:
    def __init__(self, documents):
        self.documents = documents

        # Prepare BM25 (keyword search)
        tokenized = [doc.lower().split() for doc in documents]
        self.bm25 = BM25Okapi(tokenized)

        # Prepare embeddings (semantic search)
        self.embeddings = [
            self._get_embedding(doc) for doc in documents
        ]

    def _get_embedding(self, text):
        response = client.embeddings.create(
            model="text-embedding-3-small",
            input=text
        )
        return response.data[0].embedding

    def _cosine_similarity(self, a, b):
        return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

    def search(self, query, top_k=5, alpha=0.5):
        """
        alpha: weight for semantic (1=pure semantic, 0=pure keyword)
        """
        # Keyword scores
        tokenized_query = query.lower().split()
        bm25_scores = self.bm25.get_scores(tokenized_query)
        bm25_scores = bm25_scores / (bm25_scores.max() + 1e-6)  # Normalize

        # Semantic scores
        query_embedding = self._get_embedding(query)
        semantic_scores = [
            self._cosine_similarity(query_embedding, emb)
            for emb in self.embeddings
        ]
        semantic_scores = np.array(semantic_scores)

        # Combine
        hybrid_scores = alpha * semantic_scores + (1 - alpha) * bm25_scores

        # Get top results
        top_indices = np.argsort(hybrid_scores)[::-1][:top_k]
        return [(self.documents[i], hybrid_scores[i]) for i in top_indices]

# Usage
docs = [
    "Apple iPhone 15 Pro with A17 chip",
    "Samsung Galaxy S24 Ultra smartphone",
    "Healthy apple recipes for breakfast",
    "Google Pixel 8 camera review"
]

searcher = HybridSearch(docs)
results = searcher.search("Apple phone", alpha=0.5)
for doc, score in results:
    print(f"{score:.3f}: {doc}")
\`\`\``,
  explanationContent: `# How Hybrid Search Works

## BM25 (Best Match 25)

Classic keyword algorithm:
- Term frequency (how often word appears)
- Inverse document frequency (rarer = more important)
- Document length normalization

\`\`\`python
# BM25 loves exact matches
query: "iPhone 15"
high score: "Apple iPhone 15 Pro"
low score: "A great smartphone" (no keyword match)
\`\`\`

## Semantic Search

Embedding-based similarity:
- Understands synonyms
- Captures meaning
- Language-agnostic

\`\`\`python
# Semantic understands meaning
query: "smartphone"
high score: "Apple iPhone 15 Pro" (it's a smartphone!)
high score: "Samsung Galaxy" (also a smartphone!)
\`\`\`

## The Alpha Parameter

\`\`\`python
alpha = 1.0   # Pure semantic
alpha = 0.5   # Balanced
alpha = 0.0   # Pure keyword
alpha = 0.7   # Semantic-heavy (common choice)
\`\`\``,
  realworldContent: `# Real-World: E-commerce Search

## Scenario: Product Search

Users search with mixed queries:
- "Nike running shoes" (brand + product)
- "comfortable sneakers for jogging" (descriptive)

## Implementation

\`\`\`python
# Tune alpha based on query type
def detect_query_type(query):
    brand_terms = ["nike", "adidas", "apple", ...]
    has_brand = any(term in query.lower() for term in brand_terms)
    return "brand" if has_brand else "descriptive"

def smart_search(query):
    query_type = detect_query_type(query)

    if query_type == "brand":
        # More keyword weight for brand searches
        return searcher.search(query, alpha=0.3)
    else:
        # More semantic for descriptive
        return searcher.search(query, alpha=0.7)
\`\`\`

## Industry Usage

- Pinecone: Built-in hybrid search
- Elasticsearch: Vector + BM25
- Weaviate: Hybrid queries`,
  mistakesContent: `# Common Mistakes

## 1. Not Normalizing Scores

\`\`\`python
# WRONG - BM25 and cosine have different scales
final = semantic + bm25  # Meaningless!

# RIGHT - Normalize first
bm25_norm = bm25 / (bm25.max() + 1e-6)
semantic_norm = (semantic + 1) / 2  # cosine is -1 to 1
\`\`\`

## 2. Wrong Alpha for Use Case

\`\`\`python
# Legal search with specific terms
alpha = 0.9  # WRONG - Need keyword matching

# RIGHT
alpha = 0.3  # More keyword weight for exact terms
\`\`\`

## 3. Ignoring Preprocessing

\`\`\`python
# WRONG - Case mismatch affects BM25
docs = ["iPhone 15"]
query = "iphone 15"  # Lowercase, won't match!

# RIGHT - Normalize case
docs = [doc.lower() for doc in docs]
query = query.lower()
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: When is hybrid search better than pure semantic?

**Answer**: When queries contain:
- Specific product names/SKUs
- Technical terminology
- Proper nouns (people, companies)
- Exact phrases that must match

## Q2: How do you choose the right alpha?

**Answer**:
1. Start with 0.5 (balanced)
2. Evaluate on sample queries
3. A/B test different values
4. Consider query-dependent alpha

## Q3: What are alternatives to linear combination?

**Answer**:
- Reciprocal Rank Fusion (RRF)
- Learned ranking (ML model)
- Re-ranking with cross-encoder`,
  starterCode: `from rank_bm25 import BM25Okapi
import numpy as np

# Simple documents
documents = [
    "Python programming tutorial for beginners",
    "How to cook pasta Italian style",
    "Python snake care and feeding guide",
    "Machine learning with Python code examples",
    "Italian recipes and cooking tips"
]

# TODO: Create BM25 index
# tokenized_docs = ...
# bm25 = BM25Okapi(tokenized_docs)

# TODO: Implement simple hybrid search
def hybrid_search(query, alpha=0.5):
    """
    Combine BM25 and simple word overlap scores.
    (We'll skip embeddings for simplicity)
    """
    pass

# Test queries
print("Query: 'Python programming'")
# Should rank Python tutorials higher

print("Query: 'Italian food'")
# Should rank cooking content higher`,
  solutionCode: `from rank_bm25 import BM25Okapi
import numpy as np

documents = [
    "Python programming tutorial for beginners",
    "How to cook pasta Italian style",
    "Python snake care and feeding guide",
    "Machine learning with Python code examples",
    "Italian recipes and cooking tips"
]

# Create BM25 index
tokenized_docs = [doc.lower().split() for doc in documents]
bm25 = BM25Okapi(tokenized_docs)

def word_overlap_score(query, doc):
    """Simple semantic proxy: word overlap ratio."""
    query_words = set(query.lower().split())
    doc_words = set(doc.lower().split())
    overlap = len(query_words & doc_words)
    return overlap / len(query_words) if query_words else 0

def hybrid_search(query, alpha=0.5, top_k=3):
    # BM25 scores (keyword)
    tokenized_query = query.lower().split()
    bm25_scores = bm25.get_scores(tokenized_query)
    bm25_norm = bm25_scores / (bm25_scores.max() + 1e-6)

    # Word overlap scores (simple semantic proxy)
    overlap_scores = np.array([word_overlap_score(query, doc) for doc in documents])

    # Combine
    hybrid = alpha * overlap_scores + (1 - alpha) * bm25_norm

    # Return top results
    top_idx = np.argsort(hybrid)[::-1][:top_k]
    return [(documents[i], hybrid[i]) for i in top_idx]

# Test
print("Query: 'Python programming'")
for doc, score in hybrid_search("Python programming"):
    print(f"  {score:.3f}: {doc}")

print("\nQuery: 'Italian food'")
for doc, score in hybrid_search("Italian food"):
    print(f"  {score:.3f}: {doc}")`,
  hints: [
    "Tokenize documents by splitting on spaces after lowercasing",
    "Normalize BM25 scores by dividing by max value",
    "Use argsort()[::-1] to get indices sorted by descending score"
  ]
};
