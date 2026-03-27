

// ==================== COURSE MOCKS ====================
import type { 
  Course, 
  CourseDetails, 
  CourseTree, 
  CoursesResponse, 
  ModuleShort,
  CourseProgress 
} from "@/entities/course/model/types";

export const mockCourses: CoursesResponse = {
  items: [
    {
      courseId: "course-1",
      name: "Создай свою первую игру",
      description: "На этом курсе ты создашь свою собственную игру с нуля — даже если раньше никогда не программировал. Ты научишься придумывать игровые механики, работать с графикой, писать код и соберёшь полноценный проект, в который можно играть и показывать друзьям.",
      category: "Game Development",
      moduleCount: 4,
      lessonCount: 19,
    },
    {
      courseId: "course-2",
      name: "React для начинающих",
      description: "Изучи основы React и создай современные веб-приложения. Курс подойдет для тех, кто уже знаком с JavaScript. Ты научишься создавать компоненты, управлять состоянием и работать с хуками.",
      category: "Web Development",
      moduleCount: 3,
      lessonCount: 12,
    },
    {
      courseId: "course-3",
      name: "Python для анализа данных",
      description: "Освой Python и библиотеки для анализа данных: Pandas, NumPy, Matplotlib. Научись работать с данными как профессионал. Курс включает реальные проекты и практические задания.",
      category: "Data Science",
      moduleCount: 5,
      lessonCount: 24,
    },
    {
      courseId: "course-4",
      name: "TypeScript с нуля",
      description: "Полное руководство по TypeScript. Изучи типизацию, интерфейсы, дженерики и создавай надежные приложения. Курс подойдет как новичкам, так и опытным разработчикам.",
      category: "Web Development",
      moduleCount: 4,
      lessonCount: 16,
    },
    {
      courseId: "course-5",
      name: "Node.js backend разработка",
      description: "Создавай мощные серверные приложения на Node.js. Изучи Express, базы данных, авторизацию и деплой. Получи практические навыки разработки REST API.",
      category: "Backend",
      moduleCount: 4,
      lessonCount: 20,
    },
  ],
  page: 0,
  size: 20,
  total: 5,
};

export const mockCourseDetails: CourseDetails = {
  courseId: "course-1",
  name: "Создай свою первую игру",
  description: "На этом курсе ты создашь свою собственную игру с нуля — даже если раньше никогда не программировал. Ты научишься придумывать игровые механики, работать с графикой, писать код и соберёшь полноценный проект.",
  category: "Game Development",
  modules: [
    {
      moduleId: "module-1",
      name: "Введение в игровую разработку",
      description: "Основные концепции и инструменты",
      lessonCount: 4,
      examId: "exam-1",
      unlocked: true,
    },
    {
      moduleId: "module-2",
      name: "Основы программирования игр",
      description: "Изучаем базовые механики",
      lessonCount: 5,
      examId: "exam-2",
      unlocked: false,
    },
    {
      moduleId: "module-3",
      name: "Графика и анимация",
      description: "Создаём визуальное оформление",
      lessonCount: 4,
      examId: "exam-3",
      unlocked: false,
    },
    {
      moduleId: "module-4",
      name: "Создание полноценной игры",
      description: "Собираем всё вместе",
      lessonCount: 6,
      examId: null,
      unlocked: false,
    },
  ],
};

export const mockCourseTree: CourseTree = {
  courseId: "course-1",
  name: "Создай свою первую игру",
  modules: [
    {
      moduleId: "module-1",
      name: "Введение в игровую разработку",
      examId: "exam-1",
      unlocked: true,
      lessons: [
        {
          lessonId: "lesson-1-1",
          name: "Что такое игры и как они создаются",
          quizId: "quiz-1-1",
          taskId: null,
          unlocked: true,
        },
        {
          lessonId: "lesson-1-2",
          name: "Выбор движка и инструментов",
          quizId: null,
          taskId: "task-1-2",
          unlocked: true,
        },
        {
          lessonId: "lesson-1-3",
          name: "Установка и настройка окружения",
          quizId: "quiz-1-3",
          taskId: null,
          unlocked: false,
        },
        {
          lessonId: "lesson-1-4",
          name: "Первая сцена: привет, мир!",
          quizId: null,
          taskId: "task-1-4",
          unlocked: false,
        },
      ],
    },
    {
      moduleId: "module-2",
      name: "Основы программирования игр",
      examId: "exam-2",
      unlocked: false,
      lessons: [
        {
          lessonId: "lesson-2-1",
          name: "Переменные и типы данных",
          quizId: "quiz-2-1",
          taskId: "task-2-1",
          unlocked: false,
        },
        {
          lessonId: "lesson-2-2",
          name: "Условия и циклы",
          quizId: "quiz-2-2",
          taskId: "task-2-2",
          unlocked: false,
        },
        {
          lessonId: "lesson-2-3",
          name: "Функции и методы",
          quizId: "quiz-2-3",
          taskId: null,
          unlocked: false,
        },
        {
          lessonId: "lesson-2-4",
          name: "Объекты и классы",
          quizId: null,
          taskId: "task-2-4",
          unlocked: false,
        },
        {
          lessonId: "lesson-2-5",
          name: "Практика: движение персонажа",
          quizId: "quiz-2-5",
          taskId: "task-2-5",
          unlocked: false,
        },
      ],
    },
    {
      moduleId: "module-3",
      name: "Графика и анимация",
      examId: "exam-3",
      unlocked: false,
      lessons: [
        {
          lessonId: "lesson-3-1",
          name: "Основы работы с графикой",
          quizId: "quiz-3-1",
          taskId: null,
          unlocked: false,
        },
        {
          lessonId: "lesson-3-2",
          name: "Спрайты и текстуры",
          quizId: null,
          taskId: "task-3-2",
          unlocked: false,
        },
        {
          lessonId: "lesson-3-3",
          name: "Создание анимаций",
          quizId: "quiz-3-3",
          taskId: "task-3-3",
          unlocked: false,
        },
        {
          lessonId: "lesson-3-4",
          name: "Эффекты и частицы",
          quizId: "quiz-3-4",
          taskId: null,
          unlocked: false,
        },
      ],
    },
    {
      moduleId: "module-4",
      name: "Создание полноценной игры",
      examId: null,
      unlocked: false,
      lessons: [
        {
          lessonId: "lesson-4-1",
          name: "Проектирование игровых механик",
          quizId: "quiz-4-1",
          taskId: "task-4-1",
          unlocked: false,
        },
        {
          lessonId: "lesson-4-2",
          name: "Создание уровней",
          quizId: null,
          taskId: "task-4-2",
          unlocked: false,
        },
        {
          lessonId: "lesson-4-3",
          name: "Добавление звуков и музыки",
          quizId: "quiz-4-3",
          taskId: null,
          unlocked: false,
        },
        {
          lessonId: "lesson-4-4",
          name: "UI и меню",
          quizId: "quiz-4-4",
          taskId: "task-4-4",
          unlocked: false,
        },
        {
          lessonId: "lesson-4-5",
          name: "Тестирование и отладка",
          quizId: null,
          taskId: "task-4-5",
          unlocked: false,
        },
        {
          lessonId: "lesson-4-6",
          name: "Публикация игры",
          quizId: "quiz-4-6",
          taskId: "task-4-6",
          unlocked: false,
        },
      ],
    },
  ],
};

export const mockCourseProgress: CourseProgress = {
  targetId: "course-1",
  targetType: "course",
  percent: 25,
  completed: false,
  doneItems: 1,
  totalItems: 4,
};

// ==================== MODULE MOCKS ====================
import type { Module, ModuleExam, ModuleExamResponse, ModuleProgress } from "@/entities/module/model/types";

export const mockModule: Module = {
  moduleId: "module-1",
  courseId: "course-1",
  name: "Введение в игровую разработку",
  description: "В этом модуле вы познакомитесь с основами создания игр, выберете инструменты и создадите свою первую сцену.",
  exam: {
    examId: "exam-1",
    name: "Итоговый экзамен модуля 1",
    questionsCount: 10,
    tasksCount: 2,
  },
};

export const mockModuleLessons = {
  items: [
    {
      lessonId: "lesson-1-1",
      name: "Что такое игры и как они создаются",
      description: "История игр и этапы создания",
      xp: 50,
      quizId: "quiz-1-1",
      taskId: null,
      unlocked: true,
    },
    {
      lessonId: "lesson-1-2",
      name: "Выбор движка и инструментов",
      description: "Обзор популярных игровых движков",
      xp: 75,
      quizId: null,
      taskId: "task-1-2",
      unlocked: true,
    },
    {
      lessonId: "lesson-1-3",
      name: "Установка и настройка окружения",
      description: "Практическое руководство по установке",
      xp: 50,
      quizId: "quiz-1-3",
      taskId: null,
      unlocked: false,
    },
    {
      lessonId: "lesson-1-4",
      name: "Первая сцена: привет, мир!",
      description: "Создаем первый проект",
      xp: 100,
      quizId: null,
      taskId: "task-1-4",
      unlocked: false,
    },
  ],
};

export const mockModuleExam: ModuleExamResponse = {
  examId: "exam-1",
  moduleId: "module-1",
  name: "Итоговый экзамен модуля 1",
  description: "Финальная проверка знаний по модулю",
  questionsCount: 10,
  tasksCount: 2,
};

export const mockModuleProgress: ModuleProgress = {
  targetId: "module-1",
  targetType: "module",
  percent: 50,
  completed: false,
  doneItems: 2,
  totalItems: 4,
};

// ==================== LESSON MOCKS ====================
import type { Lesson, LessonQuiz, LessonTask, LessonProgress } from "@/entities/lesson/model/types";

export const mockLessons: Lesson[] = [{
  lessonId: "lesson-1-1",
  moduleId: "module-1",
  name: "Что такое игры и как они создаются",
  description: "В этом уроке мы познакомимся с историей игр, основными жанрами и этапами создания игр.",
  content: `# Что такое игры?

Игры существуют с древних времен. Первые компьютерные игры появились в 1950-х годах.

## История игр
- **1958** - Tennis for Two
- **1962** - Spacewar!
- **1972** - Pong

## Основные жанры игр
1. **Action** - игры, основанные на реакции и скорости
2. **Strategy** - игры, требующие планирования
3. **RPG** - ролевые игры с развитием персонажа
4. **Simulation** - симуляторы реальной жизни

## Этапы создания игры
1. Концепция и дизайн
2. Прототипирование
3. Разработка
4. Тестирование
5. Релиз и поддержка

> Интересный факт: первая компьютерная игра была создана в 1958 году физиком Уильямом Хигинботамом.`,
  xp: 50,
  quizId: "quiz-1-1",
  taskId: null,
}]

export const mockLessonQuiz: LessonQuiz = {
  quizId: "quiz-1-1",
  lessonId: "lesson-1-1",
  name: "Тест: История игр",
  description: "Проверь свои знания об истории компьютерных игр",
  questionsCount: 5,
};

export const mockLessonTask: LessonTask = {
  taskId: "task-1-2",
  lessonId: "lesson-1-2",
  examId: null,
  name: "Задание: Установка Unity",
  description: "Установи Unity и создай новый проект",
  runnerLanguage: "bash",
  xpReward: 75,
  coinReward: 50,
};

export const mockLessonProgress: LessonProgress = {
  targetId: "lesson-1-1",
  targetType: "lesson",
  percent: 0,
  completed: false,
  doneItems: 0,
  totalItems: 1,
};

// ==================== QUIZ MOCKS ====================
import type { 
  QuizQuestion, 
  QuizStartResponse, 
  QuizAnswerResponse, 
  QuizQuestionsResponse,
  QuizCompleteResponse 
} from "@/entities/quiz/model/types";

export const mockQuizQuestions: QuizQuestionsResponse = {
  items: [
    {
      questId: "q1",
      quizId: "quiz-1-1",
      examId: null,
      name: "Когда появилась первая компьютерная игра?",
      description: "Выберите правильный год",
    },
    {
      questId: "q2",
      quizId: "quiz-1-1",
      examId: null,
      name: "Какой жанр игры считается самым первым?",
      description: "Выберите правильный ответ",
    },
  ],
};

export const mockQuizStartResponse: QuizStartResponse = {
  completed: false,
  question: {
    questionId: "q1",
    name: "Когда появилась первая компьютерная игра?",
    description: "Выберите правильный год",
    index: 1,
    total: 5,
    options: [
      { answerId: "a1", name: "1940-е", description: "" },
      { answerId: "a2", name: "1950-е", description: "" },
      { answerId: "a3", name: "1960-е", description: "" },
      { answerId: "a4", name: "1970-е", description: "" },
    ],
  },
};

export const mockQuizAnswerResponse: QuizAnswerResponse = {
  correct: true,
  completed: false,
  xpGranted: 10,
  coinGranted: 5,
  question: {
    questionId: "q2",
    name: "Какой жанр игры считается самым первым?",
    description: "Выберите правильный ответ",
    index: 2,
    total: 5,
    options: [
      { answerId: "a1", name: "Action", description: "" },
      { answerId: "a2", name: "Strategy", description: "" },
      { answerId: "a3", name: "Simulation", description: "" },
      { answerId: "a4", name: "Puzzle", description: "" },
    ],
  },
};

// ==================== EXAM MOCKS ====================
import type { 
  Exam, 
  ExamQuestion, 
  ExamTask, 
  ExamCompleteResponse 
} from "@/entities/exam/model/types";

export const mockExam: Exam = {
  examId: "exam-1",
  moduleId: "module-1",
  name: "Экзамен по модулю 1",
  description: "Финальная проверка знаний",
  xpReward: 100,
  coinReward: 50,
  questionsCount: 10,
  tasksCount: 2,
};

export const mockExamQuestions = {
  items: [
    {
      questId: "exam-q1",
      quizId: null,
      examId: "exam-1",
      name: "Что такое игровой движок?",
      description: "Опишите своими словами",
    },
    {
      questId: "exam-q2",
      quizId: null,
      examId: "exam-1",
      name: "Назовите основные этапы создания игры",
      description: "Перечислите в правильном порядке",
    },
  ],
};

export const mockExamTasks = {
  items: [
    {
      taskId: "exam-task-1",
      examId: "exam-1",
      lessonId: null,
      name: "Создание первой сцены",
      description: "Создайте сцену с текстом",
      runnerLanguage: "csharp",
      xpReward: 50,
      coinReward: 25,
    },
  ],
};

export const mockExamCompleteResponse: ExamCompleteResponse = {
  completed: true,
  firstCompletion: true,
  xpGranted: 100,
  coinGranted: 50,
  questionsDone: 10,
  questionsTotal: 10,
  tasksDone: 2,
  tasksTotal: 2,
};

// ==================== TASK MOCKS ====================
import type { 
  TaskStartResponse, 
  TaskCompleteResponse, 
  TaskRunResponse 
} from "@/entities/task/model/types";

export const mockTaskStartResponse: TaskStartResponse = {
  taskId: "task-1-2",
  lessonId: "lesson-1-2",
  examId: null,
  completed: false,
};

export const mockTaskCompleteResponse: TaskCompleteResponse = {
  taskId: "task-1-2",
  lessonId: "lesson-1-2",
  examId: null,
  completed: true,
  firstCompletion: true,
  xpGranted: 75,
  coinGranted: 50,
};

export const mockTaskRunResponse: TaskRunResponse = {
  taskId: "task-1-2",
  language: "csharp",
  status: "ok",
  correct: true,
  stdout: "Hello, world!\n",
  stderr: "",
  exitCode: 0,
  timedOut: false,
  durationMs: 284,
  completed: true,
  firstCompletion: true,
  xpGranted: 75,
  coinGranted: 50,
};

// ==================== QUEST MOCKS ====================
import type { QuestAnswersResponse, QuestCheckResponse } from "@/entities/quest/model/types";

export const mockQuestAnswers: QuestAnswersResponse = {
  items: [
    { answerId: "a1", name: "1940-е", description: "" },
    { answerId: "a2", name: "1950-е", description: "" },
    { answerId: "a3", name: "1960-е", description: "" },
    { answerId: "a4", name: "1970-е", description: "" },
  ],
};

export const mockQuestCheckResponse: QuestCheckResponse = {
  correct: true,
};

// ==================== COMMUNITY MOCKS ====================
import type { LeaderboardResponse, FeedResponse } from "@/entities/community/model/types";

export const mockLeaderboard: LeaderboardResponse = {
  period: "week",
  metric: "activity",
  fromInclusive: "2026-03-20T10:00:00Z",
  toInclusive: "2026-03-27T10:00:00Z",
  items: [
    { rank: 1, userId: "user-1", username: "john_doe", score: 145 },
    { rank: 2, userId: "user-2", username: "jane_smith", score: 132 },
    { rank: 3, userId: "user-3", username: "bob_wilson", score: 128 },
  ],
};

export const mockFeed: FeedResponse = {
  items: [
    {
      eventId: "event-1",
      createdAt: "2026-03-27T10:02:00Z",
      userId: "user-1",
      username: "john_doe",
      eventType: "quiz_completed",
      activityScore: 10,
      xpGranted: 12,
      coinGranted: 6,
      progressPercent: 100,
      lessonId: "lesson-1-1",
      quizId: "quiz-1-1",
      taskId: null,
      examId: null,
      details: null,
    },
    {
      eventId: "event-2",
      createdAt: "2026-03-26T15:30:00Z",
      userId: "user-2",
      username: "jane_smith",
      eventType: "task_completed",
      activityScore: 15,
      xpGranted: 75,
      coinGranted: 50,
      progressPercent: 100,
      lessonId: "lesson-1-2",
      quizId: null,
      taskId: "task-1-2",
      examId: null,
      details: null,
    },
    {
      eventId: "event-3",
      createdAt: "2026-03-25T09:15:00Z",
      userId: "user-1",
      username: "john_doe",
      eventType: "level_up",
      activityScore: 20,
      xpGranted: 0,
      coinGranted: 0,
      progressPercent: 100,
      lessonId: null,
      quizId: null,
      taskId: null,
      examId: null,
      details: { level: 2 },
    },
  ],
};




export const mockQuizCompleteResponse: QuizCompleteResponse = {
  completed: true,
  firstCompletion: true,
  xpGranted: 50,
  coinGranted: 25,
  totalQuestions: 5,
  correctAnswers: 5,
};