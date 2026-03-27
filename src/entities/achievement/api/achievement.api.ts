// entities/achievement/api/achievement.api.ts

import { api } from "@/shared/api/client";
import type { AchievementsResponse } from "../model/types";

export const achievementApi = {
  // Получить все достижения с признаком открытия
  getAchievements: (withAuth?: boolean) =>
    api().get<AchievementsResponse>("/achievements", {
      auth: withAuth,
    }),
};