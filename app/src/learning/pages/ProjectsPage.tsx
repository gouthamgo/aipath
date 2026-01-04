import { memo, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, Lock, CheckCircle, ChevronRight } from 'lucide-react';
import { curriculum, getTotalLessons, getTotalProjects, Phase } from '../data/curriculum';
import LearningLayout from '../components/LearningLayout';
import { phaseColors, difficultyColors } from '../constants';
import { ProgressRing, PhaseBadge, BackgroundGradient, UpgradeCTA } from '../components/ui';

// Mock user progress
const userProgress = {
  completedLessons: 0,
  projectProgress: {
    'python-basics': { completed: 0, total: 7 },
    'data-manipulation': { completed: 0, total: 5 },
    'apis-requests': { completed: 0, total: 5 },
  } as Record<string, { completed: number; total: number }>,
};

const ProjectListItem = memo(function ProjectListItem({
  project,
  colors,
  progress,
}: {
  project: typeof curriculum[0]['projects'][0];
  colors: typeof phaseColors[keyof typeof phaseColors];
  progress?: { completed: number; total: number };
}) {
  const { completed, total, progressPercent, isComplete } = useMemo(() => {
    const comp = progress?.completed ?? 0;
    const tot = project.lessons.length;
    const percent = tot > 0 ? Math.round((comp / tot) * 100) : 0;
    return { completed: comp, total: tot, progressPercent: percent, isComplete: percent === 100 };
  }, [progress, project.lessons.length]);

  return (
    <Link
      to={`/projects/${project.slug}`}
      className="group bg-zinc-900/50 rounded-xl border border-zinc-800 p-5 hover:border-zinc-700 hover:bg-zinc-800/30 transition-all relative"
    >
      {project.isPremium && (
        <Lock className="absolute top-4 right-4 w-4 h-4 text-violet-400" />
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

      <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {total} lessons
        </span>
        <span className="flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          ~{project.estimatedHours}h
        </span>
      </div>

      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isComplete ? 'bg-emerald-500' : `bg-gradient-to-r ${colors.gradient} to-cyan-500`
          }`}
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="flex items-center justify-between mt-3">
        <div className="flex flex-wrap gap-1">
          {project.skills.slice(0, 2).map((skill, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">
              {skill}
            </span>
          ))}
          {project.skills.length > 2 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">
              +{project.skills.length - 2}
            </span>
          )}
        </div>
        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-violet-400 transition-colors" />
      </div>
    </Link>
  );
});

const PhaseRow = memo(function PhaseRow({
  phase,
  projectProgress,
}: {
  phase: Phase;
  projectProgress: typeof userProgress.projectProgress;
}) {
  const colors = phaseColors[phase.color];

  const phaseProgress = useMemo(() => {
    let completed = 0;
    let total = 0;
    phase.projects.forEach((project) => {
      const progress = projectProgress[project.slug];
      completed += progress?.completed ?? 0;
      total += project.lessons.length;
    });
    return { completed, total, percent: total > 0 ? Math.round((completed / total) * 100) : 0 };
  }, [phase.projects, projectProgress]);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <PhaseBadge phase={phase.phase} color={phase.color} />
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">{phase.title}</h2>
              {phase.isFree ? (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">Free</span>
              ) : (
                <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30">Pro</span>
              )}
            </div>
            <p className="text-sm text-zinc-400">{phase.description}</p>
          </div>
        </div>
        <div className="hidden sm:block text-right">
          <div className="text-lg font-bold text-white">{phaseProgress.percent}%</div>
          <div className="text-xs text-zinc-500">{phaseProgress.completed}/{phaseProgress.total}</div>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {phase.projects.map((project) => (
          <ProjectListItem
            key={project.id}
            project={project}
            colors={colors}
            progress={projectProgress[project.slug]}
          />
        ))}
      </div>
    </div>
  );
});

export default function ProjectsPage() {
  const { totalLessons, totalProjects, overallProgress } = useMemo(() => ({
    totalLessons: getTotalLessons(),
    totalProjects: getTotalProjects(),
    overallProgress: Math.round((userProgress.completedLessons / getTotalLessons()) * 100),
  }), []);

  return (
    <LearningLayout currentPage="projects">
      <BackgroundGradient
        gradients={[
          { position: 'top-1/4 right-1/4', size: 'w-[600px] h-[600px]', color: 'bg-violet-600/5' },
          { position: 'bottom-1/4 left-1/3', size: 'w-[400px] h-[400px]', color: 'bg-cyan-600/5' },
        ]}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-zinc-800/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">Learning Path</h1>
                <p className="text-zinc-400 text-lg">
                  {curriculum.length} phases · {totalProjects} projects · {totalLessons} lessons
                </p>
              </div>

              <div className="flex items-center gap-6 bg-zinc-900/50 rounded-xl border border-zinc-800 px-6 py-4">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Overall Progress</div>
                  <div className="text-xl font-bold text-white">{userProgress.completedLessons}/{totalLessons}</div>
                </div>
                <ProgressRing progress={overallProgress} />
              </div>
            </div>
          </div>
        </div>

        {/* Phases */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="space-y-12">
            {curriculum.map((phase) => (
              <PhaseRow key={phase.phase} phase={phase} projectProgress={userProgress.projectProgress} />
            ))}
          </div>
        </div>

        <UpgradeCTA
          title="Unlock All Projects"
          description={`Get access to all ${totalLessons} lessons across ${totalProjects} projects with Pro.`}
        />
      </div>
    </LearningLayout>
  );
}
