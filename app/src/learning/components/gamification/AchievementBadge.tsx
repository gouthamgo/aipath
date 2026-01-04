import { memo } from 'react';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';
import type { Badge, BadgeRarity } from './types';

interface AchievementBadgeProps {
  badge: Badge;
  earned?: boolean;
  size?: 'sm' | 'md' | 'lg';
  showDetails?: boolean;
}

const rarityColors: Record<BadgeRarity, { bg: string; border: string; glow: string }> = {
  common: { bg: 'bg-zinc-700', border: 'border-zinc-600', glow: '' },
  rare: { bg: 'bg-blue-900/50', border: 'border-blue-500/50', glow: 'shadow-blue-500/20' },
  epic: { bg: 'bg-purple-900/50', border: 'border-purple-500/50', glow: 'shadow-purple-500/30' },
  legendary: { bg: 'bg-amber-900/50', border: 'border-amber-500/50', glow: 'shadow-amber-500/40' },
};

const rarityLabels: Record<BadgeRarity, string> = {
  common: 'Common',
  rare: 'Rare',
  epic: 'Epic',
  legendary: 'Legendary',
};

export const AchievementBadge = memo(function AchievementBadge({
  badge,
  earned = false,
  size = 'md',
  showDetails = true,
}: AchievementBadgeProps) {
  const colors = rarityColors[badge.rarity];

  const sizeClasses = {
    sm: { container: 'p-2', icon: 'text-xl', title: 'text-xs', desc: 'text-[10px]' },
    md: { container: 'p-3', icon: 'text-2xl', title: 'text-sm', desc: 'text-xs' },
    lg: { container: 'p-4', icon: 'text-3xl', title: 'text-base', desc: 'text-sm' },
  };

  const classes = sizeClasses[size];

  return (
    <motion.div
      whileHover={earned ? { scale: 1.05 } : undefined}
      className={`relative rounded-xl border ${colors.border} ${colors.bg} ${classes.container} transition-all ${
        earned ? `shadow-lg ${colors.glow}` : 'opacity-50 grayscale'
      }`}
    >
      {!earned && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-xl">
          <Lock className="w-4 h-4 text-zinc-500" />
        </div>
      )}

      <div className="flex items-center gap-3">
        <div className={`${classes.icon}`}>{badge.icon}</div>
        {showDetails && (
          <div className="flex-1 min-w-0">
            <div className={`font-semibold text-white truncate ${classes.title}`}>
              {badge.name}
            </div>
            <div className={`text-zinc-400 truncate ${classes.desc}`}>
              {badge.description}
            </div>
            <div className={`mt-1 ${classes.desc}`}>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-medium ${
                badge.rarity === 'legendary' ? 'bg-amber-500/20 text-amber-400' :
                badge.rarity === 'epic' ? 'bg-purple-500/20 text-purple-400' :
                badge.rarity === 'rare' ? 'bg-blue-500/20 text-blue-400' :
                'bg-zinc-600/20 text-zinc-400'
              }`}>
                {rarityLabels[badge.rarity]}
              </span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
});
