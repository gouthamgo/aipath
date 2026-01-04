import { memo, useMemo } from 'react';

const PYTHON_KEYWORDS = [
  'from', 'import', 'def', 'class', 'if', 'else', 'elif', 'for', 'while',
  'return', 'try', 'except', 'with', 'as', 'in', 'not', 'and', 'or',
  'True', 'False', 'None', 'print', 'self', 'lambda', 'yield', 'raise',
  'pass', 'break', 'continue', 'async', 'await', 'finally', 'global',
];

const PYTHON_BUILTINS = [
  'str', 'int', 'float', 'list', 'dict', 'set', 'tuple', 'len', 'range',
  'type', 'input', 'open', 'isinstance', 'enumerate', 'zip', 'map', 'filter',
  'PromptTemplate', 'ChatOpenAI', 'OpenAI', 'LLMChain',
];

interface HighlightedCodeProps {
  code: string;
  showLineNumbers?: boolean;
  lineHeight?: string;
}

function tokenizeLine(line: string): JSX.Element[] {
  const tokens: JSX.Element[] = [];
  let currentIndex = 0;

  if (line === '') {
    return [<span key="empty">{'\u00A0'}</span>];
  }

  // Check for comment
  const commentIndex = line.indexOf('#');
  const codePartEnd = commentIndex >= 0 ? commentIndex : line.length;
  const codePart = line.slice(0, codePartEnd);
  const commentPart = commentIndex >= 0 ? line.slice(commentIndex) : '';

  // Tokenize code part
  const tokenRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|\b\w+\b|[^\s\w]|\s+)/g;
  let match;

  while ((match = tokenRegex.exec(codePart)) !== null) {
    const token = match[0];
    const key = `token-${currentIndex++}`;

    if (token.startsWith('"') || token.startsWith("'")) {
      tokens.push(<span key={key} className="text-emerald-400">{token}</span>);
    } else if (PYTHON_KEYWORDS.includes(token)) {
      tokens.push(<span key={key} className="text-violet-400 font-medium">{token}</span>);
    } else if (PYTHON_BUILTINS.includes(token)) {
      tokens.push(<span key={key} className="text-cyan-400">{token}</span>);
    } else if (/^\d+(\.\d+)?$/.test(token)) {
      tokens.push(<span key={key} className="text-amber-400">{token}</span>);
    } else if (/^[()[\]{}:,=.<>+\-*/%@!]$/.test(token)) {
      tokens.push(<span key={key} className="text-zinc-400">{token}</span>);
    } else {
      tokens.push(<span key={key} className="text-zinc-200">{token}</span>);
    }
  }

  // Add comment if present
  if (commentPart) {
    tokens.push(
      <span key="comment" className="text-zinc-500 italic">{commentPart}</span>
    );
  }

  return tokens;
}

export const HighlightedCode = memo(function HighlightedCode({
  code,
  showLineNumbers = false,
  lineHeight = '24px',
}: HighlightedCodeProps) {
  const highlighted = useMemo(() => {
    const lines = code.split('\n');
    return lines.map((line, i) => (
      <div
        key={i}
        style={{ height: lineHeight, lineHeight }}
        className="flex whitespace-pre"
      >
        {showLineNumbers && (
          <span className="w-10 text-right pr-4 text-zinc-600 select-none text-xs">
            {i + 1}
          </span>
        )}
        <span>{tokenizeLine(line)}</span>
      </div>
    ));
  }, [code, showLineNumbers, lineHeight]);

  return <code className="block">{highlighted}</code>;
});

// Line numbers component for code editors
interface LineNumbersProps {
  count: number;
  lineHeight?: string;
}

export const LineNumbers = memo(function LineNumbers({
  count,
  lineHeight = '24px',
}: LineNumbersProps) {
  const numbers = useMemo(() => {
    return Array.from({ length: count }, (_, i) => (
      <div
        key={i}
        style={{ height: lineHeight, lineHeight }}
        className="text-right pr-3 text-zinc-600 select-none text-xs"
      >
        {i + 1}
      </div>
    ));
  }, [count, lineHeight]);

  return <>{numbers}</>;
});
