// entities/quiz/model/types.ts
export type QuizQuestion = {
  questionId: string;
  name: string;
  description: string;
  index: number;
  total: number;
  options: QuizAnswer[];
};

export type QuizAnswer = {
  answerId: string;
  name: string;
  description: string;
};

export type QuizStartResponse = {
  completed: boolean;
  question: QuizQuestion | null;
};

export type QuizAnswerRequest = {
  questionId: string;
  answerId: string;
};

export type QuizAnswerResponse = {
  correct: boolean;
  completed: boolean;
  xpGranted: number;
  coinGranted: number;
  question: QuizQuestion | null;
};

export type QuizQuestionsResponse = {
  items: QuizBaseQuestion[];
};

export type QuizBaseQuestion = {
  questId: string;
  quizId: string;
  examId: string | null;
  name: string;
  description: string;
};

// Добавляем тип для завершения квиза
export type QuizCompleteResponse = {
  completed: boolean;
  firstCompletion: boolean;
  xpGranted: number;
  coinGranted: number;
  totalQuestions: number;
  correctAnswers: number;
};