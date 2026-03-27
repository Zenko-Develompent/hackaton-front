import { api } from "@/shared/api/client";
import type {
  QuizStartResponse,
  QuizAnswerRequest,
  QuizAnswerResponse,
} from "../model/types";

export const quizApi = {
  start: (quizId: string) =>
    api().post<QuizStartResponse>(
      `/quizzes/${quizId}/start`,
      undefined,
      { auth: true }
    ),

  answer: (quizId: string, data: QuizAnswerRequest) =>
    api().post<QuizAnswerResponse>(
      `/quizzes/${quizId}/answer`,
      data,
      { auth: true }
    ),
};
