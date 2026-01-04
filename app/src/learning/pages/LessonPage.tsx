import { useState, useCallback, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, Clock, CheckCircle, Home, Loader2 } from 'lucide-react';
import { markLessonComplete, getLesson } from 'wasp/client/operations';
import { useQuery } from 'wasp/client/operations';

// Hooks
import { useFullLesson } from '../hooks/useLesson';
import { useCodeExecution } from '../hooks/useCodeExecution';
import { useHints, useLessonTabs, useUserCode } from '../hooks/useProgress';

// Components
import { MarkdownRenderer } from '../components/lesson/MarkdownRenderer';
import { CodeEditor } from '../components/lesson/CodeEditor';
import { HintsPanel } from '../components/lesson/HintsPanel';

// Tab configuration
const TABS = [
  { id: 'problem' as const, label: 'Problem', icon: '📋' },
  { id: 'solution' as const, label: 'Solution', icon: '💡' },
  { id: 'explanation' as const, label: 'Explain', icon: '📚' },
  { id: 'realworld' as const, label: 'Real-World', icon: '🌍' },
  { id: 'mistakes' as const, label: 'Mistakes', icon: '⚠️' },
  { id: 'interview' as const, label: 'Interview', icon: '💼' },
];

// Default content for lessons without detailed content
function getDefaultContent(title: string, description: string) {
  return {
    problemContent: `# ${title}\n\n${description}\n\n## Your Task\n\nComplete the code exercise below to practice this concept.\n\n## Tips\n\n- Take your time to understand the concept\n- Experiment with different approaches\n- Check the hints if you get stuck`,
    solutionContent: `# Solution: ${title}\n\nThe solution for this exercise will be revealed once you complete it or click "Show Solution".`,
    explanationContent: `# Deep Dive: ${title}\n\n${description}\n\n## Key Concepts\n\nThis lesson covers important concepts that you'll use throughout your AI engineering journey.`,
    realworldContent: `# Real-World Applications\n\n## How Professionals Use This\n\nThese concepts are used daily by AI engineers at companies building production AI systems.`,
    mistakesContent: `# Common Mistakes to Avoid\n\n## 1. Rushing Through\nTake time to understand the concepts before coding.\n\n## 2. Not Reading Error Messages\nError messages tell you exactly what went wrong.`,
    interviewContent: `# Interview Preparation\n\n## Commonly Asked Questions\n\nInterviewers often ask about these concepts. Be ready to explain them clearly.`,
    starterCode: `# ${title}\n# Complete the exercise below\n\n# Your code here\n`,
    solutionCode: `# ${title}\n# Example solution\n\nprint("Solution complete!")\n`,
    hints: ['Read the problem statement carefully', 'Break down the problem into smaller steps', 'Check the documentation if needed'],
  };
}

export default function LessonPage() {
  const { projectSlug, lessonSlug } = useParams<{ projectSlug: string; lessonSlug: string }>();

  // Get lesson data from static curriculum
  const { content, project, lesson, currentIndex, totalLessons, prevLesson, nextLesson, error } =
    useFullLesson(projectSlug, lessonSlug);

  // Get database lesson (includes id and userProgress)
  const { data: dbLesson } = useQuery(getLesson, {
    projectSlug: projectSlug || '',
    lessonSlug: lessonSlug || '',
  });

  // Merge content with defaults
  const lessonContent = useMemo(() => {
    if (content) return content;
    if (lesson) return getDefaultContent(lesson.title, lesson.description);
    return null;
  }, [content, lesson]);

  // Check if this lesson is already completed
  const isAlreadyCompleted = dbLesson?.userProgress?.status === 'completed';

  // State hooks
  const { activeTab, setActiveTab } = useLessonTabs('problem');
  const { code, updateCode, reset: resetCode } = useUserCode(lessonContent?.starterCode || '');
  const { isExecuting, result, execute } = useCodeExecution();
  const { revealedHints, hasMore, revealNext, reset: resetHints, totalHints, revealedCount } =
    useHints(lessonContent?.hints || []);
  const [showHints, setShowHints] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isMarkingComplete, setIsMarkingComplete] = useState(false);

  // Set initial completion state from user progress
  useEffect(() => {
    if (isAlreadyCompleted) {
      setIsCompleted(true);
    }
  }, [isAlreadyCompleted]);

  // Auto-complete when code executes successfully
  useEffect(() => {
    if (result && !result.error && result.output && dbLesson && !isCompleted && !isAlreadyCompleted) {
      // Code ran successfully with output and no errors
      setIsMarkingComplete(true);
      markLessonComplete({ lessonId: dbLesson.id })
        .then(() => {
          setIsCompleted(true);
        })
        .catch((err) => {
          console.error('Failed to mark lesson complete:', err);
        })
        .finally(() => {
          setIsMarkingComplete(false);
        });
    }
  }, [result, dbLesson, isCompleted, isAlreadyCompleted]);

  // Handlers
  const handleRun = useCallback(() => {
    execute(code);
  }, [code, execute]);

  const handleReset = useCallback(() => {
    resetCode();
    resetHints();
  }, [resetCode, resetHints]);

  const handleShowSolution = useCallback(() => {
    if (lessonContent?.solutionCode) {
      updateCode(lessonContent.solutionCode);
    }
  }, [lessonContent, updateCode]);

  const handleHint = useCallback(() => {
    if (hasMore) {
      revealNext();
      setShowHints(true);
    }
  }, [hasMore, revealNext]);

  // Get current tab content
  const tabContent = useMemo(() => {
    if (!lessonContent) return '';
    const contentMap = {
      problem: lessonContent.problemContent,
      solution: lessonContent.solutionContent,
      explanation: lessonContent.explanationContent,
      realworld: lessonContent.realworldContent,
      mistakes: lessonContent.mistakesContent,
      interview: lessonContent.interviewContent,
    };
    return contentMap[activeTab] || lessonContent.problemContent;
  }, [activeTab, lessonContent]);

  // Error state
  if (error || !lesson || !project) {
    return (
      <div className="min-h-screen bg-[#09090b] flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Lesson Not Found</h1>
          <Link to="/projects" className="text-violet-400 hover:text-violet-300">
            Back to Projects
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#09090b] flex flex-col overflow-hidden">
      {/* Header */}
      <header className="h-14 border-b border-white/5 flex items-center justify-between px-4 flex-shrink-0 bg-[#09090b]/80 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <Link
            to="/dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
            title="Dashboard"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Link
            to={`/projects/${projectSlug}`}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm font-medium">{project.title}</span>
          </Link>
          <div className="h-5 w-px bg-white/10" />
          <span className="text-sm text-zinc-500">
            {currentIndex}/{totalLessons}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-sm text-zinc-500 flex items-center gap-1">
            <Clock className="w-4 h-4" />
            ~{lesson.estimatedMinutes} min
          </span>
          {isCompleted ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/20 text-emerald-400 text-sm font-medium border border-emerald-500/30">
              <CheckCircle className="w-4 h-4" />
              Completed
            </div>
          ) : isMarkingComplete ? (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600/50 text-white text-sm font-medium">
              <Loader2 className="w-4 h-4 animate-spin" />
              Saving...
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-zinc-700/50 text-zinc-400 text-sm font-medium">
              <CheckCircle className="w-4 h-4" />
              Run code to complete
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel: Content */}
        <div className="w-1/2 border-r border-white/5 flex flex-col overflow-hidden">
          {/* Tabs */}
          <div className="flex items-center gap-1 px-4 py-2 border-b border-white/5 overflow-x-auto flex-shrink-0 bg-white/[0.02]">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-violet-600 text-white'
                    : 'text-zinc-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 prose-invert">
            <MarkdownRenderer content={tabContent} />
          </div>
        </div>

        {/* Right Panel: Code Editor */}
        <div className="w-1/2 flex flex-col overflow-hidden relative">
          <CodeEditor
            code={code}
            onChange={updateCode}
            onRun={handleRun}
            onReset={handleReset}
            onShowSolution={handleShowSolution}
            onHint={handleHint}
            hintsUsed={revealedCount}
            totalHints={totalHints}
            isRunning={isExecuting}
            output={result?.output || result?.error || ''}
          />

          {/* Hints Panel */}
          <HintsPanel
            hints={lessonContent?.hints || []}
            revealedCount={revealedCount}
            onRevealNext={revealNext}
            onClose={() => setShowHints(false)}
            isVisible={showHints && revealedCount > 0}
          />
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="h-14 border-t border-white/5 flex items-center justify-between px-4 flex-shrink-0 bg-[#09090b]/80">
        {prevLesson ? (
          <Link
            to={`/projects/${projectSlug}/lessons/${prevLesson.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">{prevLesson.title}</span>
          </Link>
        ) : (
          <div />
        )}

        <span className="text-sm font-medium text-white">{lesson.title}</span>

        {nextLesson ? (
          <Link
            to={`/projects/${projectSlug}/lessons/${nextLesson.slug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-violet-600 hover:bg-violet-500 text-white transition-all"
          >
            <span className="text-sm">{nextLesson.title}</span>
            <ChevronLeft className="w-4 h-4 rotate-180" />
          </Link>
        ) : (
          <Link
            to={`/projects/${projectSlug}`}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-all"
          >
            <span className="text-sm">Complete Project</span>
            <CheckCircle className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
