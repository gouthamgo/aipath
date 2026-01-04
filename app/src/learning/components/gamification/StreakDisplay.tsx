import { memo } from 'react';
import { motion } from 'framer-motion';
import { Flame, Calendar, Trophy } from 'lucide-react';

interface StreakDisplayProps {
  currentStreak: number;
  longestStreak: number;
  weekActivity?: boolean[]; // Last 7 days, true = active
}

export const StreakDisplay = memo(function StreakDisplay({
  currentStreak,
  longestStreak,
  weekActivity = [false, false, false, false, false, false, false],
}: StreakDisplayProps) {
  const dayLabels = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const today = new Date().getDay();
  const todayIndex = today === 0 ? 6 : today - 1; // Convert to Mon=0 index

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <motion.div
            animate={{
              scale: currentStreak > 0 ? [1, 1.1, 1] : 1,
            }}
            transition={{
              duration: 0.5,
              repeat: currentStreak > 0 ? Infinity : 0,
              repeatDelay: 2
            }}
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              currentStreak > 0 ? 'bg-amber-500/20' : 'bg-zinc-800'
            }`}
          >
            <Flame className={`w-6 h-6 ${
              currentStreak > 0 ? 'text-amber-400' : 'text-zinc-600'
            }`} />
          </motion.div>
          <div>
            <div className="text-2xl font-bold text-white">{currentStreak}</div>
            <div className="text-xs text-zinc-500">day streak</div>
          </div>
        </div>

        <div className="text-right">
          <div className="flex items-center gap-1 text-zinc-500">
            <Trophy className="w-3 h-3" />
            <span className="text-xs">Best: {longestStreak}</span>
          </div>
        </div>
      </div>

      {/* Week Activity */}
      <div className="flex items-center gap-1">
        {weekActivity.map((active, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className={`w-full aspect-square rounded-lg flex items-center justify-center ${
                active
                  ? 'bg-amber-500/20 border border-amber-500/30'
                  : i === todayIndex
                    ? 'bg-zinc-800 border border-zinc-700 border-dashed'
                    : 'bg-zinc-800/50'
              }`}
            >
              {active && <Flame className="w-3 h-3 text-amber-400" />}
            </motion.div>
            <span className={`text-[10px] ${
              i === todayIndex ? 'text-violet-400 font-medium' : 'text-zinc-600'
            }`}>
              {dayLabels[i]}
            </span>
          </div>
        ))}
      </div>

      {/* Motivation Message */}
      <div className="mt-4 text-center">
        {currentStreak === 0 ? (
          <p className="text-sm text-zinc-500">Start your streak today!</p>
        ) : currentStreak < 7 ? (
          <p className="text-sm text-zinc-500">
            {7 - currentStreak} more days to Week Warrior badge!
          </p>
        ) : currentStreak < 30 ? (
          <p className="text-sm text-amber-400/80">
            Keep going! {30 - currentStreak} days to Monthly Master!
          </p>
        ) : (
          <p className="text-sm text-amber-400">You're on fire! Keep it up!</p>
        )}
      </div>
    </div>
  );
});
