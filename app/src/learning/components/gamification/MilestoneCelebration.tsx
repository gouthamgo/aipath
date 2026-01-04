import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Sparkles, Trophy, Flame, Target, Star, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { Milestone, Badge } from './types';

interface MilestoneCelebrationProps {
  milestone: Milestone | null;
  badge?: Badge | null;
  xpEarned?: number;
  onClose: () => void;
}

const milestoneIcons: Record<string, React.ReactNode> = {
  first_lesson: <Star className="w-8 h-8" />,
  streak_3: <Flame className="w-8 h-8" />,
  streak_7: <Flame className="w-8 h-8" />,
  streak_30: <Trophy className="w-8 h-8" />,
  daily_goal: <Target className="w-8 h-8" />,
  level_up: <Zap className="w-8 h-8" />,
  phase_complete: <Trophy className="w-8 h-8" />,
  project_complete: <Sparkles className="w-8 h-8" />,
};

export function MilestoneCelebration({
  milestone,
  badge,
  xpEarned = 0,
  onClose,
}: MilestoneCelebrationProps) {
  const [isVisible, setIsVisible] = useState(false);

  const triggerConfetti = useCallback(() => {
    const duration = 2000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 9999 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#8b5cf6', '#06b6d4', '#f59e0b', '#10b981'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (milestone) {
      setIsVisible(true);
      triggerConfetti();
    }
  }, [milestone, triggerConfetti]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300);
  };

  if (!milestone) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.5, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0, y: 50 }}
            transition={{ type: 'spring', damping: 15 }}
            className="bg-zinc-900 rounded-3xl border border-zinc-800 p-8 max-w-md w-full text-center relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-zinc-800 transition-colors"
            >
              <X className="w-5 h-5 text-zinc-500" />
            </button>

            {/* Background glow */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px]" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-cyan-500/20 rounded-full blur-[60px]" />
            </div>

            {/* Icon */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', delay: 0.2 }}
              className="relative z-10 w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-white shadow-lg shadow-violet-500/30"
            >
              {milestoneIcons[milestone.type] || <Sparkles className="w-8 h-8" />}
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative z-10 text-3xl font-bold text-white mb-2"
            >
              {milestone.title}
            </motion.h2>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 text-zinc-400 mb-6"
            >
              {milestone.description}
            </motion.p>

            {/* XP Earned */}
            {(xpEarned > 0 || milestone.xpReward > 0) && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 }}
                className="relative z-10 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/30 mb-6"
              >
                <Sparkles className="w-4 h-4 text-amber-400" />
                <span className="font-semibold text-amber-400">
                  +{xpEarned || milestone.xpReward} XP
                </span>
              </motion.div>
            )}

            {/* Badge Earned */}
            {badge && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="relative z-10 bg-zinc-800/50 rounded-xl p-4 mb-6"
              >
                <div className="text-xs text-zinc-500 mb-2">Badge Unlocked</div>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-3xl">{badge.icon}</span>
                  <div className="text-left">
                    <div className="font-semibold text-white">{badge.name}</div>
                    <div className="text-xs text-zinc-400">{badge.description}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="relative z-10 flex gap-3"
            >
              <button
                onClick={handleClose}
                className="flex-1 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold transition-all"
              >
                Continue Learning
              </button>
              <button
                onClick={() => {
                  // TODO: Implement share functionality
                  navigator.share?.({
                    title: milestone.title,
                    text: `I just achieved "${milestone.title}" on AI Path! ${milestone.description}`,
                    url: window.location.origin,
                  }).catch(() => {});
                }}
                className="px-4 py-3 rounded-xl border border-zinc-700 hover:bg-zinc-800 text-zinc-400 transition-all"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
