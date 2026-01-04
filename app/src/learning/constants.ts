// Shared constants for learning module

export const phaseColors = {
  emerald: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    text: "text-emerald-400",
    gradient: "from-emerald-500",
  },
  violet: {
    bg: "bg-violet-500/10",
    border: "border-violet-500/30",
    text: "text-violet-400",
    gradient: "from-violet-500",
  },
  cyan: {
    bg: "bg-cyan-500/10",
    border: "border-cyan-500/30",
    text: "text-cyan-400",
    gradient: "from-cyan-500",
  },
  amber: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    text: "text-amber-400",
    gradient: "from-amber-500",
  },
  rose: {
    bg: "bg-rose-500/10",
    border: "border-rose-500/30",
    text: "text-rose-400",
    gradient: "from-rose-500",
  },
} as const;

export type PhaseColor = keyof typeof phaseColors;

export const difficultyColors = {
  beginner: "text-emerald-400 bg-emerald-500/10 border-emerald-500/30",
  intermediate: "text-amber-400 bg-amber-500/10 border-amber-500/30",
  advanced: "text-rose-400 bg-rose-500/10 border-rose-500/30",
} as const;

export type DifficultyLevel = keyof typeof difficultyColors;

export const difficultyConfig = {
  beginner: { label: "Beginner", colors: difficultyColors.beginner },
  intermediate: { label: "Intermediate", colors: difficultyColors.intermediate },
  advanced: { label: "Advanced", colors: difficultyColors.advanced },
} as const;
