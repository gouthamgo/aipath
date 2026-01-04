import { Level, Badge, Milestone } from './types';

// XP Rewards
export const XP_REWARDS = {
  LESSON_COMPLETE: 50,
  HINT_UNUSED_BONUS: 10,
  FIRST_TRY_BONUS: 25,
  SPEED_BONUS: 15,
  DAILY_GOAL_BONUS: 100,
  STREAK_DAY_BONUS: 10,
  PROJECT_COMPLETE: 200,
  PHASE_COMPLETE: 500,
} as const;

// Levels Configuration
export const LEVELS: Level[] = [
  { level: 1, title: 'Curious Learner', minXP: 0, maxXP: 100, color: 'zinc', icon: '🌱' },
  { level: 2, title: 'Code Explorer', minXP: 100, maxXP: 250, color: 'emerald', icon: '🔍' },
  { level: 3, title: 'AI Apprentice', minXP: 250, maxXP: 500, color: 'cyan', icon: '🎯' },
  { level: 4, title: 'Prompt Crafter', minXP: 500, maxXP: 1000, color: 'violet', icon: '✨' },
  { level: 5, title: 'Model Whisperer', minXP: 1000, maxXP: 2000, color: 'purple', icon: '🧠' },
  { level: 6, title: 'RAG Specialist', minXP: 2000, maxXP: 3500, color: 'blue', icon: '📚' },
  { level: 7, title: 'Agent Architect', minXP: 3500, maxXP: 5500, color: 'indigo', icon: '🤖' },
  { level: 8, title: 'AI Engineer', minXP: 5500, maxXP: 8000, color: 'amber', icon: '⚡' },
  { level: 9, title: 'Production Pro', minXP: 8000, maxXP: 12000, color: 'orange', icon: '🚀' },
  { level: 10, title: 'AI Mastermind', minXP: 12000, maxXP: Infinity, color: 'rose', icon: '👑' },
];

// Available Badges
export const BADGES: Badge[] = [
  // Streak Badges
  { id: 'streak_3', name: 'Getting Started', description: '3 day learning streak', icon: '🔥', category: 'streak', rarity: 'common' },
  { id: 'streak_7', name: 'Week Warrior', description: '7 day learning streak', icon: '⚡', category: 'streak', rarity: 'rare' },
  { id: 'streak_14', name: 'Fortnight Fighter', description: '14 day learning streak', icon: '💪', category: 'streak', rarity: 'rare' },
  { id: 'streak_30', name: 'Monthly Master', description: '30 day learning streak', icon: '🏆', category: 'streak', rarity: 'epic' },
  { id: 'streak_100', name: 'Century Legend', description: '100 day learning streak', icon: '👑', category: 'streak', rarity: 'legendary' },

  // Completion Badges
  { id: 'first_lesson', name: 'First Steps', description: 'Complete your first lesson', icon: '🎯', category: 'completion', rarity: 'common' },
  { id: 'lessons_10', name: 'Dedicated Learner', description: 'Complete 10 lessons', icon: '📚', category: 'completion', rarity: 'common' },
  { id: 'lessons_50', name: 'Knowledge Seeker', description: 'Complete 50 lessons', icon: '🎓', category: 'completion', rarity: 'rare' },
  { id: 'lessons_100', name: 'Century Club', description: 'Complete 100 lessons', icon: '💯', category: 'completion', rarity: 'epic' },
  { id: 'all_lessons', name: 'Completionist', description: 'Complete all lessons', icon: '🌟', category: 'completion', rarity: 'legendary' },

  // Phase Badges
  { id: 'phase_1', name: 'Python Pioneer', description: 'Complete Python Foundations', icon: '🐍', category: 'mastery', rarity: 'common' },
  { id: 'phase_2', name: 'LLM Learner', description: 'Complete LLM Fundamentals', icon: '🤖', category: 'mastery', rarity: 'rare' },
  { id: 'phase_3', name: 'RAG Ranger', description: 'Complete RAG Applications', icon: '🔍', category: 'mastery', rarity: 'rare' },
  { id: 'phase_4', name: 'Pattern Pro', description: 'Complete Advanced Patterns', icon: '🧩', category: 'mastery', rarity: 'epic' },
  { id: 'phase_5', name: 'Deploy Master', description: 'Complete Deployment', icon: '🚀', category: 'mastery', rarity: 'epic' },
  { id: 'phase_6', name: 'Agent Architect', description: 'Complete Multi-Agent Systems', icon: '🏗️', category: 'mastery', rarity: 'legendary' },

  // Speed Badges
  { id: 'speed_demon', name: 'Speed Demon', description: 'Complete a lesson under 5 minutes', icon: '⚡', category: 'speed', rarity: 'common' },
  { id: 'no_hints', name: 'Self Sufficient', description: 'Complete 10 lessons without hints', icon: '🧠', category: 'speed', rarity: 'rare' },
  { id: 'first_try', name: 'First Try Wonder', description: 'Pass 5 lessons on first attempt', icon: '🎯', category: 'speed', rarity: 'rare' },

  // Special Badges
  { id: 'early_bird', name: 'Early Bird', description: 'Complete a lesson before 7 AM', icon: '🌅', category: 'special', rarity: 'common' },
  { id: 'night_owl', name: 'Night Owl', description: 'Complete a lesson after midnight', icon: '🦉', category: 'special', rarity: 'common' },
  { id: 'weekend_warrior', name: 'Weekend Warrior', description: 'Learn on both Saturday and Sunday', icon: '💪', category: 'special', rarity: 'common' },
];

// Milestone Definitions
export const MILESTONES: Milestone[] = [
  { id: 'first_lesson', type: 'first_lesson', title: 'First Lesson Complete!', description: 'You\'ve taken your first step into AI engineering', xpReward: 50 },
  { id: 'streak_3', type: 'streak_3', title: '3 Day Streak!', description: 'You\'re building a learning habit', xpReward: 50 },
  { id: 'streak_7', type: 'streak_7', title: 'Week Streak!', description: 'A full week of consistent learning', xpReward: 100 },
  { id: 'streak_30', type: 'streak_30', title: 'Monthly Streak!', description: 'You\'re unstoppable! 30 days of dedication', xpReward: 500 },
  { id: 'daily_goal', type: 'daily_goal', title: 'Daily Goal Achieved!', description: 'You met your learning goal for today', xpReward: 100 },
  { id: 'level_up', type: 'level_up', title: 'Level Up!', description: 'You\'ve reached a new level', xpReward: 0 },
];

// Helper Functions
export function getLevelFromXP(xp: number): Level {
  return LEVELS.find(l => xp >= l.minXP && xp < l.maxXP) || LEVELS[LEVELS.length - 1];
}

export function getXPToNextLevel(xp: number): { current: number; needed: number; progress: number } {
  const level = getLevelFromXP(xp);
  const xpInLevel = xp - level.minXP;
  const xpNeeded = level.maxXP - level.minXP;
  return {
    current: xpInLevel,
    needed: xpNeeded,
    progress: Math.min((xpInLevel / xpNeeded) * 100, 100),
  };
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find(b => b.id === id);
}
