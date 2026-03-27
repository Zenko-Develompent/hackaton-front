// entities/course/model/types.ts
export type Course = {
  courseId: string;
  name: string;
  description: string;
  category: string;
  moduleCount: number;
  lessonCount: number;
};

export type CourseDetails = {
  courseId: string;
  name: string;
  description: string;
  category: string;
  modules: ModuleShort[];
};

export type ModuleShort = {
  moduleId: string;
  name: string;
  description: string;
  lessonCount: number;
  examId: string | null;
  unlocked?: boolean | null;
};

export type CoursesResponse = {
  items: Course[];
  page: number;
  size: number;
  total: number;
};

export type CourseTree = {
  courseId: string;
  name: string;
  modules: ModuleTree[];
};

export type ModuleTree = {
  moduleId: string;
  name: string;
  examId: string | null;
  unlocked?: boolean | null;
  lessons: LessonTree[];
};

export type LessonTree = {
  lessonId: string;
  name: string;
  quizId: string | null;
  taskId: string | null;
  unlocked?: boolean | null;
};

export type CourseProgress = {
  targetId: string;
  targetType: 'course';
  percent: number;
  completed: boolean;
  doneItems: number;
  totalItems: number;
};