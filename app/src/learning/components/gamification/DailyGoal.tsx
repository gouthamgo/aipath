import { memo } from 'react';
import { motion } from 'framer-motion';
import { Target, Check, Flame } from 'lucide-react';

interface DailyGoalProps {
  completed: number;
  target: number;
  streak: number;
}

export const DailyGoal = memo(function DailyGoal({
  completed,
  target,
  streak,
}: DailyGoalProps) {
  const progress = Math.min((completed / target) * 100, 100);
  const isComplete = completed >= target;

  return (
    <div className={`rounded-xl border p-4 transition-all ${
      isComplete
        ? 'bg-emerald-500/10 border-emerald-500/30'
        : 'bg-zinc-900/50 border-zinc-800'
    }`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
            isComplete ? 'bg-emerald-500/20' : 'bg-amber-500/20'
          }`}>
            {isComplete ? (
              <Check className="w-5 h-5 text-emerald-400" />
            ) : (
              <Target className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <div className="font-semibold text-white">Daily Goal</div>
            <div className="text-xs text-zinc-500">
              {isComplete ? 'Completed!' : `${target - completed} more to go`}
            </div>
          </div>
        </div>

        {streak > 0 && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30">
            <Flame className="w-4 h-4 text-amber-400" />
            <span className="text-sm font-medium text-amber-400">{streak}</span>
          </div>
        )}
      </div>

      {/* Progress circles */}
      <div className="flex items-center gap-2">
        {Array.from({ length: target }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className={`flex-1 h-3 rounded-full transition-colors ${
              i < completed
                ? isComplete
                  ? 'bg-emerald-500'
                  : 'bg-violet-500'
                : 'bg-zinc-800'
            }`}
          />
        ))}
      </div>

      {/* Completion message */}
      {isComplete && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-center text-sm text-emerald-400"
        >
          +100 XP bonus earned!
        </motion.div>
      )}
    </div>
  );
});
