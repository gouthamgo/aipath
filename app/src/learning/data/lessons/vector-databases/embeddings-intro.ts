import type { LessonContent } from '../types';

export const embeddingsIntro: LessonContent = {
  slug: "embeddings-intro",
  problemContent: `# Introduction to Embeddings

Embeddings are the foundation of semantic search and RAG. Let's understand them!

## Text Search vs Semantic Search

| Text Search | Semantic Search |
|-------------|-----------------|
| "dog" matches "dog" | "dog" matches "puppy" |
| Exact keywords only | Understands meaning |
| Misses synonyms | Finds related concepts |

## What are Embeddings?

Embeddings convert text into numbers (vectors) that capture meaning:

\`\`\`
"cat" → [0.2, 0.8, 0.1, ...]
"dog" → [0.25, 0.75, 0.15, ...]
"car" → [0.9, 0.1, 0.3, ...]
\`\`\`

Similar meanings = Similar numbers!

## Your Task

1. Create an embedding function using OpenAI's API
2. Generate embeddings for multiple sample texts
3. Calculate cosine similarity between embeddings
4. Verify that similar texts have higher similarity scores`,
  solutionContent: `# Solution: Creating Embeddings

\`\`\`python
from openai import OpenAI

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    """Get embedding vector for text."""
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Create embeddings
texts = ["I love cats", "Dogs are great", "Python programming"]
embeddings = [get_embedding(text) for text in texts]

print(f"Embedding dimension: {len(embeddings[0])}")  # 1536

# Check similarity
import numpy as np

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# "cats" and "dogs" should be more similar than "cats" and "programming"
sim_1 = cosine_similarity(embeddings[0], embeddings[1])
sim_2 = cosine_similarity(embeddings[0], embeddings[2])

print(f"Cats vs Dogs: {sim_1:.3f}")
print(f"Cats vs Programming: {sim_2:.3f}")
\`\`\``,
  explanationContent: `# How Embeddings Work

## The Vector Space

Text is mapped to high-dimensional space where:
- Similar meanings are close together
- Different meanings are far apart

\`\`\`
      programming
           ^
           |
    python ●
           |
     java ●|
           |
-----------+-----------> animals
           |     ● cat
           |   ● dog
           |
\`\`\`

## Embedding Models

| Model | Dimensions | Use Case |
|-------|------------|----------|
| text-embedding-3-small | 1536 | Cost effective |
| text-embedding-3-large | 3072 | Higher accuracy |
| ada-002 | 1536 | Legacy |

## Similarity Metrics

- **Cosine similarity**: Angle between vectors (-1 to 1)
- **Dot product**: Faster, for normalized vectors
- **Euclidean distance**: Straight-line distance`,
  realworldContent: `# Real-World: Semantic Search

## Scenario: Customer Support Search

Traditional keyword search fails:
- User: "My order is late"
- Keyword search: No results for "late"
- Semantic: Finds "delayed shipment" articles!

## Implementation

\`\`\`python
# Index support articles
articles = load_support_articles()
article_embeddings = [get_embedding(a.text) for a in articles]

# Search
query = "My order is late"
query_embedding = get_embedding(query)

# Find most similar
similarities = [
    cosine_similarity(query_embedding, ae)
    for ae in article_embeddings
]
best_idx = np.argmax(similarities)
print(articles[best_idx].text)
\`\`\``,
  mistakesContent: `# Common Mistakes

## 1. Embedding Too Much Text

\`\`\`python
# WRONG - Entire documents don't embed well
embedding = get_embedding(entire_10_page_document)

# RIGHT - Chunk first
chunks = split_into_chunks(document)
embeddings = [get_embedding(c) for c in chunks]
\`\`\`

## 2. Not Normalizing Vectors

\`\`\`python
# Some databases expect normalized vectors
def normalize(v):
    norm = np.linalg.norm(v)
    return v / norm if norm > 0 else v
\`\`\`

## 3. Ignoring Model Limits

\`\`\`python
# text-embedding-3-small has 8191 token limit
# Truncate or chunk long texts first
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: What's the difference between embeddings and encodings?

**Answer**:
- Encodings: Any numerical representation (like one-hot)
- Embeddings: Dense, learned representations that capture semantics

## Q2: Why use cosine similarity over Euclidean distance?

**Answer**: Cosine is scale-invariant - it measures angle, not magnitude. Two texts of different lengths can still be similar.

## Q3: How do you handle embedding drift?

**Answer**: When you update to a new embedding model:
1. Re-embed all stored documents
2. Or maintain parallel indexes during transition`,
  starterCode: `from openai import OpenAI
import numpy as np

client = OpenAI()

# TODO: Create a function to get embeddings
def get_embedding(text: str) -> list[float]:
    pass

# TODO: Create embeddings for these texts
texts = [
    "The weather is sunny today",
    "It's a beautiful sunny day",
    "I need to buy groceries"
]

# TODO: Calculate similarity between texts
# Which two are most similar?`,
  solutionCode: `from openai import OpenAI
import numpy as np

client = OpenAI()

def get_embedding(text: str) -> list[float]:
    response = client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def cosine_similarity(a, b):
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

texts = [
    "The weather is sunny today",
    "It's a beautiful sunny day",
    "I need to buy groceries"
]

embeddings = [get_embedding(t) for t in texts]

# Compare all pairs
print("Similarities:")
print(f"Text 1 vs 2: {cosine_similarity(embeddings[0], embeddings[1]):.3f}")
print(f"Text 1 vs 3: {cosine_similarity(embeddings[0], embeddings[2]):.3f}")
print(f"Text 2 vs 3: {cosine_similarity(embeddings[1], embeddings[2]):.3f}")

# Text 1 and 2 should be most similar (both about sunny weather)`,
  hints: [
    "Use client.embeddings.create() with model='text-embedding-3-small'",
    "The embedding is in response.data[0].embedding",
    "Use numpy for cosine similarity calculation"
  ]
};
