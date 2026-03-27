// entities/achievement/model/types.ts

export type Achievement = {
  code: string;
  name: string;
  icon: string;
  order: number;
  unlocked: boolean;
  description: string;
};

export type AchievementInProfile = {
  achievementId: string;
  name: string;
  description: string;
  icon: string;
};

export type AchievementsResponse = {
  items: Achievement[];
};