import { api } from "@/shared/api/client";
import type {
  CoursesResponse,
  CourseDetails,
  CourseTree,
  ModuleShort,
} from "../model/types";

export const courseApi = {
  getCourses: (page = 0, size = 20) =>
    api().get<CoursesResponse>("/courses", {
      params: { page, size },
    }),

  getCourse: (courseId: string) =>
    api().get<CourseDetails>(`/courses/${courseId}`),

  getModules: (courseId: string) =>
    api().get<{ items: ModuleShort[] }>(
      `/courses/${courseId}/modules`
    ),

  getTree: (courseId: string) =>
    api().get<CourseTree>(`/courses/${courseId}/tree`),
};
