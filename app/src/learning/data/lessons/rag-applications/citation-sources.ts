import type { LessonContent } from '../types';

export const citationSources: LessonContent = {
  slug: "citation-sources",
  problemContent: `# Citation and Sources

Track where answers come from!

## Citation Metadata

| Field | Description | Example |
|-------|-------------|---------|
| source | File path/URL | \`docs/policy.pdf\` |
| page | Page number | \`3\` |
| chunk_id | Chunk identifier | \`doc_001_chunk_5\` |
| timestamp | When indexed | \`2024-01-15\` |

## Why Citations Matter

- Verify accuracy
- Build trust
- Enable fact-checking
- Meet compliance requirements

## Basic Source Tracking

\`\`\`python
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True  # Key!
)

result = qa_chain.invoke({"query": "What is our policy?"})
print("Answer:", result["result"])
print("Sources:", result["source_documents"])
\`\`\`

## Formatted Citations

\`\`\`python
# Format citations nicely
for i, doc in enumerate(result["source_documents"]):
    source = doc.metadata.get("source", "Unknown")
    page = doc.metadata.get("page", "")
    print(f"[{i+1}] {source} (page {page})")
    print(f"    {doc.page_content[:100]}...")
\`\`\`

## Your Task

1. Create a QA chain with source tracking
2. Ask questions and display citations
3. Format citations for user-friendly output`,

  solutionContent: `# Solution: Citation Sources

\`\`\`python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create docs with metadata
docs = [
    Document(
        page_content="Employees get 15 days PTO per year.",
        metadata={"source": "hr_policy.pdf", "page": 12}
    ),
    Document(
        page_content="Remote work allowed 3 days per week.",
        metadata={"source": "remote_work.pdf", "page": 3}
    ),
    Document(
        page_content="Health insurance starts after 90 days.",
        metadata={"source": "benefits.pdf", "page": 7}
    ),
]

# Create QA chain
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Ask question
query = "How many PTO days do I get?"
result = qa_chain.invoke({"query": query})

# Display answer with citations
print(f"Question: {query}")
print(f"\\nAnswer: {result['result']}")
print("\\nSources:")

for i, doc in enumerate(result["source_documents"]):
    source = doc.metadata.get("source", "Unknown")
    page = doc.metadata.get("page", "N/A")
    print(f"\\n[{i+1}] {source}, page {page}")
    print(f"    \"{doc.page_content[:80]}...\"")
\`\`\`

## Output
\`\`\`
Question: How many PTO days do I get?

Answer: You get 15 days of PTO per year.

Sources:

[1] hr_policy.pdf, page 12
    "Employees get 15 days PTO per year."
\`\`\``,

  explanationContent: `# Deep Dive: Citation Strategies

## Metadata for Citations

Store source info in metadata:
\`\`\`python
Document(
    page_content="The text...",
    metadata={
        "source": "document.pdf",
        "page": 5,
        "section": "Policies",
        "author": "HR Team",
        "date": "2024-01-01"
    }
)
\`\`\`

## Inline Citations

Add citations directly to answer:
\`\`\`python
from langchain.prompts import PromptTemplate

template = """Answer the question based on the context.
Include citations like [1], [2] for each source.

Context: {context}

Question: {question}

Answer with citations:"""

prompt = PromptTemplate(template=template, input_variables=["context", "question"])
\`\`\`

## Citation Formatting

\`\`\`python
def format_citations(result):
    answer = result["result"]
    sources = result["source_documents"]

    output = f"Answer: {answer}\\n\\nSources:\\n"
    for i, doc in enumerate(sources):
        output += f"[{i+1}] {doc.metadata.get('source', 'Unknown')}\\n"
        output += f"    {doc.page_content[:100]}...\\n\\n"

    return output
\`\`\``,

  realworldContent: `# Real-World Citations

## Legal/Compliance Use Cases

\`\`\`python
# Must cite source for every claim
def answer_with_citations(query):
    result = qa_chain.invoke({"query": query})

    # Verify each source
    citations = []
    for doc in result["source_documents"]:
        citations.append({
            "document": doc.metadata["source"],
            "page": doc.metadata["page"],
            "text": doc.page_content,
            "confidence": doc.metadata.get("score", 0)
        })

    return {
        "answer": result["result"],
        "citations": citations,
        "timestamp": datetime.now()
    }
\`\`\`

## Customer-Facing App

\`\`\`python
# User-friendly citation display
def format_for_ui(result):
    return {
        "answer": result["result"],
        "sources": [
            {
                "title": doc.metadata.get("title", "Document"),
                "url": doc.metadata.get("url", "#"),
                "excerpt": doc.page_content[:200]
            }
            for doc in result["source_documents"]
        ]
    }
\`\`\`

## Audit Trail

\`\`\`python
# Log all queries and sources for compliance
def log_qa_interaction(query, result):
    log_entry = {
        "timestamp": datetime.now(),
        "query": query,
        "answer": result["result"],
        "sources_used": [
            {
                "file": doc.metadata["source"],
                "page": doc.metadata.get("page"),
                "chunk_id": doc.metadata.get("chunk_id")
            }
            for doc in result["source_documents"]
        ]
    }
    save_to_audit_log(log_entry)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Storing Metadata

\`\`\`python
# Wrong - no source info
doc = Document(page_content="Some text")

# Right - include metadata
doc = Document(
    page_content="Some text",
    metadata={"source": "file.pdf", "page": 5}
)
\`\`\`

## 2. Forgetting return_source_documents

\`\`\`python
# Wrong - no sources returned
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)
# result only has "result" key

# Right
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)
# result has both "result" and "source_documents"
\`\`\`

## 3. Not Deduplicating Sources

\`\`\`python
# Wrong - show duplicate citations
# [1] doc.pdf
# [2] doc.pdf (same document twice)

# Right - deduplicate
seen_sources = set()
unique_sources = []
for doc in result["source_documents"]:
    source = doc.metadata["source"]
    if source not in seen_sources:
        seen_sources.add(source)
        unique_sources.append(doc)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: Why include citations in RAG?

**Answer:** Verify accuracy, build user trust, enable fact-checking, meet compliance/legal requirements, debug retrieval issues.

## Q2: What metadata should documents have?

**Answer:** At minimum: source file/URL, page number. Optional: section, author, date, document title, chunk ID. Depends on use case.

## Q3: How to format citations for users?

**Answer:** Include document name, page/section, short excerpt. Make clickable if possible. Number them [1], [2]. Group duplicates. Keep concise but informative.`,

  starterCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create documents with rich metadata
docs = [
    Document(
        page_content="Python was created in 1991.",
        metadata={"source": "python_history.pdf", "page": 1, "author": "Guide"}
    ),
    Document(
        page_content="Python is used for web development and data science.",
        metadata={"source": "python_uses.pdf", "page": 3, "author": "Tech Team"}
    ),
]

# Create QA chain with sources
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Query with citations
result = qa_chain.invoke({"query": "When was Python created?"})

print("Answer:", result["result"])
print("\\nCitations:")
for i, doc in enumerate(result["source_documents"]):
    print(f"[{i+1}] {doc.metadata['source']}, p.{doc.metadata['page']}")
    print(f"    {doc.page_content}")`,

  solutionCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create documents with rich metadata
docs = [
    Document(
        page_content="Python was created in 1991.",
        metadata={"source": "python_history.pdf", "page": 1, "author": "Guide"}
    ),
    Document(
        page_content="Python is used for web development and data science.",
        metadata={"source": "python_uses.pdf", "page": 3, "author": "Tech Team"}
    ),
]

# Create QA chain with sources
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Query with citations
result = qa_chain.invoke({"query": "When was Python created?"})

print("Answer:", result["result"])
print("\\nCitations:")
for i, doc in enumerate(result["source_documents"]):
    print(f"[{i+1}] {doc.metadata['source']}, p.{doc.metadata['page']}")
    print(f"    {doc.page_content}")`,

  hints: [
    "Always use return_source_documents=True in QA chains",
    "Store source, page, and other metadata in Document objects",
    "Format citations: [1] filename.pdf, page 5",
    "Deduplicate sources before displaying to user"
  ]
};
