import { memo } from 'react';

interface GradientConfig {
  position: string;
  size: string;
  color: string;
}

interface BackgroundGradientProps {
  gradients?: GradientConfig[];
}

const defaultGradients: GradientConfig[] = [
  { position: 'top-0 right-1/4', size: 'w-[600px] h-[600px]', color: 'bg-violet-600/5' },
  { position: 'bottom-1/4 left-1/4', size: 'w-[400px] h-[400px]', color: 'bg-cyan-600/5' },
];

export const BackgroundGradient = memo(function BackgroundGradient({
  gradients = defaultGradients
}: BackgroundGradientProps) {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {gradients.map((g, i) => (
        <div
          key={i}
          className={`absolute ${g.position} ${g.size} ${g.color} rounded-full blur-[120px]`}
        />
      ))}
    </div>
  );
});
