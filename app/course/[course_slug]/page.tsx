// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/components/LessonContent.tsx
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

export default function CoursePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;

  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { isAuth } = useAuth();

  // Загрузка структуры курса
  useEffect(() => {
    const fetchCourseTree = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        setError(null);
        // Для реального API:
        // const response = await courseApi.getTree(courseSlug);
        // setCourseTree(response);

        // Используем моковые данные
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

      // Для реального API:
      // const response = await courseApi.getCourses(0, 4);
      // const filteredCourses = response.items.filter(
      //   (course) => course.courseId !== courseSlug
      // );
      // setRecommendedCourses(filteredCourses.slice(0, 4));

      // Используем моковые данные (исключаем текущий курс)
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

  // Получаем первый урок курса
  const getFirstLessonUrl = () => {
    if (!courseTree || courseTree.modules.length === 0) return null;

    const firstModule = courseTree.modules[0];
    if (firstModule.lessons.length === 0) return null;

    const firstLesson = firstModule.lessons[0];
    return `/course/${courseSlug}/module/${firstModule.moduleId}/lesson/${firstLesson.lessonId}`;
  };

  // Обработчик кнопки "Начать обучение"
  const handleStartLearning = () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const firstLessonUrl = getFirstLessonUrl();
    if (firstLessonUrl) {
      router.push(firstLessonUrl);
    }
  };

  // Формируем хлебные крошки
  const breadcrumbItems = [
    { label: courseTree?.name || "Загрузка...", href: `/course/${courseSlug}` },
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

  // Обработчик клика на урок
  const handleLessonClick = (e: React.MouseEvent, url: string) => {
    if (!isAuth) {
      e.preventDefault();
      router.push("/login");
    }
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

  if (error || !courseTree) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 mb-4">{error || "Курс не найден"}</p>
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
      <div className="flex flex-col items-start mt-5 gap-10 rounded-[40px] p-5 bg-[#6737FF] text-white text-[20px]">
        <div>
          <span className="text-[24px] opacity-60">Курс</span>
          <h1 className="text-[40px] leading-none font-semibold">
            {courseTree.name}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <span className="opacity-60">Описание</span>
          <p className="leading-none">
            {mockCourses.items.find((c) => c.courseId === courseSlug)
              ?.description || "Описание курса будет добавлено позже"}
          </p>
        </div>
        <Button
          size="lg"
          className="bg-white text-[#6737FF] font-normal"
          onClick={handleStartLearning}
        >
          {isAuth ? "Начать обучение" : "Войти для обучения"}
        </Button>
      </div>

      {/* Структура курса */}
      <div className="space-y-6 mt-10">
        <div>
          <h2 className="font-semibold text-2xl mb-2">Структура курса</h2>
          <p className="text-gray-600">
            {courseTree.modules.length} модуль
            {courseTree.modules.length !== 1 ? "я" : ""},{" "}
            {courseTree.modules.reduce(
              (total, module) => total + module.lessons.length,
              0,
            )}{" "}
            уроков
          </p>
        </div>

        {/* Список модулей */}
        <div className="space-y-5 mb-20">
          {courseTree.modules.map((module, index) => (
            <div
              key={module.moduleId}
              className="border rounded-[40px] overflow-hidden border-primary "
            >
              {/* Заголовок модуля */}
              <div className="px-5 py-5 border-b bg-primary text-white">
                {isAuth ? (
                  <Link
                    href={`/course/${courseSlug}/module/${module.moduleId}`}
                    className="text-[24px] font-medium hover:text-blue-600 hover:underline transition-colors"
                  >
                    Модуль {index + 1}. {module.name}
                  </Link>
                ) : (
                  <span
                    className="text-lg font-medium cursor-pointer hover:underline transition-colors"
                    onClick={() => router.push("/login")}
                  >
                    Модуль {index + 1}. {module.name}
                  </span>
                )}
              </div>

              {/* Список уроков */}
              <div className="divide-y">
                {module.lessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.lessonId}
                    className="px-5 py-3 pl-10 hover:bg-gray-50 transition-colors"
                  >
                    {isAuth ? (
                      <Link
                        href={`/course/${courseSlug}/module/${module.moduleId}/lesson/${lesson.lessonId}`}
                        className="text-gray-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                      >
                        <span>
                          Урок {lessonIndex + 1}. {lesson.name}
                        </span>
                      </Link>
                    ) : (
                      <span
                        className="text-gray-700 cursor-pointer hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                        onClick={() => router.push("/login")}
                      >
                        <span>
                          Урок {lessonIndex + 1}. {lesson.name}
                        </span>
                      </span>
                    )}
                  </div>
                ))}

                {/* Экзамен модуля */}
                {module.examId && (
                  <div className="px-10 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100">
                    {isAuth ? (
                      <Link
                        href={`/course/${courseSlug}/module/${module.moduleId}/exam/${module.examId}`}
                        className="text-primary hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                      >
                        <span className="font-medium">Итоговый экзамен</span>
                      </Link>
                    ) : (
                      <span
                        className="text-primary cursor-pointer hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                        onClick={() => router.push("/login")}
                      >
                        <span className="font-medium">Итоговый экзамен</span>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
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
