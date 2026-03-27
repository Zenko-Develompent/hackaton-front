// entities/quest/model/types.ts
export type QuestAnswer = {
  answerId: string;
  name: string;
  description: string;
};

export type QuestAnswersResponse = {
  items: QuestAnswer[];
};

export type QuestCheckRequest = {
  answerId: string;
};

export type QuestCheckResponse = {
  correct: boolean;
};