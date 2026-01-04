import type { LessonContent } from '../types';

export const metadataFiltering: LessonContent = {
  slug: "metadata-filtering",
  problemContent: `# Metadata Filtering

Vector search + metadata filters = Powerful search!

## Filter Operators

| Operator | Meaning | Example |
|----------|---------|---------|
| \`$eq\` | Equals | \`{"status": "active"}\` |
| \`$ne\` | Not equals | \`{"status": {"$ne": "deleted"}}\` |
| \`$gt\` / \`$gte\` | Greater than | \`{"price": {"$gte": 100}}\` |
| \`$lt\` / \`$lte\` | Less than | \`{"price": {"$lt": 50}}\` |
| \`$in\` | In list | \`{"category": {"$in": ["tech", "books"]}}\` |

## Why Metadata Filtering?

Sometimes you need both:
- Semantic similarity (vectors)
- Exact constraints (metadata)

Example: "Find technical docs from 2024"
- Semantic: "technical docs"
- Filter: year = 2024

## Your Task

1. Add metadata to your vector documents
2. Use \`where\` filters to narrow search scope
3. Combine semantic search with metadata filtering
4. Build a filtered search for a specific use case`,
  solutionContent: `# Solution: Metadata Filtering

\`\`\`python
import chromadb

client = chromadb.PersistentClient(path="./filtered_db")
collection = client.get_or_create_collection("products")

# Add products with rich metadata
products = [
    {
        "text": "Wireless Bluetooth headphones with noise cancellation",
        "metadata": {"category": "electronics", "price": 199, "in_stock": True}
    },
    {
        "text": "Organic green tea from Japan",
        "metadata": {"category": "food", "price": 25, "in_stock": True}
    },
    {
        "text": "Professional DSLR camera with 4K video",
        "metadata": {"category": "electronics", "price": 1299, "in_stock": False}
    },
    {
        "text": "Noise cancelling earbuds for travel",
        "metadata": {"category": "electronics", "price": 149, "in_stock": True}
    }
]

collection.add(
    documents=[p["text"] for p in products],
    ids=[f"prod_{i}" for i in range(len(products))],
    metadatas=[p["metadata"] for p in products]
)

# Query with filters
results = collection.query(
    query_texts=["audio equipment for listening to music"],
    n_results=3,
    where={
        "$and": [
            {"category": {"$eq": "electronics"}},
            {"in_stock": {"$eq": True}},
            {"price": {"$lte": 200}}
        ]
    }
)

print("Audio equipment, electronics, in stock, under $200:")
for doc, meta in zip(results['documents'][0], results['metadatas'][0]):
    print(f"  {doc} - \${meta['price']}")
\`\`\``,
  explanationContent: `# Filter Syntax Deep Dive

## Chroma Filters

\`\`\`python
# Simple equality
where={"field": "value"}

# Operators
where={"field": {"$eq": "value"}}
where={"field": {"$ne": "value"}}  # not equal
where={"field": {"$gt": 10}}       # greater than
where={"field": {"$gte": 10}}      # greater or equal
where={"field": {"$lt": 10}}       # less than
where={"field": {"$lte": 10}}      # less or equal
where={"field": {"$in": ["a", "b"]}}  # in list

# Logical operators
where={"$and": [filter1, filter2]}
where={"$or": [filter1, filter2]}
\`\`\`

## Pinecone Filters

\`\`\`python
filter={
    "category": {"$eq": "tech"},
    "price": {"$lte": 100},
    "$or": [
        {"brand": {"$eq": "Apple"}},
        {"brand": {"$eq": "Samsung"}}
    ]
}
\`\`\`

## Best Practices

1. Index metadata you'll filter on
2. Use specific types (not mixed)
3. Keep metadata lightweight`,
  realworldContent: `# Real-World: E-commerce Search

## Scenario: Product Discovery

Combine semantic understanding with business logic:

\`\`\`python
def search_products(
    query: str,
    category: str = None,
    min_price: float = None,
    max_price: float = None,
    in_stock_only: bool = True
):
    filters = []

    if category:
        filters.append({"category": {"$eq": category}})
    if min_price:
        filters.append({"price": {"$gte": min_price}})
    if max_price:
        filters.append({"price": {"$lte": max_price}})
    if in_stock_only:
        filters.append({"in_stock": {"$eq": True}})

    where = {"$and": filters} if filters else None

    return collection.query(
        query_texts=[query],
        n_results=20,
        where=where
    )

# User: "comfortable shoes" + filters from sidebar
results = search_products(
    query="comfortable running shoes",
    category="footwear",
    max_price=150,
    in_stock_only=True
)
\`\`\``,
  mistakesContent: `# Common Mistakes

## 1. Wrong Operator Syntax

\`\`\`python
# WRONG
where={"price": ">100"}

# RIGHT
where={"price": {"$gt": 100}}
\`\`\`

## 2. Type Mismatches

\`\`\`python
# WRONG - Stored as string, filtering as int
metadatas=[{"price": "100"}]  # String!
where={"price": {"$gt": 50}}   # Won't work

# RIGHT - Consistent types
metadatas=[{"price": 100}]    # Integer
where={"price": {"$gt": 50}}  # Works!
\`\`\`

## 3. Filtering on Missing Fields

\`\`\`python
# Document without "category" field
# Filter for category will exclude it

# Solution: Always include expected fields
metadatas=[{"category": doc.get("category", "unknown")}]
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: How do filters affect search performance?

**Answer**:
- Filters are applied AFTER vector similarity
- Complex filters may slow down queries
- Pre-filter when possible for better performance

## Q2: How would you implement "search within category"?

**Answer**:
\`\`\`python
results = collection.query(
    query_texts=[user_query],
    where={"category": {"$eq": selected_category}},
    n_results=20
)
\`\`\`

## Q3: Can you do full-text search with vector databases?

**Answer**: Most vector DBs focus on semantic search. For full-text:
- Use hybrid search (combine BM25 + vectors)
- Pinecone supports hybrid search
- Or use separate text search index`,
  starterCode: `import chromadb

client = chromadb.PersistentClient(path="./filter_demo")
collection = client.get_or_create_collection("articles")

# Sample articles
articles = [
    {"text": "New AI breakthrough in language models", "category": "tech", "year": 2024},
    {"text": "Climate change affects global weather patterns", "category": "science", "year": 2023},
    {"text": "Stock market reaches all-time high", "category": "finance", "year": 2024},
    {"text": "Revolutionary battery technology announced", "category": "tech", "year": 2024},
    {"text": "Space exploration mission to Mars", "category": "science", "year": 2024},
]

# TODO: Add articles with metadata

# TODO: Search for tech articles from 2024

# TODO: Search for any 2024 articles about innovation`,
  solutionCode: `import chromadb

client = chromadb.PersistentClient(path="./filter_demo")
collection = client.get_or_create_collection("articles")

# Sample articles
articles = [
    {"text": "New AI breakthrough in language models", "category": "tech", "year": 2024},
    {"text": "Climate change affects global weather patterns", "category": "science", "year": 2023},
    {"text": "Stock market reaches all-time high", "category": "finance", "year": 2024},
    {"text": "Revolutionary battery technology announced", "category": "tech", "year": 2024},
    {"text": "Space exploration mission to Mars", "category": "science", "year": 2024},
]

# Add articles with metadata
collection.add(
    documents=[a["text"] for a in articles],
    ids=[f"article_{i}" for i in range(len(articles))],
    metadatas=[{"category": a["category"], "year": a["year"]} for a in articles]
)

# Search for tech articles from 2024
print("Tech articles from 2024:")
results = collection.query(
    query_texts=["technology advances"],
    n_results=3,
    where={"$and": [{"category": {"$eq": "tech"}}, {"year": {"$eq": 2024}}]}
)
for doc in results['documents'][0]:
    print(f"  - {doc}")

# Search for any 2024 articles about innovation
print("\n2024 articles about innovation:")
results = collection.query(
    query_texts=["innovation and breakthroughs"],
    n_results=3,
    where={"year": {"$eq": 2024}}
)
for doc in results['documents'][0]:
    print(f"  - {doc}")`,
  hints: [
    "Use where={'$and': [...]} to combine multiple conditions",
    "Operators like $eq, $gt, $lt need the format: {'field': {'$op': value}}",
    "Remember to add metadata when inserting documents"
  ]
};
