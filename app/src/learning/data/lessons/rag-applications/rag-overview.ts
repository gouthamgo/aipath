import type { LessonContent } from '../types';

export const ragOverview: LessonContent = {
  slug: "rag-overview",
  problemContent: `# What is RAG?

RAG stands for Retrieval-Augmented Generation. It makes AI smarter by giving it access to your documents!

## The Problem with LLMs

LLMs have limitations:
- Only know data from their training (outdated)
- Don't know your private documents
- Can't cite sources
- Hallucinate when they don't know

## The RAG Solution

RAG combines:
1. **Retrieval**: Find relevant documents
2. **Augmentation**: Add them to the prompt
3. **Generation**: LLM uses those docs to answer

\`\`\`
User Question
    ↓
Find relevant chunks from your docs
    ↓
Add chunks to prompt
    ↓
LLM generates answer with context
\`\`\`

## RAG Architecture

| Step | What Happens |
|------|-------------|
| 1. Load | Import documents (PDFs, web, etc) |
| 2. Split | Break into small chunks |
| 3. Embed | Convert to vector embeddings |
| 4. Store | Save in vector database |
| 5. Query | User asks a question |
| 6. Retrieve | Find relevant chunks |
| 7. Generate | LLM answers using chunks |

## Your Task

1. Study the RAG architecture diagram above
2. Understand the 7 steps: Load → Split → Embed → Store → Query → Retrieve → Generate
3. Identify why each step is necessary
4. Run the example code to see RAG in action`,

  solutionContent: `# RAG Flow Example

\`\`\`python
# 1. Load documents
from langchain_community.document_loaders import TextLoader
loader = TextLoader("company_docs.txt")
docs = loader.load()

# 2. Split into chunks
from langchain.text_splitter import RecursiveCharacterTextSplitter
splitter = RecursiveCharacterTextSplitter(chunk_size=500)
chunks = splitter.split_documents(docs)

# 3. Create embeddings and vector store
from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

# 4. Query time - retrieve relevant chunks
query = "What's our refund policy?"
relevant_chunks = vectorstore.similarity_search(query, k=3)

# 5. Use chunks in prompt
from langchain_openai import ChatOpenAI
from langchain.chains import RetrievalQA

llm = ChatOpenAI(model="gpt-4o-mini")
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)

answer = qa_chain.invoke({"query": query})
print(answer["result"])
\`\`\``,

  explanationContent: `# Deep Dive: Why RAG Works

## Without RAG

\`\`\`python
# LLM doesn't know your data
llm.invoke("What's our company's refund policy?")
# "I don't have information about your company's refund policy"
\`\`\`

## With RAG

\`\`\`python
# 1. Find relevant docs about refund policy
# 2. Add to prompt: "Based on these docs: [chunks], answer: ..."
# 3. LLM answers accurately from your docs
\`\`\`

## Key Components

| Component | Purpose |
|-----------|---------|
| Document Loader | Import files |
| Text Splitter | Chunk documents |
| Embeddings | Convert text to vectors |
| Vector Store | Find similar chunks |
| Retriever | Get relevant context |
| LLM | Generate final answer |

## RAG vs Fine-Tuning

| RAG | Fine-Tuning |
|-----|-------------|
| Easy to update docs | Hard to retrain |
| Can cite sources | No citations |
| Lower cost | Expensive |
| Works immediately | Takes time |`,

  realworldContent: `# Real-World RAG Use Cases

## Customer Support

\`\`\`python
# Load company docs, policies, FAQs
# User asks: "How do I return a product?"
# RAG finds relevant policy docs
# Returns accurate answer with source
\`\`\`

## Legal Document Search

\`\`\`python
# Load all contracts, case law
# Lawyer asks: "Find clauses about liability"
# RAG searches thousands of docs in seconds
\`\`\`

## Internal Knowledge Base

\`\`\`python
# Load confluence, notion, wiki docs
# Employee asks: "What's the PTO policy?"
# RAG retrieves and summarizes policy
\`\`\`

## Code Documentation

\`\`\`python
# Load all code docs, READMEs
# Developer asks: "How to configure Redis?"
# RAG finds relevant setup guides
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Chunks Too Large

\`\`\`python
# Wrong - chunks too big (2000+ chars)
splitter = RecursiveCharacterTextSplitter(chunk_size=5000)
# Hard to find precise info

# Right - smaller chunks (500-1000)
splitter = RecursiveCharacterTextSplitter(chunk_size=500)
\`\`\`

## 2. Not Enough Context

\`\`\`python
# Wrong - only retrieve 1 chunk
retriever = vectorstore.as_retriever(k=1)
# Might miss important context

# Right - retrieve 3-5 chunks
retriever = vectorstore.as_retriever(k=4)
\`\`\`

## 3. No Source Citations

\`\`\`python
# Wrong - user doesn't know where answer came from
# Right - always include sources
answer = qa_chain.invoke({"query": query, "return_source_documents": True})
print("Sources:", answer["source_documents"])
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What is RAG and why use it?

**Answer:** Retrieval-Augmented Generation. Gives LLMs access to external knowledge (your docs). More accurate than pure LLM, can cite sources, easy to update.

## Q2: RAG vs fine-tuning?

**Answer:** RAG adds knowledge via retrieval (easier, updatable, cites sources). Fine-tuning bakes knowledge into weights (expensive, hard to update, no citations). Use RAG for knowledge that changes.

## Q3: Main components of RAG?

**Answer:** Document loader, text splitter, embeddings, vector store, retriever, LLM. Load docs → chunk → embed → store → retrieve → generate.`,

  starterCode: `# RAG is a pattern, not code to write
# The key is understanding the flow:

# 1. LOAD: Get your documents
# 2. SPLIT: Break into chunks
# 3. EMBED: Convert to vectors
# 4. STORE: Put in vector database
# 5. RETRIEVE: Find relevant chunks
# 6. GENERATE: LLM answers using chunks

# Next lessons will implement each step!`,

  solutionCode: `# RAG is a pattern, not code to write
# The key is understanding the flow:

# 1. LOAD: Get your documents
# 2. SPLIT: Break into chunks
# 3. EMBED: Convert to vectors
# 4. STORE: Put in vector database
# 5. RETRIEVE: Find relevant chunks
# 6. GENERATE: LLM answers using chunks

# Next lessons will implement each step!`,

  hints: [
    "RAG = Retrieval + Augmented + Generation",
    "Use RAG to give LLMs access to your documents",
    "Flow: Load → Split → Embed → Store → Retrieve → Generate",
    "Better than fine-tuning for frequently updated knowledge"
  ]
};
