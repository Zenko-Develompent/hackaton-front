// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/components/LessonContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { useAuth } from "@/features/auth/useAuth";
import { mockCourseTree, mockCourses, mockLessons } from "@/entities/mockData";
import type { Lesson } from "@/entities/lesson/model/types";
import type { CourseTree } from "@/entities/course/model/types";
import type { Course } from "@/entities/course/model/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import "highlight.js/styles/github-dark.css";

import CoinIconWhite from "@/shared/assets/icons/CoinVerticalWhite.svg";

import { useRef } from "react";
import hljs from "highlight.js";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;
  const lessonSlug = params.lesson_slug as string;

  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonLoading, setLessonLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuth } = useAuth();

  // Находим текущий модуль, урок и индексы
  const currentModuleIndex = courseTree?.modules.findIndex(
    (module) => module.moduleId === moduleSlug,
  );
  const currentModule =
    currentModuleIndex !== undefined && currentModuleIndex !== -1
      ? courseTree?.modules[currentModuleIndex]
      : null;

  const currentLessonIndex = currentModule?.lessons.findIndex(
    (lesson) => lesson.lessonId === lessonSlug,
  );
  const currentLesson =
    currentLessonIndex !== undefined && currentLessonIndex !== -1
      ? currentModule?.lessons[currentLessonIndex]
      : null;

  // Находим предыдущий и следующий уроки
  const prevLesson =
    currentLessonIndex !== undefined && currentLessonIndex > 0
      ? currentModule?.lessons[currentLessonIndex - 1]
      : null;
  const nextLesson =
    currentLessonIndex !== undefined &&
    currentLessonIndex !== -1 &&
    currentModule &&
    currentLessonIndex < currentModule.lessons.length - 1
      ? currentModule?.lessons[currentLessonIndex + 1]
      : null;

  // Находим предыдущий и следующий модули для навигации
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

  // Загрузка структуры курса
  useEffect(() => {
    const fetchCourseTree = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        setError(null);

        setTimeout(() => {
          setCourseTree(mockCourseTree);
          setLoading(false);
        }, 500);
      } catch (err) {
        console.error("Error fetching course tree:", err);
        setError("Не удалось загрузить структуру курса");
        setLoading(false);
      }
    };

    fetchCourseTree();
  }, [courseSlug]);

  // Загрузка урока
  useEffect(() => {
    const fetchLesson = async () => {
      if (!lessonSlug) return;

      try {
        setLessonLoading(true);

        setTimeout(() => {
          const lessonData = mockLessons[lessonSlug];
          setLesson(lessonData || null);
          setLessonLoading(false);
        }, 300);
      } catch (err) {
        console.error("Error fetching lesson:", err);
        setLessonLoading(false);
      }
    };

    fetchLesson();
  }, [lessonSlug]);

  // Загрузка рекомендуемых курсов
  const fetchRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      setRecommendedError(false);

      setTimeout(() => {
        const filteredCourses = mockCourses.items.filter(
          (course) => course.courseId !== courseSlug,
        );
        setRecommendedCourses(filteredCourses.slice(0, 4));
        setRecommendedLoading(false);
      }, 300);
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
    { label: currentLesson?.name || "Загрузка..." },
  ];

  // Обработчики навигации
  const handlePrevLesson = () => {
    if (prevLesson) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${prevLesson.lessonId}`,
      );
    } else if (prevModule) {
      const lastLessonOfPrevModule =
        prevModule.lessons[prevModule.lessons.length - 1];
      router.push(
        `/course/${courseSlug}/module/${prevModule.moduleId}/lesson/${lastLessonOfPrevModule.lessonId}`,
      );
    }
  };

  const handleNextLesson = () => {
    if (nextLesson) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${nextLesson.lessonId}`,
      );
    } else if (nextModule) {
      const firstLessonOfNextModule = nextModule.lessons[0];
      router.push(
        `/course/${courseSlug}/module/${nextModule.moduleId}/lesson/${firstLessonOfNextModule.lessonId}`,
      );
    }
  };

  const handleStartQuiz = () => {
    if (lesson?.quizId) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}/quiz`,
      );
    }
  };

  const handleStartTask = () => {
    if (lesson?.taskId) {
      router.push(
        `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}/task`,
      );
    }
  };

  // Обработчики для карточек курсов
  const handleStartCourse = (courseId: string) => {
    if (!isAuth) {
      router.push("/login");
      return;
    }
    router.push(`/course/${courseId}`);
  };

  const handleDetails = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleRetryRecommended = () => {
    fetchRecommendedCourses();
  };

  if (loading || lessonLoading) {
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

  if (error || !courseTree || !currentModule || !currentLesson || !lesson) {
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

  // Компонент для подсветки кода
  const CodeBlock = ({ inline, className, children, ...props }: any) => {
    const codeRef = useRef<HTMLElement>(null);
    const match = /language-(\w+)/.exec(className || "");
    const language = match ? match[1] : "";
    const codeString = String(children).replace(/\n$/, "");

    useEffect(() => {
      if (codeRef.current && !inline && language) {
        hljs.highlightElement(codeRef.current);
      }
    }, [codeString, language, inline]);

    if (!inline && language) {
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

    if (!inline) {
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
      <div className="relative flex flex-col items-start mt-5 gap-6 rounded-[40px] p-5 bg-[#35BCFF] text-white">
        <div>
          <span className="text-[20px] opacity-60">
            Урок{" "}
            {currentLessonIndex !== undefined ? currentLessonIndex + 1 : ""}
          </span>
          <h1 className="text-[40px] leading-none font-semibold mt-2">
            {lesson.name}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <p className="text-white/80 text-[18px]">{lesson.description}</p>
        </div>
        <div className="flex gap-3">
          {lesson.quizId && (
            <Button
              size="lg"
              variant="outline"
              className="bg-0 text-white font-normal "
              onClick={handleStartQuiz}
            >
              Пройти тест
            </Button>
          )}
          {lesson.taskId && (
            <Button
              size="lg"
              variant="outline"
              className="bg-0 text-white font-normal "
              onClick={handleStartTask}
            >
              Выполнить задание
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
            onStartLearning={handleStartCourse}
            onDetails={handleDetails}
          />
        ))}
      </CoursesWrapper>
    </Container>
  );
}
