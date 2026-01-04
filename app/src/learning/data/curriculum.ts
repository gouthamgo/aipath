// AI Path Curriculum Data
// Comprehensive AI Engineering learning path

export interface Lesson {
  slug: string;
  title: string;
  description: string;
  order: number;
  estimatedMinutes: number;
  completed?: boolean;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  longDescription: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  estimatedHours: number;
  isPremium: boolean;
  skills: string[];
  lessons: Lesson[];
}

export interface Phase {
  phase: number;
  title: string;
  description: string;
  color: "emerald" | "violet" | "cyan" | "amber" | "rose";
  isFree: boolean;
  projects: Project[];
}

export const curriculum: Phase[] = [
  {
    phase: 1,
    title: "Python Foundations",
    description: "Master Python fundamentals for AI development",
    color: "emerald",
    isFree: true,
    projects: [
      {
        id: "1",
        slug: "python-basics",
        title: "Python Essentials",
        description: "Core Python for AI engineers",
        longDescription: "Learn the essential Python skills every AI engineer needs. From variables and data types to functions and classes, build a solid foundation for your AI journey.",
        difficulty: "beginner",
        estimatedHours: 3,
        isPremium: false,
        skills: ["Variables", "Functions", "Classes", "Data Types", "Control Flow"],
        lessons: [
          { slug: "variables-types", title: "Variables & Data Types", description: "Python's building blocks", order: 1, estimatedMinutes: 15 },
          { slug: "control-flow", title: "Control Flow", description: "If statements and loops", order: 2, estimatedMinutes: 20 },
          { slug: "functions", title: "Functions & Modules", description: "Reusable code blocks", order: 3, estimatedMinutes: 25 },
          { slug: "classes-objects", title: "Classes & Objects", description: "Object-oriented Python", order: 4, estimatedMinutes: 30 },
          { slug: "error-handling", title: "Error Handling", description: "Try, except, and debugging", order: 5, estimatedMinutes: 20 },
          { slug: "file-io", title: "File I/O", description: "Reading and writing files", order: 6, estimatedMinutes: 20 },
          { slug: "project-cli-tool", title: "Project: CLI Tool", description: "Build a command-line app", order: 7, estimatedMinutes: 45 },
        ],
      },
      {
        id: "2",
        slug: "data-manipulation",
        title: "Data Manipulation",
        description: "NumPy, Pandas, and data processing",
        longDescription: "Master the data manipulation libraries that power AI and ML. Learn to clean, transform, and analyze data with NumPy and Pandas.",
        difficulty: "beginner",
        estimatedHours: 4,
        isPremium: false,
        skills: ["NumPy", "Pandas", "Data Cleaning", "CSV/JSON", "Data Analysis"],
        lessons: [
          { slug: "numpy-basics", title: "NumPy Fundamentals", description: "Arrays and operations", order: 1, estimatedMinutes: 25 },
          { slug: "pandas-intro", title: "Pandas Introduction", description: "DataFrames and Series", order: 2, estimatedMinutes: 30 },
          { slug: "data-cleaning", title: "Data Cleaning", description: "Handle missing data", order: 3, estimatedMinutes: 25 },
          { slug: "data-transformation", title: "Data Transformation", description: "Reshape and aggregate", order: 4, estimatedMinutes: 30 },
          { slug: "project-data-analyzer", title: "Project: Data Analyzer", description: "Build a data analysis tool", order: 5, estimatedMinutes: 45 },
        ],
      },
      {
        id: "3",
        slug: "apis-requests",
        title: "APIs & HTTP",
        description: "Work with REST APIs and web requests",
        longDescription: "Learn to interact with web APIs, make HTTP requests, and handle JSON data. Essential skills for working with AI services.",
        difficulty: "beginner",
        estimatedHours: 3,
        isPremium: false,
        skills: ["REST APIs", "HTTP Methods", "JSON", "Authentication", "Rate Limiting"],
        lessons: [
          { slug: "http-basics", title: "HTTP Fundamentals", description: "Requests and responses", order: 1, estimatedMinutes: 20 },
          { slug: "requests-library", title: "Python Requests", description: "Making API calls", order: 2, estimatedMinutes: 25 },
          { slug: "json-handling", title: "JSON Handling", description: "Parse and create JSON", order: 3, estimatedMinutes: 20 },
          { slug: "api-authentication", title: "API Authentication", description: "Keys and tokens", order: 4, estimatedMinutes: 25 },
          { slug: "project-api-client", title: "Project: API Client", description: "Build a weather app", order: 5, estimatedMinutes: 40 },
        ],
      },
    ],
  },
  {
    phase: 2,
    title: "LLM Fundamentals",
    description: "Master LangChain and core AI concepts",
    color: "violet",
    isFree: false,
    projects: [
      {
        id: "4",
        slug: "openai-api-mastery",
        title: "OpenAI API Mastery",
        description: "Master the OpenAI API for building AI apps",
        longDescription: "Deep dive into the OpenAI API. Learn to use GPT models, handle tokens, manage costs, and build production-ready applications.",
        difficulty: "intermediate",
        estimatedHours: 4,
        isPremium: true,
        skills: ["OpenAI API", "GPT Models", "Token Management", "API Best Practices", "Cost Control"],
        lessons: [
          { slug: "openai-setup", title: "OpenAI Setup", description: "API keys and configuration", order: 1, estimatedMinutes: 15 },
          { slug: "chat-completions", title: "Chat Completions API", description: "Core API usage", order: 2, estimatedMinutes: 25 },
          { slug: "model-selection", title: "Model Selection", description: "Choose the right model", order: 3, estimatedMinutes: 20 },
          { slug: "token-management", title: "Token Management", description: "Count and optimize tokens", order: 4, estimatedMinutes: 25 },
          { slug: "api-parameters", title: "API Parameters", description: "Temperature, top_p, and more", order: 5, estimatedMinutes: 25 },
          { slug: "error-handling-api", title: "Error Handling", description: "Handle API errors gracefully", order: 6, estimatedMinutes: 20 },
          { slug: "streaming-basics", title: "Streaming Responses", description: "Real-time token streaming", order: 7, estimatedMinutes: 25 },
          { slug: "project-ai-assistant", title: "Project: AI Assistant", description: "Build a smart assistant", order: 8, estimatedMinutes: 50 },
        ],
      },
      {
        id: "5",
        slug: "langchain-basics",
        title: "LangChain Essentials",
        description: "Build AI applications with LangChain",
        longDescription: "Learn the fundamentals of LangChain, the most popular framework for building LLM applications. Master prompts, chains, and output parsers.",
        difficulty: "intermediate",
        estimatedHours: 6,
        isPremium: true,
        skills: ["LangChain", "Prompts", "Chains", "Output Parsers", "Memory", "LCEL"],
        lessons: [
          { slug: "langchain-setup", title: "LangChain Setup", description: "Installation and config", order: 1, estimatedMinutes: 15 },
          { slug: "llm-models", title: "LLM Models", description: "Connect to various LLMs", order: 2, estimatedMinutes: 20 },
          { slug: "prompt-templates", title: "Prompt Templates", description: "Dynamic prompts", order: 3, estimatedMinutes: 25 },
          { slug: "output-parsers", title: "Output Parsers", description: "Structured outputs", order: 4, estimatedMinutes: 30 },
          { slug: "lcel-intro", title: "LCEL Introduction", description: "Expression language basics", order: 5, estimatedMinutes: 30 },
          { slug: "chains", title: "Chains", description: "Connect components", order: 6, estimatedMinutes: 35 },
          { slug: "runnables", title: "Runnables", description: "Composable operations", order: 7, estimatedMinutes: 30 },
          { slug: "memory", title: "Memory Systems", description: "Conversation history", order: 8, estimatedMinutes: 30 },
          { slug: "callbacks", title: "Callbacks & Tracing", description: "Monitor chain execution", order: 9, estimatedMinutes: 25 },
          { slug: "project-chatbot", title: "Project: AI Chatbot", description: "Build a chatbot", order: 10, estimatedMinutes: 60 },
        ],
      },
      {
        id: "6",
        slug: "prompt-engineering",
        title: "Prompt Engineering",
        description: "Master the art of prompting LLMs",
        longDescription: "Learn advanced prompting techniques to get the best results from LLMs. From zero-shot to chain-of-thought, master every technique.",
        difficulty: "intermediate",
        estimatedHours: 5,
        isPremium: true,
        skills: ["Zero-shot", "Few-shot", "Chain of Thought", "System Prompts", "Prompt Optimization", "Personas"],
        lessons: [
          { slug: "prompting-basics", title: "Prompting Basics", description: "Fundamentals of good prompts", order: 1, estimatedMinutes: 20 },
          { slug: "zero-few-shot", title: "Zero & Few-Shot", description: "Learning paradigms", order: 2, estimatedMinutes: 30 },
          { slug: "chain-of-thought", title: "Chain of Thought", description: "Reasoning step by step", order: 3, estimatedMinutes: 30 },
          { slug: "system-prompts", title: "System Prompts", description: "Define AI behavior", order: 4, estimatedMinutes: 25 },
          { slug: "role-prompting", title: "Role Prompting", description: "Personas and expertise", order: 5, estimatedMinutes: 25 },
          { slug: "structured-prompts", title: "Structured Prompts", description: "Templates and formats", order: 6, estimatedMinutes: 25 },
          { slug: "prompt-chaining", title: "Prompt Chaining", description: "Multi-step prompting", order: 7, estimatedMinutes: 30 },
          { slug: "prompt-debugging", title: "Prompt Debugging", description: "Fix broken prompts", order: 8, estimatedMinutes: 25 },
          { slug: "project-prompt-lib", title: "Project: Prompt Library", description: "Build a prompt manager", order: 9, estimatedMinutes: 50 },
        ],
      },
      {
        id: "7",
        slug: "structured-outputs",
        title: "Structured Outputs",
        description: "Get reliable JSON from LLMs",
        longDescription: "Learn to extract structured data from LLMs. Master JSON mode, function calling, and schema validation for reliable AI outputs.",
        difficulty: "intermediate",
        estimatedHours: 4,
        isPremium: true,
        skills: ["JSON Mode", "Function Calling", "Pydantic", "Schema Validation", "Data Extraction"],
        lessons: [
          { slug: "why-structured", title: "Why Structured Outputs", description: "The reliability problem", order: 1, estimatedMinutes: 15 },
          { slug: "json-mode", title: "JSON Mode", description: "Force JSON responses", order: 2, estimatedMinutes: 25 },
          { slug: "function-calling", title: "Function Calling", description: "Tool use pattern", order: 3, estimatedMinutes: 35 },
          { slug: "pydantic-models", title: "Pydantic Models", description: "Define output schemas", order: 4, estimatedMinutes: 30 },
          { slug: "validation-retry", title: "Validation & Retry", description: "Handle malformed outputs", order: 5, estimatedMinutes: 25 },
          { slug: "extraction-patterns", title: "Extraction Patterns", description: "Extract data from text", order: 6, estimatedMinutes: 30 },
          { slug: "project-data-extractor", title: "Project: Data Extractor", description: "Build an extraction pipeline", order: 7, estimatedMinutes: 50 },
        ],
      },
      {
        id: "8",
        slug: "vector-databases",
        title: "Vector Databases",
        description: "Store and search embeddings",
        longDescription: "Learn to work with vector databases for semantic search and retrieval. Master Pinecone, Chroma, and embedding strategies.",
        difficulty: "intermediate",
        estimatedHours: 5,
        isPremium: true,
        skills: ["Embeddings", "Pinecone", "Chroma", "Similarity Search", "Indexing", "Metadata Filtering"],
        lessons: [
          { slug: "embeddings-intro", title: "Embeddings Intro", description: "What are embeddings", order: 1, estimatedMinutes: 25 },
          { slug: "embedding-models", title: "Embedding Models", description: "OpenAI vs open source", order: 2, estimatedMinutes: 25 },
          { slug: "creating-embeddings", title: "Creating Embeddings", description: "Generate vectors", order: 3, estimatedMinutes: 30 },
          { slug: "chroma-basics", title: "Chroma Database", description: "Local vector store", order: 4, estimatedMinutes: 30 },
          { slug: "pinecone-basics", title: "Pinecone Database", description: "Cloud vector store", order: 5, estimatedMinutes: 30 },
          { slug: "similarity-search", title: "Similarity Search", description: "Find similar items", order: 6, estimatedMinutes: 25 },
          { slug: "metadata-filtering", title: "Metadata Filtering", description: "Filter by attributes", order: 7, estimatedMinutes: 25 },
          { slug: "hybrid-search", title: "Hybrid Search", description: "Combine keyword + vector", order: 8, estimatedMinutes: 30 },
          { slug: "project-semantic-search", title: "Project: Semantic Search", description: "Build a search engine", order: 9, estimatedMinutes: 55 },
        ],
      },
      {
        id: "9",
        slug: "rag-applications",
        title: "RAG Applications",
        description: "Retrieval-Augmented Generation",
        longDescription: "Build powerful RAG systems that combine retrieval with generation. Learn to create AI that answers questions from your documents.",
        difficulty: "intermediate",
        estimatedHours: 6,
        isPremium: true,
        skills: ["RAG", "Document Loading", "Chunking", "Retrieval", "QA Systems", "Evaluation"],
        lessons: [
          { slug: "rag-overview", title: "RAG Overview", description: "What is RAG", order: 1, estimatedMinutes: 20 },
          { slug: "document-loaders", title: "Document Loaders", description: "Load various formats", order: 2, estimatedMinutes: 30 },
          { slug: "text-chunking", title: "Text Chunking", description: "Split documents smartly", order: 3, estimatedMinutes: 30 },
          { slug: "chunking-strategies", title: "Chunking Strategies", description: "Overlap, semantic, hierarchical", order: 4, estimatedMinutes: 30 },
          { slug: "retrieval-strategies", title: "Retrieval Strategies", description: "Find relevant chunks", order: 5, estimatedMinutes: 35 },
          { slug: "reranking", title: "Reranking", description: "Improve retrieval quality", order: 6, estimatedMinutes: 25 },
          { slug: "qa-chains", title: "QA Chains", description: "Answer questions", order: 7, estimatedMinutes: 30 },
          { slug: "citation-sources", title: "Citations & Sources", description: "Track where answers come from", order: 8, estimatedMinutes: 25 },
          { slug: "rag-evaluation", title: "RAG Evaluation", description: "Measure RAG quality", order: 9, estimatedMinutes: 30 },
          { slug: "project-doc-qa", title: "Project: Doc Q&A", description: "Chat with documents", order: 10, estimatedMinutes: 60 },
        ],
      },
      {
        id: "10",
        slug: "multi-provider-llms",
        title: "Multi-Provider LLMs",
        description: "Work with Claude, Gemini, and more",
        longDescription: "Learn to work with multiple LLM providers including Anthropic's Claude, Google's Gemini, and open-source models. Master provider abstraction and model selection strategies.",
        difficulty: "intermediate",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Claude API", "Gemini API", "LiteLLM", "Provider Abstraction", "Model Comparison"],
        lessons: [
          { slug: "claude-api-intro", title: "Claude API Fundamentals", description: "Anthropic's Claude models", order: 1, estimatedMinutes: 25 },
          { slug: "claude-features", title: "Claude's Unique Features", description: "System prompts and artifacts", order: 2, estimatedMinutes: 30 },
          { slug: "gemini-api-intro", title: "Gemini API Basics", description: "Google's Gemini models", order: 3, estimatedMinutes: 25 },
          { slug: "litellm-abstraction", title: "LiteLLM Abstraction", description: "One interface, many models", order: 4, estimatedMinutes: 30 },
          { slug: "model-comparison", title: "Model Comparison", description: "Choosing the right model", order: 5, estimatedMinutes: 25 },
          { slug: "cost-performance", title: "Cost vs Performance", description: "Optimize spend across providers", order: 6, estimatedMinutes: 25 },
          { slug: "project-multi-provider", title: "Project: Multi-Provider Chat", description: "Build a provider-agnostic app", order: 7, estimatedMinutes: 50 },
        ],
      },
      {
        id: "11",
        slug: "llm-fine-tuning",
        title: "LLM Fine-Tuning",
        description: "Customize models for your use case",
        longDescription: "Learn when and how to fine-tune LLMs for your specific needs. Master LoRA, QLoRA, and modern fine-tuning techniques with Hugging Face.",
        difficulty: "intermediate",
        estimatedHours: 5,
        isPremium: true,
        skills: ["Fine-Tuning", "LoRA", "QLoRA", "Hugging Face", "Dataset Preparation", "PEFT"],
        lessons: [
          { slug: "when-to-finetune", title: "When to Fine-Tune", description: "Fine-tuning vs prompting", order: 1, estimatedMinutes: 20 },
          { slug: "dataset-preparation", title: "Dataset Preparation", description: "Format training data", order: 2, estimatedMinutes: 35 },
          { slug: "lora-basics", title: "LoRA Fundamentals", description: "Low-rank adaptation", order: 3, estimatedMinutes: 35 },
          { slug: "qlora-efficient", title: "QLoRA for Efficiency", description: "Quantized fine-tuning", order: 4, estimatedMinutes: 30 },
          { slug: "huggingface-training", title: "Training with Hugging Face", description: "TRL and SFTTrainer", order: 5, estimatedMinutes: 40 },
          { slug: "finetune-evaluation", title: "Evaluating Fine-Tuned Models", description: "Measure improvements", order: 6, estimatedMinutes: 30 },
          { slug: "finetune-deployment", title: "Deploying Fine-Tuned Models", description: "Serve your custom model", order: 7, estimatedMinutes: 30 },
          { slug: "project-custom-model", title: "Project: Custom Fine-Tuned Model", description: "Train your own model", order: 8, estimatedMinutes: 60 },
        ],
      },
    ],
  },
  {
    phase: 3,
    title: "AI Agents",
    description: "Build autonomous AI agent systems",
    color: "cyan",
    isFree: false,
    projects: [
      {
        id: "12",
        slug: "agent-fundamentals",
        title: "Agent Fundamentals",
        description: "Understand AI agents and tools",
        longDescription: "Learn the core concepts of AI agents - how they reason, use tools, and accomplish complex tasks autonomously.",
        difficulty: "advanced",
        estimatedHours: 5,
        isPremium: true,
        skills: ["Agent Architecture", "Tool Use", "ReAct Pattern", "Planning", "Execution"],
        lessons: [
          { slug: "what-are-agents", title: "What Are Agents", description: "Agent fundamentals", order: 1, estimatedMinutes: 25 },
          { slug: "react-pattern", title: "ReAct Pattern", description: "Reasoning + Acting", order: 2, estimatedMinutes: 35 },
          { slug: "building-tools", title: "Building Tools", description: "Create agent tools", order: 3, estimatedMinutes: 40 },
          { slug: "agent-memory", title: "Agent Memory", description: "Long-term context", order: 4, estimatedMinutes: 30 },
          { slug: "error-recovery", title: "Error Recovery", description: "Handle failures", order: 5, estimatedMinutes: 30 },
          { slug: "project-research-agent", title: "Project: Research Agent", description: "Auto research tool", order: 6, estimatedMinutes: 60 },
        ],
      },
      {
        id: "13",
        slug: "langgraph",
        title: "LangGraph",
        description: "Build stateful agent workflows",
        longDescription: "Master LangGraph to build complex, stateful agent workflows with cycles and branching logic.",
        difficulty: "advanced",
        estimatedHours: 5,
        isPremium: true,
        skills: ["LangGraph", "State Machines", "Conditional Edges", "Checkpoints", "Human-in-Loop"],
        lessons: [
          { slug: "langgraph-intro", title: "LangGraph Intro", description: "Graph-based agents", order: 1, estimatedMinutes: 30 },
          { slug: "nodes-edges", title: "Nodes & Edges", description: "Build the graph", order: 2, estimatedMinutes: 35 },
          { slug: "state-management", title: "State Management", description: "Track agent state", order: 3, estimatedMinutes: 35 },
          { slug: "conditional-logic", title: "Conditional Logic", description: "Branching flows", order: 4, estimatedMinutes: 30 },
          { slug: "project-workflow-agent", title: "Project: Workflow Agent", description: "Complex agent flow", order: 5, estimatedMinutes: 60 },
        ],
      },
      {
        id: "14",
        slug: "multi-agent-systems",
        title: "Multi-Agent Systems",
        description: "Coordinate multiple AI agents",
        longDescription: "Learn to build systems where multiple AI agents collaborate to solve complex problems. Master CrewAI and agent orchestration.",
        difficulty: "advanced",
        estimatedHours: 5,
        isPremium: true,
        skills: ["CrewAI", "Agent Roles", "Collaboration", "Delegation", "Orchestration"],
        lessons: [
          { slug: "multi-agent-intro", title: "Multi-Agent Intro", description: "Why multiple agents", order: 1, estimatedMinutes: 25 },
          { slug: "crewai-basics", title: "CrewAI Basics", description: "Team of agents", order: 2, estimatedMinutes: 35 },
          { slug: "agent-roles", title: "Agent Roles", description: "Define specializations", order: 3, estimatedMinutes: 30 },
          { slug: "task-delegation", title: "Task Delegation", description: "Distribute work", order: 4, estimatedMinutes: 35 },
          { slug: "project-agent-team", title: "Project: Agent Team", description: "Build a crew", order: 5, estimatedMinutes: 60 },
        ],
      },
      {
        id: "15",
        slug: "mcp-integration",
        title: "MCP & Tool Integration",
        description: "Model Context Protocol mastery",
        longDescription: "Master the Model Context Protocol (MCP), the industry standard for connecting AI models to external tools and services. Build production-ready integrations.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["MCP", "Tool Integration", "Resources", "Prompts", "Server Development"],
        lessons: [
          { slug: "mcp-introduction", title: "Introduction to MCP", description: "The new standard for AI tools", order: 1, estimatedMinutes: 25 },
          { slug: "mcp-architecture", title: "MCP Architecture", description: "Servers, clients, and transport", order: 2, estimatedMinutes: 30 },
          { slug: "mcp-tools", title: "MCP Tools Primitive", description: "Define callable functions", order: 3, estimatedMinutes: 35 },
          { slug: "mcp-resources", title: "MCP Resources Primitive", description: "Expose data to models", order: 4, estimatedMinutes: 30 },
          { slug: "mcp-prompts", title: "MCP Prompts Primitive", description: "Reusable prompt templates", order: 5, estimatedMinutes: 25 },
          { slug: "building-mcp-server", title: "Building MCP Servers", description: "Create custom servers in Python", order: 6, estimatedMinutes: 40 },
          { slug: "mcp-with-claude", title: "MCP with Claude", description: "Connect Claude to your tools", order: 7, estimatedMinutes: 30 },
          { slug: "project-mcp-server", title: "Project: Custom MCP Server", description: "Build a production MCP server", order: 8, estimatedMinutes: 55 },
        ],
      },
    ],
  },
  {
    phase: 4,
    title: "Production AI",
    description: "Deploy and scale AI applications",
    color: "amber",
    isFree: false,
    projects: [
      {
        id: "16",
        slug: "llmops",
        title: "LLMOps",
        description: "Operate LLM applications",
        longDescription: "Learn to monitor, evaluate, and optimize LLM applications in production. Master observability and cost management.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Monitoring", "Evaluation", "Cost Optimization", "Langfuse", "Tracing"],
        lessons: [
          { slug: "llmops-intro", title: "LLMOps Overview", description: "Production AI ops", order: 1, estimatedMinutes: 20 },
          { slug: "tracing-observability", title: "Tracing & Observability", description: "Monitor your LLM", order: 2, estimatedMinutes: 35 },
          { slug: "evaluation", title: "LLM Evaluation", description: "Measure quality", order: 3, estimatedMinutes: 35 },
          { slug: "cost-optimization", title: "Cost Optimization", description: "Reduce spend", order: 4, estimatedMinutes: 30 },
          { slug: "project-monitoring", title: "Project: Monitoring Dashboard", description: "Build observability", order: 5, estimatedMinutes: 50 },
        ],
      },
      {
        id: "17",
        slug: "deployment",
        title: "Deployment",
        description: "Deploy AI apps to production",
        longDescription: "Learn to deploy AI applications using modern infrastructure. From Docker to cloud platforms, master deployment strategies.",
        difficulty: "advanced",
        estimatedHours: 5,
        isPremium: true,
        skills: ["Docker", "FastAPI", "Cloud Deploy", "Scaling", "Security"],
        lessons: [
          { slug: "api-design", title: "API Design", description: "Design AI APIs", order: 1, estimatedMinutes: 30 },
          { slug: "fastapi-basics", title: "FastAPI Basics", description: "Build the backend", order: 2, estimatedMinutes: 35 },
          { slug: "docker-containerization", title: "Docker", description: "Containerize your app", order: 3, estimatedMinutes: 35 },
          { slug: "cloud-deployment", title: "Cloud Deployment", description: "Deploy to cloud", order: 4, estimatedMinutes: 40 },
          { slug: "project-deploy-ai", title: "Project: Deploy AI App", description: "Full deployment", order: 5, estimatedMinutes: 60 },
        ],
      },
      {
        id: "18",
        slug: "advanced-patterns",
        title: "Advanced Patterns",
        description: "Production-ready AI patterns",
        longDescription: "Master advanced patterns for building reliable, scalable AI systems. Learn caching, streaming, fallbacks, and more.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Caching", "Streaming", "Fallbacks", "Rate Limiting", "Queue Systems"],
        lessons: [
          { slug: "caching-strategies", title: "Caching Strategies", description: "Cache LLM responses", order: 1, estimatedMinutes: 30 },
          { slug: "streaming-responses", title: "Streaming", description: "Real-time output", order: 2, estimatedMinutes: 30 },
          { slug: "fallbacks-retries", title: "Fallbacks & Retries", description: "Handle failures", order: 3, estimatedMinutes: 30 },
          { slug: "rate-limiting", title: "Rate Limiting", description: "Manage throughput", order: 4, estimatedMinutes: 25 },
          { slug: "project-production-app", title: "Project: Production App", description: "Apply all patterns", order: 5, estimatedMinutes: 60 },
        ],
      },
      {
        id: "19",
        slug: "ai-testing-evaluation",
        title: "AI Testing & Evaluation",
        description: "Test and evaluate LLM applications",
        longDescription: "Master the art of testing AI applications. Learn to build evaluation datasets, use LLM-as-judge patterns, and implement comprehensive testing strategies.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["LLM Evaluation", "Golden Datasets", "A/B Testing", "Regression Testing", "Red Teaming"],
        lessons: [
          { slug: "eval-fundamentals", title: "Evaluation Fundamentals", description: "Why and how to evaluate", order: 1, estimatedMinutes: 25 },
          { slug: "golden-datasets", title: "Building Golden Datasets", description: "Create test suites", order: 2, estimatedMinutes: 35 },
          { slug: "llm-as-judge", title: "LLM-as-Judge Patterns", description: "Use LLMs to evaluate LLMs", order: 3, estimatedMinutes: 35 },
          { slug: "prompt-regression", title: "Prompt Regression Testing", description: "Catch prompt regressions", order: 4, estimatedMinutes: 30 },
          { slug: "ab-testing-ai", title: "A/B Testing for AI", description: "Compare model versions", order: 5, estimatedMinutes: 30 },
          { slug: "red-teaming", title: "Red Teaming & Adversarial Tests", description: "Find vulnerabilities", order: 6, estimatedMinutes: 30 },
          { slug: "project-eval-pipeline", title: "Project: Evaluation Pipeline", description: "Build a complete eval system", order: 7, estimatedMinutes: 55 },
        ],
      },
      {
        id: "20",
        slug: "ai-safety-guardrails",
        title: "AI Safety & Guardrails",
        description: "Build safe and responsible AI",
        longDescription: "Learn to build AI systems that are safe, secure, and responsible. Master prompt injection prevention, content moderation, and ethical AI practices.",
        difficulty: "advanced",
        estimatedHours: 3,
        isPremium: true,
        skills: ["Prompt Injection", "Content Moderation", "Guardrails", "AI Ethics", "Responsible AI"],
        lessons: [
          { slug: "ai-safety-intro", title: "AI Safety Introduction", description: "Why safety matters", order: 1, estimatedMinutes: 20 },
          { slug: "prompt-injection", title: "Prompt Injection Prevention", description: "Defend against attacks", order: 2, estimatedMinutes: 35 },
          { slug: "content-moderation", title: "Content Moderation", description: "Filter harmful content", order: 3, estimatedMinutes: 30 },
          { slug: "guardrails-implementation", title: "Implementing Guardrails", description: "Build safety layers", order: 4, estimatedMinutes: 35 },
          { slug: "responsible-ai", title: "Responsible AI Practices", description: "Ethics and bias", order: 5, estimatedMinutes: 25 },
          { slug: "project-safe-ai", title: "Project: Safe AI System", description: "Build with guardrails", order: 6, estimatedMinutes: 50 },
        ],
      },
    ],
  },
  {
    phase: 5,
    title: "Specialized AI",
    description: "Advanced topics and specialized skills",
    color: "rose",
    isFree: false,
    projects: [
      {
        id: "21",
        slug: "open-source-llms",
        title: "Open Source LLMs",
        description: "Run and deploy open models",
        longDescription: "Master open-source LLMs like Llama, Mistral, and DeepSeek. Learn to run models locally with Ollama and deploy them for production use.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Ollama", "Llama", "Mistral", "Hugging Face", "Local Deployment", "Model Quantization"],
        lessons: [
          { slug: "open-source-landscape", title: "Open Source LLM Landscape", description: "Available models and trade-offs", order: 1, estimatedMinutes: 25 },
          { slug: "ollama-setup", title: "Running Ollama Locally", description: "Local model deployment", order: 2, estimatedMinutes: 30 },
          { slug: "llama-models", title: "Llama Model Family", description: "Meta's open models", order: 3, estimatedMinutes: 30 },
          { slug: "mistral-models", title: "Mistral Models", description: "Efficient open models", order: 4, estimatedMinutes: 25 },
          { slug: "model-quantization", title: "Model Quantization", description: "Run on limited hardware", order: 5, estimatedMinutes: 30 },
          { slug: "open-vs-closed", title: "Open vs Closed Comparison", description: "When to use each", order: 6, estimatedMinutes: 25 },
          { slug: "project-local-ai", title: "Project: Local AI Assistant", description: "Build with open models", order: 7, estimatedMinutes: 55 },
        ],
      },
      {
        id: "22",
        slug: "multimodal-ai",
        title: "Multimodal AI",
        description: "Vision, audio, and beyond",
        longDescription: "Build AI applications that understand images, audio, and video. Master GPT-4 Vision, Whisper, and multimodal RAG systems.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Vision AI", "GPT-4V", "Whisper", "Audio Processing", "Multimodal RAG"],
        lessons: [
          { slug: "multimodal-intro", title: "Multimodal AI Introduction", description: "Beyond text", order: 1, estimatedMinutes: 20 },
          { slug: "vision-models", title: "Vision Models", description: "GPT-4V and Claude Vision", order: 2, estimatedMinutes: 35 },
          { slug: "image-understanding", title: "Image Understanding", description: "Analyze and describe images", order: 3, estimatedMinutes: 30 },
          { slug: "whisper-audio", title: "Audio with Whisper", description: "Transcription and processing", order: 4, estimatedMinutes: 30 },
          { slug: "text-to-speech", title: "Text-to-Speech", description: "Generate spoken audio", order: 5, estimatedMinutes: 25 },
          { slug: "multimodal-rag", title: "Multimodal RAG", description: "RAG with images and docs", order: 6, estimatedMinutes: 35 },
          { slug: "project-multimodal-app", title: "Project: Multimodal App", description: "Build vision + audio app", order: 7, estimatedMinutes: 55 },
        ],
      },
      {
        id: "23",
        slug: "voice-agents",
        title: "Voice AI Agents",
        description: "Build conversational voice AI",
        longDescription: "Create AI agents that can speak and listen. Build voice-first applications with real-time conversation capabilities.",
        difficulty: "advanced",
        estimatedHours: 4,
        isPremium: true,
        skills: ["Voice AI", "Real-time Audio", "Conversation Design", "Speech Recognition", "Voice Synthesis"],
        lessons: [
          { slug: "voice-ai-intro", title: "Voice AI Introduction", description: "Voice-first applications", order: 1, estimatedMinutes: 20 },
          { slug: "speech-recognition", title: "Speech Recognition", description: "Convert speech to text", order: 2, estimatedMinutes: 30 },
          { slug: "voice-synthesis", title: "Voice Synthesis", description: "Natural-sounding speech", order: 3, estimatedMinutes: 30 },
          { slug: "realtime-voice", title: "Real-time Voice Processing", description: "Low-latency conversations", order: 4, estimatedMinutes: 35 },
          { slug: "conversation-design", title: "Conversation Design", description: "Design voice interactions", order: 5, estimatedMinutes: 25 },
          { slug: "voice-agent-patterns", title: "Voice Agent Patterns", description: "Production voice agents", order: 6, estimatedMinutes: 30 },
          { slug: "project-voice-agent", title: "Project: Voice Agent", description: "Build a voice assistant", order: 7, estimatedMinutes: 55 },
        ],
      },
    ],
  },
];

// Helper functions
export function getTotalLessons(): number {
  return curriculum.reduce(
    (acc, phase) => acc + phase.projects.reduce(
      (a, p) => a + p.lessons.length, 0
    ), 0
  );
}

export function getTotalProjects(): number {
  return curriculum.reduce((acc, phase) => acc + phase.projects.length, 0);
}

export function getProjectBySlug(slug: string): Project | undefined {
  for (const phase of curriculum) {
    const project = phase.projects.find(p => p.slug === slug);
    if (project) return project;
  }
  return undefined;
}

export function getPhaseForProject(projectSlug: string): Phase | undefined {
  return curriculum.find(phase =>
    phase.projects.some(p => p.slug === projectSlug)
  );
}
