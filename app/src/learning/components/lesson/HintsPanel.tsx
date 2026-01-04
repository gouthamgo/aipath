import { memo } from 'react';
import { Lightbulb, X } from 'lucide-react';

interface HintsPanelProps {
  hints: string[];
  revealedCount: number;
  onRevealNext: () => void;
  onClose: () => void;
  isVisible: boolean;
}

export const HintsPanel = memo(function HintsPanel({
  hints,
  revealedCount,
  onRevealNext,
  onClose,
  isVisible,
}: HintsPanelProps) {
  if (!isVisible) return null;

  const hasMore = revealedCount < hints.length;
  const revealedHints = hints.slice(0, revealedCount);

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-amber-500/10 border-t border-amber-500/30 p-4 animate-in slide-in-from-bottom duration-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <span className="font-medium text-amber-400">
            Hints ({revealedCount}/{hints.length})
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-zinc-400 hover:text-white transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-2">
        {revealedHints.map((hint, i) => (
          <div
            key={i}
            className="flex items-start gap-2 text-sm text-zinc-300 animate-in fade-in duration-300"
          >
            <span className="text-amber-400 font-mono text-xs mt-0.5">
              {i + 1}.
            </span>
            <span>{hint}</span>
          </div>
        ))}
      </div>

      {hasMore && (
        <button
          onClick={onRevealNext}
          className="mt-3 text-sm text-amber-400 hover:text-amber-300 transition-colors"
        >
          Show next hint →
        </button>
      )}
    </div>
  );
});

// Floating hint button
interface HintButtonProps {
  onClick: () => void;
  hintsUsed: number;
  totalHints: number;
}

export const HintButton = memo(function HintButton({
  onClick,
  hintsUsed,
  totalHints,
}: HintButtonProps) {
  const hasMore = hintsUsed < totalHints;

  return (
    <button
      onClick={onClick}
      disabled={!hasMore}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-amber-400 hover:bg-amber-500/10 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
      title={hasMore ? `Show hint (${hintsUsed}/${totalHints} used)` : 'All hints revealed'}
    >
      <Lightbulb className="w-4 h-4" />
      <span>Hint</span>
      {hintsUsed > 0 && (
        <span className="text-xs text-amber-400/60">
          {hintsUsed}/{totalHints}
        </span>
      )}
    </button>
  );
});
