import { memo } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, TrendingUp } from 'lucide-react';
import { getLevelFromXP, getXPToNextLevel } from './constants';

interface XPDisplayProps {
  xp: number;
  showLevel?: boolean;
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

export const XPDisplay = memo(function XPDisplay({
  xp,
  showLevel = true,
  size = 'md',
  animate = true,
}: XPDisplayProps) {
  const level = getLevelFromXP(xp);
  const { current, needed, progress } = getXPToNextLevel(xp);

  const sizeClasses = {
    sm: { container: 'p-3', text: 'text-sm', icon: 'w-4 h-4', bar: 'h-1.5' },
    md: { container: 'p-4', text: 'text-base', icon: 'w-5 h-5', bar: 'h-2' },
    lg: { container: 'p-6', text: 'text-lg', icon: 'w-6 h-6', bar: 'h-3' },
  };

  const classes = sizeClasses[size];

  return (
    <div className={`bg-zinc-900/50 rounded-xl border border-zinc-800 ${classes.container}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center">
            <Sparkles className={`${classes.icon} text-violet-400`} />
          </div>
          <div>
            <span className={`font-bold text-white ${classes.text}`}>{xp.toLocaleString()} XP</span>
            {showLevel && (
              <div className="flex items-center gap-1 text-xs text-zinc-500">
                <span>{level.icon}</span>
                <span>{level.title}</span>
              </div>
            )}
          </div>
        </div>
        {showLevel && (
          <div className="text-right">
            <div className="text-xs text-zinc-500">Level {level.level}</div>
            <div className="text-xs text-violet-400">{current}/{needed} to next</div>
          </div>
        )}
      </div>

      {/* XP Progress Bar */}
      <div className={`w-full bg-zinc-800 rounded-full overflow-hidden ${classes.bar}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
          initial={animate ? { width: 0 } : { width: `${progress}%` }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
});
