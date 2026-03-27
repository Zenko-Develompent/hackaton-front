// entities/quest/api/quest.api.ts
import { api } from "@/shared/api/client";
import type {
  QuestAnswersResponse,
  QuestCheckRequest,
  QuestCheckResponse,
} from "../model/types";

export const questApi = {
  getAnswers: (questId: string) =>
    api().get<QuestAnswersResponse>(`/quests/${questId}/answers`, {auth: true}),

  check: (questId: string, data: QuestCheckRequest, withAuth?: boolean) =>
    api().post<QuestCheckResponse>(`/quests/${questId}/check`, data, {
      auth: true,
    }),
};