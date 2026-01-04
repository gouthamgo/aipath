import type { LessonContent } from '../types';

export const langchainAgents: LessonContent = {
  slug: "langchain-agents",
  problemContent: `# Agents with LangChain

LangChain makes building agents easier!

## Why LangChain for Agents?

| Feature | Benefit |
|---------|---------|
| Pre-built tools | Search, calculator, etc. |
| Agent types | ReAct, OpenAI Functions |
| Memory integration | Built-in |
| Tracing | LangSmith debugging |

## LangChain Agent Components

\`\`\`python
from langchain.agents import create_react_agent
from langchain.tools import Tool

# 1. LLM
llm = ChatOpenAI()

# 2. Tools
tools = [search_tool, calculator_tool]

# 3. Agent
agent = create_react_agent(llm, tools, prompt)

# 4. Executor
executor = AgentExecutor(agent=agent, tools=tools)
\`\`\`

## Your Task

Build an agent using LangChain.`,
  solutionContent: `# Solution: LangChain Agent

\`\`\`python
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# Create LLM
llm = ChatOpenAI(model="gpt-4o-mini")

# Define tools
def search(query: str) -> str:
    """Simulate search."""
    return f"Search results for '{query}': [Results here]"

def calculate(expression: str) -> str:
    """Calculate math expression."""
    try:
        return str(eval(expression))
    except:
        return "Error in calculation"

tools = [
    Tool(
        name="search",
        description="Search for information. Input: search query",
        func=search
    ),
    Tool(
        name="calculate",
        description="Do math calculations. Input: math expression",
        func=calculate
    )
]

# Create prompt
prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful assistant. Use tools when needed."),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

# Create agent
agent = create_openai_functions_agent(llm, tools, prompt)

# Create executor
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

# Run
result = executor.invoke({"input": "What is 25 * 4?"})
print(result["output"])
\`\`\``,
  explanationContent: `# LangChain Agents Deep Dive

## Agent Types

### 1. OpenAI Functions Agent (Recommended)
\`\`\`python
agent = create_openai_functions_agent(llm, tools, prompt)
# Uses OpenAI's function calling
# Most reliable for GPT models
\`\`\`

### 2. ReAct Agent
\`\`\`python
agent = create_react_agent(llm, tools, prompt)
# Uses ReAct prompting pattern
# Works with any LLM
\`\`\`

### 3. Structured Chat Agent
\`\`\`python
agent = create_structured_chat_agent(llm, tools, prompt)
# Outputs structured JSON
# Good for complex tool arguments
\`\`\`

## The AgentExecutor

\`\`\`python
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    verbose=True,           # Print steps
    max_iterations=10,      # Prevent infinite loops
    handle_parsing_errors=True,  # Recover from errors
    return_intermediate_steps=True  # Get full trace
)
\`\`\`

## Custom Tools

\`\`\`python
from langchain.tools import StructuredTool
from pydantic import BaseModel

class SearchInput(BaseModel):
    query: str
    max_results: int = 10

tool = StructuredTool.from_function(
    func=search_function,
    name="search",
    description="Search the web",
    args_schema=SearchInput
)
\`\`\``,
  realworldContent: `# Real-World: Research Assistant

## Scenario: Automated Research

\`\`\`python
from langchain.tools import DuckDuckGoSearchRun
from langchain.tools import WikipediaQueryRun
from langchain_community.utilities import WikipediaAPIWrapper

# Real search tools
search = DuckDuckGoSearchRun()
wikipedia = WikipediaQueryRun(api_wrapper=WikipediaAPIWrapper())

tools = [
    Tool(name="web_search", func=search.run,
         description="Search the web for current info"),
    Tool(name="wikipedia", func=wikipedia.run,
         description="Look up facts on Wikipedia"),
]

# Research agent
research_agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=research_agent, tools=tools)

# Use it
result = executor.invoke({
    "input": "What are the latest developments in quantum computing?"
})
\`\`\`

## Adding Memory

\`\`\`python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)

executor = AgentExecutor(
    agent=agent,
    tools=tools,
    memory=memory  # Agent remembers conversation
)
\`\`\``,
  mistakesContent: `# Common Mistakes

## 1. Wrong Prompt Template

\`\`\`python
# WRONG - Missing agent_scratchpad
prompt = ChatPromptTemplate.from_messages([
    ("system", "..."),
    ("user", "{input}")
])

# RIGHT - Include scratchpad for agent's work
prompt = ChatPromptTemplate.from_messages([
    ("system", "..."),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])
\`\`\`

## 2. Not Handling Tool Errors

\`\`\`python
# WRONG
executor = AgentExecutor(agent=agent, tools=tools)

# RIGHT
executor = AgentExecutor(
    agent=agent,
    tools=tools,
    handle_parsing_errors=True,  # Recover from bad outputs
    max_iterations=5  # Prevent infinite loops
)
\`\`\`

## 3. Vague Tool Descriptions

\`\`\`python
# WRONG - Agent doesn't know when to use
Tool(name="tool1", description="does stuff", func=fn)

# RIGHT - Clear, specific description
Tool(
    name="calculate",
    description="Performs mathematical calculations. Input should be a valid math expression like '2 + 2' or '(5 * 3) / 2'",
    func=calculate
)
\`\`\``,
  interviewContent: `# Interview Questions

## Q1: When would you use LangChain agents vs raw OpenAI?

**Answer**:
- LangChain: Rapid prototyping, complex workflows, need pre-built tools
- Raw OpenAI: Production optimization, simple use cases, full control

## Q2: How do you debug LangChain agents?

**Answer**:
1. Set verbose=True in AgentExecutor
2. Use LangSmith for tracing
3. Check intermediate_steps in output
4. Add logging to custom tools
5. Test tools individually

## Q3: How do you add memory to a LangChain agent?

**Answer**:
\`\`\`python
from langchain.memory import ConversationBufferMemory

memory = ConversationBufferMemory(
    memory_key="chat_history",
    return_messages=True
)
executor = AgentExecutor(agent=agent, tools=tools, memory=memory)
\`\`\``,
  starterCode: `from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

# TODO: Create the LLM
llm = None

# TODO: Define a weather tool
def get_weather(location: str) -> str:
    """Get weather for location."""
    pass

tools = [
    # TODO: Create Tool for weather
]

# TODO: Create prompt with agent_scratchpad
prompt = None

# TODO: Create agent and executor

# Test
# result = executor.invoke({"input": "What's the weather in Tokyo?"})
# print(result["output"])`,
  solutionCode: `from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.tools import Tool
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

llm = ChatOpenAI(model="gpt-4o-mini")

def get_weather(location: str) -> str:
    """Get weather for location."""
    weather_data = {
        "tokyo": "22°C, Sunny",
        "london": "15°C, Rainy",
        "new york": "18°C, Cloudy"
    }
    return weather_data.get(location.lower(), "Weather data not available")

tools = [
    Tool(
        name="get_weather",
        description="Get current weather for a city. Input: city name",
        func=get_weather
    )
]

prompt = ChatPromptTemplate.from_messages([
    ("system", "You are a helpful weather assistant."),
    ("user", "{input}"),
    MessagesPlaceholder(variable_name="agent_scratchpad")
])

agent = create_openai_functions_agent(llm, tools, prompt)
executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

result = executor.invoke({"input": "What's the weather in Tokyo?"})
print(result["output"])`,
  hints: [
    "Use ChatOpenAI(model='gpt-4o-mini') for the LLM",
    "Tool description should clearly explain input format",
    "Always include MessagesPlaceholder for agent_scratchpad"
  ]
};
