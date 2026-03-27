// entities/exam/model/types.ts
export type Exam = {
  examId: string;
  moduleId: string;
  name: string;
  description: string;
  xpReward: number;
  coinReward: number;
  questionsCount: number;
  tasksCount: number;
};

export type ExamQuestion = {
  questId: string;
  quizId: string | null;
  examId: string;
  name: string;
  description: string;
};

export type ExamTask = {
  taskId: string;
  examId: string;
  lessonId: string | null;
  name: string;
  description: string;
  runnerLanguage: string;
  xpReward: number;
  coinReward: number;
};

export type ExamQuestionsResponse = {
  items: ExamQuestion[];
};

export type ExamTasksResponse = {
  items: ExamTask[];
};

export type ExamCompleteResponse = {
  completed: boolean;
  firstCompletion: boolean;
  xpGranted: number;
  coinGranted: number;
  questionsDone: number;
  questionsTotal: number;
  tasksDone: number;
  tasksTotal: number;
};

export type ExamRewardsRequest = {
  xpReward: number;
  coinReward: number;
};

export type ExamRewardsResponse = Exam;