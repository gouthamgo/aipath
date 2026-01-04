import { memo, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { motion } from 'framer-motion';
import {
  BookOpen,
  Flame,
  Trophy,
  Clock,
  Play,
  ArrowRight,
  Sparkles,
  Target,
  Zap,
  Award,
  ChevronRight,
} from 'lucide-react';
import { curriculum, getTotalLessons, getTotalProjects } from '../data/curriculum';
import LearningLayout from '../components/LearningLayout';
import { phaseColors, difficultyColors } from '../constants';
import {
  StatCard,
  ProgressRing,
  ProjectCard,
  PhaseBadge,
  BackgroundGradient,
  UpgradeCTA,
} from '../components/ui';
import {
  XPDisplay,
  DailyGoal,
  LevelBadge,
  StreakDisplay,
  AchievementBadge,
  MilestoneCelebration,
  LearningPathVisualizer,
} from '../components/gamification';
import { BADGES, getLevelFromXP, getXPToNextLevel } from '../components/gamification/constants';
import type { Milestone, Badge } from '../components/gamification/types';

// Mock user progress - would come from database
const userProgress = {
  xp: 350,
  completedLessons: 12,
  streak: 5,
  longestStreak: 12,
  hoursLearned: 4.5,
  certificates: 0,
  dailyGoal: 2,
  lessonsToday: 1,
  currentProjectSlug: 'python-basics',
  currentLessonSlug: 'variables-types',
  weekActivity: [true, true, false, true, true, false, false],
  earnedBadges: ['first_lesson', 'streak_3'],
  hasCompletedOnboarding: true, // Toggle this to show/hide onboarding redirect
  projectProgress: {
    'python-basics': { completed: 5, total: 7 },
    'data-manipulation': { completed: 2, total: 5 },
    'apis-requests': { completed: 0, total: 5 },
  } as Record<string, { completed: number; total: number }>,
};

// Quick Actions Component
const QuickActions = memo(function QuickActions() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[
        { icon: Play, label: 'Continue', color: 'violet', href: '/projects/python-basics/lessons/variables-types' },
        { icon: Target, label: 'Daily Goal', color: 'amber', href: '#daily-goal' },
        { icon: Award, label: 'Badges', color: 'cyan', href: '#badges' },
        { icon: Trophy, label: 'Leaderboard', color: 'emerald', href: '#leaderboard' },
      ].map((action, i) => (
        <Link
          key={action.label}
          to={action.href}
          className={`flex items-center gap-3 p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 hover:border-${action.color}-500/30 transition-all group`}
        >
          <div className={`w-10 h-10 rounded-lg bg-${action.color}-500/10 flex items-center justify-center`}>
            <action.icon className={`w-5 h-5 text-${action.color}-400`} />
          </div>
          <span className="font-medium text-zinc-300 group-hover:text-white transition-colors">
            {action.label}
          </span>
        </Link>
      ))}
    </div>
  );
});

// Continue Learning Card - More prominent
const ContinueLearning = memo(function ContinueLearning({
  project,
  lesson,
  xpReward,
}: {
  project: typeof curriculum[0]['projects'][0];
  lesson: typeof curriculum[0]['projects'][0]['lessons'][0];
  xpReward: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600/20 via-violet-500/10 to-cyan-600/20 border border-violet-500/30 p-6"
    >
      {/* Glow effect */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/20 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <span className="px-2 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-xs font-medium">
            Up Next
          </span>
          <span className="text-xs text-zinc-500">
            Lesson {lesson.order} of {project.lessons.length}
          </span>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2">{lesson.title}</h2>
        <p className="text-zinc-400 mb-4">{lesson.description}</p>

        <div className="flex flex-wrap items-center gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <Clock className="w-4 h-4" />
            ~{lesson.estimatedMinutes} min
          </div>
          <div className="flex items-center gap-1.5 text-sm text-zinc-400">
            <BookOpen className="w-4 h-4" />
            {project.title}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-amber-400">
            <Sparkles className="w-4 h-4" />
            +{xpReward} XP
          </div>
        </div>

        <Link
          to={`/projects/${project.slug}/lessons/${lesson.slug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold transition-all hover:shadow-lg hover:shadow-violet-500/20"
        >
          <Play className="w-5 h-5" />
          Start Lesson
        </Link>
      </div>
    </motion.div>
  );
});

// Badges Section
const BadgesSection = memo(function BadgesSection({
  earnedBadgeIds,
}: {
  earnedBadgeIds: string[];
}) {
  const earnedBadges = BADGES.filter(b => earnedBadgeIds.includes(b.id));
  const nextBadges = BADGES.filter(b => !earnedBadgeIds.includes(b.id)).slice(0, 3);

  return (
    <div id="badges" className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Award className="w-5 h-5 text-cyan-400" />
          Achievements
        </h3>
        <span className="text-xs text-zinc-500">{earnedBadges.length} earned</span>
      </div>

      {earnedBadges.length > 0 ? (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {earnedBadges.slice(0, 4).map((badge) => (
            <AchievementBadge key={badge.id} badge={badge} earned size="sm" />
          ))}
        </div>
      ) : (
        <p className="text-sm text-zinc-500 mb-4">Complete lessons to earn badges!</p>
      )}

      <div className="border-t border-zinc-800 pt-4">
        <p className="text-xs text-zinc-500 mb-2">Up next:</p>
        <div className="flex gap-2">
          {nextBadges.map((badge) => (
            <div
              key={badge.id}
              className="w-10 h-10 rounded-lg bg-zinc-800 flex items-center justify-center opacity-50"
              title={badge.name}
            >
              <span className="text-lg grayscale">{badge.icon}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

// Progress Overview Component
const ProgressOverview = memo(function ProgressOverview({
  xp,
  lessonsComplete,
  totalLessons,
  hoursLearned,
}: {
  xp: number;
  lessonsComplete: number;
  totalLessons: number;
  hoursLearned: number;
}) {
  const level = getLevelFromXP(xp);
  const { progress } = getXPToNextLevel(xp);

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center gap-4 mb-4">
        <LevelBadge xp={xp} size="md" showTitle />
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-zinc-500">XP to Level {level.level + 1}</span>
            <span className="text-violet-400">{Math.round(progress)}%</span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="text-center p-3 rounded-lg bg-zinc-800/50">
            <div className="text-xl font-bold text-white">{lessonsComplete}</div>
            <div className="text-[10px] text-zinc-500">Lessons Done</div>
          </div>
          <div className="text-center p-3 rounded-lg bg-zinc-800/50">
            <div className="text-xl font-bold text-white">{hoursLearned}</div>
            <div className="text-[10px] text-zinc-500">Hours Learned</div>
          </div>
        </div>
      </div>
    </div>
  );
});

// Learning Path Section for Dashboard
const LearningPathSection = memo(function LearningPathSection() {
  const phases = curriculum.map((phase, i) => ({
    id: phase.phase.toString(),
    title: phase.title,
    description: phase.description,
    lessonsTotal: phase.projects.reduce((acc, p) => acc + p.lessons.length, 0),
    lessonsComplete: phase.projects.reduce(
      (acc, p) => acc + (userProgress.projectProgress[p.slug]?.completed || 0),
      0
    ),
    isFree: phase.isFree,
    isLocked: !phase.isFree && i > 0, // Lock premium phases for non-pro users
    isCurrent: i === 0, // First phase is current
    projects: phase.projects.map(p => ({
      id: p.id.toString(),
      title: p.title,
      slug: p.slug,
      lessonsTotal: p.lessons.length,
      lessonsComplete: userProgress.projectProgress[p.slug]?.completed || 0,
    })),
  }));

  return (
    <div className="bg-zinc-900/50 rounded-xl border border-zinc-800 p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-violet-400" />
          Your Learning Path
        </h3>
        <Link
          to="/projects"
          className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1"
        >
          View all <ChevronRight className="w-3 h-3" />
        </Link>
      </div>

      <LearningPathVisualizer phases={phases} compact />
    </div>
  );
});

export default function DashboardPage() {
  const { data: user } = useAuth();
  const [activeMilestone, setActiveMilestone] = useState<Milestone | null>(null);
  const [activeBadge, setActiveBadge] = useState<Badge | null>(null);

  // Redirect to onboarding if not completed
  if (!userProgress.hasCompletedOnboarding) {
    return <Navigate to="/onboarding" replace />;
  }

  const { totalLessons, totalProjects, overallProgress } = useMemo(() => ({
    totalLessons: getTotalLessons(),
    totalProjects: getTotalProjects(),
    overallProgress: Math.round((userProgress.completedLessons / getTotalLessons()) * 100),
  }), []);

  const { currentProject, currentLesson } = useMemo(() => {
    const project = curriculum
      .flatMap((p) => p.projects)
      .find((p) => p.slug === userProgress.currentProjectSlug);
    const lesson = project?.lessons.find((l) => l.slug === userProgress.currentLessonSlug);
    return { currentProject: project, currentLesson: lesson };
  }, []);

  const userName = user?.email?.split('@')[0] || 'Learner';
  const level = getLevelFromXP(userProgress.xp);

  return (
    <LearningLayout currentPage="dashboard">
      <BackgroundGradient />

      {/* Milestone Celebration Modal */}
      <MilestoneCelebration
        milestone={activeMilestone}
        badge={activeBadge}
        xpEarned={50}
        onClose={() => {
          setActiveMilestone(null);
          setActiveBadge(null);
        }}
      />

      <div className="relative z-10">
        {/* Header */}
        <div className="border-b border-zinc-800/50">
          <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    Welcome back, {userName}!
                  </h1>
                  <span className="text-xl">{level.icon}</span>
                </div>
                <p className="text-zinc-400">
                  {level.title} • {userProgress.xp.toLocaleString()} XP
                </p>
              </div>

              {/* XP Display */}
              <div className="flex items-center gap-4">
                <XPDisplay xp={userProgress.xp} size="sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Daily Goal - Prominent placement */}
              <div id="daily-goal">
                <DailyGoal
                  completed={userProgress.lessonsToday}
                  target={userProgress.dailyGoal}
                  streak={userProgress.streak}
                />
              </div>

              {/* Continue Learning */}
              {currentProject && currentLesson && (
                <ContinueLearning
                  project={currentProject}
                  lesson={currentLesson}
                  xpReward={50}
                />
              )}

              {/* Learning Path */}
              <LearningPathSection />

              {/* Recent Projects */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-white">Continue Projects</h2>
                  <Link
                    to="/projects"
                    className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1"
                  >
                    All projects <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  {curriculum[0].projects.slice(0, 2).map((project) => (
                    <ProjectCard
                      key={project.id}
                      project={project}
                      phaseColor={curriculum[0].color}
                      progress={userProgress.projectProgress[project.slug]}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Streak Display */}
              <StreakDisplay
                currentStreak={userProgress.streak}
                longestStreak={userProgress.longestStreak}
                weekActivity={userProgress.weekActivity}
              />

              {/* Progress Overview */}
              <ProgressOverview
                xp={userProgress.xp}
                lessonsComplete={userProgress.completedLessons}
                totalLessons={totalLessons}
                hoursLearned={userProgress.hoursLearned}
              />

              {/* Badges Section */}
              <BadgesSection earnedBadgeIds={userProgress.earnedBadges} />

              {/* Upgrade CTA for free users */}
              <div className="bg-gradient-to-br from-violet-600/20 via-violet-500/10 to-cyan-600/20 rounded-xl border border-violet-500/30 p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-5 h-5 text-violet-400" />
                  <span className="font-semibold text-white">Unlock Pro</span>
                </div>
                <p className="text-sm text-zinc-400 mb-3">
                  Access all {totalLessons} lessons and {totalProjects} projects
                </p>
                <Link
                  to="/pricing"
                  className="block w-full text-center py-2 px-4 rounded-lg bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium transition-colors"
                >
                  View Plans
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </LearningLayout>
  );
}
