import type { LessonContent } from '../types';

export const chromaSetup: LessonContent = {
  slug: "chroma-setup",
  problemContent: `# Getting Started with Chroma

Chroma is perfect for learning and prototyping. Let's set it up!

## Chroma Concepts

| Concept | Description |
|---------|-------------|
| Client | Connection to Chroma |
| Collection | Group of related vectors |
| Document | Text + embedding + metadata |
| Query | Search for similar documents |

## What is Chroma?

- Open-source vector database
- Runs locally (no cloud needed)
- Simple Python API
- Perfect for RAG applications

## Installation

\`\`\`bash
pip install chromadb
\`\`\`

## Your Task

1. Install chromadb and create a client
2. Create a collection for storing documents
3. Add documents with embeddings and metadata
4. Perform a similarity search query`,
  solutionContent: `# Solution: Chroma Setup

\`\`\`python
import chromadb
from chromadb.utils import embedding_functions

# Create a client (persists to disk)
client = chromadb.PersistentClient(path="./chroma_db")

# Use OpenAI embeddings
openai_ef = embedding_functions.OpenAIEmbeddingFunction(
    api_key="your-api-key",  # Or use env var
    model_name="text-embedding-3-small"
)

# Create a collection
collection = client.get_or_create_collection(
    name="my_documents",
    embedding_function=openai_ef
)

# Add documents (embeddings created automatically)
collection.add(
    documents=[
        "Python is a programming language",
        "JavaScript runs in browsers",
        "Machine learning uses algorithms"
    ],
    ids=["doc1", "doc2", "doc3"],
    metadatas=[
        {"topic": "python"},
        {"topic": "javascript"},
        {"topic": "ml"}
    ]
)

# Query
results = collection.query(
    query_texts=["What language is good for ML?"],
    n_results=2
)

print(results['documents'])
\`\`\``,
  explanationContent: `# Chroma Deep Dive

## Client Types

\`\`\`python
# In-memory (data lost on restart)
client = chromadb.Client()

# Persistent (saved to disk)
client = chromadb.PersistentClient(path="./db")

# HTTP client (connect to server)
client = chromadb.HttpClient(host="localhost", port=8000)
\`\`\`

## Collection Operations

\`\`\`python
# Create
collection = client.create_collection("name")

# Get existing
collection = client.get_collection("name")

# Get or create
collection = client.get_or_create_collection("name")

# Delete
client.delete_collection("name")

# List all
collections = client.list_collections()
\`\`\`

## Document Operations

\`\`\`python
# Add
collection.add(documents=[...], ids=[...])

# Update
collection.update(ids=["doc1"], documents=["new text"])

# Upsert (add or update)
collection.upsert(ids=["doc1"], documents=["text"])

# Delete
collection.delete(ids=["doc1"])
\`\`\``,
  realworldContent: `# Real-World: Document Q&A System

## Scenario: Company Knowledge Base

Store and search internal documents:

\`\`\`python
# Index company documents
collection.add(
    documents=[doc.text for doc in company_docs],
    ids=[doc.id for doc in company_docs],
    metadatas=[{
        "department": doc.department,
        "date": doc.date,
        "author": doc.author
    } for doc in company_docs]
)

# Search with filters
results = collection.query(
    query_texts=["vacation policy"],
    n_results=5,
    where={"department": "HR"}  # Only HR docs
)
\`\`\`

## Benefits

- Instant search across thousands of documents
- No keyword matching needed
- Filter by department, date, author
- Works offline (local Chroma)`,
  mistakesContent: `# Common Mistakes

## 1. Duplicate IDs

\`\`\`python
# WRONG - Same ID twice causes error
collection.add(
    documents=["doc1", "doc2"],
    ids=["same_id", "same_id"]  # Error!
)

# RIGHT - Unique IDs
collection.add(
    documents=["doc1", "doc2"],
    ids=["id_1", "id_2"]
)
\`\`\`

## 2. Not Using Persistence

\`\`\`python
# WRONG - Data lost on restart
client = chromadb.Client()

# RIGHT - Save to disk
client = chromadb.PersistentClient(path="./db")
\`\`\`

## 3. Forgetting Metadata

\`\`\`python
# WRONG - No way to filter later
collection.add(documents=[text], ids=["1"])

# RIGHT - Add useful metadata
collection.add(
    documents=[text],
    ids=["1"],
    metadatas=[{"source": "manual", "date": "2024-01"}]
)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How does Chroma handle embeddings?

**Answer**: Chroma can:
1. Auto-embed using built-in or custom embedding functions
2. Accept pre-computed embeddings directly
3. Store documents with their embeddings

## Q2: When would you NOT use Chroma?

**Answer**:
- Very large scale (billions of vectors)
- Need managed cloud service
- High availability requirements
- Multi-region replication

## Q3: How do you update a document in Chroma?

**Answer**: Use update() or upsert():
\`\`\`python
collection.update(ids=["doc1"], documents=["new text"])
# or
collection.upsert(ids=["doc1"], documents=["new text"])
\`\`\``,
  starterCode: `import chromadb

# TODO: Create a persistent client
client = None

# TODO: Create a collection called "my_notes"
collection = None

# TODO: Add these documents with IDs and metadata
notes = [
    ("Meeting notes from Monday discussion", "work"),
    ("Recipe for chocolate cake", "cooking"),
    ("Python list comprehension tips", "programming")
]

# TODO: Query for programming-related notes

# Print results`,
  solutionCode: `import chromadb

# Create a persistent client
client = chromadb.PersistentClient(path="./my_chroma_db")

# Create a collection
collection = client.get_or_create_collection(name="my_notes")

# Add documents with IDs and metadata
notes = [
    ("Meeting notes from Monday discussion", "work"),
    ("Recipe for chocolate cake", "cooking"),
    ("Python list comprehension tips", "programming")
]

collection.add(
    documents=[note[0] for note in notes],
    ids=[f"note_{i}" for i in range(len(notes))],
    metadatas=[{"category": note[1]} for note in notes]
)

# Query for programming-related notes
results = collection.query(
    query_texts=["How to write Python code"],
    n_results=2
)

print("Query: How to write Python code")
print("Results:", results['documents'])
print("Categories:", [m['category'] for m in results['metadatas'][0]])`,
  hints: [
    "Use chromadb.PersistentClient(path='./my_chroma_db')",
    "Use client.get_or_create_collection('my_notes')",
    "Pass documents, ids, and metadatas to collection.add()"
  ]
};
