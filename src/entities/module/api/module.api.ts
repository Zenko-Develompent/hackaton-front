import { api } from "@/shared/api/client";
import type { Module, LessonShort } from "../model/types";

export const moduleApi = {
  getModule: (moduleId: string) =>
    api().get<Module>(`/modules/${moduleId}`),

  getLessons: (moduleId: string) =>
    api().get<{ items: LessonShort[] }>(
      `/modules/${moduleId}/lessons`
    ),

  getExam: (moduleId: string) =>
    api().get(`/modules/${moduleId}/exam`),
};
