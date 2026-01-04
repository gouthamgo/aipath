import type { LessonContent } from '../types';

export const chunkingStrategies: LessonContent = {
  slug: "chunking-strategies",
  problemContent: `# Advanced Chunking Strategies

Different strategies for different types of content!

## Basic vs Advanced Chunking

| Strategy | When to Use |
|----------|-------------|
| Fixed-size | General content |
| Semantic | Preserve meaning |
| Hierarchical | Structured docs |
| Sliding window | Dense info |

## Fixed-Size Chunking

Simple, consistent chunks:
\`\`\`python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
\`\`\`

## Semantic Chunking

Split by meaning, not just size:
\`\`\`python
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"
)
# Splits when semantic similarity drops
\`\`\`

## Hierarchical Chunking

For structured documents:
\`\`\`python
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers = [("#", "h1"), ("##", "h2")]
splitter = MarkdownHeaderTextSplitter(headers)
# Preserves document structure
\`\`\`

## Your Task

1. Compare fixed-size vs semantic chunking
2. Try different chunk sizes
3. Observe the differences`,

  solutionContent: `# Solution: Chunking Strategies

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

sample_text = """
Introduction to Machine Learning

Machine learning is a subset of artificial intelligence.
It enables computers to learn from data without explicit programming.

Types of Machine Learning

There are three main types: supervised, unsupervised, and reinforcement learning.
Supervised learning uses labeled data to train models.
Unsupervised learning finds patterns in unlabeled data.

Applications

ML is used in recommendation systems, image recognition, and natural language processing.
"""

# 1. Fixed-size chunking
fixed_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20
)
fixed_chunks = fixed_splitter.split_text(sample_text)

print("Fixed-size chunks:", len(fixed_chunks))
for i, chunk in enumerate(fixed_chunks):
    print(f"Chunk {i+1}: {chunk[:50]}...")

# 2. Semantic chunking
semantic_splitter = SemanticChunker(
    OpenAIEmbeddings(),
    breakpoint_threshold_type="percentile"
)
semantic_chunks = semantic_splitter.split_text(sample_text)

print(f"\\nSemantic chunks: {len(semantic_chunks)}")
for i, chunk in enumerate(semantic_chunks):
    print(f"Chunk {i+1}: {chunk[:50]}...")
\`\`\``,

  explanationContent: `# Deep Dive: Chunking Strategies

## Fixed-Size with Overlap

**Pros:**
- Simple and fast
- Predictable chunk sizes
- Works for most content

**Cons:**
- May split mid-sentence
- Ignores semantic boundaries

\`\`\`python
RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
\`\`\`

## Semantic Chunking

**Pros:**
- Preserves meaning
- Natural breakpoints
- Better retrieval

**Cons:**
- Slower (uses embeddings)
- Variable chunk sizes
- Requires API calls

\`\`\`python
SemanticChunker(
    embeddings,
    breakpoint_threshold_type="percentile"
)
\`\`\`

## Hierarchical/Header-Based

**Pros:**
- Preserves structure
- Great for docs with sections
- Includes context in metadata

**Cons:**
- Only works with structured docs
- Chunks can be very different sizes

\`\`\`python
MarkdownHeaderTextSplitter(
    headers_to_split_on=[("#", "h1"), ("##", "h2")]
)
\`\`\``,

  realworldContent: `# Real-World Strategy Selection

## Technical Documentation

\`\`\`python
# Use header-based splitting
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers = [
    ("#", "title"),
    ("##", "section"),
    ("###", "subsection")
]
splitter = MarkdownHeaderTextSplitter(headers)
# Each chunk knows its section context
\`\`\`

## Long Articles/Books

\`\`\`python
# Use larger chunks with semantic splitting
splitter = SemanticChunker(
    embeddings,
    breakpoint_threshold_type="percentile"
)
# Preserves narrative flow
\`\`\`

## Mixed Content

\`\`\`python
# Use recursive with good separators
splitter = RecursiveCharacterTextSplitter(
    chunk_size=800,
    chunk_overlap=100,
    separators=["\\n\\n", "\\n", ". ", " "]
)
# Tries to split on paragraphs, then sentences
\`\`\`

## Parent-Child Chunking

\`\`\`python
# Small chunks for retrieval, large for context
parent_splitter = RecursiveCharacterTextSplitter(chunk_size=2000)
child_splitter = RecursiveCharacterTextSplitter(chunk_size=400)

parents = parent_splitter.split_documents(docs)
all_children = []
for parent in parents:
    children = child_splitter.split_documents([parent])
    for child in children:
        child.metadata["parent_id"] = id(parent)
    all_children.extend(children)
# Retrieve small chunks, return full parent for context
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. One Size Fits All

\`\`\`python
# Wrong - same strategy for all content types
splitter = RecursiveCharacterTextSplitter(chunk_size=500)
# Use for everything

# Right - choose based on content
# Technical docs: header-based
# Articles: semantic
# General: recursive
\`\`\`

## 2. Ignoring Content Structure

\`\`\`python
# Wrong - split markdown with character splitter
# Loses header structure

# Right - use MarkdownHeaderTextSplitter
# Preserves document hierarchy
\`\`\`

## 3. Chunk Size Extremes

\`\`\`python
# Too small: chunk_size=50
# Loses context, too many chunks

# Too large: chunk_size=5000
# Poor retrieval precision

# Just right: 400-1000 depending on content
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: When to use semantic vs fixed-size chunking?

**Answer:** Semantic for meaning preservation (articles, narratives). Fixed-size for speed and consistency (general content, large scale). Semantic is slower but better quality.

## Q2: What's hierarchical chunking?

**Answer:** Splitting based on document structure (headers, sections). Preserves context by keeping metadata about position in hierarchy. Great for technical docs.

## Q3: Explain parent-child chunking.

**Answer:** Create small chunks for retrieval, large chunks for context. Retrieve precise small chunks, then return full parent chunk to LLM. Best of both worlds.`,

  starterCode: `from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_experimental.text_splitter import SemanticChunker
from langchain_openai import OpenAIEmbeddings

text = """
# Introduction
This is the introduction section.

## Background
Here's some background information.

## Methods
This section describes the methods used.

# Conclusion
Final thoughts and summary.
"""

# Try different strategies
# 1. Fixed-size
fixed_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20
)
fixed_chunks = fixed_splitter.split_text(text)
print(f"Fixed: {len(fixed_chunks)} chunks")

# 2. Semantic (requires API key)
# semantic_splitter = SemanticChunker(OpenAIEmbeddings())
# semantic_chunks = semantic_splitter.split_text(text)
# print(f"Semantic: {len(semantic_chunks)} chunks")`,

  solutionCode: `from langchain.text_splitter import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter
)

text = """
# Introduction
This is the introduction section.

## Background
Here's some background information.

## Methods
This section describes the methods used.

# Conclusion
Final thoughts and summary.
"""

# 1. Fixed-size chunking
fixed_splitter = RecursiveCharacterTextSplitter(
    chunk_size=100,
    chunk_overlap=20
)
fixed_chunks = fixed_splitter.split_text(text)
print(f"Fixed: {len(fixed_chunks)} chunks")
for i, chunk in enumerate(fixed_chunks):
    print(f"{i+1}. {chunk[:40]}...")

# 2. Header-based chunking
headers = [("#", "h1"), ("##", "h2")]
md_splitter = MarkdownHeaderTextSplitter(headers)
md_chunks = md_splitter.split_text(text)
print(f"\\nMarkdown: {len(md_chunks)} chunks")
for i, chunk in enumerate(md_chunks):
    print(f"{i+1}. {chunk[:40]}...")`,

  hints: [
    "Choose strategy based on content type",
    "Semantic chunking preserves meaning but is slower",
    "Header-based splitting great for structured docs",
    "Parent-child: small for retrieval, large for context"
  ]
};
