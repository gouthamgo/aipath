import { memo, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Clock, Lock, CheckCircle, Play, ChevronRight, Target, ArrowRight } from 'lucide-react';
import { getProjectBySlug, getPhaseForProject } from '../data/curriculum';
import LearningLayout from '../components/LearningLayout';
import { phaseColors, difficultyConfig } from '../constants';
import { ProgressRing, BackgroundGradient, UpgradeCTA } from '../components/ui';

// Mock user progress
const userProgress = {
  completedLessons: [] as string[],
  currentLessonSlug: 'variables-types',
};

const LessonItem = memo(function LessonItem({
  lesson,
  projectSlug,
  isCompleted,
  isCurrent,
}: {
  lesson: { slug: string; title: string; description: string; order: number; estimatedMinutes: number };
  projectSlug: string;
  isCompleted: boolean;
  isCurrent: boolean;
}) {
  return (
    <Link
      to={`/projects/${projectSlug}/lessons/${lesson.slug}`}
      className={`flex items-center gap-4 p-4 rounded-xl border transition-all hover:bg-zinc-800/30 group ${
        isCurrent
          ? 'bg-violet-500/5 border-violet-500/30'
          : 'bg-zinc-900/50 border-zinc-800/80 hover:border-zinc-700'
      }`}
    >
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold shrink-0 ${
          isCompleted
            ? 'bg-emerald-500/15 text-emerald-400'
            : isCurrent
            ? 'bg-violet-500/15 text-violet-400'
            : 'bg-zinc-800 text-zinc-500'
        }`}
      >
        {isCompleted ? <CheckCircle className="w-5 h-5" /> : lesson.order}
      </div>

      <div className="flex-1 min-w-0">
        <h3 className={`font-medium transition-colors ${
          isCurrent ? 'text-violet-400' : 'text-white group-hover:text-violet-400'
        }`}>
          {lesson.title}
        </h3>
        <p className="text-sm text-zinc-500 truncate">{lesson.description}</p>
      </div>

      <div className="flex items-center gap-3 shrink-0 text-zinc-600">
        <span className="text-xs flex items-center gap-1">
          <Clock className="w-3.5 h-3.5" />
          {lesson.estimatedMinutes}m
        </span>
        <ChevronRight className="w-4 h-4 group-hover:text-violet-400 transition-colors" />
      </div>
    </Link>
  );
});

export default function ProjectDetailPage() {
  const { projectSlug } = useParams<{ projectSlug: string }>();

  const { project, phase } = useMemo(() => ({
    project: getProjectBySlug(projectSlug || ''),
    phase: getPhaseForProject(projectSlug || ''),
  }), [projectSlug]);

  if (!project || !phase) {
    return (
      <LearningLayout currentPage="project">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-4">Project Not Found</h1>
            <Link to="/projects" className="text-violet-400 hover:text-violet-300">
              ← Back to Projects
            </Link>
          </div>
        </div>
      </LearningLayout>
    );
  }

  const currentPhaseColors = phaseColors[phase.color];
  const difficulty = difficultyConfig[project.difficulty];

  const completedCount = project.lessons.filter((l) =>
    userProgress.completedLessons.includes(l.slug)
  ).length;

  const progressPercent = Math.round((completedCount / project.lessons.length) * 100);

  const currentLesson =
    project.lessons.find((l) => !userProgress.completedLessons.includes(l.slug)) ||
    project.lessons[0];

  return (
    <LearningLayout currentPage="project">
      <BackgroundGradient
        gradients={[
          { position: 'top-20 right-1/4', size: 'w-[600px] h-[600px]', color: 'bg-violet-600/5' },
          { position: 'bottom-1/3 left-1/4', size: 'w-[500px] h-[500px]', color: 'bg-emerald-600/5' },
        ]}
      />

      <div className="relative z-10">
        {/* Breadcrumb */}
        <div className="border-b border-zinc-800/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center gap-2 text-sm">
              <Link to="/projects" className="text-zinc-500 hover:text-white transition-colors">
                Projects
              </Link>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
              <span className="text-white font-medium">{project.title}</span>
            </div>
          </div>
        </div>

        {/* Hero */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left: Project Info */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border ${currentPhaseColors.bg} ${currentPhaseColors.border}`}>
                  <span className={`text-xs font-bold ${currentPhaseColors.text}`}>Phase {phase.phase}</span>
                  <span className={`text-xs ${currentPhaseColors.text}`}>· {phase.title}</span>
                </div>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${difficulty.colors}`}>
                  {difficulty.label}
                </span>
                {project.isPremium ? (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-violet-500/15 text-violet-400 border border-violet-500/30 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    Pro
                  </span>
                ) : (
                  <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                    Free
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-lg text-zinc-400 leading-relaxed mb-6">{project.longDescription}</p>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-5 text-sm text-zinc-500 mb-6">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4" />
                  {project.lessons.length} lessons
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" />
                  ~{project.estimatedHours} hours
                </span>
                <span className="flex items-center gap-1.5">
                  <Target className="w-4 h-4" />
                  {completedCount}/{project.lessons.length} completed
                </span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-2">
                {project.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs font-medium px-3 py-1.5 rounded-full bg-zinc-800/80 text-zinc-300 border border-zinc-700/50"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Right: CTA Card */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 bg-zinc-900/80 rounded-2xl border border-zinc-800 p-6">
                <div className="flex justify-center mb-6">
                  <ProgressRing progress={progressPercent} size={128} strokeWidth={8} />
                </div>

                <div className="text-center text-sm text-zinc-400 mb-6">
                  {completedCount} of {project.lessons.length} lessons completed
                </div>

                <Link
                  to={`/projects/${projectSlug}/lessons/${currentLesson.slug}`}
                  className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/20"
                >
                  <Play className="w-5 h-5" />
                  {completedCount === 0 ? 'Start Learning' : 'Continue'}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Lessons List */}
        <div className="border-t border-zinc-800/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
            <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Target className="w-5 h-5 text-violet-400" />
              Course Content
              <span className="text-sm font-normal text-zinc-500 ml-2">
                {project.lessons.length} lessons
              </span>
            </h2>

            <div className="grid gap-3">
              {project.lessons.map((lesson) => (
                <LessonItem
                  key={lesson.slug}
                  lesson={lesson}
                  projectSlug={projectSlug || ''}
                  isCompleted={userProgress.completedLessons.includes(lesson.slug)}
                  isCurrent={lesson.slug === currentLesson.slug}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pro Upsell */}
        {project.isPremium && (
          <UpgradeCTA
            description={`Get access to all ${project.lessons.length} lessons in this project plus our entire curriculum with Pro.`}
          />
        )}
      </div>
    </LearningLayout>
  );
}
