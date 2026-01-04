import { memo } from 'react';
import { difficultyColors } from '../../constants';

interface DifficultyBadgeProps {
  difficulty: keyof typeof difficultyColors;
}

export const DifficultyBadge = memo(function DifficultyBadge({ difficulty }: DifficultyBadgeProps) {
  return (
    <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[difficulty]}`}>
      {difficulty}
    </span>
  );
});
