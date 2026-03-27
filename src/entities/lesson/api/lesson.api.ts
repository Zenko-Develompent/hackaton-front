import { api } from "@/shared/api/client";
import type {
  Lesson,
  LessonQuiz,
  LessonTask,
} from "../model/types";

export const lessonApi = {
  getLesson: (lessonId: string) =>
    api().get<Lesson>(`/lessons/${lessonId}`),

  getQuiz: (lessonId: string) =>
    api().get<LessonQuiz>(`/lessons/${lessonId}/quiz`),

  getTask: (lessonId: string) =>
    api().get<LessonTask>(`/lessons/${lessonId}/task`),
};
