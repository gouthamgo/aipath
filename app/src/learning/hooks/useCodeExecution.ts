import { useState, useCallback } from 'react';

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
}

interface UseCodeExecutionReturn {
  isExecuting: boolean;
  result: ExecutionResult | null;
  execute: (code: string) => Promise<void>;
  reset: () => void;
}

// Piston API for code execution
const PISTON_API = 'https://emkc.org/api/v2/piston/execute';

export function useCodeExecution(): UseCodeExecutionReturn {
  const [isExecuting, setIsExecuting] = useState(false);
  const [result, setResult] = useState<ExecutionResult | null>(null);

  const execute = useCallback(async (code: string) => {
    setIsExecuting(true);
    setResult(null);
    const startTime = performance.now();

    try {
      const response = await fetch(PISTON_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language: 'python',
          version: '3.10',
          files: [{ content: code }],
        }),
      });

      const data = await response.json();
      const executionTime = performance.now() - startTime;

      if (data.run) {
        setResult({
          output: data.run.stdout || '',
          error: data.run.stderr || null,
          executionTime,
        });
      } else {
        setResult({
          output: '',
          error: data.message || 'Execution failed',
          executionTime,
        });
      }
    } catch (err) {
      setResult({
        output: '',
        error: err instanceof Error ? err.message : 'Network error',
        executionTime: performance.now() - startTime,
      });
    } finally {
      setIsExecuting(false);
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
  }, []);

  return { isExecuting, result, execute, reset };
}
