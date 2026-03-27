export type Module = {
  moduleId: string;
  courseId: string;
  name: string;
  description: string;
  exam: {
    examId: string;
    name: string;
    questionsCount: number;
    tasksCount: number;
  } | null;
};

export type LessonShort = {
  lessonId: string;
  name: string;
  description: string;
  xp: number;
  quizId: string | null;
  taskId: string | null;
};
