// app/course/[course_slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { courseApi } from "@/entities/course/api/course.api";
import type { CourseTree, Course } from "@/entities/course/model/types";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { useAuth } from "@/features/auth/useAuth";
import { Lock } from "lucide-react";

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

  // Загрузка структуры курса с учетом авторизации
  useEffect(() => {
    const fetchCourseTree = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        setError(null);

        const response = await courseApi.getTree(courseSlug, isAuth);
        setCourseTree(response);
        setLoading(false);
        
      } catch (err) {
        console.error("Error fetching course tree:", err);
        setError("Не удалось загрузить структуру курса");
        setLoading(false);
      }
    };

    fetchCourseTree();
  }, [courseSlug, isAuth]);

  // Загрузка рекомендуемых курсов
  const fetchRecommendedCourses = async () => {
    try {
      setRecommendedLoading(true);
      setRecommendedError(false);

      const response = await courseApi.getCourses(0, 4);
      const filteredCourses = response.items.filter(
        (course) => course.courseId !== courseSlug
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

  // Получаем первый доступный урок курса
  const getFirstAvailableLessonUrl = () => {
    if (!courseTree || courseTree.modules.length === 0) return null;

    for (const module of courseTree.modules) {
      // Проверяем доступен ли модуль
      if (module.unlocked !== false) {
        for (const lesson of module.lessons) {
          // Проверяем доступен ли урок
          if (lesson.unlocked !== false) {
            return `/course/${courseSlug}/module/${module.moduleId}/lesson/${lesson.lessonId}`;
          }
        }
      }
    }
    return null;
  };

  // Проверяем, есть ли доступные модули
  const hasAvailableModules = () => {
    if (!courseTree) return false;
    return courseTree.modules.some(module => module.unlocked !== false);
  };

  // Обработчик кнопки "Начать обучение"
  const handleStartLearning = () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const firstAvailableLessonUrl = getFirstAvailableLessonUrl();
    if (firstAvailableLessonUrl) {
      router.push(firstAvailableLessonUrl);
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
        <div className="flex flex-col">
          <span className="opacity-60">Описание</span>
          <p className="leading-none">
            {courseTree.description || "Описание курса будет добавлено позже"}
          </p>
        </div>
        <Button
          size="lg"
          className="bg-white text-[#6737FF] font-normal"
          onClick={handleStartLearning}
          disabled={!hasAvailableModules()}
        >
          {!isAuth 
            ? "Войти для обучения" 
            : !hasAvailableModules() 
              ? "Все модули заблокированы" 
              : "Начать обучение"}
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
          {courseTree.modules.map((module, index) => {
            const isModuleUnlocked = module.unlocked !== false;
            const moduleLink = isModuleUnlocked 
              ? `/course/${courseSlug}/module/${module.moduleId}`
              : undefined;
            
            return (
              <div
                key={module.moduleId}
                className={`border rounded-[40px] overflow-hidden ${
                  !isModuleUnlocked ? "opacity-60" : ""
                } ${isModuleUnlocked ? "border-primary" : "border-gray-200"}`}
              >
                {/* Заголовок модуля */}
                <div className={`px-5 py-5 border-b ${
                  isModuleUnlocked 
                    ? "bg-primary text-white" 
                    : "bg-gray-100 text-gray-500"
                }`}>
                  {isAuth && isModuleUnlocked ? (
                    <Link
                      href={moduleLink!}
                      className="text-[24px] font-medium hover:underline transition-colors flex items-center justify-between"
                    >
                      <span>Модуль {index + 1}. {module.name}</span>
                      {!isModuleUnlocked && <Lock className="w-5 h-5" />}
                    </Link>
                  ) : (
                    <span
                      className={`text-[24px] font-medium flex items-center justify-between ${
                        !isModuleUnlocked ? "cursor-not-allowed" : "cursor-pointer"
                      }`}
                      onClick={() => {
                        if (isAuth && isModuleUnlocked) {
                          router.push(moduleLink!);
                        } else if (!isAuth) {
                          router.push("/login");
                        }
                      }}
                    >
                      <span>Модуль {index + 1}. {module.name}</span>
                      {!isModuleUnlocked && <Lock className="w-5 h-5" />}
                    </span>
                  )}
                </div>

                {/* Список уроков */}
                <div className="divide-y">
                  {module.lessons.map((lesson, lessonIndex) => {
                    const isLessonUnlocked = lesson.unlocked !== false && isModuleUnlocked;
                    const lessonLink = isLessonUnlocked 
                      ? `/course/${courseSlug}/module/${module.moduleId}/lesson/${lesson.lessonId}`
                      : undefined;
                    
                    return (
                      <div
                        key={lesson.lessonId}
                        className={`px-5 py-3 pl-10 hover:bg-gray-50 transition-colors ${
                          !isLessonUnlocked ? "opacity-50" : ""
                        }`}
                      >
                        {isAuth && isLessonUnlocked ? (
                          <Link
                            href={lessonLink!}
                            className="text-gray-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                          >
                            <span>Урок {lessonIndex + 1}. {lesson.name}</span>
                          </Link>
                        ) : (
                          <span
                            className={`text-gray-700 flex items-center gap-2 ${
                              isAuth && !isLessonUnlocked
                                ? "cursor-not-allowed"
                                : "cursor-pointer"
                            }`}
                            onClick={() => {
                              if (!isAuth) {
                                router.push("/login");
                              } else if (isLessonUnlocked) {
                                router.push(lessonLink!);
                              }
                            }}
                          >
                            <span>Урок {lessonIndex + 1}. {lesson.name}</span>
                            {!isLessonUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                          </span>
                        )}
                      </div>
                    );
                  })}

                  {/* Экзамен модуля */}
                  {module.examId && (
                    <div className="px-10 py-3 hover:bg-gray-50 transition-colors border-t border-gray-100">
                      {isAuth && isModuleUnlocked ? (
                        <Link
                          href={`/course/${courseSlug}/module/${module.moduleId}/exam`}
                          className="text-primary hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                        >
                          <span className="font-medium">Итоговый экзамен</span>
                        </Link>
                      ) : (
                        <span
                          className={`text-primary flex items-center gap-2 ${
                            !isAuth ? "cursor-pointer" : "cursor-not-allowed"
                          }`}
                          onClick={() => {
                            if (!isAuth) {
                              router.push("/login");
                            }
                          }}
                        >
                          <span className="font-medium">Итоговый экзамен</span>
                          {!isModuleUnlocked && <Lock className="w-4 h-4" />}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
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