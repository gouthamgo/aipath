import type { LessonContent } from '../types';

export const tracingObservability: LessonContent = {
  slug: "tracing-observability",
  problemContent: `# Tracing & Observability

See inside your LLM application with tracing!

## Why Tracing?

\`\`\`
User: "Summarize this document"
         │
         ▼
┌─────────────────────────────────┐
│ What happened inside?           │
│ • How long did each step take?  │
│ • What prompts were sent?       │
│ • Where did it fail?            │
└─────────────────────────────────┘
\`\`\`

## Trace Structure

\`\`\`
Trace: "summarize_document"
├── Span: "load_document" (120ms)
├── Span: "chunk_text" (50ms)
├── Span: "embed_chunks" (300ms)
│   ├── Span: "embed_1" (100ms)
│   ├── Span: "embed_2" (100ms)
│   └── Span: "embed_3" (100ms)
├── Span: "llm_summarize" (800ms)
│   └── tokens: 1500, cost: $0.015
└── Total: 1270ms
\`\`\`

## Key Concepts

- **Trace**: Full request lifecycle
- **Span**: Individual operation
- **Attributes**: Metadata (tokens, model, etc.)

## Your Task

Implement basic tracing for an LLM pipeline.`,

  solutionContent: `# Solution: Tracing System

\`\`\`python
import time
import uuid
from contextlib import contextmanager
from dataclasses import dataclass, field
from typing import Optional

@dataclass
class Span:
    name: str
    start_time: float = field(default_factory=time.time)
    end_time: Optional[float] = None
    attributes: dict = field(default_factory=dict)
    children: list = field(default_factory=list)

    @property
    def duration_ms(self):
        if self.end_time:
            return (self.end_time - self.start_time) * 1000
        return None

    def to_dict(self):
        return {
            "name": self.name,
            "duration_ms": round(self.duration_ms, 2) if self.duration_ms else None,
            "attributes": self.attributes,
            "children": [c.to_dict() for c in self.children]
        }

class Tracer:
    def __init__(self):
        self.traces = []
        self.current_span = None

    @contextmanager
    def span(self, name: str, **attributes):
        new_span = Span(name=name, attributes=attributes)

        if self.current_span:
            self.current_span.children.append(new_span)
        else:
            self.traces.append(new_span)

        parent = self.current_span
        self.current_span = new_span

        try:
            yield new_span
        finally:
            new_span.end_time = time.time()
            self.current_span = parent

    def print_trace(self, span=None, indent=0):
        if span is None:
            for trace in self.traces:
                self.print_trace(trace, 0)
            return

        prefix = "  " * indent
        duration = f"{span.duration_ms:.1f}ms" if span.duration_ms else "..."
        print(f"{prefix}├── {span.name} ({duration})")

        if span.attributes:
            for k, v in span.attributes.items():
                print(f"{prefix}│   {k}: {v}")

        for child in span.children:
            self.print_trace(child, indent + 1)

# Usage
tracer = Tracer()

def process_document(doc: str):
    with tracer.span("process_document", doc_length=len(doc)):

        with tracer.span("chunk_text"):
            time.sleep(0.05)  # Simulate work
            chunks = [doc[i:i+100] for i in range(0, len(doc), 100)]

        with tracer.span("embed_chunks", num_chunks=len(chunks)):
            for i, chunk in enumerate(chunks):
                with tracer.span(f"embed_{i}"):
                    time.sleep(0.02)

        with tracer.span("summarize", model="gpt-4o-mini"):
            time.sleep(0.3)
            summary = "Document summary..."

        return summary

# Run
result = process_document("This is a sample document. " * 20)
print("\\nTrace:")
tracer.print_trace()
\`\`\``,

  explanationContent: `# Observability Deep Dive

## The Three Pillars

### 1. Logs
\`\`\`python
logger.info("LLM call started", prompt=prompt[:50])
logger.info("LLM call completed", tokens=500, latency=1.2)
\`\`\`

### 2. Metrics
\`\`\`python
metrics.counter("llm_requests_total").inc()
metrics.histogram("llm_latency_seconds").observe(1.2)
metrics.gauge("llm_cost_dollars").set(0.05)
\`\`\`

### 3. Traces
\`\`\`python
with tracer.span("llm_call") as span:
    span.set_attribute("model", "gpt-4")
    span.set_attribute("tokens", 500)
    response = llm.call(prompt)
\`\`\`

## Tracing Tools

| Tool | Best For |
|------|----------|
| Langfuse | Open source, LLM-focused |
| LangSmith | LangChain integration |
| Helicone | Cost tracking |
| OpenTelemetry | General tracing |

## What to Trace

- LLM calls (prompt, response, tokens)
- Retrieval (query, results, scores)
- Tools (name, args, result)
- Errors (type, message, stack)`,

  realworldContent: `# Real-World Tracing

## Langfuse Integration

\`\`\`python
from langfuse import Langfuse
from langfuse.decorators import observe

langfuse = Langfuse()

@observe()
def rag_pipeline(question: str):
    # Automatically traced!

    with langfuse.span("retrieve"):
        docs = retrieve(question)

    with langfuse.span("generate"):
        answer = generate(question, docs)

    return answer
\`\`\`

## Debug Workflow

1. User reports: "Response was wrong"
2. Find trace by request ID
3. See exact prompts sent
4. Identify issue (bad retrieval? wrong prompt?)
5. Fix and redeploy`,

  mistakesContent: `# Common Tracing Mistakes

## 1. Not Tracing LLM Calls

\`\`\`python
# Wrong - no visibility
response = llm.call(prompt)

# Right - traced
with tracer.span("llm_call", model=model, prompt=prompt[:100]):
    response = llm.call(prompt)
\`\`\`

## 2. Missing Context

\`\`\`python
# Wrong - no useful info
with tracer.span("process"):
    result = process(data)

# Right - rich context
with tracer.span("process", input_size=len(data), type=data.type):
    result = process(data)
\`\`\`

## 3. Too Much Data

\`\`\`python
# Wrong - storing huge prompts
span.set_attribute("prompt", full_10kb_prompt)

# Right - summarize
span.set_attribute("prompt_preview", prompt[:200])
span.set_attribute("prompt_tokens", count_tokens(prompt))
\`\`\``,

  interviewContent: `# Interview Questions

## Q1: What's the difference between logs, metrics, and traces?

**Answer:**
- **Logs**: Individual events with context
- **Metrics**: Aggregated numerical data over time
- **Traces**: Request flow showing parent-child relationships

## Q2: What would you include in an LLM trace?

**Answer:**
- Model name and version
- Prompt (or preview/hash)
- Response (or preview)
- Token counts (input/output)
- Latency
- Cost
- Any errors

## Q3: How do you debug a slow LLM request?

**Answer:**
1. Find the trace by request ID
2. Look at span durations
3. Identify the slow span
4. Check attributes for clues
5. Fix the bottleneck`,

  starterCode: `import time
from contextlib import contextmanager

# TODO: Create a simple Span class
class Span:
    def __init__(self, name):
        self.name = name
        self.start_time = time.time()
        self.end_time = None
        self.children = []

    def finish(self):
        pass

    @property
    def duration_ms(self):
        pass

# TODO: Create a Tracer class with context manager
class Tracer:
    def __init__(self):
        self.spans = []

    @contextmanager
    def span(self, name):
        # TODO: Create span, yield it, then finish
        pass

    def print_spans(self):
        for span in self.spans:
            print(f"{span.name}: {span.duration_ms:.1f}ms")

# Test
tracer = Tracer()

with tracer.span("main_operation"):
    time.sleep(0.1)

    with tracer.span("sub_operation"):
        time.sleep(0.05)

tracer.print_spans()`,

  solutionCode: `import time
from contextlib import contextmanager

class Span:
    def __init__(self, name):
        self.name = name
        self.start_time = time.time()
        self.end_time = None
        self.children = []

    def finish(self):
        self.end_time = time.time()

    @property
    def duration_ms(self):
        if self.end_time:
            return (self.end_time - self.start_time) * 1000
        return 0

class Tracer:
    def __init__(self):
        self.spans = []
        self._stack = []

    @contextmanager
    def span(self, name):
        new_span = Span(name)

        # Add as child to current span or to root
        if self._stack:
            self._stack[-1].children.append(new_span)
        else:
            self.spans.append(new_span)

        self._stack.append(new_span)

        try:
            yield new_span
        finally:
            new_span.finish()
            self._stack.pop()

    def print_spans(self, spans=None, indent=0):
        spans = spans if spans is not None else self.spans
        for span in spans:
            prefix = "  " * indent
            print(f"{prefix}• {span.name}: {span.duration_ms:.1f}ms")
            self.print_spans(span.children, indent + 1)

# Test
tracer = Tracer()

with tracer.span("main_operation"):
    time.sleep(0.1)

    with tracer.span("sub_operation_1"):
        time.sleep(0.05)

    with tracer.span("sub_operation_2"):
        time.sleep(0.03)

print("Trace:")
tracer.print_spans()`,

  hints: [
    "finish() should record end_time",
    "duration_ms calculates (end - start) * 1000",
    "Use a stack to track parent-child relationships",
    "contextmanager should yield the span then finish it",
  ],
};
