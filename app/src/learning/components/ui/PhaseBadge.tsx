import { memo } from 'react';
import { phaseColors } from '../../constants';

interface PhaseBadgeProps {
  phase: number;
  color: keyof typeof phaseColors;
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-lg',
  lg: 'w-12 h-12 text-xl',
};

export const PhaseBadge = memo(function PhaseBadge({ phase, color, size = 'lg' }: PhaseBadgeProps) {
  const colors = phaseColors[color];

  return (
    <div className={`${sizes[size]} rounded-xl flex items-center justify-center font-bold border ${colors.bg} ${colors.border} ${colors.text}`}>
      {phase}
    </div>
  );
});
