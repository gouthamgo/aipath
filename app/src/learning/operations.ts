import type {
  GetProjects,
  GetProject,
  GetLesson,
  GetDashboardData,
  GetUserProgress,
  ExecutePythonCode,
  SaveUserCode,
  MarkLessonComplete,
  UpdateUserApiKeys,
} from "wasp/server/operations";
import type { Project, Lesson, UserProgress, User } from "wasp/entities";
import axios from "axios";

// Piston API for Python execution
const PISTON_URL = process.env.PISTON_URL || "https://emkc.org/api/v2/piston";

// ==================== QUERIES ====================

export const getProjects: GetProjects<void, Project[]> = async (_args, context) => {
  // Single query with conditional progress include
  const projects = await context.entities.Project.findMany({
    where: { isPublished: true },
    orderBy: { order: "asc" },
    include: {
      lessons: {
        orderBy: { order: "asc" },
        select: {
          id: true,
          title: true,
          slug: true,
          order: true,
          isPremium: true,
          // Include user progress if logged in
          ...(context.user && {
            userProgress: {
              where: { userId: context.user.id },
              select: { status: true, completedAt: true },
            },
          }),
        },
      },
    },
  });

  return projects;
};

export const getProject: GetProject<
  { slug: string },
  (Project & { lessons: Lesson[]; userProgress?: UserProgress[] }) | null
> = async ({ slug }, context) => {
  const project = await context.entities.Project.findUnique({
    where: { slug },
    include: {
      lessons: {
        orderBy: { order: "asc" },
      },
    },
  });

  if (!project) return null;

  // Get user progress if logged in
  if (context.user) {
    const progress = await context.entities.UserProgress.findMany({
      where: {
        userId: context.user.id,
        lessonId: { in: project.lessons.map((l) => l.id) },
      },
    });

    return { ...project, userProgress: progress };
  }

  return project;
};

export const getLesson: GetLesson<
  { projectSlug: string; lessonSlug: string },
  (Lesson & { project: Project; userProgress?: UserProgress | null; isLocked: boolean }) | null
> = async ({ projectSlug, lessonSlug }, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  // Single optimized query: get lesson with project in one call
  const lesson = await context.entities.Lesson.findFirst({
    where: {
      slug: lessonSlug,
      project: { slug: projectSlug },
    },
    include: {
      project: true,
    },
  });

  if (!lesson) {
    throw new Error("Lesson not found");
  }

  // Parallel fetch: user and progress at the same time
  const [user, userProgress] = await Promise.all([
    context.entities.User.findUnique({
      where: { id: context.user.id },
      select: { subscriptionPlan: true },
    }),
    context.entities.UserProgress.findUnique({
      where: {
        userId_lessonId: {
          userId: context.user.id,
          lessonId: lesson.id,
        },
      },
    }),
  ]);

  const canAccess =
    !lesson.isPremium ||
    user?.subscriptionPlan === "pro" ||
    user?.subscriptionPlan === "lifetime";

  if (!canAccess) {
    return {
      ...lesson,
      solutionContent: "Upgrade to Pro to access the solution.",
      solutionCode: "# Upgrade to Pro to see the solution",
      isLocked: true,
      userProgress,
    };
  }

  return {
    ...lesson,
    isLocked: false,
    userProgress,
  };
};

export const getDashboardData: GetDashboardData<
  void,
  {
    user: User;
    recentProgress: (UserProgress & { lesson: Lesson & { project: Project } })[];
    totalLessons: number;
    completedLessons: number;
    currentProject: Project | null;
  }
> = async (_args, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  const [user, progress, totalLessons] = await Promise.all([
    context.entities.User.findUnique({
      where: { id: context.user.id },
    }),
    context.entities.UserProgress.findMany({
      where: { userId: context.user.id },
      orderBy: { updatedAt: "desc" },
      take: 10,
      include: {
        lesson: {
          include: { project: true },
        },
      },
    }),
    context.entities.Lesson.count(),
  ]);

  const completedLessons = progress.filter((p) => p.status === "completed").length;

  // Find current project (most recent in-progress)
  const inProgress = progress.find((p) => p.status === "in_progress");
  const currentProject = inProgress?.lesson.project || null;

  return {
    user: user!,
    recentProgress: progress,
    totalLessons,
    completedLessons,
    currentProject,
  };
};

export const getUserProgress: GetUserProgress<
  void,
  (UserProgress & { lesson: Lesson & { project: Project } })[]
> = async (_args, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  return context.entities.UserProgress.findMany({
    where: { userId: context.user.id },
    include: {
      lesson: {
        include: { project: true },
      },
    },
    orderBy: { updatedAt: "desc" },
  });
};

// ==================== ACTIONS ====================

interface ExecutionResult {
  output: string;
  error: string | null;
  executionTime: number;
  [key: string]: string | number | null;
}

export const executePythonCode: ExecutePythonCode<
  { code: string; lessonId: string },
  ExecutionResult
> = async ({ code, lessonId }, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  const startTime = Date.now();

  try {
    const response = await axios.post(
      `${PISTON_URL}/execute`,
      {
        language: "python",
        version: "3.11",
        files: [{ name: "main.py", content: code }],
        run_timeout: 10000, // 10 seconds
        compile_memory_limit: 100000000, // 100MB
      },
      { timeout: 15000 }
    );

    const { run } = response.data;

    // Log the submission
    await context.entities.CodeSubmission.create({
      data: {
        userId: context.user.id,
        lessonId,
        code,
        output: run.stdout || "",
        error: run.stderr || null,
        passed: !run.stderr,
      },
    });

    return {
      output: run.stdout || "",
      error: run.stderr || null,
      executionTime: Date.now() - startTime,
    };
  } catch (error: any) {
    return {
      output: "",
      error: `Execution failed: ${error.message}`,
      executionTime: Date.now() - startTime,
    };
  }
};

export const saveUserCode: SaveUserCode<{ lessonId: string; code: string }, void> = async (
  { lessonId, code },
  context
) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  await context.entities.UserProgress.upsert({
    where: {
      userId_lessonId: {
        userId: context.user.id,
        lessonId,
      },
    },
    update: {
      savedCode: code,
      status: "in_progress",
      updatedAt: new Date(),
    },
    create: {
      userId: context.user.id,
      lessonId,
      savedCode: code,
      status: "in_progress",
    },
  });
};

export const markLessonComplete: MarkLessonComplete<{ lessonId: string }, void> = async (
  { lessonId },
  context
) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  await context.entities.UserProgress.upsert({
    where: {
      userId_lessonId: {
        userId: context.user.id,
        lessonId,
      },
    },
    update: {
      status: "completed",
      completedAt: new Date(),
    },
    create: {
      userId: context.user.id,
      lessonId,
      status: "completed",
      completedAt: new Date(),
    },
  });

  // Update user stats
  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      totalLessonsCompleted: { increment: 1 },
      lastActiveAt: new Date(),
    },
  });
};

export const updateUserApiKeys: UpdateUserApiKeys<
  { openaiApiKey?: string; anthropicApiKey?: string },
  void
> = async ({ openaiApiKey, anthropicApiKey }, context) => {
  if (!context.user) {
    throw new Error("Not authenticated");
  }

  await context.entities.User.update({
    where: { id: context.user.id },
    data: {
      ...(openaiApiKey !== undefined && { openaiApiKey }),
      ...(anthropicApiKey !== undefined && { anthropicApiKey }),
    },
  });
};
