import { Section, SectionHeader, Card, FeatureIcon } from "./shared";

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
      </svg>
    ),
    title: "Real Python Execution",
    description: "Write and run Python code in your browser. No setup required. Sandboxed execution with AI libraries pre-installed.",
    color: "violet" as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
      </svg>
    ),
    title: "Project-Based Learning",
    description: "Learn by building real AI applications. Each project teaches practical skills you'll use in production.",
    color: "cyan" as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "LangChain & LlamaIndex",
    description: "Master the most popular AI frameworks. Build chains, agents, and RAG systems from scratch.",
    color: "amber" as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    title: "AI Agent Systems",
    description: "Build multi-agent systems with LangGraph and CrewAI. Create AI teams that collaborate on complex tasks.",
    color: "emerald" as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
      </svg>
    ),
    title: "Vector Databases & RAG",
    description: "Learn embeddings, vector stores, and retrieval-augmented generation. Build knowledge systems that understand context.",
    color: "violet" as const,
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
      </svg>
    ),
    title: "Production Deployment",
    description: "Deploy AI applications to production. Learn Docker, FastAPI, and cloud deployment best practices.",
    color: "cyan" as const,
  },
];

export default function Features() {
  return (
    <Section id="features" size="full">
      <SectionHeader
        badge="Why AI Path"
        badgeColor="violet"
        title={
          <>
            Everything you need to become an{" "}
            <span className="text-gradient">AI Engineer</span>
          </>
        }
        subtitle="From Python fundamentals to production AI systems. Learn by building real projects with the tools companies use."
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((feature, i) => (
          <Card key={i} className="p-6 sm:p-8">
            <FeatureIcon color={feature.color}>
              {feature.icon}
            </FeatureIcon>
            <h3 className="text-lg sm:text-xl font-semibold text-white mt-5 mb-3">
              {feature.title}
            </h3>
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
              {feature.description}
            </p>
          </Card>
        ))}
      </div>
    </Section>
  );
}
