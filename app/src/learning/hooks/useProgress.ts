import { useState, useCallback, useEffect } from 'react';

interface HintState {
  revealedCount: number;
  hints: string[];
}

// Hook for managing hint progression
export function useHints(hints: string[] = []) {
  const [revealedCount, setRevealedCount] = useState(0);

  const revealNext = useCallback(() => {
    setRevealedCount(prev => Math.min(prev + 1, hints.length));
  }, [hints.length]);

  const reset = useCallback(() => {
    setRevealedCount(0);
  }, []);

  return {
    revealedHints: hints.slice(0, revealedCount),
    hasMore: revealedCount < hints.length,
    revealNext,
    reset,
    totalHints: hints.length,
    revealedCount,
  };
}

// Hook for managing solution visibility
export function useSolutionVisibility() {
  const [showSolution, setShowSolution] = useState(false);

  const toggle = useCallback(() => {
    setShowSolution(prev => !prev);
  }, []);

  const hide = useCallback(() => {
    setShowSolution(false);
  }, []);

  const show = useCallback(() => {
    setShowSolution(true);
  }, []);

  return { showSolution, toggle, hide, show };
}

// Hook for managing user code state
export function useUserCode(starterCode: string = '') {
  const [code, setCode] = useState(starterCode);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    setCode(starterCode);
    setHasChanges(false);
  }, [starterCode]);

  const updateCode = useCallback((newCode: string) => {
    setCode(newCode);
    setHasChanges(newCode !== starterCode);
  }, [starterCode]);

  const reset = useCallback(() => {
    setCode(starterCode);
    setHasChanges(false);
  }, [starterCode]);

  return { code, updateCode, reset, hasChanges };
}

// Hook for tab management
export type LessonTab = 'problem' | 'solution' | 'explanation' | 'realworld' | 'mistakes' | 'interview';

export function useLessonTabs(defaultTab: LessonTab = 'problem') {
  const [activeTab, setActiveTab] = useState<LessonTab>(defaultTab);

  const tabs: { id: LessonTab; label: string }[] = [
    { id: 'problem', label: 'Problem' },
    { id: 'solution', label: 'Solution' },
    { id: 'explanation', label: 'Explanation' },
    { id: 'realworld', label: 'Real-World' },
    { id: 'mistakes', label: 'Mistakes' },
    { id: 'interview', label: 'Interview' },
  ];

  return { activeTab, setActiveTab, tabs };
}
