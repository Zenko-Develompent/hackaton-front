// entities/lesson/model/types.ts
export type Lesson = {
  lessonId: string;
  moduleId: string;
  name: string;
  description: string;
  content: string | null;
  xp: number;
  quizId: string | null;
  taskId: string | null;
};

export type LessonQuiz = {
  quizId: string;
  lessonId: string;
  name: string;
  description: string;
  questionsCount: number;
};

export type LessonTask = {
  taskId: string;
  lessonId: string;
  examId: string | null;
  name: string;
  description: string;
  runnerLanguage?: string;
  xpReward?: number;
  coinReward?: number;
};

export type LessonProgress = {
  targetId: string;
  targetType: 'lesson';
  percent: number;
  completed: boolean;
  doneItems: number;
  totalItems: number;
};