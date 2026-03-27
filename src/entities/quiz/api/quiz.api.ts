// entities/quiz/api/quiz.api.ts
import { api } from "@/shared/api/client";
import type {
  QuizQuestionsResponse,
  QuizStartResponse,
  QuizAnswerRequest,
  QuizAnswerResponse,
} from "../model/types";

export const quizApi = {
  getQuestions: (quizId: string) =>
    api().get<QuizQuestionsResponse>(`/quizzes/${quizId}/questions`),

  start: (quizId: string) =>
    api().post<QuizStartResponse>(`/quizzes/${quizId}/start`, undefined, {
      auth: true,
    }),

  answer: (quizId: string, data: QuizAnswerRequest) =>
    api().post<QuizAnswerResponse>(`/quizzes/${quizId}/answer`, data, {
      auth: true,
    }),
};