// entities/community/api/community.api.ts

import { api } from "@/shared/api/client";
import type {
  LeaderboardResponse,
  LeaderboardPeriod,
  LeaderboardMetric,
  FeedResponse,
} from "../model/types";

export const communityApi = {
  getLeaderboard: (
    period: LeaderboardPeriod = 'week',
    metric: LeaderboardMetric = 'activity',
    limit = 9
  ) =>
    api().get<LeaderboardResponse>('/community/leaderboard', {
      params: { period, metric, limit },
    }),

  getFeed: (limit = 10) =>
    api().get<FeedResponse>('/community/feed', {
      params: { limit },
    }),
};