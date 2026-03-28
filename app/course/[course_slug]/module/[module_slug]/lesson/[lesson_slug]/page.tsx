// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/components/LessonContent.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { useAuth } from "@/features/auth/useAuth";
import { courseApi } from "@/entities/course/api/course.api";
import { lessonApi } from "@/entities/lesson/api/lesson.api";
import { moduleApi } from "@/entities/module/api/module.api";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";
import hljs from "highlight.js";
import CoinIconWhite from "@/shared/assets/icons/CoinVerticalWhite.svg";
import { Lock, CheckCircle, Circle } from "lucide-react";
import type { CourseTree, Course } from "@/entities/course/model/types";
import type { Lesson } from "@/entities/lesson/model/types";
import type { LessonShort } from "@/entities/module/model/types";

// Ключ для хранения в localStorage
const LAST_LESSON_STORAGE_KEY = "last_lesson";

// Интерфейс для сохранения последнего урока
interface LastLessonData {
  userId: string;
  courseId: string;
  courseSlug: string;
  courseName: string;
  moduleId: string;
  moduleSlug: string;
  moduleName: string;
  lessonId: string;
  lessonSlug: string;
  lessonName: string;
  timestamp: number;
}

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;
  const lessonSlug = params.lesson_slug as string;

  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [moduleLessons, setModuleLessons] = useState<LessonShort[]>([]);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Состояния для проверки пройденности
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [taskCompleted, setTaskCompleted] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<any>(null);

  document.title="Доки Доки | " + lesson?.name;
  
  const { isAuth } = useAuth();

  // Находим текущий модуль и индексы
  const currentModuleIndex = courseTree?.modules.findIndex(
    (module) => module.moduleId === moduleSlug,
  );
  const currentModule =
    currentModuleIndex !== undefined && currentModuleIndex !== -1
      ? courseTree?.modules[currentModuleIndex]
      : null;

  // Проверяем доступность модуля
  const isModuleUnlocked = currentModule?.unlocked !== false;

  const currentLessonIndex = moduleLessons.findIndex(
    (lesson) => lesson.lessonId === lessonSlug,
  );

  // Проверяем доступность текущего урока
  const currentLessonData = moduleLessons[currentLessonIndex];
  const isLessonUnlocked =
    currentLessonData?.unlocked !== false && isModuleUnlocked;

  const auth = useAuth();

  // Сохранение последнего урока в localStorage
  const saveLastLesson = () => {
    if (!courseTree || !currentModule || !lesson) return;
    
    const lastLessonData: LastLessonData = {
      userId: auth.user ? auth.user?.userId : "",
      courseId: courseTree.courseId,
      courseSlug: courseSlug,
      courseName: courseTree.name,
      moduleId: currentModule.moduleId,
      moduleSlug: moduleSlug,
      moduleName: currentModule.name,
      lessonId: lesson.lessonId,
      lessonSlug: lessonSlug,
      lessonName: lesson.name,
      timestamp: Date.now(),
    };
    
    try {
      const existingData = localStorage.getItem(LAST_LESSON_STORAGE_KEY);
      let lessonsMap: Record<string, LastLessonData> = {};
      
      if (existingData) {
        lessonsMap = JSON.parse(existingData);
      }
      
      lessonsMap[courseTree.courseId] = lastLessonData;
      localStorage.setItem(LAST_LESSON_STORAGE_KEY, JSON.stringify(lessonsMap));
    } catch (err) {
      console.error("[LessonPage] Failed to save last lesson:", err);
    }
  };

  // Загрузка структуры курса
  useEffect(() => {
    const fetchCourseTree = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        setError(null);

        const data = await courseApi.getTree(courseSlug, isAuth);
        setCourseTree(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course tree:", err);
        setError("Не удалось загрузить структуру курса");
        setLoading(false);
      }
    };

    fetchCourseTree();
  }, [courseSlug, isAuth]);

  // Загрузка уроков модуля
  useEffect(() => {
    const fetchModuleLessons = async () => {
      if (!moduleSlug) return;

      try {
        const data = await moduleApi.getLessons(moduleSlug, isAuth);
        setModuleLessons(data.items);
      } catch (err) {
        console.error("Error fetching module lessons:", err);
      }
    };

    fetchModuleLessons();
  }, [moduleSlug, isAuth]);

  // Загрузка урока и проверка пройденности
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonSlug) return;

      try {
        setLessonLoading(true);

        const data = await lessonApi.getLesson(lessonSlug, isAuth);
        console.log(data)
        setLesson(data);
        
        // Загружаем прогресс урока
        try {
          const progress = await lessonApi.getProgress(lessonSlug);
          setLessonProgress(progress);
          setQuizCompleted(progress.completed || progress.percent >= 50);
          
          // Если есть задание, проверяем его выполнение
          if (data.taskId) {
            setTaskCompleted(progress.completed || progress.percent >= 100);
          }
        } catch (err) {
          console.error("Error fetching lesson progress:", err);
        }
        
        setLessonLoading(false);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setLessonLoading(false);
      }
    };

    fetchLesson();
  }, [lessonSlug]);

  // Сохраняем последний урок после успешной загрузки всех данных
  useEffect(() => {
    if (!loading && !lessonLoading && courseTree && lesson && currentModule) {
      saveLastLesson();
    }
  }, [loading, lessonLoading, courseTree, lesson, currentModule]);

  // Загрузка рекомендуемых курсов
  const fetchRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      setRecommendedError(false);

      const response = await courseApi.getCourses(0, 4);
      const filteredCourses = response.items.filter(
        (course) => course.courseId !== courseSlug,
      );
      setRecommendedCourses(filteredCourses.slice(0, 4));
      setRecommendedLoading(false);
    } catch (err) {
      console.error("Error fetching recommended courses:", err);
      setRecommendedError(true);
      setRecommendedLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendedCourses();
  }, [courseSlug]);

  // Формируем хлебные крошки
  const breadcrumbItems = [
    { label: courseTree?.name || "Загрузка...", href: `/course/${courseSlug}` },
    {
      label: currentModule?.name || "Загрузка...",
      href: `/course/${courseSlug}/module/${moduleSlug}`,
    },
    { label: lesson?.name || "Загрузка..." },
  ];

  // Обработчики навигации
  const getPrevAvailableLesson = () => {
    for (let i = currentLessonIndex - 1; i >= 0; i--) {
      if (moduleLessons[i]?.unlocked !== false && isModuleUnlocked) {
        return moduleLessons[i];
      }
    }
    return null;
  };

  const getNextAvailableLesson = () => {
    for (let i = currentLessonIndex + 1; i < moduleLessons.length; i++) {
      if (moduleLessons[i]?.unlocked !== false && isModuleUnlocked) {
        return moduleLessons[i];
      }
    }
    return null;
  };

  const prevLesson = getPrevAvailableLesson();
  const nextLesson = getNextAvailableLesson();

  const prevModule =
    currentModuleIndex !== undefined && currentModuleIndex > 0
      ? courseTree?.modules[currentModuleIndex - 1]
      : null;
  const nextModule =
    currentModuleIndex !== undefined &&
    currentModuleIndex !== -1 &&
    courseTree &&
    currentModuleIndex < courseTree.modules.length - 1
      ? courseTree?.modules[currentModuleIndex + 1]
      : null;

  const handlePrevLesson = () => {
    if (prevLesson) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${prevLesson.lessonId}`,
      );
    } else if (prevModule) {
      const lastAvailableLesson = prevModule.lessons
        .slice()
        .reverse()
        .find((lesson) => lesson.unlocked !== false);
      if (lastAvailableLesson) {
        router.push(
          `/course/${courseSlug}/module/${prevModule.moduleId}/lesson/${lastAvailableLesson.lessonId}`,
        );
      } else {
        router.push(`/course/${courseSlug}/module/${prevModule.moduleId}`);
      }
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${nextLesson.lessonId}`,
      );
    } else if (nextModule) {
      const firstAvailableLesson = nextModule.lessons.find(
        (lesson) => lesson.unlocked !== false,
      );
      if (firstAvailableLesson) {
        router.push(
          `/course/${courseSlug}/module/${nextModule.moduleId}/lesson/${firstAvailableLesson.lessonId}`,
        );
      } else {
        router.push(`/course/${courseSlug}/module/${nextModule.moduleId}`);
      }
    }
  };

  const handleStartQuiz = () => {
    if (lesson?.quizId && isLessonUnlocked && !quizCompleted) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}/quiz`,
      );
    }
  };

  const handleStartTask = () => {
    if (lesson?.taskId && isLessonUnlocked && !taskCompleted && quizCompleted) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}/task`,
      );
    }
  };

  const handleRetryRecommended = () => {
    fetchRecommendedCourses();
  };

  const isLoading = loading || lessonLoading;

  // Если урок недоступен, показываем сообщение
  if (!isLoading && !isLessonUnlocked) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Lock className="w-10 h-10 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Урок недоступен
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            {!isModuleUnlocked
              ? "Этот модуль пока недоступен. Пройдите предыдущие модули, чтобы открыть его."
              : "Этот урок пока недоступен. Пройдите предыдущие уроки, чтобы открыть его."}
          </p>
          <Button
            onClick={() =>
              router.push(`/course/${courseSlug}/module/${moduleSlug}`)
            }
          >
            Вернуться к модулю
          </Button>
        </div>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded-[40px] w-1/3 mb-5"></div>
            <div className="h-80 bg-gray-200 rounded-[40px] mb-10"></div>
            <div className="h-8 bg-gray-200 rounded-[40px] w-1/4 mb-10"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded-[40px]"></div>
              ))}
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (error || !courseTree || !currentModule || !lesson) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 mb-4">{error || "Урок не найден"}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const codeRef = useRef<HTMLElement>(null);
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");
    const isBlockCode = Boolean(language) || codeString.includes("\n");

    useEffect(() => {
      if (codeRef.current && !inline && language) {
        hljs.highlightElement(codeRef.current);
      }
    }, [codeString, language, inline]);

    if (isBlockCode && language) {
      return (
        <pre className="rounded-xl overflow-x-auto bg-gray-900 p-4 my-4">
          <code
            ref={codeRef}
            className={`language-${language} hljs`}
            {...props}
          >
            {codeString}
          </code>
        </pre>
      );
    }

    if (isBlockCode) {
      return (
        <pre className="rounded-xl overflow-x-auto bg-gray-900 p-4 my-4">
          <code {...props} className="hljs">
            {children}
          </code>
        </pre>
      );
    }

    return (
      <code
        className="bg-gray-100 px-1.5 py-0.5 rounded text-sm font-mono text-pink-500"
        {...props}
      >
        {children}
      </code>
    );
  };

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

      {/* Hero секция */}
      <div style={{
          backgroundImage: "url('/bg_dec.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}  className="relative flex flex-col items-start mt-5 gap-6 rounded-[40px] p-5 bg-[#35BCFF] text-white">
        <div>
          <span className="text-[20px] opacity-60">
            Урок{" "}
            {currentLessonIndex !== undefined ? currentLessonIndex + 1 : ""} • {lesson.xp} XP
          </span>
          <h1 className="text-[40px] leading-none font-semibold mt-2">
            {lesson.name}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/80 text-[18px]">{lesson.description}</p>
        </div>
        
        {/* Статус прохождения теста и задания */}
        <div className="flex gap-4 text-sm">
          {lesson.quizId && (
            <div className={`flex items-center gap-1 ${quizCompleted ? 'text-green-300' : 'text-white/60'}`}>
              {quizCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span>Тест {quizCompleted ? 'пройден' : 'не пройден'}</span>
            </div>
          )}
          {lesson.taskId && (
            <div className={`flex items-center gap-1 ${taskCompleted ? 'text-green-300' : 'text-white/60'}`}>
              {taskCompleted ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
              <span>Задание {taskCompleted ? 'выполнено' : 'не выполнено'}</span>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          {lesson.quizId && (
            <Button
              size="lg"
              variant="outline"
              className={`bg-0 text-white font-normal ${quizCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
              onClick={handleStartQuiz}
              disabled={quizCompleted}
            >
              {quizCompleted ? "Тест пройден ✓" : "Пройти тест"}
            </Button>
          )}
          {lesson.taskId && (
            <Button
              size="lg"
              variant="outline"
              className={`bg-0 text-white font-normal ${taskCompleted || !quizCompleted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/20'}`}
              onClick={handleStartTask}
              disabled={taskCompleted || Boolean(lesson.quizId && !quizCompleted)}
            >
              {taskCompleted 
                ? "Задание выполнено ✓" 
                : (lesson.quizId && !quizCompleted) 
                  ? "Сначала пройдите тест" 
                  : "Выполнить задание"}
            </Button>
          )}
        </div>
        <span className="absolute -top-2 -right-4 rotate-12 flex  bg-[#FF841D] rounded-[200px] items-center justify-center pl-3 font-medium text-[20px] text-white cursor-pointer">
          +{lesson.xp}
          <CoinIconWhite />
        </span>
      </div>

      {/* Контент урока в формате Markdown */}
      <div className="mt-10 mb-20">
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw]}
          components={{
            code: CodeBlock,
            h1: ({ children }) => (
              <h1 className="text-3xl font-bold mt-8 mb-4 text-gray-900">
                {children}
              </h1>
            ),
            h2: ({ children }) => (
              <h2 className="text-2xl font-bold mt-6 mb-3 text-gray-900">
                {children}
              </h2>
            ),
            h3: ({ children }) => (
              <h3 className="text-xl font-bold mt-4 mb-2 text-gray-900">
                {children}
              </h3>
            ),
            p: ({ children }) => (
              <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
            ),
            a: ({ href, children }) => (
              <a
                href={href}
                className="text-blue-600 hover:underline font-medium"
                target="_blank"
                rel="noopener noreferrer"
              >
                {children}
              </a>
            ),
            ul: ({ children }) => (
              <ul className="list-disc pl-5 mb-4">{children}</ul>
            ),
            ol: ({ children }) => (
              <ol className="list-decimal pl-5 mb-4">{children}</ol>
            ),
            li: ({ children }) => (
              <li className="text-gray-700 mb-1">{children}</li>
            ),
            blockquote: ({ children }) => (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4 ">
                {children}
              </blockquote>
            ),
            table: ({ children }) => (
              <div className="overflow-x-auto mb-4">
                <table className="border-collapse w-full">{children}</table>
              </div>
            ),
            th: ({ children }) => (
              <th className="border border-gray-300 p-2 bg-gray-100 font-semibold">
                {children}
              </th>
            ),
            td: ({ children }) => (
              <td className="border border-gray-300 p-2">{children}</td>
            ),
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                className="rounded-lg shadow-md max-w-full h-auto my-4"
              />
            ),
          }}
        >
          {lesson.content || ""}
        </ReactMarkdown>
      </div>

      {/* Навигация между уроками */}
      <div className="flex justify-between gap-4 mb-20">
        <Button
          variant="outline"
          size="lg"
          onClick={handlePrevLesson}
          disabled={!prevLesson && !prevModule}
          className="flex-1 text-[16px]"
        >
          ←{" "}
          {prevLesson
            ? `Предыдущий: ${prevLesson.name}`
            : prevModule
              ? `Предыдущий модуль: ${prevModule.name}`
              : "Предыдущий урок"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleNextLesson}
          disabled={!nextLesson && !nextModule}
          className="flex-1 text-[16px]"
        >
          {nextLesson
            ? `Следующий: ${nextLesson.name}`
            : nextModule
              ? `Следующий модуль: ${nextModule.name}`
              : "Следующий урок"}{" "}
          →
        </Button>
      </div>

      {/* Рекомендуемые курсы */}
      <CoursesWrapper
        title="Смотрите также"
        loading={recommendedLoading}
        error={recommendedError}
        onRetry={handleRetryRecommended}
        emptyMessage="Нет рекомендуемых курсов"
        errorMessage="Не удалось загрузить рекомендуемые курсы"
        initialLimit={2}
      >
        {recommendedCourses.map((course) => (
          <CourseCard
            key={course.courseId}
            course={course}
            onStartLearning={() => router.push(`/course/${course.courseId}`)}
            onDetails={() => router.push(`/course/${course.courseId}`)}
          />
        ))}
      </CoursesWrapper>
    </Container>
  );
}
