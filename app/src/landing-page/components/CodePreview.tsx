import { useState } from "react";

const tabs = ["Problem", "Solution", "Explain", "Real-World"];

const codeContent = {
  Problem: {
    instruction: "Build a simple AI chatbot using LangChain that can answer questions about a given topic.",
    code: `# Your task: Create a basic chatbot
# using LangChain's ChatOpenAI

from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage

# TODO: Initialize the LLM
llm = ____

# TODO: Create a message and get response
message = HumanMessage(content="What is AI?")
response = ____

print(response.content)`,
  },
  Solution: {
    instruction: "Here's the complete solution with a working chatbot implementation.",
    code: `from langchain.chat_models import ChatOpenAI
from langchain.schema import HumanMessage

# Initialize the LLM with GPT-4
llm = ChatOpenAI(
    model="gpt-4",
    temperature=0.7
)

# Create a message and get response
message = HumanMessage(content="What is AI?")
response = llm.invoke([message])

print(response.content)
# Output: AI (Artificial Intelligence) is...`,
  },
  Explain: {
    instruction: "Understanding the key concepts behind this implementation.",
    code: `# ChatOpenAI is a LangChain wrapper around
# OpenAI's chat models (GPT-3.5, GPT-4)
#
# Key parameters:
# - model: The model to use (gpt-3.5-turbo, gpt-4)
# - temperature: Controls randomness (0-1)
#   Lower = more focused, Higher = more creative
#
# HumanMessage represents a user's input
# in the chat conversation format
#
# .invoke() sends the message to the API
# and returns the AI's response`,
  },
  "Real-World": {
    instruction: "How this pattern is used in production applications.",
    code: `# Real-world applications:
#
# 1. Customer Support Bots
#    - Answer FAQs automatically
#    - Escalate complex issues to humans
#
# 2. Code Assistants
#    - Help developers write code
#    - Explain complex codebases
#
# 3. Research Tools
#    - Summarize documents
#    - Answer questions about data
#
# Next: Add memory to remember context!`,
  },
};

export default function CodePreview() {
  const [activeTab, setActiveTab] = useState<keyof typeof codeContent>("Problem");

  return (
    <section className="py-24 relative">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 mb-4">
            <span className="text-xs font-medium text-green-400">Interactive Learning</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Learn by <span className="text-gradient-success">doing</span>, not watching
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Each lesson includes hands-on coding challenges. Write real Python code, run it instantly, and see the results.
          </p>
        </div>

        {/* Interactive Preview */}
        <div className="gradient-border rounded-2xl overflow-hidden">
          <div className="glass-card rounded-2xl">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/80" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                  <div className="w-3 h-3 rounded-full bg-green-500/80" />
                </div>
                <span className="text-sm text-muted-foreground font-mono">Lesson 1: Your First Chatbot</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Project 5: LangChain Basics</span>
              </div>
            </div>

            {/* Content */}
            <div className="grid lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-white/5">
              {/* Left: Content Tabs */}
              <div className="p-6">
                {/* Tabs */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab as keyof typeof codeContent)}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        activeTab === tab
                          ? "bg-primary text-primary-foreground"
                          : "bg-white/5 text-muted-foreground hover:bg-white/10 hover:text-foreground"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="space-y-4">
                  <p className="text-muted-foreground leading-relaxed">
                    {codeContent[activeTab].instruction}
                  </p>
                </div>
              </div>

              {/* Right: Code Editor */}
              <div className="p-1">
                <div className="code-editor-container rounded-xl h-full">
                  {/* Editor Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                    <span className="text-xs text-muted-foreground font-mono">chatbot.py</span>
                    <div className="flex items-center gap-2">
                      <button className="px-3 py-1 text-xs font-medium rounded bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-colors">
                        Run
                      </button>
                      <button className="px-3 py-1 text-xs font-medium rounded bg-white/5 text-muted-foreground hover:bg-white/10 transition-colors">
                        Reset
                      </button>
                    </div>
                  </div>

                  {/* Code */}
                  <pre className="p-4 text-sm font-mono overflow-auto max-h-80">
                    <code className="text-foreground whitespace-pre">
                      {codeContent[activeTab].code.split('\n').map((line, i) => (
                        <div key={i} className="leading-relaxed">
                          <span className="text-muted-foreground/50 select-none mr-4">
                            {String(i + 1).padStart(2, ' ')}
                          </span>
                          <span
                            dangerouslySetInnerHTML={{
                              __html: line
                                .replace(/(#.+)$/g, '<span class="text-muted-foreground">$1</span>')
                                .replace(/\b(from|import|def|return|print|if|else|for|in|class|async|await)\b/g, '<span class="text-purple-400">$1</span>')
                                .replace(/"([^"]+)"/g, '<span class="text-green-400">"$1"</span>')
                                .replace(/\b(ChatOpenAI|HumanMessage|invoke)\b/g, '<span class="text-yellow-400">$1</span>')
                                .replace(/\b(llm|message|response|model|temperature|content)\b/g, '<span class="text-blue-400">$1</span>')
                                .replace(/____/g, '<span class="bg-purple-500/20 text-purple-300 px-1 rounded">____</span>')
                            }}
                          />
                        </div>
                      ))}
                    </code>
                  </pre>

                  {/* Output Terminal */}
                  <div className="border-t border-white/5 p-4">
                    <div className="text-xs text-muted-foreground mb-2">Output:</div>
                    <div className="terminal-output rounded-lg p-3 text-sm">
                      <span className="text-green-400">
                        {activeTab === "Solution" && "AI (Artificial Intelligence) is the simulation of human intelligence..."}
                        {activeTab === "Problem" && ">>> Click 'Run' to execute your code"}
                        {activeTab === "Explain" && ">>> Ready to learn!"}
                        {activeTab === "Real-World" && ">>> Let's build something amazing!"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
