import type { LessonContent } from '../types';

export const ragEvaluation: LessonContent = {
  slug: "rag-evaluation",
  problemContent: `# RAG Evaluation

Measure and improve your RAG system's quality!

## Why Evaluate RAG?

- Ensure accuracy
- Catch failures early
- Compare different approaches
- Optimize performance

## Key Metrics

| Metric | What It Measures |
|--------|------------------|
| Retrieval Precision | Are retrieved docs relevant? |
| Retrieval Recall | Did we get all relevant docs? |
| Answer Relevance | Does answer match question? |
| Faithfulness | Is answer based on docs? |
| Context Precision | Quality of retrieved chunks |

## Manual Evaluation

\`\`\`python
# Create test questions with expected sources
test_cases = [
    {
        "question": "What's the PTO policy?",
        "expected_answer_contains": ["15 days"],
        "expected_source": "hr_policy.pdf"
    }
]

# Test your RAG
for test in test_cases:
    result = qa_chain.invoke({"query": test["question"]})
    # Check if answer contains expected info
    # Check if correct source was used
\`\`\`

## Automated Evaluation

\`\`\`python
from langchain.evaluation import load_evaluator

# Check answer relevance
evaluator = load_evaluator("qa")
eval_result = evaluator.evaluate_strings(
    prediction=answer,
    input=question,
    reference=ground_truth
)
\`\`\`

## Your Task

1. Create test cases for your RAG system
2. Evaluate retrieval quality
3. Check answer accuracy`,

  solutionContent: `# Solution: RAG Evaluation

\`\`\`python
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document
from langchain.evaluation import load_evaluator

# Setup RAG system
docs = [
    Document(
        page_content="Employees receive 15 days of PTO annually.",
        metadata={"source": "hr_policy.pdf"}
    ),
    Document(
        page_content="Remote work is permitted 3 days per week.",
        metadata={"source": "remote_policy.pdf"}
    ),
]

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Test cases
test_cases = [
    {
        "question": "How much PTO do employees get?",
        "expected_keywords": ["15", "days"],
        "expected_source": "hr_policy.pdf"
    },
    {
        "question": "How many days can I work remotely?",
        "expected_keywords": ["3", "days", "week"],
        "expected_source": "remote_policy.pdf"
    }
]

# Run evaluation
print("=== RAG Evaluation ===\\n")
for i, test in enumerate(test_cases):
    result = qa_chain.invoke({"query": test["question"]})

    print(f"Test {i+1}: {test['question']}")
    print(f"Answer: {result['result']}")

    # Check keywords
    keywords_found = all(
        kw.lower() in result["result"].lower()
        for kw in test["expected_keywords"]
    )
    print(f"Keywords present: {keywords_found}")

    # Check source
    sources = [doc.metadata["source"] for doc in result["source_documents"]]
    source_correct = test["expected_source"] in sources
    print(f"Correct source: {source_correct}")

    print(f"✓ PASS" if (keywords_found and source_correct) else "✗ FAIL")
    print()
\`\`\``,

  explanationContent: `# Deep Dive: Evaluation Metrics

## Retrieval Metrics

**Precision**: Of retrieved docs, how many are relevant?
\`\`\`python
precision = relevant_retrieved / total_retrieved
\`\`\`

**Recall**: Of all relevant docs, how many did we retrieve?
\`\`\`python
recall = relevant_retrieved / total_relevant
\`\`\`

## Answer Quality Metrics

**Faithfulness**: Is answer grounded in retrieved docs?
\`\`\`python
# LLM checks if answer is supported by context
evaluator = load_evaluator("context_qa")
result = evaluator.evaluate_strings(
    prediction=answer,
    input=question,
    context=retrieved_docs
)
\`\`\`

**Relevance**: Does answer address the question?
\`\`\`python
evaluator = load_evaluator("qa")
result = evaluator.evaluate_strings(
    prediction=answer,
    input=question
)
\`\`\`

## RAGAS Framework

\`\`\`python
from ragas import evaluate
from ragas.metrics import (
    faithfulness,
    answer_relevancy,
    context_precision,
    context_recall
)

# Evaluate your RAG
results = evaluate(
    dataset,
    metrics=[
        faithfulness,
        answer_relevancy,
        context_precision,
        context_recall
    ]
)
\`\`\``,

  realworldContent: `# Real-World Evaluation

## A/B Testing

\`\`\`python
# Compare different chunking strategies
def evaluate_config(chunk_size, overlap):
    # Create RAG with this config
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=overlap
    )
    # ... create vectorstore, qa_chain

    # Test on benchmark questions
    score = run_test_suite(qa_chain, test_questions)
    return score

# Find best config
results = []
for chunk_size in [300, 500, 800]:
    for overlap in [30, 50, 100]:
        score = evaluate_config(chunk_size, overlap)
        results.append((chunk_size, overlap, score))
\`\`\`

## Continuous Monitoring

\`\`\`python
# Track metrics over time
def log_query(query, result):
    metrics = {
        "timestamp": datetime.now(),
        "query": query,
        "answer_length": len(result["result"]),
        "num_sources": len(result["source_documents"]),
        "retrieval_time": result.get("retrieval_time"),
    }
    save_metrics(metrics)

# Alert if metrics degrade
if avg_answer_length < threshold:
    send_alert("RAG quality degrading")
\`\`\`

## Human Feedback Loop

\`\`\`python
# Collect user ratings
def get_user_feedback(answer):
    rating = ask_user("Rate this answer (1-5)")
    if rating < 3:
        # Flag for review
        flag_for_improvement(query, answer, rating)
    return rating
\`\`\``,

  mistakesContent: `# Common Mistakes

## 1. No Test Suite

\`\`\`python
# Wrong - no systematic testing
# Just try random questions

# Right - create test suite
test_questions = [
    {"q": "...", "expected": "..."},
    {"q": "...", "expected": "..."},
]
\`\`\`

## 2. Only Testing Happy Path

\`\`\`python
# Wrong - only test questions you know work
test_cases = ["What is X?"]  # Known to work

# Right - test edge cases
test_cases = [
    "What is X?",  # Normal
    "Tell me about Y?",  # Ambiguous
    "How much Z?",  # Not in docs
    "Compare A and B",  # Complex
]
\`\`\`

## 3. Ignoring Retrieval Quality

\`\`\`python
# Wrong - only check final answer
assert "15 days" in answer

# Right - also check retrieval
assert correct_doc in retrieved_docs
assert len(retrieved_docs) >= 3
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: How to evaluate RAG systems?

**Answer:** Use retrieval metrics (precision, recall) and answer metrics (faithfulness, relevance). Create test suite with expected answers. Use frameworks like RAGAS. Monitor in production.

## Q2: What is faithfulness in RAG?

**Answer:** Whether the answer is grounded in retrieved documents. Prevents hallucination. Checked by verifying each claim in answer against context.

## Q3: How to improve RAG performance?

**Answer:** Better chunking (size, overlap, strategy), more relevant retrieval (higher k, reranking), improved prompts, better embeddings model, filter by metadata, use test suite to measure.`,

  starterCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create a simple RAG system
docs = [
    Document(page_content="The capital of France is Paris."),
    Document(page_content="The capital of Spain is Madrid."),
]

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Test cases
tests = [
    {"q": "What is the capital of France?", "expected": "Paris"},
    {"q": "What is the capital of Spain?", "expected": "Madrid"},
]

# Evaluate
for test in tests:
    result = qa_chain.invoke({"query": test["q"]})
    correct = test["expected"].lower() in result["result"].lower()
    print(f"Q: {test['q']}")
    print(f"A: {result['result']}")
    print(f"✓ PASS" if correct else "✗ FAIL")
    print()`,

  solutionCode: `from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import FAISS
from langchain.chains import RetrievalQA
from langchain.schema import Document

# Create a simple RAG system
docs = [
    Document(page_content="The capital of France is Paris.", metadata={"source": "geography.pdf"}),
    Document(page_content="The capital of Spain is Madrid.", metadata={"source": "geography.pdf"}),
]

embeddings = OpenAIEmbeddings()
vectorstore = FAISS.from_documents(docs, embeddings)
llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

qa_chain = RetrievalQA.from_chain_type(
    llm=llm,
    retriever=vectorstore.as_retriever(),
    return_source_documents=True
)

# Test cases with multiple checks
tests = [
    {"q": "What is the capital of France?", "expected": "Paris"},
    {"q": "What is the capital of Spain?", "expected": "Madrid"},
]

# Evaluate
passed = 0
for test in tests:
    result = qa_chain.invoke({"query": test["q"]})

    # Check answer correctness
    answer_correct = test["expected"].lower() in result["result"].lower()

    # Check retrieval
    retrieval_ok = len(result["source_documents"]) > 0

    print(f"Q: {test['q']}")
    print(f"A: {result['result']}")
    print(f"Answer correct: {answer_correct}")
    print(f"Sources retrieved: {len(result['source_documents'])}")

    if answer_correct and retrieval_ok:
        print("✓ PASS")
        passed += 1
    else:
        print("✗ FAIL")
    print()

print(f"Passed {passed}/{len(tests)} tests")`,

  hints: [
    "Create test suite with questions and expected answers",
    "Check both answer correctness and source retrieval",
    "Test edge cases: ambiguous questions, missing info",
    "Use evaluation frameworks like RAGAS for production"
  ]
};
