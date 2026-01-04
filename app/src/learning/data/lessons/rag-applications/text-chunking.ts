import type { LessonContent } from '../types';

export const textChunking: LessonContent = {
  slug: "text-chunking",
  problemContent: `# Text Chunking

Split large documents into smaller, manageable pieces!

## Why Split Documents?

- LLMs have token limits
- Smaller chunks = more precise retrieval
- Better matching for similarity search
- Faster processing

## The Problem

\`\`\`python
# A 50-page PDF loaded as one document
doc = loader.load()[0]
print(len(doc.page_content))  # 100,000 characters!
# Too big for effective retrieval
\`\`\`

## The Solution: Text Splitters

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,      # Target chunk size
    chunk_overlap=50     # Overlap between chunks
)

chunks = splitter.split_documents([doc])
print(f"Split into {len(chunks)} chunks")
\`\`\`

## Common Splitters

| Splitter | Best For |
|----------|---------|
| \`RecursiveCharacterTextSplitter\` | General text |
| \`CharacterTextSplitter\` | Simple splitting |
| \`TokenTextSplitter\` | Token-aware splitting |
| \`MarkdownHeaderTextSplitter\` | Markdown files |

## Your Task

1. Load a document
2. Split it into chunks
3. Examine chunk sizes and overlap`,

  solutionContent: `# Solution: Text Chunking

\`\`\`python
from langchain_community.document_loaders import TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter

# 1. Load a document
loader = TextLoader("long_document.txt")
docs = loader.load()
print(f"Original doc length: {len(docs[0].page_content)} characters")

# 2. Create splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,          # Each chunk ~500 chars
    chunk_overlap=50,        # 50 char overlap
    separators=["\\n\\n", "\\n", " ", ""]  # Split on paragraphs first
)

# 3. Split the documents
chunks = splitter.split_documents(docs)

print(f"\\nSplit into {len(chunks)} chunks")

# Examine first few chunks
for i, chunk in enumerate(chunks[:3]):
    print(f"\\nChunk {i+1} ({len(chunk.page_content)} chars):")
    print(chunk.page_content[:100] + "...")
    print("Metadata:", chunk.metadata)
\`\`\`

## Output
\`\`\`
Original doc length: 5000 characters

Split into 12 chunks

Chunk 1 (487 chars):
This is the beginning of the document...
Metadata: {'source': 'long_document.txt'}
\`\`\``,

  explanationContent: `# Deep Dive: How Splitting Works

## Chunk Size

Target number of characters per chunk:
\`\`\`python
chunk_size=500  # Aim for 500 characters
\`\`\`

## Chunk Overlap

Characters to repeat between chunks:
\`\`\`python
chunk_overlap=50  # 50 chars overlap
\`\`\`

## Why Overlap?

Prevents splitting important context:
\`\`\`
Chunk 1: "...the refund policy states that customers..."
Chunk 2: "...policy states that customers can return..."
         ↑ overlap ensures context preserved
\`\`\`

## Recursive Splitting

Tries separators in order:
1. Split on "\\n\\n" (paragraphs)
2. If too big, split on "\\n" (lines)
3. If still too big, split on " " (words)
4. Last resort: split on "" (characters)

\`\`\`python
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
    separators=["\\n\\n", "\\n", " ", ""]
)
\`\`\``,

  realworldContent: `# Real-World Chunking

## For Technical Docs

\`\`\`python
# Smaller chunks for precise retrieval
splitter = RecursiveCharacterTextSplitter(
    chunk_size=300,
    chunk_overlap=30
)
\`\`\`

## For Long-Form Content

\`\`\`python
# Larger chunks for context
splitter = RecursiveCharacterTextSplitter(
    chunk_size=1000,
    chunk_overlap=100
)
\`\`\`

## Markdown-Aware Splitting

\`\`\`python
from langchain.text_splitter import MarkdownHeaderTextSplitter

headers_to_split_on = [
    ("#", "Header 1"),
    ("##", "Header 2"),
    ("###", "Header 3"),
]

splitter = MarkdownHeaderTextSplitter(
    headers_to_split_on=headers_to_split_on
)
# Splits on headers, preserves structure
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Chunk Size Too Large

\`\`\`python
# Wrong - chunks too big
splitter = RecursiveCharacterTextSplitter(chunk_size=5000)
# Hard to find specific information

# Right - reasonable size
splitter = RecursiveCharacterTextSplitter(chunk_size=500)
\`\`\`

## 2. No Overlap

\`\`\`python
# Wrong - no overlap
splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=0  # Splits context!
)

# Right - add overlap
chunk_overlap=50  # 10% overlap
\`\`\`

## 3. Using split_text vs split_documents

\`\`\`python
# Wrong - loses metadata
chunks = splitter.split_text(docs[0].page_content)
# chunks are just strings!

# Right - preserves metadata
chunks = splitter.split_documents(docs)
# chunks are Document objects with metadata
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why chunk documents?

**Answer:** LLMs have token limits, smaller chunks enable precise retrieval, better similarity matching, and faster processing.

## Q2: What's chunk overlap and why use it?

**Answer:** Repeating characters between chunks. Prevents losing context at chunk boundaries. Typical: 10% overlap (50 chars for 500 char chunks).

## Q3: How does RecursiveCharacterTextSplitter work?

**Answer:** Tries splitting on separators in order (paragraphs, lines, words, chars). Ensures chunks stay under target size while preserving natural breaks.`,

  starterCode: `from langchain.text_splitter import RecursiveCharacterTextSplitter

# Sample long text
long_text = """
This is a long document that needs to be split into smaller chunks.

Paragraph two continues the discussion with more details about the topic.

Paragraph three adds even more information that we need to process.
""" * 10  # Repeat to make it longer

# 1. Create a text splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20
)

# 2. Split the text
chunks = splitter.split_text(long_text)

# 3. Examine results
print(f"Split into {len(chunks)} chunks")
for i, chunk in enumerate(chunks[:3]):
    print(f"\\nChunk {i+1} ({len(chunk)} chars):")
    print(chunk[:100] + "...")`,

  solutionCode: `from langchain.text_splitter import RecursiveCharacterTextSplitter

# Sample long text
long_text = """
This is a long document that needs to be split into smaller chunks.

Paragraph two continues the discussion with more details about the topic.

Paragraph three adds even more information that we need to process.
""" * 10  # Repeat to make it longer

# 1. Create a text splitter
splitter = RecursiveCharacterTextSplitter(
    chunk_size=200,
    chunk_overlap=20
)

# 2. Split the text
chunks = splitter.split_text(long_text)

# 3. Examine results
print(f"Split into {len(chunks)} chunks")
for i, chunk in enumerate(chunks[:3]):
    print(f"\\nChunk {i+1} ({len(chunk)} chars):")
    print(chunk[:100] + "...")`,

  hints: [
    "RecursiveCharacterTextSplitter is most versatile",
    "chunk_size: target characters per chunk (500-1000 typical)",
    "chunk_overlap: 10% of chunk_size is common",
    "Use split_documents() to preserve metadata"
  ]
};
