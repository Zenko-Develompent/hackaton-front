// entities/community/model/types.ts

export type LeaderboardPeriod = 'day' | 'week' | 'month';
export type LeaderboardMetric = 'activity' | 'xp';

export type LeaderboardItem = {
  rank: number;
  userId: string;
  username: string;
  score: number;
};

export type LeaderboardResponse = {
  period: LeaderboardPeriod;
  metric: LeaderboardMetric;
  fromInclusive: string;
  toInclusive: string;
  items: LeaderboardItem[];
};

export type FeedEventType = 
  | 'quiz_completed'
  | 'task_completed'
  | 'exam_completed'
  | 'level_up'
  | 'achievement_unlocked'
  | 'message_sent'
  | 'code_error'
  | 'lesson_repeated'
  | 'streak_day';

export type FeedItem = {
  eventId: string;
  createdAt: string;
  userId: string;
  username: string;
  eventType: FeedEventType;
  activityScore: number;
  xpGranted: number;
  coinGranted: number;
  progressPercent: number;
  lessonId: string | null;
  quizId: string | null;
  taskId: string | null;
  examId: string | null;
  details: any | null;
};

export type FeedResponse = {
  items: FeedItem[];
};