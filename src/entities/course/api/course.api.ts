// entities/course/api/course.api.ts
import { api } from "@/shared/api/client";
import type {
  CoursesResponse,
  CourseDetails,
  CourseTree,
  ModuleShort,
  CourseProgress,
} from "../model/types";

export const courseApi = {
  getCourses: (page = 0, size = 20) =>
    api().get<CoursesResponse>("/courses", {
      params: { page, size },
    }),

  getCourse: (courseId: string, withAuth?: boolean) =>
    api().get<CourseDetails>(`/courses/${courseId}`, {
      auth: withAuth,
    }),

  getModules: (courseId: string, withAuth?: boolean) =>
    api().get<{ items: ModuleShort[] }>(`/courses/${courseId}/modules`, {
      auth: withAuth,
    }),

  getTree: (courseId: string, withAuth?: boolean) =>
    api().get<CourseTree>(`/courses/${courseId}/tree`, {
      auth: withAuth,
    }),

  getProgress: (courseId: string) =>
    api().get<CourseProgress>(`/courses/${courseId}/progress`, {
      auth: true,
    }),
};