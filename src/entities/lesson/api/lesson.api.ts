// entities/lesson/api/lesson.api.ts
import { api } from "@/shared/api/client";
import type {
  Lesson,
  LessonQuiz,
  LessonTask,
  LessonProgress,
} from "../model/types";

export const lessonApi = {
  getLesson: (lessonId: string) =>
    api().get<Lesson>(`/lessons/${lessonId}`),

  getQuiz: (lessonId: string) =>
    api().get<LessonQuiz>(`/lessons/${lessonId}/quiz`),

  getTask: (lessonId: string) =>
    api().get<LessonTask>(`/lessons/${lessonId}/task`),

  getProgress: (lessonId: string) =>
    api().get<LessonProgress>(`/lessons/${lessonId}/progress`, {
      auth: true,
    }),
};