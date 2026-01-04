import type { LessonContent } from '../types';

export const pineconeSetup: LessonContent = {
  slug: "pinecone-setup",
  problemContent: `# Getting Started with Pinecone

Pinecone is a production-grade vector database. Let's set it up!

## Pinecone Concepts

| Concept | Description |
|---------|-------------|
| Index | Where vectors are stored |
| Namespace | Partition within index |
| Upsert | Insert or update vectors |
| Query | Find similar vectors |

## What is Pinecone?

- Fully managed vector database
- Scales to billions of vectors
- Enterprise security and reliability
- Pay-per-use pricing

## Installation

\`\`\`bash
pip install pinecone-client
\`\`\`

## Your Task

1. Create a Pinecone account and get API key
2. Initialize the Pinecone client
3. Create an index and upsert vectors
4. Query for similar vectors and inspect results`,
  solutionContent: `# Solution: Pinecone Setup

\`\`\`python
from pinecone import Pinecone
from openai import OpenAI

# Initialize clients
pc = Pinecone(api_key="your-pinecone-api-key")
openai_client = OpenAI()

# Create index (only once)
if "my-index" not in pc.list_indexes().names():
    pc.create_index(
        name="my-index",
        dimension=1536,  # text-embedding-3-small dimension
        metric="cosine"
    )

# Connect to index
index = pc.Index("my-index")

# Helper to get embeddings
def get_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

# Upsert vectors
documents = [
    {"id": "doc1", "text": "Python is great for ML"},
    {"id": "doc2", "text": "JavaScript for web development"},
]

vectors = [
    {
        "id": doc["id"],
        "values": get_embedding(doc["text"]),
        "metadata": {"text": doc["text"]}
    }
    for doc in documents
]

index.upsert(vectors=vectors)

# Query
query_embedding = get_embedding("machine learning programming")
results = index.query(
    vector=query_embedding,
    top_k=2,
    include_metadata=True
)

for match in results['matches']:
    print(f"Score: {match['score']:.3f} - {match['metadata']['text']}")
\`\`\``,
  explanationContent: `# Pinecone Deep Dive

## Index Types

\`\`\`python
# Serverless (recommended for most use cases)
pc.create_index(
    name="my-index",
    dimension=1536,
    metric="cosine",
    spec=ServerlessSpec(cloud="aws", region="us-east-1")
)

# Pod-based (more control)
pc.create_index(
    name="my-index",
    dimension=1536,
    metric="cosine",
    spec=PodSpec(environment="gcp-starter")
)
\`\`\`

## Namespaces

Partition data within an index:

\`\`\`python
# Upsert to specific namespace
index.upsert(vectors=vectors, namespace="user_123")

# Query specific namespace
index.query(vector=query, namespace="user_123")
\`\`\`

## Metadata Filtering

\`\`\`python
results = index.query(
    vector=query_embedding,
    top_k=10,
    filter={
        "category": {"$eq": "tech"},
        "date": {"$gte": "2024-01-01"}
    }
)
\`\`\``,
  realworldContent: `# Real-World: Multi-Tenant SaaS

## Scenario: Document Search for Multiple Companies

Each company's data is isolated using namespaces:

\`\`\`python
def index_document(company_id: str, doc: Document):
    """Index document for specific company."""
    vector = {
        "id": doc.id,
        "values": get_embedding(doc.text),
        "metadata": {
            "title": doc.title,
            "date": doc.date
        }
    }
    index.upsert(
        vectors=[vector],
        namespace=company_id  # Isolation!
    )

def search_documents(company_id: str, query: str):
    """Search only within company's documents."""
    return index.query(
        vector=get_embedding(query),
        namespace=company_id,  # Only their data
        top_k=10,
        include_metadata=True
    )
\`\`\`

## Benefits

- Data isolation between customers
- Per-tenant usage tracking
- Easy customer data deletion`,
  mistakesContent: `# Common Mistakes

## 1. Wrong Dimension

\`\`\`python
# WRONG - Dimension mismatch
pc.create_index(dimension=768)  # But embeddings are 1536!

# RIGHT - Match your embedding model
# text-embedding-3-small = 1536
# text-embedding-3-large = 3072
pc.create_index(dimension=1536)
\`\`\`

## 2. Not Including Metadata

\`\`\`python
# WRONG - Can't see what matched
index.query(vector=query, include_metadata=False)

# RIGHT - Include metadata
index.query(vector=query, include_metadata=True)
\`\`\`

## 3. Ignoring Rate Limits

\`\`\`python
# WRONG - Hits rate limits
for doc in million_docs:
    index.upsert([vector])

# RIGHT - Batch upserts
for batch in chunks(vectors, 100):
    index.upsert(batch)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do Pinecone namespaces differ from separate indexes?

**Answer**:
- Namespaces: Logical partitions, share resources, no extra cost
- Indexes: Physical separation, separate billing, more isolation

## Q2: How would you handle index updates for millions of documents?

**Answer**:
1. Batch upserts (100-1000 vectors per call)
2. Use async/parallel processing
3. Implement retry logic with backoff
4. Monitor with Pinecone's dashboard

## Q3: What happens if you query with a different embedding model?

**Answer**: Results will be meaningless! The query vector dimensions might not match (error) or the semantic space is different (wrong results). Always use the same model for indexing and querying.`,
  starterCode: `from pinecone import Pinecone

# TODO: Initialize Pinecone client
# pc = Pinecone(api_key="...")

# TODO: Create or connect to an index
# (Use dimension=1536 for text-embedding-3-small)

# TODO: Create a function to upsert documents
def upsert_documents(docs):
    """
    docs: list of {"id": str, "text": str}
    """
    pass

# TODO: Create a function to search
def search(query: str, top_k: int = 3):
    """Search for similar documents."""
    pass

# Test with sample documents
sample_docs = [
    {"id": "1", "text": "The cat sat on the mat"},
    {"id": "2", "text": "Dogs love to play fetch"},
    {"id": "3", "text": "Python is a programming language"}
]`,
  solutionCode: `from pinecone import Pinecone
from openai import OpenAI

# Initialize clients
pc = Pinecone(api_key="your-api-key")  # Replace with your key
openai_client = OpenAI()

# Connect to index (assumes it exists)
index = pc.Index("my-index")

def get_embedding(text):
    response = openai_client.embeddings.create(
        model="text-embedding-3-small",
        input=text
    )
    return response.data[0].embedding

def upsert_documents(docs):
    """Upsert documents to Pinecone."""
    vectors = [
        {
            "id": doc["id"],
            "values": get_embedding(doc["text"]),
            "metadata": {"text": doc["text"]}
        }
        for doc in docs
    ]
    index.upsert(vectors=vectors)
    print(f"Upserted {len(docs)} documents")

def search(query: str, top_k: int = 3):
    """Search for similar documents."""
    query_embedding = get_embedding(query)
    results = index.query(
        vector=query_embedding,
        top_k=top_k,
        include_metadata=True
    )
    return [(m['metadata']['text'], m['score']) for m in results['matches']]

# Test
sample_docs = [
    {"id": "1", "text": "The cat sat on the mat"},
    {"id": "2", "text": "Dogs love to play fetch"},
    {"id": "3", "text": "Python is a programming language"}
]

upsert_documents(sample_docs)
print(search("animals and pets"))`,
  hints: [
    "Initialize with Pinecone(api_key='...')",
    "Get embedding for each document before upserting",
    "Include metadata with the text for retrieval"
  ]
};
