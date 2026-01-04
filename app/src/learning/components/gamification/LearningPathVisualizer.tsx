import { memo, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Check,
  Lock,
  Play,
  ChevronRight,
  Star,
  Code2,
  Brain,
  Database,
  Cpu,
  Rocket,
  Bot,
} from 'lucide-react';

interface Phase {
  id: string;
  title: string;
  description: string;
  lessonsTotal: number;
  lessonsComplete: number;
  isFree: boolean;
  isLocked: boolean;
  isCurrent: boolean;
  projects: Array<{
    id: string;
    title: string;
    slug: string;
    lessonsTotal: number;
    lessonsComplete: number;
  }>;
}

interface LearningPathVisualizerProps {
  phases: Phase[];
  currentPhaseId?: string;
  compact?: boolean;
}

const phaseIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  'python-foundations': Code2,
  'llm-fundamentals': Brain,
  'rag-applications': Database,
  'advanced-patterns': Cpu,
  'deployment': Rocket,
  'multi-agent': Bot,
};

const phaseColors: Record<number, { bg: string; border: string; text: string; gradient: string }> = {
  0: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400', gradient: 'from-emerald-500 to-emerald-600' },
  1: { bg: 'bg-violet-500/10', border: 'border-violet-500/30', text: 'text-violet-400', gradient: 'from-violet-500 to-violet-600' },
  2: { bg: 'bg-cyan-500/10', border: 'border-cyan-500/30', text: 'text-cyan-400', gradient: 'from-cyan-500 to-cyan-600' },
  3: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400', gradient: 'from-amber-500 to-amber-600' },
  4: { bg: 'bg-rose-500/10', border: 'border-rose-500/30', text: 'text-rose-400', gradient: 'from-rose-500 to-rose-600' },
  5: { bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', text: 'text-indigo-400', gradient: 'from-indigo-500 to-indigo-600' },
};

export const LearningPathVisualizer = memo(function LearningPathVisualizer({
  phases,
  currentPhaseId,
  compact = false,
}: LearningPathVisualizerProps) {
  const currentPhaseIndex = useMemo(() => {
    const idx = phases.findIndex(p => p.id === currentPhaseId || p.isCurrent);
    return idx >= 0 ? idx : 0;
  }, [phases, currentPhaseId]);

  if (compact) {
    return (
      <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-white">Your Journey</h3>
          <Link to="/projects" className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1">
            View all <ChevronRight className="w-3 h-3" />
          </Link>
        </div>

        {/* Compact Progress Bar */}
        <div className="relative">
          <div className="flex items-center gap-1">
            {phases.map((phase, i) => {
              const progress = phase.lessonsTotal > 0
                ? (phase.lessonsComplete / phase.lessonsTotal) * 100
                : 0;
              const colors = phaseColors[i % 6];
              const isComplete = progress === 100;
              const isCurrent = i === currentPhaseIndex;

              return (
                <div key={phase.id} className="flex-1 relative group">
                  <div className={`h-2 rounded-full overflow-hidden ${
                    phase.isLocked ? 'bg-zinc-800' : 'bg-zinc-700'
                  }`}>
                    {!phase.isLocked && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        className={`h-full bg-gradient-to-r ${colors.gradient}`}
                      />
                    )}
                  </div>

                  {/* Dot indicator */}
                  <div className={`absolute -top-1 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-2 ${
                    isComplete
                      ? `bg-gradient-to-r ${colors.gradient} border-transparent`
                      : isCurrent
                        ? `${colors.bg} ${colors.border}`
                        : phase.isLocked
                          ? 'bg-zinc-800 border-zinc-700'
                          : 'bg-zinc-900 border-zinc-700'
                  } flex items-center justify-center`}>
                    {isComplete && <Check className="w-2 h-2 text-white" />}
                    {phase.isLocked && <Lock className="w-2 h-2 text-zinc-600" />}
                  </div>

                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-zinc-800 rounded text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                    {phase.title}
                    <div className={`text-[10px] ${colors.text}`}>
                      {phase.lessonsComplete}/{phase.lessonsTotal} lessons
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Phase Labels */}
          <div className="flex justify-between mt-4">
            <span className="text-xs text-zinc-500">Start</span>
            <span className="text-xs text-zinc-500">AI Mastermind</span>
          </div>
        </div>
      </div>
    );
  }

  // Full Visualizer
  return (
    <div className="space-y-4">
      {phases.map((phase, i) => {
        const progress = phase.lessonsTotal > 0
          ? (phase.lessonsComplete / phase.lessonsTotal) * 100
          : 0;
        const colors = phaseColors[i % 6];
        const isComplete = progress === 100;
        const isCurrent = i === currentPhaseIndex;
        const Icon = phaseIcons[phase.id] || Star;

        return (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`relative ${i < phases.length - 1 ? 'pb-4' : ''}`}
          >
            {/* Connector Line */}
            {i < phases.length - 1 && (
              <div className="absolute left-6 top-14 bottom-0 w-0.5 bg-zinc-800">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isComplete ? '100%' : '0%' }}
                  className={`w-full bg-gradient-to-b ${colors.gradient}`}
                />
              </div>
            )}

            <div className={`relative rounded-xl border p-4 transition-all ${
              phase.isLocked
                ? 'bg-zinc-900/30 border-zinc-800/50 opacity-60'
                : isCurrent
                  ? `${colors.bg} ${colors.border}`
                  : 'bg-zinc-900/50 border-zinc-800 hover:border-zinc-700'
            }`}>
              <div className="flex items-start gap-4">
                {/* Phase Icon */}
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  isComplete
                    ? `bg-gradient-to-br ${colors.gradient}`
                    : phase.isLocked
                      ? 'bg-zinc-800'
                      : colors.bg
                }`}>
                  {phase.isLocked ? (
                    <Lock className="w-5 h-5 text-zinc-600" />
                  ) : isComplete ? (
                    <Check className="w-5 h-5 text-white" />
                  ) : (
                    <Icon className={`w-5 h-5 ${colors.text}`} />
                  )}
                </div>

                {/* Phase Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className={`font-semibold ${
                      phase.isLocked ? 'text-zinc-500' : 'text-white'
                    }`}>
                      {phase.title}
                    </h3>
                    {phase.isFree && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                        Free
                      </span>
                    )}
                    {isCurrent && !isComplete && (
                      <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-400 border border-violet-500/30">
                        Current
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-zinc-500 mb-3">{phase.description}</p>

                  {/* Progress Bar */}
                  {!phase.isLocked && (
                    <div className="mb-2">
                      <div className="flex justify-between text-xs mb-1">
                        <span className={colors.text}>
                          {phase.lessonsComplete}/{phase.lessonsTotal} lessons
                        </span>
                        <span className="text-zinc-500">{Math.round(progress)}%</span>
                      </div>
                      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          className={`h-full bg-gradient-to-r ${colors.gradient}`}
                        />
                      </div>
                    </div>
                  )}

                  {/* Projects Preview */}
                  {!phase.isLocked && phase.projects.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {phase.projects.slice(0, 3).map((project) => (
                        <Link
                          key={project.id}
                          to={`/projects/${project.slug}`}
                          className="text-xs px-2 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                        >
                          {project.title}
                        </Link>
                      ))}
                      {phase.projects.length > 3 && (
                        <span className="text-xs px-2 py-1 text-zinc-500">
                          +{phase.projects.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Action Button */}
                {!phase.isLocked && (
                  <Link
                    to={`/projects?phase=${phase.id}`}
                    className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isCurrent
                        ? `bg-gradient-to-r ${colors.gradient} text-white hover:shadow-lg`
                        : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                    }`}
                  >
                    {isComplete ? 'Review' : isCurrent ? 'Continue' : 'Start'}
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
});
