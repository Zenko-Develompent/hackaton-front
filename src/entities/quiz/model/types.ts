export type QuizQuestion = {
  questionId: string;
  name: string;
  description: string;
  index: number;
  total: number;
  options: {
    answerId: string;
    name: string;
    description: string;
  }[];
};

export type QuizStartResponse = {
  completed: boolean;
  question: QuizQuestion | null;
  task: any | null;
};

export type QuizAnswerRequest = {
  questionId: string;
  answerId: string;
};

export type QuizAnswerResponse = {
  correct: boolean;
  completed: boolean;
  question: QuizQuestion | null;
  task: any | null;
};
