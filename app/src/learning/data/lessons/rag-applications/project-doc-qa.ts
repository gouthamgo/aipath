import type { LessonContent } from '../types';

export const projectDocQa: LessonContent = {
  slug: "project-doc-qa",
  problemContent: `# Project: Chat with Documents

Build a complete RAG system that lets you chat with your documents!

## System Components

| Component | Class/Method | Purpose |
|-----------|--------------|---------|
| Loader | \`DirectoryLoader\` | Load docs from folder |
| Splitter | \`RecursiveCharacterTextSplitter\` | Chunk documents |
| Vector Store | \`FAISS\` / \`Chroma\` | Store embeddings |
| Retriever | \`as_retriever()\` | Find relevant chunks |
| QA Chain | \`RetrievalQA\` | Generate answers |

## What You'll Build

A document QA system that:
1. Loads documents from a folder
2. Splits them into chunks
3. Creates a vector store
4. Answers questions with citations
5. Handles follow-up questions

## Requirements

\`\`\`python
class DocumentQA:
    def __init__(self, docs_path):
        # Load docs, create vector store
        pass

    def ask(self, question):
        # Return answer with sources
        pass

    def chat(self, question, history=None):
        # Handle conversation context
        pass
\`\`\`

## Features to Implement

- Load multiple document types (txt, pdf, md)
- Smart chunking with overlap
- Retrieve top 4 relevant chunks
- Include source citations
- Support conversation history

## Your Task

1. Implement the DocumentQA class
2. Load sample documents
3. Test with various questions
4. Add citation formatting`,

  solutionContent: `# Solution: Document QA System

\`\`\`python
from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document
import os

class DocumentQA:
    def __init__(self, docs_path):
        """Initialize the QA system with documents from a folder."""
        print(f"Loading documents from {docs_path}...")

        # Load documents
        self.docs = self._load_documents(docs_path)
        print(f"Loaded {len(self.docs)} document chunks")

        # Create vector store
        embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.from_documents(self.docs, embeddings)

        # Create QA chain
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 4}),
            return_source_documents=True
        )

        print("QA system ready!")

    def _load_documents(self, docs_path):
        """Load and chunk documents."""
        # For this example, create some sample docs
        if not os.path.exists(docs_path):
            os.makedirs(docs_path)
            # Create sample documents
            with open(f"{docs_path}/policies.txt", "w") as f:
                f.write("""
Company Policies

PTO Policy:
Employees receive 15 days of paid time off annually.
PTO must be requested 2 weeks in advance.
Unused PTO does not roll over.

Remote Work Policy:
Employees may work remotely up to 3 days per week.
Remote work must be approved by manager.
Employees must be available during core hours (10am-3pm).
                """)

            with open(f"{docs_path}/benefits.txt", "w") as f:
                f.write("""
Employee Benefits

Health Insurance:
Coverage starts after 90 days of employment.
Company covers 80% of premiums.
Includes medical, dental, and vision.

Retirement:
401k with 4% company match.
Vesting period is 3 years.
                """)

        # Load documents
        loader = DirectoryLoader(
            docs_path,
            glob="**/*.txt",
            loader_cls=TextLoader
        )
        documents = loader.load()

        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(
            chunk_size=500,
            chunk_overlap=50
        )
        chunks = splitter.split_documents(documents)

        return chunks

    def ask(self, question):
        """Ask a question and get answer with sources."""
        result = self.qa_chain.invoke({"query": question})

        # Format output
        output = {
            "question": question,
            "answer": result["result"],
            "sources": []
        }

        # Add formatted sources
        for i, doc in enumerate(result["source_documents"]):
            source_info = {
                "number": i + 1,
                "file": doc.metadata.get("source", "Unknown"),
                "content": doc.page_content[:150] + "..."
            }
            output["sources"].append(source_info)

        return output

    def print_answer(self, result):
        """Pretty print the answer."""
        print(f"\\nQ: {result['question']}")
        print(f"\\nA: {result['answer']}")
        print("\\nSources:")
        for source in result["sources"]:
            print(f"  [{source['number']}] {source['file']}")
            print(f"      {source['content']}")
        print()

# Usage
if __name__ == "__main__":
    # Create QA system
    qa_system = DocumentQA("./company_docs")

    # Ask questions
    questions = [
        "How many PTO days do employees get?",
        "What's the remote work policy?",
        "When does health insurance start?",
        "What's the 401k match?"
    ]

    for question in questions:
        result = qa_system.ask(question)
        qa_system.print_answer(result)
\`\`\``,

  explanationContent: `# How It Works

## Architecture

\`\`\`
DocumentQA
├── __init__
│   ├── Load documents from folder
│   ├── Split into chunks
│   ├── Create embeddings
│   ├── Build vector store
│   └── Initialize QA chain
├── ask(question)
│   ├── Retrieve relevant chunks
│   ├── Generate answer
│   └── Format with citations
└── print_answer(result)
    └── Display nicely formatted output
\`\`\`

## Key Design Decisions

1. **DirectoryLoader**: Load all .txt files from a folder
2. **RecursiveCharacterTextSplitter**: Smart chunking (500 chars, 50 overlap)
3. **FAISS**: Fast vector store for similarity search
4. **RetrievalQA**: Combines retrieval and generation
5. **return_source_documents**: Always include citations

## Customization Points

\`\`\`python
# Adjust chunk size for your content
chunk_size=500  # Smaller for precise, larger for context

# Adjust retrieval count
search_kwargs={"k": 4}  # More for comprehensive answers

# Adjust temperature
temperature=0  # Factual (0) vs creative (0.7)
\`\`\``,

  realworldContent: `# Production Enhancements

## Add More File Types

\`\`\`python
from langchain_community.document_loaders import PyPDFLoader, CSVLoader

def _load_documents(self, docs_path):
    all_docs = []

    # Load PDFs
    pdf_loader = DirectoryLoader(docs_path, glob="**/*.pdf", loader_cls=PyPDFLoader)
    all_docs.extend(pdf_loader.load())

    # Load text files
    txt_loader = DirectoryLoader(docs_path, glob="**/*.txt", loader_cls=TextLoader)
    all_docs.extend(txt_loader.load())

    # Load CSVs
    csv_loader = DirectoryLoader(docs_path, glob="**/*.csv", loader_cls=CSVLoader)
    all_docs.extend(csv_loader.load())

    # Split all
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    return splitter.split_documents(all_docs)
\`\`\`

## Add Conversation Memory

\`\`\`python
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

chain = ConversationalRetrievalChain.from_llm(
    llm=llm,
    retriever=retriever,
    memory=memory
)

# Now supports follow-up questions
\`\`\`

## Add Reranking

\`\`\`python
from langchain.retrievers import ContextualCompressionRetriever
from langchain.retrievers.document_compressors import CohereRerank

base_retriever = vectorstore.as_retriever(search_kwargs={"k": 20})
compressor = CohereRerank(top_n=5)

retriever = ContextualCompressionRetriever(
    base_compressor=compressor,
    base_retriever=base_retriever
)
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. Hardcoded Paths

\`\`\`python
# Wrong - hardcoded path
qa = DocumentQA("/Users/me/docs")

# Right - flexible path
qa = DocumentQA(os.getenv("DOCS_PATH", "./docs"))
\`\`\`

## 2. Not Handling Empty Results

\`\`\`python
# Wrong - assumes sources exist
sources = result["source_documents"][0]  # Might be empty!

# Right - check first
sources = result.get("source_documents", [])
if sources:
    # Use sources
\`\`\`

## 3. Poor Error Handling

\`\`\`python
# Add error handling
def ask(self, question):
    try:
        result = self.qa_chain.invoke({"query": question})
        return self._format_result(result)
    except Exception as e:
        return {
            "question": question,
            "answer": f"Error: {str(e)}",
            "sources": []
        }
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How would you make this production-ready?

**Answer:** Add error handling, support more file types, add conversation memory, implement reranking, add authentication, rate limiting, logging, monitoring, and caching.

## Q2: How to handle large document sets?

**Answer:** Use persistent vector store (Pinecone, Weaviate), batch processing for indexing, metadata filtering to narrow search, chunk caching, and possibly multiple specialized indexes.

## Q3: How to improve answer quality?

**Answer:** Better chunking strategy, increase retrieval count (k), add reranking, use better embeddings model, customize prompts, lower temperature, add query expansion.`,

  starterCode: `from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
import os

class DocumentQA:
    def __init__(self, docs_path):
        # TODO: Load documents from docs_path
        # TODO: Split into chunks
        # TODO: Create vector store
        # TODO: Create QA chain
        pass

    def ask(self, question):
        # TODO: Query the QA chain
        # TODO: Format result with citations
        pass

# Test it
# qa = DocumentQA("./docs")
# result = qa.ask("What is the PTO policy?")
# print(result)`,

  solutionCode: `from langchain_community.document_loaders import DirectoryLoader, TextLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
import os

class DocumentQA:
    def __init__(self, docs_path):
        # Load documents
        loader = DirectoryLoader(docs_path, glob="**/*.txt", loader_cls=TextLoader)
        docs = loader.load()

        # Split into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
        chunks = splitter.split_documents(docs)

        # Create vector store
        embeddings = OpenAIEmbeddings()
        self.vectorstore = FAISS.from_documents(chunks, embeddings)

        # Create QA chain
        llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)
        self.qa_chain = RetrievalQA.from_chain_type(
            llm=llm,
            retriever=self.vectorstore.as_retriever(search_kwargs={"k": 4}),
            return_source_documents=True
        )

    def ask(self, question):
        result = self.qa_chain.invoke({"query": question})

        return {
            "question": question,
            "answer": result["result"],
            "sources": [
                {"file": doc.metadata.get("source"), "content": doc.page_content[:100]}
                for doc in result["source_documents"]
            ]
        }

# Test it
# qa = DocumentQA("./docs")
# result = qa.ask("What is the PTO policy?")
# print("Answer:", result["answer"])
# print("Sources:", result["sources"])`,

  hints: [
    "Use DirectoryLoader to load all files from a folder",
    "RecursiveCharacterTextSplitter for smart chunking",
    "FAISS for vector store (fast and local)",
    "Always return_source_documents=True for citations"
  ]
};
