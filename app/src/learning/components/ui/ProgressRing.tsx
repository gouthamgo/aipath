import { memo, useMemo } from 'react';

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
  color?: string;
}

export const ProgressRing = memo(function ProgressRing({
  progress,
  size = 80,
  strokeWidth = 6,
  showLabel = true,
  color = 'stroke-violet-500',
}: ProgressRingProps) {
  const { radius, circumference, offset } = useMemo(() => {
    const r = (size - strokeWidth) / 2;
    const c = r * 2 * Math.PI;
    const o = c - (progress / 100) * c;
    return { radius: r, circumference: c, offset: o };
  }, [size, strokeWidth, progress]);

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          className="stroke-zinc-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          className={color}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
        />
      </svg>
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-lg font-bold text-white">{progress}%</span>
        </div>
      )}
    </div>
  );
});
