// app/course/[course_slug]/module/[module_slug]/components/ModuleContent.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { courseApi } from "@/entities/course/api/course.api";
import { moduleApi } from "@/entities/module/api/module.api";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { useAuth } from "@/features/auth/useAuth";
import { ChevronLeft, ChevronRight, Lock, AlertCircle } from "lucide-react";
import type { CourseTree, Course } from "@/entities/course/model/types";
import type { LessonShort } from "@/entities/module/model/types";
import type { ModuleExamResponse } from "@/entities/module/model/types";
import { log } from "console";

export default function ModulePage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;

  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [lessons, setLessons] = useState<LessonShort[]>([]);
  const [examId, setExamId] = useState<string | null>(null);
  const [examAccessible, setExamAccessible] = useState<boolean>(false);
  const [courseName, setCourseName] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [moduleDescription, setModuleDescription] = useState<string>("");
  const [recommendedCourses, setRecommendedCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [recommendedLoading, setRecommendedLoading] = useState(true);
  const [recommendedError, setRecommendedError] = useState(false);
  const [error, setError] = useState<string | null>(null);


  document.title="Доки Доки | Модуль " + moduleName;

  const { isAuth } = useAuth();

  // Находим текущий модуль и его индекс
  const currentModuleIndex = courseTree?.modules.findIndex(
    (module) => module.moduleId === moduleSlug,
  );
  const currentModule =
    currentModuleIndex !== undefined && currentModuleIndex !== -1
      ? courseTree?.modules[currentModuleIndex]
      : null;

  // Проверяем, доступен ли текущий модуль
  const isModuleUnlocked = currentModule?.unlocked !== false;

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

  // Загрузка структуры курса (для навигации между модулями)
  useEffect(() => {
    const fetchCourseTree = async () => {
      if (!courseSlug) return;

      try {
        setLoading(true);
        setError(null);
        
        const data = await courseApi.getTree(courseSlug, isAuth);
        setCourseTree(data);
        setCourseName(data.name);
        
        // Находим текущий модуль в дереве
        const module = data.modules.find(m => m.moduleId === moduleSlug);
        if (module) {
          setModuleName(module.name);
          setExamId(module.examId);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching course tree:", err);
        setError("Не удалось загрузить структуру курса");
        setLoading(false);
      }
    };

    fetchCourseTree();
  }, [courseSlug, moduleSlug, isAuth]);

  // Проверка доступности экзамена
  useEffect(() => {
    const checkExamAccessibility = async () => {
      if (!moduleSlug || !examId || !isAuth) return;
      
      try {
        const examInfo = await moduleApi.getExam(moduleSlug);
        console.log(examInfo);
        setExamAccessible(examInfo.unlocked === true);
      } catch (err) {
        console.error("Error checking exam accessibility:", err);
        setExamAccessible(false);
      }
    };

    checkExamAccessibility();
  }, [moduleSlug, examId, isAuth]);

  // Загрузка уроков модуля
  useEffect(() => {
    const fetchLessons = async () => {
      if (!moduleSlug) return;

      try {
        setLessonsLoading(true);
        
        const data = await moduleApi.getLessons(moduleSlug, isAuth);
        setLessons(data.items);
        
        // Также получаем детальную информацию о модуле для описания
        try {
          const moduleData = await moduleApi.getModule(moduleSlug);
          setModuleDescription(moduleData.description);
        } catch (err) {
          console.error("Error fetching module details:", err);
        }
        
        setLessonsLoading(false);
      } catch (err) {
        console.error("Error fetching lessons:", err);
        setLessonsLoading(false);
      }
    };

    fetchLessons();
  }, [moduleSlug, isAuth]);

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

  // Получаем первый доступный урок модуля
  const getFirstAvailableLessonUrl = () => {
    if (!lessons || lessons.length === 0) return null;
    
    // Ищем первый доступный урок
    for (const lesson of lessons) {
      if (lesson.unlocked !== false) {
        return `/course/${courseSlug}/module/${moduleSlug}/lesson/${lesson.lessonId}`;
      }
    }
    return null;
  };

  // Проверяем, есть ли доступные уроки
  const hasAvailableLessons = () => {
    if (!lessons) return false;
    return lessons.some(lesson => lesson.unlocked !== false);
  };

  // Обработчик кнопки "Начать модуль"
  const handleStartModule = () => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    if (!isModuleUnlocked) {
      setError("Этот модуль пока недоступен. Пройдите предыдущие модули.");
      return;
    }

    const firstAvailableLessonUrl = getFirstAvailableLessonUrl();
    if (firstAvailableLessonUrl) {
      router.push(firstAvailableLessonUrl);
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
    { label: courseName || "Загрузка...", href: `/course/${courseSlug}` },
    { label: moduleName || "Загрузка..." },
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

  const isLoading = loading || lessonsLoading;

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

  const showExamWarning = examId && !examAccessible && isAuth && isModuleUnlocked;

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

      {/* Hero секция */}
      <div className={`flex flex-col items-start mt-5 gap-10 rounded-[40px] p-5 text-white text-[20px] ${
        isModuleUnlocked ? "bg-primary" : "bg-gray-500"
      }`}>
        <div>
          <span className="text-[24px] opacity-60">
            Модуль{" "}
            {currentModuleIndex !== undefined ? currentModuleIndex + 1 : ""}
            {!isModuleUnlocked && " (заблокирован)"}
          </span>
          <h1 className="text-[40px] leading-none font-semibold">
            {moduleName}
          </h1>
        </div>
        <div className="flex flex-col gap-2">
          <span className="opacity-60">Описание</span>
          <p className="leading-none">
            {moduleDescription || "Описание модуля будет добавлено позже"}
          </p>
        </div>
        <Button
          size="lg"
          className={`font-normal ${
            isModuleUnlocked 
              ? "bg-white text-primary" 
              : "bg-gray-300 text-gray-600 cursor-not-allowed"
          }`}
          onClick={handleStartModule}
          disabled={!isModuleUnlocked || lessons.length === 0 || !hasAvailableLessons()}
        >
          {!isAuth 
            ? "Войти для обучения" 
            : !isModuleUnlocked 
              ? "Модуль заблокирован" 
              : !hasAvailableLessons() 
                ? "Нет доступных уроков" 
                : "Начать модуль"}
        </Button>
      </div>

      {/* Структура модуля */}
      <div className="space-y-6 mt-10">
        <div>
          <h2 className="font-semibold text-2xl mb-2">Уроки модуля</h2>
          <p className="text-gray-600">
            {lessons.length} уроков
            {examId && ", итоговый экзамен"}
          </p>
        </div>

        {/* Список уроков */}
        <div className="space-y-5 mb-20">
          <div className="border rounded-[40px] overflow-hidden">
            <div className="divide-y">
              {lessons.map((lesson, lessonIndex) => {
                const isLessonUnlocked = lesson.unlocked !== false && isModuleUnlocked;
                
                return (
                  <div
                    key={lesson.lessonId}
                    className={`px-5 py-4 transition-colors ${
                      isLessonUnlocked ? "hover:bg-gray-50" : "opacity-60"
                    }`}
                  >
                    {isAuth && isLessonUnlocked ? (
                      <Link
                        href={`/course/${courseSlug}/module/${moduleSlug}/lesson/${lesson.lessonId}`}
                        className="text-gray-700  flex items-center gap-2"
                      >
                        <span className="font-medium hover:text-blue-600 hover:underline transition-colors">
                          Урок {lessonIndex + 1}. {lesson.name}
                        </span>
   
                        {lesson.quizId && (
                          <span className="text-xs text-gray-400 ml-2">+ Тест</span>
                        )}
                        {lesson.taskId && (
                          <span className="text-xs text-gray-400 ml-2">+ Задание</span>
                        )}
                      </Link>
                    ) : (
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="font-medium">
                          Урок {lessonIndex + 1}.
                        </span>
                        <span>{lesson.name}</span>
                        {!isLessonUnlocked && (
                          <Lock className="w-4 h-4 text-gray-400 ml-2" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {/* Экзамен модуля */}
              {examId && (
                <div className={`px-5 py-4 transition-colors border-t border-gray-100 ${
                  isModuleUnlocked && examAccessible ? "hover:bg-gray-50" : ""
                }`}>
                  {isAuth && isModuleUnlocked && examAccessible ? (
                    <Link
                      href={`/course/${courseSlug}/module/${moduleSlug}/exam`}
                      className="text-gray-700 hover:text-blue-600 hover:underline transition-colors flex items-center gap-2"
                    >
                      <span className="font-medium">Итоговый экзамен</span>
                    </Link>
                  ) : (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-gray-700">
                        <span className="font-medium">Итоговый экзамен</span>
                        {!isModuleUnlocked && <Lock className="w-4 h-4 text-gray-400" />}
                        {showExamWarning && (
                          <AlertCircle className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                      {showExamWarning && (
                        <span className="text-xs text-yellow-600">
                          Пройдите все уроки модуля
                        </span>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
          
          {/* Навигация между модулями */}
          <div className="flex justify-between gap-4">
            <Button
              variant="outline"
              size="lg"
              onClick={handlePrevModule}
              disabled={!prevModule}
              className="flex-1 text-[16px]"
            >
              <ChevronLeft className="w-5 h-5" />
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
                : "Следующий модуль"}
              <ChevronRight className="w-5 h-5" />
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