import { memo, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Lock, CheckCircle } from 'lucide-react';
import { phaseColors, difficultyColors } from '../../constants';
import type { Project } from '../../data/curriculum';

interface ProjectCardProps {
  project: Project;
  phaseColor: keyof typeof phaseColors;
  progress?: { completed: number; total: number };
}

export const ProjectCard = memo(function ProjectCard({
  project,
  phaseColor,
  progress,
}: ProjectCardProps) {
  const { completed, total, progressPercent, isComplete, colors } = useMemo(() => {
    const comp = progress?.completed ?? 0;
    const tot = progress?.total ?? project.lessons.length;
    const percent = tot > 0 ? Math.round((comp / tot) * 100) : 0;
    return {
      completed: comp,
      total: tot,
      progressPercent: percent,
      isComplete: percent === 100,
      colors: phaseColors[phaseColor],
    };
  }, [progress, project.lessons.length, phaseColor]);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group bg-zinc-900/50 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all block relative"
    >
      {project.isPremium && (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-violet-400" />
        </div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 pr-8">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${difficultyColors[project.difficulty]}`}>
              {project.difficulty}
            </span>
            {isComplete && <CheckCircle className="w-4 h-4 text-emerald-400" />}
          </div>
          <h3 className="font-semibold text-white group-hover:text-violet-400 transition-colors">
            {project.title}
          </h3>
          <p className="text-sm text-zinc-500 mt-1 line-clamp-2">{project.description}</p>
        </div>
      </div>

      <div className="flex items-center justify-between text-xs text-zinc-500 mt-3">
        <span>{completed}/{total} lessons</span>
        <span>~{project.estimatedHours}h</span>
      </div>

      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden mt-3">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete ? 'bg-emerald-500' : `bg-gradient-to-r ${colors.gradient} to-cyan-500`
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </Link>
  );
});
