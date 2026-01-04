import { memo } from 'react';
import { motion } from 'framer-motion';
import { getLevelFromXP } from './constants';

interface LevelBadgeProps {
  xp: number;
  size?: 'sm' | 'md' | 'lg';
  showTitle?: boolean;
}

const colorMap: Record<string, string> = {
  zinc: 'from-zinc-500 to-zinc-600',
  emerald: 'from-emerald-500 to-emerald-600',
  cyan: 'from-cyan-500 to-cyan-600',
  violet: 'from-violet-500 to-violet-600',
  purple: 'from-purple-500 to-purple-600',
  blue: 'from-blue-500 to-blue-600',
  indigo: 'from-indigo-500 to-indigo-600',
  amber: 'from-amber-500 to-amber-600',
  orange: 'from-orange-500 to-orange-600',
  rose: 'from-rose-500 to-rose-600',
};

export const LevelBadge = memo(function LevelBadge({
  xp,
  size = 'md',
  showTitle = true,
}: LevelBadgeProps) {
  const level = getLevelFromXP(xp);
  const gradient = colorMap[level.color] || colorMap.violet;

  const sizeClasses = {
    sm: { badge: 'w-8 h-8', icon: 'text-lg', text: 'text-xs' },
    md: { badge: 'w-12 h-12', icon: 'text-2xl', text: 'text-sm' },
    lg: { badge: 'w-16 h-16', icon: 'text-3xl', text: 'text-base' },
  };

  const classes = sizeClasses[size];

  return (
    <div className="flex items-center gap-3">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className={`${classes.badge} rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
      >
        <span className={classes.icon}>{level.icon}</span>
      </motion.div>
      {showTitle && (
        <div>
          <div className="text-xs text-zinc-500">Level {level.level}</div>
          <div className={`font-semibold text-white ${classes.text}`}>{level.title}</div>
        </div>
      )}
    </div>
  );
});
