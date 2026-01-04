import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllLessonContent, type LessonContent } from '../data/lessons';
import { getProjectBySlug, type Project, type Lesson } from '../data/curriculum';

// Hook to get lesson content by slug
export function useLessonContent(slug: string | undefined) {
  return useMemo(() => {
    if (!slug) return null;
    return getAllLessonContent(slug);
  }, [slug]);
}

// Hook to get project and lesson metadata
export function useLessonMeta(projectSlug: string | undefined, lessonSlug: string | undefined) {
  return useMemo(() => {
    if (!projectSlug || !lessonSlug) {
      return { project: null, lesson: null, lessonIndex: -1 };
    }

    const project = getProjectBySlug(projectSlug);
    if (!project) {
      return { project: null, lesson: null, lessonIndex: -1 };
    }

    const lessonIndex = project.lessons.findIndex(l => l.slug === lessonSlug);
    const lesson = lessonIndex >= 0 ? project.lessons[lessonIndex] : null;

    return { project, lesson, lessonIndex };
  }, [projectSlug, lessonSlug]);
}

// Hook to get navigation (prev/next lessons)
export function useLessonNavigation(
  project: Project | null,
  lessonIndex: number
) {
  return useMemo(() => {
    if (!project || lessonIndex < 0) {
      return { prevLesson: null, nextLesson: null, totalLessons: 0 };
    }

    const lessons = project.lessons;
    const prevLesson = lessonIndex > 0 ? lessons[lessonIndex - 1] : null;
    const nextLesson = lessonIndex < lessons.length - 1 ? lessons[lessonIndex + 1] : null;

    return {
      prevLesson,
      nextLesson,
      totalLessons: lessons.length,
      currentIndex: lessonIndex + 1,
    };
  }, [project, lessonIndex]);
}

// Combined hook for full lesson data
export function useFullLesson(projectSlug: string | undefined, lessonSlug: string | undefined) {
  const content = useLessonContent(lessonSlug);
  const { project, lesson, lessonIndex } = useLessonMeta(projectSlug, lessonSlug);
  const navigation = useLessonNavigation(project, lessonIndex);

  return {
    content,
    project,
    lesson,
    lessonIndex,
    ...navigation,
    isLoading: false,
    error: !project ? 'Project not found' : !lesson ? 'Lesson not found' : null,
  };
}
