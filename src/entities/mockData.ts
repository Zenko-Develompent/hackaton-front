// entities/course/model/mockData.ts
import type {
  Course,
  CourseDetails,
  CourseTree,
  CoursesResponse,
  ModuleShort,
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
    },
    {
      moduleId: "module-2",
      name: "Основы программирования игр",
      description: "Изучаем базовые механики",
      lessonCount: 5,
      examId: "exam-2",
    },
    {
      moduleId: "module-3",
      name: "Графика и анимация",
      description: "Создаём визуальное оформление",
      lessonCount: 4,
      examId: "exam-3",
    },
    {
      moduleId: "module-4",
      name: "Создание полноценной игры",
      description: "Собираем всё вместе",
      lessonCount: 6,
      examId: null,
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
      lessons: [
        {
          lessonId: "lesson-1-1",
          name: "Что такое игры и как они создаются",
          quizId: "quiz-1-1",
          taskId: null,
        },
        {
          lessonId: "lesson-1-2",
          name: "Выбор движка и инструментов",
          quizId: null,
          taskId: "task-1-2",
        },
        {
          lessonId: "lesson-1-3",
          name: "Установка и настройка окружения",
          quizId: "quiz-1-3",
          taskId: null,
        },
        {
          lessonId: "lesson-1-4",
          name: "Первая сцена: привет, мир!",
          quizId: null,
          taskId: "task-1-4",
        },
      ],
    },
    {
      moduleId: "module-2",
      name: "Основы программирования игр",
      examId: "exam-2",
      lessons: [
        {
          lessonId: "lesson-2-1",
          name: "Переменные и типы данных",
          quizId: "quiz-2-1",
          taskId: "task-2-1",
        },
        {
          lessonId: "lesson-2-2",
          name: "Условия и циклы",
          quizId: "quiz-2-2",
          taskId: "task-2-2",
        },
        {
          lessonId: "lesson-2-3",
          name: "Функции и методы",
          quizId: "quiz-2-3",
          taskId: null,
        },
        {
          lessonId: "lesson-2-4",
          name: "Объекты и классы",
          quizId: null,
          taskId: "task-2-4",
        },
        {
          lessonId: "lesson-2-5",
          name: "Практика: движение персонажа",
          quizId: "quiz-2-5",
          taskId: "task-2-5",
        },
      ],
    },
    {
      moduleId: "module-3",
      name: "Графика и анимация",
      examId: "exam-3",
      lessons: [
        {
          lessonId: "lesson-3-1",
          name: "Основы работы с графикой",
          quizId: "quiz-3-1",
          taskId: null,
        },
        {
          lessonId: "lesson-3-2",
          name: "Спрайты и текстуры",
          quizId: null,
          taskId: "task-3-2",
        },
        {
          lessonId: "lesson-3-3",
          name: "Создание анимаций",
          quizId: "quiz-3-3",
          taskId: "task-3-3",
        },
        {
          lessonId: "lesson-3-4",
          name: "Эффекты и частицы",
          quizId: "quiz-3-4",
          taskId: null,
        },
      ],
    },
    {
      moduleId: "module-4",
      name: "Создание полноценной игры",
      examId: null,
      lessons: [
        {
          lessonId: "lesson-4-1",
          name: "Проектирование игровых механик",
          quizId: "quiz-4-1",
          taskId: "task-4-1",
        },
        {
          lessonId: "lesson-4-2",
          name: "Создание уровней",
          quizId: null,
          taskId: "task-4-2",
        },
        {
          lessonId: "lesson-4-3",
          name: "Добавление звуков и музыки",
          quizId: "quiz-4-3",
          taskId: null,
        },
        {
          lessonId: "lesson-4-4",
          name: "UI и меню",
          quizId: "quiz-4-4",
          taskId: "task-4-4",
        },
        {
          lessonId: "lesson-4-5",
          name: "Тестирование и отладка",
          quizId: null,
          taskId: "task-4-5",
        },
        {
          lessonId: "lesson-4-6",
          name: "Публикация игры",
          quizId: "quiz-4-6",
          taskId: "task-4-6",
        },
      ],
    },
  ],
};

export const mockModules = {
  items: [
    {
      moduleId: "module-1",
      name: "Введение в игровую разработку",
      description: "Основные концепции и инструменты",
      lessonCount: 4,
      examId: "exam-1",
    },
    {
      moduleId: "module-2",
      name: "Основы программирования игр",
      description: "Изучаем базовые механики",
      lessonCount: 5,
      examId: "exam-2",
    },
    {
      moduleId: "module-3",
      name: "Графика и анимация",
      description: "Создаём визуальное оформление",
      lessonCount: 4,
      examId: "exam-3",
    },
    {
      moduleId: "module-4",
      name: "Создание полноценной игры",
      description: "Собираем всё вместе",
      lessonCount: 6,
      examId: null,
    },
  ],
};


// entities/lesson/model/mockData.ts
import type { Lesson, LessonQuiz, LessonTask } from "@/entities/lesson/model/types";

export const mockLessons: Record<string, Lesson> = {
  "lesson-1-1": {
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
  },
  "lesson-1-2": {
    lessonId: "lesson-1-2",
    moduleId: "module-1",
    name: "Выбор движка и инструментов",
    description: "Узнаем о популярных игровых движках и выберем подходящий для нашего проекта.",
    content: `# Игровые движки

Игровой движок - это основа любой игры. Он предоставляет готовые инструменты для разработки.

## Популярные движки

### Unity
- **Плюсы**: большой рынок, C#, огромное сообщество
- **Минусы**: сложность с оптимизацией
- **Лучше всего подходит**: мобильные игры, инди-проекты

### Unreal Engine
- **Плюсы**: графика AAA уровня, Blueprints
- **Минусы**: сложный порог входа
- **Лучше всего подходит**: AAA проекты, шутеры

### Godot
- **Плюсы**: бесплатный, легкий, открытый код
- **Минусы**: мало вакансий
- **Лучше всего подходит**: 2D игры, инди-проекты

## Выбор для нашего курса
Для создания первой игры мы будем использовать **Unity** по следующим причинам:
- \`\`\`csharp
// Простой синтаксис C#
void Start() {
    Debug.Log("Hello, World!");
}
\`\`\`
- Огромное количество обучающих материалов
- Кроссплатформенность

## Установка
1. Перейдите на [официальный сайт Unity](https://unity.com)
2. Скачайте Unity Hub
3. Установите последнюю версию Unity
4. Установите Visual Studio Community

> **Важно**: выберите версию LTS (Long Term Support) для стабильной работы.`,
    xp: 75,
    quizId: null,
    taskId: "task-1-2",
  },
  "lesson-1-3": {
    lessonId: "lesson-1-3",
    moduleId: "module-1",
    name: "Установка и настройка окружения",
    description: "Установим необходимые инструменты и настроим рабочее окружение.",
    content: `# Установка инструментов разработки

## Шаг 1: Установка Unity Hub

Unity Hub - это менеджер для управления версиями Unity и проектами.

1. Скачайте Unity Hub с официального сайта
2. Запустите установщик
3. Следуйте инструкциям установщика

## Шаг 2: Установка Unity Editor

После установки Unity Hub:

1. Откройте Unity Hub
2. Перейдите во вкладку **Installs**
3. Нажмите **Install Editor**
4. Выберите версию **LTS** (рекомендуется)
5. Установите следующие компоненты:
   - \`Windows Build Support\` (для сборки под Windows)
   - \`WebGL Build Support\` (для сборки в браузер)
   - \`Documentation\`

## Шаг 3: Установка Visual Studio

Для написания кода нам понадобится редактор:

\`\`\`
1. Скачайте Visual Studio Community
2. Во время установки выберите:
   - .NET desktop development
   - Game development with Unity
\`\`\`

## Шаг 4: Настройка Visual Studio

После установки:
1. Откройте Visual Studio
2. В меню **Tools** → **Get Tools and Features**
3. Убедитесь, что установлен пакет **Game development with Unity**

## Проверка установки

Создайте новый проект в Unity:
\`\`\`csharp
using UnityEngine;

public class Test : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Установка прошла успешно!");
    }
}
\`\`\`

Если вы видите сообщение в консоли Unity, значит всё работает правильно.`,
    xp: 50,
    quizId: "quiz-1-3",
    taskId: null,
  },
  "lesson-1-4": {
    lessonId: "lesson-1-4",
    moduleId: "module-1",
    name: "Первая сцена: привет, мир!",
    description: "Создадим первую сцену и выведем на экран 'Привет, мир!'",
    content: `# Создаем первую сцену

## Создание нового проекта

1. Откройте Unity Hub
2. Нажмите **New Project**
3. Выберите шаблон **2D Core** или **3D Core**
4. Укажите имя проекта: \`MyFirstGame\`
5. Нажмите **Create**

## Структура проекта

После создания проекта вы увидите:
- **Scene** - окно сцены
- **Game** - окно игры
- **Hierarchy** - иерархия объектов
- **Inspector** - свойства объекта
- **Project** - файлы проекта
- **Console** - вывод ошибок и сообщений

## Создаем первый объект

1. В Hierarchy нажмите правой кнопкой мыши
2. Выберите **3D Object** → **Cube**
3. Вы увидите куб в сцене

## Пишем скрипт

Создадим скрипт, который будет выводить сообщение:

\`\`\`csharp
using UnityEngine;

public class HelloWorld : MonoBehaviour
{
    void Start()
    {
        Debug.Log("Привет, мир! Добро пожаловать в разработку игр!");
    }
    
    void Update()
    {
        // Этот метод вызывается каждый кадр
    }
}
\`\`\`

1. В окне Project нажмите правой кнопкой мыши
2. Выберите **Create** → **C# Script**
3. Назовите его \`HelloWorld\`
4. Дважды кликните по скрипту (откроется Visual Studio)
5. Вставьте код выше
6. Сохраните файл

## Прикрепляем скрипт к объекту

1. Выделите Cube в Hierarchy
2. Перетащите скрипт \`HelloWorld\` из Project в Inspector на куб
3. Нажмите **Play** (треугольник вверху)
4. Посмотрите в Console - вы увидите сообщение

## Результат

Поздравляю! Вы создали свою первую сцену и написали первый скрипт!

\`\`\`
[Message] Привет, мир! Добро пожаловать в разработку игр!
\`\`\`

Теперь вы готовы к созданию настоящей игры!`,
    xp: 100,
    quizId: null,
    taskId: "task-1-4",
  },
  "lesson-2-1": {
    lessonId: "lesson-2-1",
    moduleId: "module-2",
    name: "Переменные и типы данных",
    description: "Изучим основные типы данных и научимся работать с переменными.",
    content: `# Переменные и типы данных в C#

## Что такое переменная?

Переменная - это контейнер для хранения данных. Представьте, что это коробка с именем, в которую можно положить значение.

## Основные типы данных

### Целочисленные типы
\`\`\`csharp
int age = 25;           // целые числа
byte level = 10;        // от 0 до 255
long score = 999999;    // большие числа
\`\`\`

### Числа с плавающей точкой
\`\`\`csharp
float speed = 5.5f;     // числа с точкой (нужна f)
double gravity = 9.81;  // двойная точность
\`\`\`

### Логический тип
\`\`\`csharp
bool isGameOver = false; // true или false
bool isPlayerAlive = true;
\`\`\`

### Строковый тип
\`\`\`csharp
string playerName = "Игрок 1";
char grade = 'A';        // один символ
\`\`\`

## Объявление переменных

\`\`\`csharp
public class Player : MonoBehaviour
{
    // Объявление переменных
    public int health = 100;
    private float speed = 5f;
    protected string playerName = "Hero";
    
    void Start()
    {
        // Локальная переменная
        int localScore = 0;
        
        Debug.Log("Здоровье: " + health);
        Debug.Log($"Скорость: {speed}");
        Debug.Log($"Имя: {playerName}");
    }
}
\`\`\`

## Модификаторы доступа

- \`public\` - доступно везде
- \`private\` - только внутри класса
- \`protected\` - доступно в классе и наследниках

## Константы

\`\`\`csharp
const float GRAVITY = 9.81f;
const int MAX_HEALTH = 100;
\`\`\`

## Практический пример

\`\`\`csharp
using UnityEngine;

public class PlayerStats : MonoBehaviour
{
    // Публичные переменные видны в Inspector
    public string playerName = "Hero";
    public int maxHealth = 100;
    public float moveSpeed = 5f;
    
    // Приватные переменные
    private int currentHealth;
    private int experiencePoints;
    private bool isDead = false;
    
    void Start()
    {
        currentHealth = maxHealth;
        experiencePoints = 0;
        
        Debug.Log($"{playerName} создан!");
        Debug.Log($"Здоровье: {currentHealth}/{maxHealth}");
    }
    
    public void TakeDamage(int damage)
    {
        currentHealth -= damage;
        
        if (currentHealth <= 0)
        {
            currentHealth = 0;
            isDead = true;
            Debug.Log($"{playerName} погиб!");
        }
        else
        {
            Debug.Log($"{playerName} получил {damage} урона. Осталось: {currentHealth}");
        }
    }
    
    public void AddExperience(int xp)
    {
        experiencePoints += xp;
        Debug.Log($"Получено {xp} опыта! Всего: {experiencePoints}");
    }
}
\`\`\`

## Упражнение

Создайте свой класс для игрового объекта с 5 разными переменными разных типов.

> **Совет**: всегда давайте переменным понятные имена на английском языке.`,
    xp: 75,
    quizId: "quiz-2-1",
    taskId: "task-2-1",
  },
};

export const mockQuizzes: Record<string, LessonQuiz> = {
  "quiz-1-1": {
    quizId: "quiz-1-1",
    lessonId: "lesson-1-1",
    name: "Тест: История игр",
    description: "Проверь свои знания об истории компьютерных игр",
    questionsCount: 5,
  },
  "quiz-1-3": {
    quizId: "quiz-1-3",
    lessonId: "lesson-1-3",
    name: "Тест: Настройка окружения",
    description: "Проверь, правильно ли ты установил и настроил инструменты",
    questionsCount: 3,
  },
  "quiz-2-1": {
    quizId: "quiz-2-1",
    lessonId: "lesson-2-1",
    name: "Тест: Переменные и типы данных",
    description: "Проверь понимание переменных и типов данных",
    questionsCount: 5,
  },
};

export const mockTasks: Record<string, LessonTask> = {
  "task-1-2": {
    taskId: "task-1-2",
    lessonId: "lesson-1-2",
    examId: null,
    name: "Задание: Установка Unity",
    description: "Установи Unity и создай новый проект",
  },
  "task-1-4": {
    taskId: "task-1-4",
    lessonId: "lesson-1-4",
    examId: null,
    name: "Задание: Первая сцена",
    description: "Создай первую сцену с текстом 'Привет, мир!'",
  },
  "task-2-1": {
    taskId: "task-2-1",
    lessonId: "lesson-2-1",
    examId: null,
    name: "Задание: Переменные",
    description: "Создай несколько переменных разных типов и выведи их значения",
  },
};

// entities/module/model/mockData.ts
import type { Module, LessonShort } from "@/entities/module/model/types";



export const mockLessonsShort: Record<string, LessonShort[]> = {
  "module-1": [
    {
      lessonId: "lesson-1-1",
      name: "Что такое игры и как они создаются",
      description: "История игр и этапы создания",
      xp: 50,
      quizId: "quiz-1-1",
      taskId: null,
    },
    {
      lessonId: "lesson-1-2",
      name: "Выбор движка и инструментов",
      description: "Обзор популярных игровых движков",
      xp: 75,
      quizId: null,
      taskId: "task-1-2",
    },
    {
      lessonId: "lesson-1-3",
      name: "Установка и настройка окружения",
      description: "Практическое руководство по установке",
      xp: 50,
      quizId: "quiz-1-3",
      taskId: null,
    },
    {
      lessonId: "lesson-1-4",
      name: "Первая сцена: привет, мир!",
      description: "Создаем первый проект",
      xp: 100,
      quizId: null,
      taskId: "task-1-4",
    },
  ],
  "module-2": [
    {
      lessonId: "lesson-2-1",
      name: "Переменные и типы данных",
      description: "Основы хранения данных",
      xp: 75,
      quizId: "quiz-2-1",
      taskId: "task-2-1",
    },
    {
      lessonId: "lesson-2-2",
      name: "Условия и циклы",
      description: "Управление потоком программы",
      xp: 100,
      quizId: "quiz-2-2",
      taskId: "task-2-2",
    },
    {
      lessonId: "lesson-2-3",
      name: "Функции и методы",
      description: "Организация кода",
      xp: 75,
      quizId: "quiz-2-3",
      taskId: null,
    },
    {
      lessonId: "lesson-2-4",
      name: "Объекты и классы",
      description: "Объектно-ориентированное программирование",
      xp: 100,
      quizId: null,
      taskId: "task-2-4",
    },
    {
      lessonId: "lesson-2-5",
      name: "Практика: движение персонажа",
      description: "Реализуем движение",
      xp: 150,
      quizId: "quiz-2-5",
      taskId: "task-2-5",
    },
  ],
};

// entities/quiz/model/mockData.ts
import type { QuizStartResponse, QuizAnswerResponse, QuizQuestion } from "@/entities/quiz/model/types";

export const mockQuizQuestions: Record<string, QuizQuestion[]> = {
  "quiz-1-1": [
    {
      questionId: "q1",
      name: "Когда появилась первая компьютерная игра?",
      description: "Выберите правильный год",
      index: 0,
      total: 5,
      options: [
        { answerId: "a1", name: "1940-е", description: "" },
        { answerId: "a2", name: "1950-е", description: "" },
        { answerId: "a3", name: "1960-е", description: "" },
        { answerId: "a4", name: "1970-е", description: "" },
      ],
    },
    {
      questionId: "q2",
      name: "Какой жанр игры считается самым первым?",
      description: "Выберите правильный ответ",
      index: 1,
      total: 5,
      options: [
        { answerId: "a1", name: "Action", description: "" },
        { answerId: "a2", name: "Strategy", description: "" },
        { answerId: "a3", name: "Simulation", description: "" },
        { answerId: "a4", name: "Puzzle", description: "" },
      ],
    },
  ],
  "quiz-2-1": [
    {
      questionId: "q1",
      name: "Какой тип данных используется для хранения целых чисел?",
      description: "Выберите правильный ответ",
      index: 0,
      total: 5,
      options: [
        { answerId: "a1", name: "string", description: "" },
        { answerId: "a2", name: "float", description: "" },
        { answerId: "a3", name: "int", description: "" },
        { answerId: "a4", name: "bool", description: "" },
      ],
    },
    {
      questionId: "q2",
      name: "Как объявить переменную в C#?",
      description: "Выберите правильный синтаксис",
      index: 1,
      total: 5,
      options: [
        { answerId: "a1", name: "variable = 5", description: "" },
        { answerId: "a2", name: "int variable = 5", description: "" },
        { answerId: "a3", name: "var = 5", description: "" },
        { answerId: "a4", name: "variable int = 5", description: "" },
      ],
    },
  ],
};

export const mockQuizStartResponse: QuizStartResponse = {
  completed: false,
  question: mockQuizQuestions["quiz-1-1"][0],
  task: null,
};

export const mockQuizAnswerResponseCorrect: QuizAnswerResponse = {
  correct: true,
  completed: false,
  question: mockQuizQuestions["quiz-1-1"][1],
  task: null,
};

export const mockQuizAnswerResponseCompleted: QuizAnswerResponse = {
  correct: true,
  completed: true,
  question: null,
  task: null,
};

// entities/auth/model/mockData.ts
import type { UserShort, AuthTokens } from "@/entities/auth/model/types";

export const mockUser: UserShort = {
  id: "user-1",
  username: "john_doe",
  email: "john@example.com",
};

export const mockAuthTokens: AuthTokens = {
  accessToken: "mock-access-token-12345",
  accessExpiresAt: new Date(Date.now() + 3600000).toISOString(),
  refreshToken: "mock-refresh-token-67890",
  refreshExpiresAt: new Date(Date.now() + 86400000).toISOString(),
};

export const mockLoginResponse = {
  ...mockAuthTokens,
  deviceId: "device-1",
  sessionId: "session-1",
  sessionKey: "mock-session-key",
  sessionKeyIv: "mock-session-key-iv",
  user: mockUser,
};

export const mockRegisterResponse = {
  needVerify: true,
  ticket: "mock-ticket-123",
  email: "newuser@example.com",
  resendAfterSec: 60,
};

export const mockRefreshResponse = mockAuthTokens;

export const mockLogoutResponse = {
  ok: true,
};