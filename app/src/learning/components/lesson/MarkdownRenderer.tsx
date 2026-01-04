import React, { memo, useMemo } from 'react';
import { HighlightedCode } from './SyntaxHighlighter';

interface MarkdownRendererProps {
  content: string;
}

export const MarkdownRenderer = memo(function MarkdownRenderer({
  content,
}: MarkdownRendererProps) {
  const rendered = useMemo(() => {
    const lines = content.split('\n');
    const result: JSX.Element[] = [];
    let inCodeBlock = false;
    let codeBlockContent: string[] = [];
    let codeLanguage = '';
    let blockKey = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End code block
          result.push(
            <div key={blockKey++} className="my-4 rounded-lg overflow-hidden bg-[#0d0d10] border border-white/5">
              <div className="px-3 py-1.5 bg-white/5 text-xs text-zinc-500 font-mono">
                {codeLanguage || 'code'}
              </div>
              <pre className="p-4 overflow-x-auto text-sm font-mono">
                <HighlightedCode code={codeBlockContent.join('\n')} />
              </pre>
            </div>
          );
          codeBlockContent = [];
          inCodeBlock = false;
        } else {
          // Start code block
          inCodeBlock = true;
          codeLanguage = line.slice(3).trim();
        }
        continue;
      }

      if (inCodeBlock) {
        codeBlockContent.push(line);
        continue;
      }

      // Headers
      if (line.startsWith('# ')) {
        result.push(
          <h1 key={blockKey++} className="text-2xl font-bold text-white mt-6 mb-3">
            {line.slice(2)}
          </h1>
        );
      } else if (line.startsWith('## ')) {
        result.push(
          <h2 key={blockKey++} className="text-xl font-semibold text-white mt-5 mb-2">
            {line.slice(3)}
          </h2>
        );
      } else if (line.startsWith('### ')) {
        result.push(
          <h3 key={blockKey++} className="text-lg font-medium text-white mt-4 mb-2">
            {line.slice(4)}
          </h3>
        );
      }
      // Bold text on its own line
      else if (line.startsWith('**') && line.endsWith('**')) {
        result.push(
          <p key={blockKey++} className="font-semibold text-white">
            {line.slice(2, -2)}
          </p>
        );
      }
      // List items
      else if (line.startsWith('- ') || line.startsWith('* ')) {
        result.push(
          <li key={blockKey++} className="ml-4 text-zinc-300 list-disc">
            {renderInlineCode(line.slice(2))}
          </li>
        );
      }
      // Numbered list items
      else if (line.match(/^\d+\.\s/)) {
        result.push(
          <li key={blockKey++} className="ml-4 text-zinc-300 list-decimal">
            {renderInlineCode(line)}
          </li>
        );
      }
      // Table rows
      else if (line.startsWith('|')) {
        const cells = line.split('|').filter(c => c.trim());
        // Skip separator rows
        if (cells.every(c => /^[-:\s]+$/.test(c))) continue;
        result.push(
          <div key={blockKey++} className="flex text-sm border-b border-white/5">
            {cells.map((cell, j) => (
              <div key={j} className="flex-1 px-3 py-2 text-zinc-300">
                {renderInlineCode(cell.trim())}
              </div>
            ))}
          </div>
        );
      }
      // Paragraph with inline code
      else if (line.includes('`') && !line.startsWith('```')) {
        result.push(
          <p key={blockKey++} className="text-zinc-300 leading-relaxed">
            {renderInlineCode(line)}
          </p>
        );
      }
      // Empty line
      else if (line.trim() === '') {
        result.push(<div key={blockKey++} className="h-2" />);
      }
      // Regular paragraph
      else {
        result.push(
          <p key={blockKey++} className="text-zinc-300 leading-relaxed">
            {line}
          </p>
        );
      }
    }

    return result;
  }, [content]);

  return <>{rendered}</>;
});

// Helper to render inline code within text
function renderInlineCode(text: string): React.ReactNode {
  if (!text.includes('`')) return text;

  const parts = text.split(/(`[^`]+`)/);
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('`') && part.endsWith('`')
          ? <code key={i} className="px-1.5 py-0.5 rounded bg-violet-500/10 text-violet-300 font-mono text-sm">{part.slice(1, -1)}</code>
          : <span key={i}>{part}</span>
      )}
    </>
  );
}
