// app/course/[course_slug]/module/[module_slug]/components/ModuleContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { courseApi } from "@/entities/course/api/course.api";
import type { CourseTree, Course } from "@/entities/course/model/types";
import { mockCourseTree, mockCourses } from "@/entities/mockData";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { useAuth } from "@/features/auth/useAuth";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;

  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuth } = useAuth();

  // Находим текущий модуль и его индекс
  const currentModuleIndex = courseTree?.modules.findIndex(
    (module) => module.moduleId === moduleSlug,
  );
  const currentModule =
    currentModuleIndex !== undefined && currentModuleIndex !== -1
      ? courseTree?.modules[currentModuleIndex]
      : null;

  // Находим предыдущий и следующий модули
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

  // Получаем первый урок модуля
  const getFirstLessonUrl = () => {
    if (!currentModule || currentModule.lessons.length === 0) return null;

    const firstLesson = currentModule.lessons[0];
    return `/course/${courseSlug}/module/${moduleSlug}/lesson/${firstLesson.lessonId}`;
  };

  // Обработчик кнопки "Начать модуль"
  const handleStartModule = () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const firstLessonUrl = getFirstLessonUrl();
    if (firstLessonUrl) {
      router.push(firstLessonUrl);
    }
  };

  // Обработчики навигации по модулям
  const handlePrevModule = () => {
    if (prevModule) {
      router.push(`/course/${courseSlug}/module/${prevModule.moduleId}`);
    }
  };

  const handleNextModule = () => {
    if (nextModule) {
      router.push(`/course/${courseSlug}/module/${nextModule.moduleId}`);
    }
  };

  // Формируем хлебные крошки
  const breadcrumbItems = [
    { label: courseTree?.name || "Загрузка...", href: `/course/${courseSlug}` },
    { label: currentModule?.name || "Загрузка..." },
  ];

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

  if (loading) {
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

  if (error || !courseTree || !currentModule) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 mb-4">{error || "Модуль не найден"}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

      {/* Hero секция */}
      <div className="flex flex-col items-start mt-5 gap-10 rounded-[40px] p-5 bg-primary text-white text-[20px]">
        <div>
          <span className="text-[24px] opacity-60">
            Модуль{" "}
            {currentModuleIndex !== undefined ? currentModuleIndex + 1 : ""}
          </span>
          <h1 className="text-[40px] leading-none font-semibold">
            {currentModule.name}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <span className="opacity-60">Описание</span>
          <p className="leading-none">
            {mockCourses.items.find((c) => c.courseId === courseSlug)
              ?.description || "Описание модуля будет добавлено позже"}
          </p>
        </div>
        <Button
          size="lg"
          className="bg-white text-primary font-normal"
          onClick={handleStartModule}
        >
          {isAuth ? "Начать модуль" : "Войти для обучения"}
        </Button>
      </div>

      {/* Структура модуля */}
      <div className="space-y-6 mt-10">
        <div>
          <h2 className="font-semibold text-2xl mb-2">Уроки модуля</h2>
          <p className="text-gray-600">
            {currentModule.lessons.length} уроков
            {currentModule.examId && ", итоговый экзамен"}
          </p>
        </div>

        {/* Список уроков */}
        <div className="space-y-5 mb-20">
          <div className="border rounded-[40px] overflow-hidden">
            {/* Список уроков */}
            <div className="divide-y">
              {currentModule.lessons.map((lesson, lessonIndex) => (
                <div
                  key={lesson.lessonId}
                  className="px-5 py-4 hover:bg-gray-50 transition-colors"
                >
                  {isAuth ? (
                    <Link
                      href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${lesson.lessonId}`}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <span className="font-medium">
                        Урок {lessonIndex + 1}.
                      </span>
                      <span>{lesson.name}</span>
                    </Link>
                  ) : (
                    <span
                      className="text-gray-700 cursor-pointer hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                      onClick={() => router.push("/login")}
                    >
                      <span className="font-medium">
                        Урок {lessonIndex + 1}.
                      </span>
                      <span>{lesson.name}</span>
                    </span>
                  )}
                </div>
              ))}

              {/* Экзамен модуля */}
              {currentModule.examId && (
                <div className="px-5 py-4 hover:bg-gray-50 transition-colors border-t border-gray-100">
                  {isAuth ? (
                    <Link
                      href={`/course/${courseSlug}/module/${moduleSlug}/exam/${currentModule.examId}`}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <span className="font-medium">Итоговый экзамен</span>
                    </Link>
                  ) : (
                    <span
                      className="text-gray-700 cursor-pointer hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                      onClick={() => router.push("/login")}
                    >
                      <span className="font-medium">Итоговый экзамен</span>
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {/* Навигация между модулями */}
          <div className="flex justify-between gap-4 mb-20">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevModule}
              disabled={!prevModule}
              className="flex-1 text-[16px]"
            >
              <ChevronLeft/>
              {prevModule
                ? `Предыдущий: ${prevModule.name}`
                : "Предыдущий модуль"}
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleNextModule}
              disabled={!nextModule}
              className="flex-1 text-[16px]"
            >
              {nextModule
                ? `Следующий: ${nextModule.name}`
                : "Следующий модуль"}{" "}
              <ChevronRight/>
            </Button>
          </div>
        </div>
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
