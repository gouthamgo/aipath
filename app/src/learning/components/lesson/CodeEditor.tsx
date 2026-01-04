import { memo, useRef, useCallback, useEffect } from 'react';
import { Play, RotateCcw, Eye, Lightbulb } from 'lucide-react';
import { HighlightedCode, LineNumbers } from './SyntaxHighlighter';

// Shared editor styles - MUST be identical for textarea and pre
const EDITOR_STYLES = {
  fontFamily: "'JetBrains Mono', ui-monospace, SFMono-Regular, 'SF Mono', Menlo, Consolas, monospace",
  fontSize: '14px',
  lineHeight: '24px',
  letterSpacing: '0px',
  tabSize: 4,
  padding: '16px',
} as const;

interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  onRun: () => void;
  onReset: () => void;
  onShowSolution: () => void;
  onHint?: () => void;
  hintsUsed?: number;
  totalHints?: number;
  isRunning: boolean;
  output: string;
}

export const CodeEditor = memo(function CodeEditor({
  code,
  onChange,
  onRun,
  onReset,
  onShowSolution,
  onHint,
  hintsUsed = 0,
  totalHints = 0,
  isRunning,
  output,
}: CodeEditorProps) {
  const lineNumbersRef = useRef<HTMLDivElement>(null);
  const preRef = useRef<HTMLPreElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const lineCount = code.split('\n').length;

  // Sync scroll between textarea, pre, and line numbers
  const handleScroll = useCallback(() => {
    if (textareaRef.current) {
      const { scrollTop, scrollLeft } = textareaRef.current;
      if (lineNumbersRef.current) {
        lineNumbersRef.current.scrollTop = scrollTop;
      }
      if (preRef.current) {
        preRef.current.scrollTop = scrollTop;
        preRef.current.scrollLeft = scrollLeft;
      }
    }
  }, []);

  // Also sync on any input change
  useEffect(() => {
    handleScroll();
  }, [code, handleScroll]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Run on Ctrl/Cmd + Enter
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      onRun();
      return;
    }

    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      if (e.shiftKey) {
        // Shift+Tab: remove indentation
        const beforeCursor = code.substring(0, start);
        const lineStart = beforeCursor.lastIndexOf('\n') + 1;
        const linePrefix = code.substring(lineStart, start);
        const spacesToRemove = Math.min(4, linePrefix.length - linePrefix.trimStart().length);

        if (spacesToRemove > 0) {
          const newCode = code.substring(0, lineStart) + code.substring(lineStart + spacesToRemove);
          onChange(newCode);
          requestAnimationFrame(() => {
            target.selectionStart = target.selectionEnd = start - spacesToRemove;
          });
        }
      } else {
        // Tab: add indentation
        const newCode = code.substring(0, start) + '    ' + code.substring(end);
        onChange(newCode);
        requestAnimationFrame(() => {
          target.selectionStart = target.selectionEnd = start + 4;
        });
      }
      return;
    }

    // Handle Enter key - maintain indentation
    if (e.key === 'Enter') {
      e.preventDefault();
      const target = e.target as HTMLTextAreaElement;
      const start = target.selectionStart;
      const beforeCursor = code.substring(0, start);
      const lineStart = beforeCursor.lastIndexOf('\n') + 1;
      const currentLine = code.substring(lineStart, start);
      const indent = currentLine.match(/^[\t ]*/)?.[0] || '';

      // Add extra indent after colon
      const extraIndent = currentLine.trimEnd().endsWith(':') ? '    ' : '';

      const newCode = code.substring(0, start) + '\n' + indent + extraIndent + code.substring(target.selectionEnd);
      onChange(newCode);
      requestAnimationFrame(() => {
        const newPos = start + 1 + indent.length + extraIndent.length;
        target.selectionStart = target.selectionEnd = newPos;
      });
    }
  }, [code, onChange, onRun]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/5 bg-white/[0.02] flex-shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-sm text-zinc-400 font-medium">Python</span>
          <span className="text-xs text-zinc-600 hidden sm:inline">Ctrl+Enter to run</span>
        </div>
        <div className="flex items-center gap-1.5">
          {onHint && totalHints > 0 && (
            <button
              onClick={onHint}
              disabled={hintsUsed >= totalHints}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              title={hintsUsed < totalHints ? `Show hint (${hintsUsed}/${totalHints} used)` : 'All hints revealed'}
            >
              <Lightbulb className="w-4 h-4" />
              <span className="hidden sm:inline">Hint</span>
              {hintsUsed > 0 && (
                <span className="text-xs text-amber-400/60">{hintsUsed}/{totalHints}</span>
              )}
            </button>
          )}
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            title="Reset code"
          >
            <RotateCcw className="w-4 h-4" />
            <span className="hidden sm:inline">Reset</span>
          </button>
          <button
            onClick={onShowSolution}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-all text-sm"
            title="Show solution"
          >
            <Eye className="w-4 h-4" />
            <span className="hidden sm:inline">Solution</span>
          </button>
          <button
            onClick={onRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-medium transition-all disabled:opacity-50"
          >
            <Play className="w-4 h-4" />
            {isRunning ? 'Running...' : 'Run'}
          </button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div ref={containerRef} className="flex-1 relative overflow-hidden bg-[#0a0a0c]">
          {/* Line Numbers */}
          <div
            ref={lineNumbersRef}
            className="absolute left-0 top-0 bottom-0 w-12 bg-[#09090b] border-r border-white/5 overflow-hidden select-none"
            style={{
              paddingTop: EDITOR_STYLES.padding,
              paddingBottom: EDITOR_STYLES.padding,
            }}
          >
            <LineNumbers count={lineCount} lineHeight={EDITOR_STYLES.lineHeight} />
          </div>

          {/* Code Display (syntax highlighted) - positioned behind textarea */}
          <pre
            ref={preRef}
            className="absolute left-12 right-0 top-0 bottom-0 overflow-auto m-0 whitespace-pre"
            style={{
              fontFamily: EDITOR_STYLES.fontFamily,
              fontSize: EDITOR_STYLES.fontSize,
              lineHeight: EDITOR_STYLES.lineHeight,
              letterSpacing: EDITOR_STYLES.letterSpacing,
              tabSize: EDITOR_STYLES.tabSize,
              padding: EDITOR_STYLES.padding,
              pointerEvents: 'none',
            }}
            aria-hidden="true"
          >
            <HighlightedCode code={code} lineHeight={EDITOR_STYLES.lineHeight} />
          </pre>

          {/* Textarea (transparent, for editing) - positioned on top */}
          <textarea
            ref={textareaRef}
            value={code}
            onChange={(e) => onChange(e.target.value)}
            onScroll={handleScroll}
            onKeyDown={handleKeyDown}
            className="absolute left-12 right-0 top-0 bottom-0 bg-transparent resize-none outline-none overflow-auto"
            style={{
              fontFamily: EDITOR_STYLES.fontFamily,
              fontSize: EDITOR_STYLES.fontSize,
              lineHeight: EDITOR_STYLES.lineHeight,
              letterSpacing: EDITOR_STYLES.letterSpacing,
              tabSize: EDITOR_STYLES.tabSize,
              padding: EDITOR_STYLES.padding,
              whiteSpace: 'pre',
              wordWrap: 'normal',
              overflowWrap: 'normal',
              color: 'transparent',
              caretColor: '#a855f7',
              WebkitTextFillColor: 'transparent',
            }}
            spellCheck={false}
            autoCapitalize="off"
            autoCorrect="off"
            autoComplete="off"
            data-code-editor="true"
            data-gramm="false"
            data-gramm_editor="false"
            data-enable-grammarly="false"
          />
        </div>

        {/* Output Panel */}
        <div className="h-32 border-t border-white/5 flex flex-col flex-shrink-0">
          <div className="px-4 py-2 border-b border-white/5 bg-white/[0.02]">
            <span className="text-sm text-zinc-400 font-medium">Output</span>
          </div>
          <div className="flex-1 p-4 overflow-auto">
            <pre className="font-mono text-sm whitespace-pre-wrap">
              {output ? (
                <span className={output.startsWith('Error') ? 'text-red-400' : 'text-emerald-400'}>
                  {output}
                </span>
              ) : (
                <span className="text-zinc-600">Run your code to see output...</span>
              )}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
});
