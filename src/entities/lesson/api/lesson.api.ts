// entities/lesson/api/lesson.api.ts
import { api } from "@/shared/api/client";
import type {
  Lesson,
  LessonQuiz,
  LessonTask,
  LessonProgress,
} from "../model/types";

export const lessonApi = {
  getLesson: (lessonId: string, withAuth?: boolean) =>
    api().get<Lesson>(`/lessons/${lessonId}`, {
      auth: withAuth,
    }),

  getQuiz: (lessonId: string, withAuth?: boolean) =>
    api().get<LessonQuiz>(`/lessons/${lessonId}/quiz`, {
      auth: withAuth,
    }),

  getTask: (lessonId: string, withAuth?: boolean) =>
    api().get<LessonTask>(`/lessons/${lessonId}/task`, {
      auth: withAuth,
    }),

  getProgress: (lessonId: string) =>
    api().get<LessonProgress>(`/lessons/${lessonId}/progress`, {
      auth: true,
    }),
};
