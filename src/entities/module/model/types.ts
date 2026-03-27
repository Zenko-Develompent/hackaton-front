// entities/module/model/types.ts
export type Module = {
  moduleId: string;
  courseId: string;
  name: string;
  description: string;
  exam: ModuleExam | null;
};

export type ModuleExam = {
  examId: string;
  name: string;
  questionsCount: number;
  tasksCount: number;
};

export type LessonShort = {
  lessonId: string;
  name: string;
  description: string;
  xp: number;
  quizId: string | null;
  taskId: string | null;
  unlocked?: boolean | null;
};

export type ModuleLessonsResponse = {
  items: LessonShort[];
};

export type ModuleExamResponse = {
  examId: string;
  moduleId: string;
  name: string;
  description: string;
  questionsCount: number;
  tasksCount: number;
};

export type ModuleProgress = {
  targetId: string;
  targetType: 'module';
  percent: number;
  completed: boolean;
  doneItems: number;
  totalItems: number;
};