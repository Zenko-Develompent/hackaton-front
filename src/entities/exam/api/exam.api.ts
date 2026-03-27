// entities/exam/api/exam.api.ts
import { api } from "@/shared/api/client";
import type {
  Exam,
  ExamQuestionsResponse,
  ExamTasksResponse,
  ExamCompleteResponse,
  ExamRewardsRequest,
  ExamRewardsResponse,
} from "../model/types";

export const examApi = {
  getExam: (examId: string) =>
    api().get<Exam>(`/exams/${examId}`),

  getQuestions: (examId: string) =>
    api().get<ExamQuestionsResponse>(`/exams/${examId}/questions`),

  getTasks: (examId: string) =>
    api().get<ExamTasksResponse>(`/exams/${examId}/tasks`),

  complete: (examId: string) =>
    api().post<ExamCompleteResponse>(`/exams/${examId}/complete`, undefined, {
      auth: true,
    }),

  updateRewards: (examId: string, data: ExamRewardsRequest) =>
    api().put<ExamRewardsResponse>(`/exams/${examId}/rewards`, data, {
      auth: true,
    }),
};