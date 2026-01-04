import { Link as WaspRouterLink, routes } from "wasp/client/router";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Container } from "./shared";

const stats = [
  { value: "17", label: "Projects" },
  { value: "85+", label: "Lessons" },
  { value: "50h", label: "Content" },
  { value: "100%", label: "Hands-on" },
];

const codeLines = [
  { text: "from langchain import ChatOpenAI", delay: 0 },
  { text: "from langchain.agents import create_react_agent", delay: 100 },
  { text: "", delay: 200 },
  { text: "# Initialize your AI model", delay: 300 },
  { text: 'llm = ChatOpenAI(model="gpt-4")', delay: 400 },
  { text: "", delay: 500 },
  { text: "# Create an intelligent agent", delay: 600 },
  { text: "agent = create_react_agent(llm, tools)", delay: 700 },
  { text: "", delay: 800 },
  { text: "# Run your first AI task", delay: 900 },
  { text: 'response = agent.invoke("Analyze trends")', delay: 1000 },
];

function TypewriterCode() {
  const [visibleLines, setVisibleLines] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisibleLines((prev) => {
        if (prev >= codeLines.length) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 150);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="font-mono text-sm leading-relaxed">
      {codeLines.slice(0, visibleLines).map((line, i) => (
        <div
          key={i}
          className={`${line.text === "" ? "h-5" : ""} ${
            line.text.startsWith("#") ? "text-zinc-500" :
            line.text.startsWith("from") ? "text-violet-400" :
            line.text.includes('"') ? "text-amber-400" : "text-zinc-300"
          }`}
        >
          {line.text}
        </div>
      ))}
      {visibleLines < codeLines.length && (
        <span className="inline-block w-2 h-5 bg-violet-500 animate-pulse" />
      )}
    </div>
  );
}

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-20 pb-16 lg:pt-24 lg:pb-20">
      <Container size="full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500" />
              </span>
              <span className="text-sm font-medium text-violet-300">
                New: Advanced RAG Course
              </span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight mb-6">
              <span className="text-white">Master AI Engineering</span>
              <br />
              <span className="text-gradient">By Building Real Apps</span>
            </h1>

            {/* Subheadline */}
            <p className="text-lg sm:text-xl text-zinc-400 max-w-xl mx-auto lg:mx-0 mb-10 leading-relaxed">
              Learn <span className="text-white font-medium">LangChain</span>, <span className="text-white font-medium">LlamaIndex</span>, and production AI systems through hands-on Python projects.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
              <WaspRouterLink
                to={routes.SignupRoute.to}
                className="btn-cta px-8 py-4 rounded-xl text-base font-semibold inline-flex items-center justify-center gap-2"
              >
                Start Learning Free
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </WaspRouterLink>
              <Link
                to="/#curriculum"
                className="btn-secondary px-8 py-4 rounded-xl text-base font-medium inline-flex items-center justify-center gap-2"
              >
                View Curriculum
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-zinc-500">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                5 free projects included
              </div>
            </div>
          </div>

          {/* Right: Code Preview */}
          <div className="relative">
            {/* Glow effects */}
            <div className="absolute -inset-4 bg-gradient-to-r from-violet-500/20 to-cyan-500/20 rounded-3xl blur-2xl opacity-50" />

            {/* Code Window */}
            <div className="relative rounded-2xl border border-white/10 bg-[#0c0c0f] overflow-hidden shadow-2xl">
              {/* Window Header */}
              <div className="flex items-center gap-2 border-b border-white/5 bg-white/[0.02] px-4 py-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <div className="ml-4 flex items-center gap-4 text-xs text-zinc-500">
                  <span className="text-zinc-300 border-b border-violet-500 pb-2">agent.py</span>
                  <span className="pb-2">requirements.txt</span>
                </div>
              </div>

              {/* Code Content */}
              <div className="p-6 min-h-[300px]">
                <TypewriterCode />
              </div>

              {/* Terminal Output */}
              <div className="border-t border-white/5 bg-black/40 px-6 py-4">
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>Terminal</span>
                </div>
                <div className="font-mono text-sm text-emerald-400">
                  Agent initialized successfully
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 lg:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-6 lg:gap-8">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-white/[0.02] border border-white/5"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gradient mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
}
