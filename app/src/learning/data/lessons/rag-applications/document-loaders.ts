import type { LessonContent } from '../types';

export const documentLoaders: LessonContent = {
  slug: "document-loaders",
  problemContent: `# Document Loaders

Load documents from various sources into your RAG system!

## What are Document Loaders?

They import files and convert them to a standard format LangChain can use.

## Common Loaders

| Loader | File Type |
|--------|-----------|
| \`TextLoader\` | .txt files |
| \`PyPDFLoader\` | PDF files |
| \`CSVLoader\` | CSV files |
| \`UnstructuredMarkdownLoader\` | Markdown |
| \`WebBaseLoader\` | Web pages |

## Loading Text Files

\`\`\`python
from langchain_community.document_loaders import TextLoader

loader = TextLoader("document.txt")
docs = loader.load()

print(docs[0].page_content)  # The text
print(docs[0].metadata)      # File info
\`\`\`

## Loading PDFs

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("report.pdf")
pages = loader.load()

# Each page is a separate document
for page in pages:
    print(f"Page {page.metadata['page']}: {page.page_content[:100]}")
\`\`\`

## Your Task

1. Load a text file
2. Load a PDF file
3. Examine the metadata`,

  solutionContent: `# Solution: Document Loaders

\`\`\`python
from langchain_community.document_loaders import (
    TextLoader,
    PyPDFLoader,
    CSVLoader
)

# 1. Load text file
text_loader = TextLoader("example.txt")
text_docs = text_loader.load()
print(f"Loaded {len(text_docs)} text documents")
print("Content preview:", text_docs[0].page_content[:200])
print("Metadata:", text_docs[0].metadata)

# 2. Load PDF
pdf_loader = PyPDFLoader("example.pdf")
pdf_pages = pdf_loader.load()
print(f"\\nLoaded {len(pdf_pages)} PDF pages")
for i, page in enumerate(pdf_pages[:3]):
    print(f"Page {i+1}:", page.page_content[:100])

# 3. Load CSV
csv_loader = CSVLoader("data.csv")
csv_docs = csv_loader.load()
print(f"\\nLoaded {len(csv_docs)} CSV rows")
\`\`\`

## Document Structure

Every loaded document has:
- \`page_content\`: The actual text
- \`metadata\`: Info about the source (file path, page number, etc.)`,

  explanationContent: `# Deep Dive: Document Loaders

## Document Object

\`\`\`python
from langchain.schema import Document

doc = Document(
    page_content="This is the text content",
    metadata={"source": "file.txt", "page": 1}
)
\`\`\`

## Web Page Loader

\`\`\`python
from langchain_community.document_loaders import WebBaseLoader

loader = WebBaseLoader("https://example.com")
docs = loader.load()
# Extracts text from HTML
\`\`\`

## Directory Loader

Load all files in a folder:

\`\`\`python
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader(
    "./documents",
    glob="**/*.txt"
)
docs = loader.load()
\`\`\`

## Custom Metadata

\`\`\`python
loader = TextLoader("file.txt")
docs = loader.load()

# Add custom metadata
for doc in docs:
    doc.metadata["department"] = "engineering"
    doc.metadata["year"] = 2024
\`\`\``,

  realworldContent: `# Real-World Usage

## Load Company Docs

\`\`\`python
from langchain_community.document_loaders import DirectoryLoader

# Load all PDFs from docs folder
loader = DirectoryLoader(
    "./company_docs",
    glob="**/*.pdf",
    loader_cls=PyPDFLoader
)
all_docs = loader.load()
print(f"Loaded {len(all_docs)} pages from all PDFs")
\`\`\`

## Load Multiple Sources

\`\`\`python
# Combine different sources
all_documents = []

# Load PDFs
pdf_loader = DirectoryLoader("./pdfs", glob="*.pdf", loader_cls=PyPDFLoader)
all_documents.extend(pdf_loader.load())

# Load text files
txt_loader = DirectoryLoader("./texts", glob="*.txt", loader_cls=TextLoader)
all_documents.extend(txt_loader.load())

# Load web pages
urls = ["https://docs.example.com/page1", "https://docs.example.com/page2"]
for url in urls:
    loader = WebBaseLoader(url)
    all_documents.extend(loader.load())
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Wrong Loader for File Type

\`\`\`python
# Wrong - using TextLoader for PDF
loader = TextLoader("document.pdf")  # Won't read PDF properly!

# Right - use PyPDFLoader
loader = PyPDFLoader("document.pdf")
\`\`\`

## 2. Not Handling Errors

\`\`\`python
# Wrong - crashes if file doesn't exist
loader = TextLoader("missing.txt")
docs = loader.load()  # Error!

# Right - handle errors
try:
    loader = TextLoader("missing.txt")
    docs = loader.load()
except Exception as e:
    print(f"Error loading: {e}")
\`\`\`

## 3. Ignoring Metadata

\`\`\`python
# Wrong - lose track of source
docs = loader.load()
# Which doc came from which file?

# Right - preserve metadata
for doc in docs:
    print(f"Source: {doc.metadata['source']}")
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What do document loaders do?

**Answer:** Convert files (PDF, text, web) into Document objects with page_content and metadata. Standardize format for RAG processing.

## Q2: How to load a directory of PDFs?

**Answer:** Use DirectoryLoader with glob pattern and PyPDFLoader class. Example: DirectoryLoader("./docs", glob="**/*.pdf", loader_cls=PyPDFLoader).

## Q3: What's in a Document object?

**Answer:** page_content (the text) and metadata (source, page number, etc.). Metadata helps track where information came from.`,

  starterCode: `from langchain_community.document_loaders import TextLoader, PyPDFLoader

# 1. Load a text file
# First, create a sample file
with open("sample.txt", "w") as f:
    f.write("This is a sample document for RAG.\\nIt has multiple lines.")

loader = TextLoader("sample.txt")
docs = loader.load()

print("Number of documents:", len(docs))
print("Content:", docs[0].page_content)
print("Metadata:", docs[0].metadata)`,

  solutionCode: `from langchain_community.document_loaders import TextLoader, PyPDFLoader

# 1. Load a text file
# First, create a sample file
with open("sample.txt", "w") as f:
    f.write("This is a sample document for RAG.\\nIt has multiple lines.")

loader = TextLoader("sample.txt")
docs = loader.load()

print("Number of documents:", len(docs))
print("Content:", docs[0].page_content)
print("Metadata:", docs[0].metadata)

# 2. For PDFs, use PyPDFLoader
# pdf_loader = PyPDFLoader("example.pdf")
# pdf_docs = pdf_loader.load()`,

  hints: [
    "TextLoader for .txt files, PyPDFLoader for PDFs",
    "loader.load() returns a list of Document objects",
    "Each Document has page_content and metadata",
    "Use DirectoryLoader to load multiple files at once"
  ]
};
