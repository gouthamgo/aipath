import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from 'wasp/client/auth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Rocket,
  Briefcase,
  Lightbulb,
  Code2,
  Brain,
  Clock,
  Target,
  Zap,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  GraduationCap,
  Building2,
  Cpu,
  Bot,
  Database,
  Check,
} from 'lucide-react';

// Onboarding Steps
type OnboardingStep = 'welcome' | 'goal' | 'experience' | 'time' | 'path' | 'ready';

interface OnboardingData {
  goal: string | null;
  experience: string | null;
  timeCommitment: string | null;
  selectedPath: string | null;
}

// Goal Options
const goals = [
  {
    id: 'career',
    icon: Briefcase,
    title: 'Land an AI Engineering Job',
    description: 'Build portfolio projects that impress hiring managers',
    color: 'violet',
  },
  {
    id: 'startup',
    icon: Rocket,
    title: 'Build My Own AI Product',
    description: 'Launch a startup or side project using AI',
    color: 'cyan',
  },
  {
    id: 'upskill',
    icon: Brain,
    title: 'Upskill at My Current Job',
    description: 'Add AI capabilities to become more valuable',
    color: 'amber',
  },
  {
    id: 'curious',
    icon: Lightbulb,
    title: 'Just Curious About AI',
    description: 'Explore and learn at my own pace',
    color: 'emerald',
  },
];

// Experience Levels
const experienceLevels = [
  {
    id: 'beginner',
    icon: GraduationCap,
    title: 'New to Programming',
    description: 'I\'m just starting out with coding',
    recommendedPath: 'foundations',
  },
  {
    id: 'intermediate',
    icon: Code2,
    title: 'Know Python Basics',
    description: 'I can write functions and classes',
    recommendedPath: 'llm-fundamentals',
  },
  {
    id: 'advanced',
    icon: Cpu,
    title: 'Experienced Developer',
    description: 'I\'ve built production applications',
    recommendedPath: 'rag-applications',
  },
  {
    id: 'ai-curious',
    icon: Bot,
    title: 'Some AI Experience',
    description: 'I\'ve played with LLM APIs before',
    recommendedPath: 'advanced-patterns',
  },
];

// Time Commitments
const timeCommitments = [
  { id: '15min', label: '15 min/day', description: 'Light learning', lessonsPerDay: 1 },
  { id: '30min', label: '30 min/day', description: 'Steady progress', lessonsPerDay: 2 },
  { id: '1hour', label: '1 hour/day', description: 'Fast track', lessonsPerDay: 4 },
  { id: 'weekend', label: 'Weekends only', description: 'Deep dives', lessonsPerDay: 6 },
];

// Learning Paths
const learningPaths = [
  {
    id: 'foundations',
    title: 'Start from Scratch',
    description: 'Begin with Python fundamentals and build up',
    phases: ['Python Foundations', 'LLM Fundamentals', 'RAG Applications'],
    duration: '12 weeks',
    icon: GraduationCap,
    color: 'emerald',
  },
  {
    id: 'llm-fundamentals',
    title: 'LLM Fast Track',
    description: 'Jump straight into working with LLMs',
    phases: ['LLM Fundamentals', 'RAG Applications', 'Advanced Patterns'],
    duration: '8 weeks',
    icon: Brain,
    color: 'violet',
  },
  {
    id: 'rag-applications',
    title: 'RAG Specialist',
    description: 'Focus on retrieval-augmented generation',
    phases: ['RAG Applications', 'Advanced Patterns', 'Deployment'],
    duration: '6 weeks',
    icon: Database,
    color: 'cyan',
  },
  {
    id: 'advanced-patterns',
    title: 'AI Architect',
    description: 'Master advanced patterns and deployment',
    phases: ['Advanced Patterns', 'Deployment', 'Multi-Agent Systems'],
    duration: '4 weeks',
    icon: Building2,
    color: 'amber',
  },
];

const colorClasses = {
  violet: {
    bg: 'bg-violet-500/10',
    border: 'border-violet-500/30',
    text: 'text-violet-400',
    ring: 'ring-violet-500',
  },
  cyan: {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    ring: 'ring-cyan-500',
  },
  amber: {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    ring: 'ring-amber-500',
  },
  emerald: {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    ring: 'ring-emerald-500',
  },
};

export default function OnboardingPage() {
  const { data: user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState<OnboardingStep>('welcome');
  const [data, setData] = useState<OnboardingData>({
    goal: null,
    experience: null,
    timeCommitment: null,
    selectedPath: null,
  });

  const steps: OnboardingStep[] = ['welcome', 'goal', 'experience', 'time', 'path', 'ready'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex) / (steps.length - 1)) * 100;

  const nextStep = useCallback(() => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setStep(steps[nextIndex]);
    }
  }, [currentStepIndex, steps]);

  const prevStep = useCallback(() => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setStep(steps[prevIndex]);
    }
  }, [currentStepIndex, steps]);

  const handleComplete = useCallback(() => {
    // TODO: Save onboarding data to user profile
    // For now, just navigate to dashboard
    navigate('/dashboard');
  }, [navigate]);

  const userName = user?.email?.split('@')[0] || 'there';

  return (
    <div className="min-h-screen bg-[#09090b] text-white flex flex-col">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-violet-600/20 rounded-full blur-[120px] opacity-50" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-cyan-600/15 rounded-full blur-[100px] opacity-40" />
      </div>

      {/* Progress Bar */}
      {step !== 'welcome' && (
        <div className="fixed top-0 left-0 right-0 z-50">
          <div className="h-1 bg-zinc-800">
            <motion.div
              className="h-full bg-gradient-to-r from-violet-500 to-cyan-500"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <AnimatePresence mode="wait">
          {/* Welcome Step */}
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring' }}
                className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-4xl md:text-5xl font-bold mb-4"
              >
                Welcome, {userName}!
              </motion.h1>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-zinc-400 mb-8"
              >
                Let's personalize your AI engineering journey.
                <br />
                This will only take 60 seconds.
              </motion.p>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <button
                  onClick={nextStep}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-violet-500/20"
                >
                  Let's Go
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Skip for now
                </button>
              </motion.div>
            </motion.div>
          )}

          {/* Goal Step */}
          {step === 'goal' && (
            <motion.div
              key="goal"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-3xl w-full"
            >
              <div className="text-center mb-8">
                <Target className="w-12 h-12 mx-auto mb-4 text-violet-400" />
                <h2 className="text-3xl font-bold mb-2">What's your main goal?</h2>
                <p className="text-zinc-400">We'll customize your learning path based on this</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {goals.map((goal) => {
                  const colors = colorClasses[goal.color as keyof typeof colorClasses];
                  const isSelected = data.goal === goal.id;
                  return (
                    <button
                      key={goal.id}
                      onClick={() => setData({ ...data, goal: goal.id })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all ${
                        isSelected
                          ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}`
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4`}>
                        <goal.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{goal.title}</h3>
                      <p className="text-sm text-zinc-400">{goal.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-4 right-4 w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.goal}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Experience Step */}
          {step === 'experience' && (
            <motion.div
              key="experience"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-3xl w-full"
            >
              <div className="text-center mb-8">
                <Code2 className="w-12 h-12 mx-auto mb-4 text-cyan-400" />
                <h2 className="text-3xl font-bold mb-2">What's your experience level?</h2>
                <p className="text-zinc-400">We'll start you at the right point</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {experienceLevels.map((level) => {
                  const isSelected = data.experience === level.id;
                  return (
                    <button
                      key={level.id}
                      onClick={() => setData({ ...data, experience: level.id, selectedPath: level.recommendedPath })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all relative ${
                        isSelected
                          ? 'border-cyan-500/30 bg-cyan-500/10 ring-2 ring-cyan-500'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-4">
                        <level.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{level.title}</h3>
                      <p className="text-sm text-zinc-400">{level.description}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-4 right-4 w-6 h-6 rounded-full bg-cyan-500/10 text-cyan-400 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.experience}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Time Commitment Step */}
          {step === 'time' && (
            <motion.div
              key="time"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-2xl w-full"
            >
              <div className="text-center mb-8">
                <Clock className="w-12 h-12 mx-auto mb-4 text-amber-400" />
                <h2 className="text-3xl font-bold mb-2">How much time can you commit?</h2>
                <p className="text-zinc-400">We'll set a daily goal that works for you</p>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-8">
                {timeCommitments.map((time) => {
                  const isSelected = data.timeCommitment === time.id;
                  return (
                    <button
                      key={time.id}
                      onClick={() => setData({ ...data, timeCommitment: time.id })}
                      className={`p-6 rounded-2xl border-2 text-center transition-all relative ${
                        isSelected
                          ? 'border-amber-500/30 bg-amber-500/10 ring-2 ring-amber-500'
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      <div className="text-2xl font-bold text-white mb-1">{time.label}</div>
                      <p className="text-sm text-zinc-400">{time.description}</p>
                      <p className="text-xs text-amber-400 mt-2">{time.lessonsPerDay} lesson{time.lessonsPerDay > 1 ? 's' : ''}/day</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-3 right-3 w-6 h-6 rounded-full bg-amber-500/10 text-amber-400 flex items-center justify-center"
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.timeCommitment}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Path Selection Step */}
          {step === 'path' && (
            <motion.div
              key="path"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="max-w-4xl w-full"
            >
              <div className="text-center mb-8">
                <Zap className="w-12 h-12 mx-auto mb-4 text-emerald-400" />
                <h2 className="text-3xl font-bold mb-2">Your Recommended Path</h2>
                <p className="text-zinc-400">Based on your experience, we suggest starting here</p>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mb-8">
                {learningPaths.map((path) => {
                  const colors = colorClasses[path.color as keyof typeof colorClasses];
                  const isSelected = data.selectedPath === path.id;
                  const isRecommended = experienceLevels.find(l => l.id === data.experience)?.recommendedPath === path.id;

                  return (
                    <button
                      key={path.id}
                      onClick={() => setData({ ...data, selectedPath: path.id })}
                      className={`p-6 rounded-2xl border-2 text-left transition-all relative ${
                        isSelected
                          ? `${colors.border} ${colors.bg} ring-2 ${colors.ring}`
                          : 'border-zinc-800 hover:border-zinc-700 bg-zinc-900/50'
                      }`}
                    >
                      {isRecommended && (
                        <span className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-medium bg-emerald-500 text-white rounded-full">
                          Recommended
                        </span>
                      )}
                      <div className={`w-12 h-12 rounded-xl ${colors.bg} ${colors.text} flex items-center justify-center mb-4`}>
                        <path.icon className="w-6 h-6" />
                      </div>
                      <h3 className="text-lg font-semibold text-white mb-1">{path.title}</h3>
                      <p className="text-sm text-zinc-400 mb-3">{path.description}</p>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {path.phases.map((phase, i) => (
                          <span key={i} className="text-xs px-2 py-1 rounded-full bg-zinc-800 text-zinc-300">
                            {phase}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-zinc-500">Est. {path.duration}</p>
                      {isSelected && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className={`absolute top-4 right-4 w-6 h-6 rounded-full ${colors.bg} ${colors.text} flex items-center justify-center`}
                        >
                          <Check className="w-4 h-4" />
                        </motion.div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="flex justify-between">
                <button
                  onClick={prevStep}
                  className="flex items-center gap-2 px-6 py-3 text-zinc-400 hover:text-white transition-colors"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Back
                </button>
                <button
                  onClick={nextStep}
                  disabled={!data.selectedPath}
                  className="flex items-center gap-2 px-8 py-3 rounded-xl bg-violet-600 hover:bg-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold transition-all"
                >
                  Continue
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </motion.div>
          )}

          {/* Ready Step */}
          {step === 'ready' && (
            <motion.div
              key="ready"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-2xl text-center"
            >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.2 }}
                className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center"
              >
                <Rocket className="w-12 h-12 text-white" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-4"
              >
                You're All Set!
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 mb-8"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Your Personalized Plan</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-violet-400">
                      {goals.find(g => g.id === data.goal)?.title.split(' ')[0]}
                    </div>
                    <div className="text-xs text-zinc-500">Goal</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-cyan-400">
                      {timeCommitments.find(t => t.id === data.timeCommitment)?.label}
                    </div>
                    <div className="text-xs text-zinc-500">Daily Goal</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-emerald-400">
                      {learningPaths.find(p => p.id === data.selectedPath)?.duration}
                    </div>
                    <div className="text-xs text-zinc-500">Est. Time</div>
                  </div>
                </div>
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="text-zinc-400 mb-8"
              >
                Your first lesson is waiting. Let's build something amazing!
              </motion.p>

              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                onClick={handleComplete}
                className="inline-flex items-center justify-center gap-2 px-10 py-4 rounded-xl bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold text-lg transition-all hover:shadow-lg hover:shadow-violet-500/20"
              >
                Start Learning
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
