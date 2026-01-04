// Gamification Types

export interface UserGamification {
  xp: number;
  level: number;
  streak: number;
  longestStreak: number;
  lessonsToday: number;
  dailyGoal: number;
  badges: Badge[];
  lastActiveDate: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt?: string;
  category: BadgeCategory;
  rarity: BadgeRarity;
}

export type BadgeCategory =
  | 'streak'
  | 'completion'
  | 'speed'
  | 'mastery'
  | 'exploration'
  | 'special';

export type BadgeRarity = 'common' | 'rare' | 'epic' | 'legendary';

export interface Level {
  level: number;
  title: string;
  minXP: number;
  maxXP: number;
  color: string;
  icon: string;
}

export interface Milestone {
  id: string;
  type: MilestoneType;
  title: string;
  description: string;
  xpReward: number;
  badge?: Badge;
}

export type MilestoneType =
  | 'first_lesson'
  | 'streak_3'
  | 'streak_7'
  | 'streak_30'
  | 'phase_complete'
  | 'project_complete'
  | 'daily_goal'
  | 'level_up';

export interface DailyGoalProgress {
  completed: number;
  target: number;
  xpEarned: number;
}

export interface XPEvent {
  type: 'lesson_complete' | 'hint_unused' | 'streak_bonus' | 'daily_goal' | 'speed_bonus' | 'first_try';
  amount: number;
  description: string;
}
