import { type Prisma } from "@prisma/client";
import { type User } from "wasp/entities";
import { HttpError, prisma } from "wasp/server";
import {
  type GetPaginatedUsers,
  type UpdateIsUserAdminById,
  type ExportUserData,
  type DeleteUserAccount,
} from "wasp/server/operations";
import * as z from "zod";
import { SubscriptionStatus } from "../payment/plans";
import { ensureArgsSchemaOrThrowHttpError } from "../server/validation";

const updateUserAdminByIdInputSchema = z.object({
  id: z.string().nonempty(),
  isAdmin: z.boolean(),
});

type UpdateUserAdminByIdInput = z.infer<typeof updateUserAdminByIdInputSchema>;

export const updateIsUserAdminById: UpdateIsUserAdminById<
  UpdateUserAdminByIdInput,
  User
> = async (rawArgs, context) => {
  const { id, isAdmin } = ensureArgsSchemaOrThrowHttpError(
    updateUserAdminByIdInputSchema,
    rawArgs,
  );

  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  return context.entities.User.update({
    where: { id },
    data: { isAdmin },
  });
};

type GetPaginatedUsersOutput = {
  users: Pick<
    User,
    | "id"
    | "email"
    | "username"
    | "subscriptionStatus"
    | "paymentProcessorUserId"
    | "isAdmin"
  >[];
  totalPages: number;
};

const getPaginatorArgsSchema = z.object({
  skipPages: z.number(),
  filter: z.object({
    emailContains: z.string().nonempty().optional(),
    isAdmin: z.boolean().optional(),
    subscriptionStatusIn: z
      .array(z.nativeEnum(SubscriptionStatus).nullable())
      .optional(),
  }),
});

type GetPaginatedUsersInput = z.infer<typeof getPaginatorArgsSchema>;

export const getPaginatedUsers: GetPaginatedUsers<
  GetPaginatedUsersInput,
  GetPaginatedUsersOutput
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(
      401,
      "Only authenticated users are allowed to perform this operation",
    );
  }

  if (!context.user.isAdmin) {
    throw new HttpError(
      403,
      "Only admins are allowed to perform this operation",
    );
  }

  const {
    skipPages,
    filter: {
      subscriptionStatusIn: subscriptionStatus,
      emailContains,
      isAdmin,
    },
  } = ensureArgsSchemaOrThrowHttpError(getPaginatorArgsSchema, rawArgs);

  const includeUnsubscribedUsers = !!subscriptionStatus?.some(
    (status) => status === null,
  );
  const desiredSubscriptionStatuses = subscriptionStatus?.filter(
    (status) => status !== null,
  );

  const pageSize = 10;

  const userPageQuery: Prisma.UserFindManyArgs = {
    skip: skipPages * pageSize,
    take: pageSize,
    where: {
      AND: [
        {
          email: {
            contains: emailContains,
            mode: "insensitive",
          },
          isAdmin,
        },
        {
          OR: [
            {
              subscriptionStatus: {
                in: desiredSubscriptionStatuses,
              },
            },
            {
              subscriptionStatus: includeUnsubscribedUsers ? null : undefined,
            },
          ],
        },
      ],
    },
    select: {
      id: true,
      email: true,
      username: true,
      isAdmin: true,
      subscriptionStatus: true,
      paymentProcessorUserId: true,
    },
    orderBy: {
      username: "asc",
    },
  };

  const [pageOfUsers, totalUsers] = await prisma.$transaction([
    context.entities.User.findMany(userPageQuery),
    context.entities.User.count({ where: userPageQuery.where }),
  ]);
  const totalPages = Math.ceil(totalUsers / pageSize);

  return {
    users: pageOfUsers,
    totalPages,
  };
};

// ============== GDPR: Export User Data ==============
type ExportUserDataOutput = {
  user: {
    id: string;
    email: string | null;
    username: string | null;
    createdAt: Date;
    subscriptionStatus: string | null;
    subscriptionPlan: string | null;
    totalLessonsCompleted: number;
    currentStreak: number;
    longestStreak: number;
    lastActiveAt: Date | null;
  };
  progress: Array<{
    lessonId: string;
    status: string;
    completedAt: Date | null;
    timeSpentMinutes: number;
    savedCode: string | null;
    hintsUsed: number;
  }>;
  codeSubmissions: Array<{
    lessonId: string;
    code: string;
    output: string | null;
    error: string | null;
    passed: boolean;
    createdAt: Date;
  }>;
  files: Array<{
    id: string;
    name: string;
    type: string;
    createdAt: Date;
  }>;
  contactMessages: Array<{
    content: string;
    createdAt: Date;
  }>;
  tasks: Array<{
    description: string;
    isDone: boolean;
    createdAt: Date;
  }>;
  exportedAt: string;
};

export const exportUserData: ExportUserData<void, ExportUserDataOutput> = async (
  _args,
  context
) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to export your data");
  }

  const userId = context.user.id;

  const [user, progress, codeSubmissions, files, contactMessages, tasks] =
    await Promise.all([
      context.entities.User.findUnique({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          username: true,
          createdAt: true,
          subscriptionStatus: true,
          subscriptionPlan: true,
          totalLessonsCompleted: true,
          currentStreak: true,
          longestStreak: true,
          lastActiveAt: true,
        },
      }),
      context.entities.UserProgress.findMany({
        where: { userId },
        select: {
          lessonId: true,
          status: true,
          completedAt: true,
          timeSpentMinutes: true,
          savedCode: true,
          hintsUsed: true,
        },
      }),
      context.entities.CodeSubmission.findMany({
        where: { userId },
        select: {
          lessonId: true,
          code: true,
          output: true,
          error: true,
          passed: true,
          createdAt: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      context.entities.File.findMany({
        where: { userId },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
        },
      }),
      context.entities.ContactFormMessage.findMany({
        where: { userId },
        select: {
          content: true,
          createdAt: true,
        },
      }),
      context.entities.Task.findMany({
        where: { userId },
        select: {
          description: true,
          isDone: true,
          createdAt: true,
        },
      }),
    ]);

  if (!user) {
    throw new HttpError(404, "User not found");
  }

  return {
    user,
    progress,
    codeSubmissions,
    files,
    contactMessages,
    tasks,
    exportedAt: new Date().toISOString(),
  };
};

// ============== GDPR: Delete User Account ==============
const deleteUserAccountSchema = z.object({
  confirmationText: z.string(),
});

type DeleteUserAccountInput = z.infer<typeof deleteUserAccountSchema>;

export const deleteUserAccount: DeleteUserAccount<
  DeleteUserAccountInput,
  { success: boolean }
> = async (rawArgs, context) => {
  if (!context.user) {
    throw new HttpError(401, "You must be logged in to delete your account");
  }

  const { confirmationText } = ensureArgsSchemaOrThrowHttpError(
    deleteUserAccountSchema,
    rawArgs
  );

  if (confirmationText !== "DELETE") {
    throw new HttpError(400, 'Please type "DELETE" to confirm account deletion');
  }

  const userId = context.user.id;

  // Delete related records that don't have CASCADE delete
  await prisma.$transaction([
    context.entities.GptResponse.deleteMany({ where: { userId } }),
    context.entities.Task.deleteMany({ where: { userId } }),
    context.entities.File.deleteMany({ where: { userId } }),
    context.entities.ContactFormMessage.deleteMany({ where: { userId } }),
    // UserProgress, CodeSubmission have CASCADE delete in schema
    context.entities.User.delete({ where: { id: userId } }),
  ]);

  return { success: true };
};
