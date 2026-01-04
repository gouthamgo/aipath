import type { LessonContent } from '../types';

export const qaChains: LessonContent = {
  slug: "qa-chains",
  problemContent: `# QA Chains

Build question-answering systems with RAG!

## What is a QA Chain?

Combines retrieval and generation:
1. User asks a question
2. Retrieve relevant documents
3. LLM answers based on documents

\`\`\`python
from langchain.chains import RetrievalQA

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever
)

answer = qa_chain.invoke({"query": "What is RAG?"})
print(answer["result"])
\`\`\`

## QA Chain Types

| Type | Description |
|------|-------------|
| \`stuff\` | Put all docs in one prompt (simple) |
| \`map_reduce\` | Summarize each doc, then combine |
| \`refine\` | Iteratively refine answer |
| \`map_rerank\` | Score each answer, pick best |

## Basic QA Chain

\`\`\`python
from langchain.chains import RetrievalQA
from langchain_openai import ChatOpenAI

llm = ChatOpenAI(model="gpt-4o-mini")

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # Simple: stuff all docs in prompt
    retriever=retriever
)

result = qa_chain.invoke({"query": "Your question here"})
\`\`\`

## Your Task

1. Create a QA chain
2. Load documents into a vector store
3. Ask questions and get answers`,

  solutionContent: `# Solution: QA Chains

\`\`\`python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document
from langchain.text_splitter import RecursiveCharacterTextSplitter

# Sample documents
docs_text = """
Company Policy on Remote Work

Employees may work remotely up to 3 days per week.
Remote work requests must be approved by managers.
Employees must be available during core hours (10am-3pm).

Time Off Policy

Employees receive 15 days of PTO per year.
PTO must be requested 2 weeks in advance.
Unused PTO does not roll over to the next year.
"""

# Load and split
doc = Document(page_content=docs_text)
splitter = RecursiveCharacterTextSplitter(chunk_size=200, chunk_overlap=20)
chunks = splitter.split_documents([doc])

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(chunks, embeddings)

# Create retriever
retriever = vectorstore.as_retriever(search_kwargs={"k": 3})

# Create QA chain
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    return_source_documents=True
)

# Ask questions
questions = [
    "How many days can I work remotely?",
    "How much PTO do I get?",
    "Do I need approval for remote work?"
]

for question in questions:
    result = qa_chain.invoke({"query": question})
    print(f"Q: {question}")
    print(f"A: {result['result']}")
    print()
\`\`\``,

  explanationContent: `# Deep Dive: QA Chain Types

## Stuff Chain (Most Common)

Puts all docs in one prompt:
\`\`\`python
chain_type="stuff"

# Prompt:
# Based on these documents:
# [doc1, doc2, doc3]
# Answer: {question}
\`\`\`

**Pros:** Simple, works well
**Cons:** Token limit issues with many docs

## Map Reduce

Process each doc separately, then combine:
\`\`\`python
chain_type="map_reduce"

# Step 1: Ask question to each doc individually
# Step 2: Combine all answers
\`\`\`

**Pros:** Handles many docs
**Cons:** More LLM calls, slower

## Refine

Iteratively improve answer:
\`\`\`python
chain_type="refine"

# Start with doc1 → answer1
# Add doc2 → refine answer1 → answer2
# Add doc3 → refine answer2 → answer3
\`\`\`

**Pros:** Good for complex questions
**Cons:** Sequential, slow

## Custom Prompts

\`\`\`python
from langchain.prompts import PromptTemplate

template = """Use these documents to answer the question.
If you don't know, say "I don't know".

Documents: {context}

Question: {question}

Answer:"""

prompt = PromptTemplate(template=template, input_variables=["context", "question"])

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=retriever,
    chain_type_kwargs={"prompt": prompt}
)
\`\`\``,

  realworldContent: `# Real-World QA Systems

## Customer Support Bot

\`\`\`python
# Load all FAQs, policies, docs
from langchain_community.document_loaders import DirectoryLoader

loader = DirectoryLoader("./knowledge_base", glob="**/*.txt")
docs = loader.load()

# Create QA system
vectorstore = FAISS.from_documents(docs, embeddings)
qa = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever()
)

# Customer asks
answer = qa.invoke({"query": "What's your return policy?"})
\`\`\`

## Internal Knowledge Base

\`\`\`python
# Load confluence, notion exports
docs = load_all_internal_docs()

# Department-specific retrieval
def qa_for_department(dept):
    filtered_retriever = vectorstore.as_retriever(
        search_kwargs={"filter": {"department": dept}}
    )
    return RetrievalQA.from_chain_type(llm=llm, retriever=filtered_retriever)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Not Returning Sources

\`\`\`python
# Wrong - can't verify answer
qa_chain = RetrievalQA.from_chain_type(llm=llm, retriever=retriever)

# Right - include sources
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=retriever,
    return_source_documents=True
)
print("Sources:", result["source_documents"])
\`\`\`

## 2. Using Stuff Chain for Too Many Docs

\`\`\`python
# Wrong - retriever gets 50 docs, stuff in one prompt
retriever = vectorstore.as_retriever(search_kwargs={"k": 50})
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",  # Token limit error!
    retriever=retriever
)

# Right - use map_reduce or reduce k
chain_type="map_reduce"  # Or k=4
\`\`\`

## 3. High Temperature

\`\`\`python
# Wrong - creative but less factual
llm = ChatOpenAI(temperature=0.9)

# Right - factual answers
llm = ChatOpenAI(temperature=0)
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between QA chain types?

**Answer:**
- Stuff: All docs in one prompt (simple, fast, token limits)
- Map-reduce: Process each doc separately, combine (handles many docs, slower)
- Refine: Iteratively improve answer (good quality, sequential)

## Q2: How to improve QA accuracy?

**Answer:** Better chunking, more relevant retrieval (higher k or reranking), custom prompts, lower temperature, return and verify sources.

## Q3: When to use return_source_documents?

**Answer:** Always in production. Lets you verify answer accuracy, provide citations to users, debug retrieval issues.`,

  starterCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create sample knowledge base
docs = [
    Document(page_content="Our company offers 15 days of PTO per year."),
    Document(page_content="Remote work is allowed up to 3 days per week."),
    Document(page_content="Health insurance starts after 90 days of employment."),
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Create QA chain
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Ask a question
result = qa_chain.invoke({"query": "How many PTO days do we get?"})
print("Answer:", result["result"])
print("\\nSources:")
for doc in result["source_documents"]:
    print("-", doc.page_content)`,

  solutionCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create sample knowledge base
docs = [
    Document(page_content="Our company offers 15 days of PTO per year."),
    Document(page_content="Remote work is allowed up to 3 days per week."),
    Document(page_content="Health insurance starts after 90 days of employment."),
]

# Create vector store
embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)

# Create QA chain
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    chain_type="stuff",
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Ask a question
result = qa_chain.invoke({"query": "How many PTO days do we get?"})
print("Answer:", result["result"])
print("\\nSources:")
for doc in result["source_documents"]:
    print("-", doc.page_content)`,

  hints: [
    "RetrievalQA.from_chain_type combines retriever and LLM",
    "chain_type='stuff' is simplest and most common",
    "return_source_documents=True includes retrieved docs",
    "Use temperature=0 for factual answers"
  ]
};
