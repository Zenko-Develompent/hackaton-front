// entities/module/api/module.api.ts
import { api } from "@/shared/api/client";
import type {
  Module,
  LessonShort,
  ModuleExamResponse,
  ModuleProgress,
} from "../model/types";

export const moduleApi = {
  getModule: (moduleId: string) =>
    api().get<Module>(`/modules/${moduleId}`),

  getLessons: (moduleId: string, withAuth?: boolean) =>
    api().get<{ items: LessonShort[] }>(`/modules/${moduleId}/lessons`, {
      auth: withAuth,
    }),

  getExam: (moduleId: string) =>
    api().get<ModuleExamResponse>(`/modules/${moduleId}/exam`),

  getProgress: (moduleId: string) =>
    api().get<ModuleProgress>(`/modules/${moduleId}/progress`, {
      auth: true,
    }),
};