"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { LessonCard } from "@/widgets/Courses/LessonCard";
import { useRouter } from "next/navigation";
import { courseApi } from "@/entities/course/api/course.api";
import type { Course } from "@/entities/course/model/types";
import { LeaderboardWidget } from "@/widgets/community/LeaderboardWidget";

const LAST_LESSON_STORAGE_KEY = "last_lesson";

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

export default function Home() {
  const auth = useAuth();
  const router = useRouter();

  const [courses, setCourses] = useState<Course[]>([]);
  const [lastLessons, setLastLessons] = useState<LastLessonData[]>([]);
  const [coursesLoading, setCoursesLoading] = useState(true);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [coursesError, setCoursesError] = useState(false);
  const [lessonsError, setLessonsError] = useState(false);

  const handleStart = () => {
    if (auth.isAuth) {
      router.push("/courses");
    } else {
      router.replace("/login");
    }
  };

  // Функция для очистки дублирующихся уроков (по одному на курс)
  const cleanupDuplicateLessons = (lessonsMap: Record<string, LastLessonData>): Record<string, LastLessonData> => {
    const cleaned: Record<string, LastLessonData> = {};
    
    // Для каждого курса оставляем только последний урок (с максимальным timestamp)
    for (const courseId in lessonsMap) {
      const lesson = lessonsMap[courseId];
      
      // Если для этого курса еще нет урока, добавляем
      if (!cleaned[courseId]) {
        cleaned[courseId] = lesson;
      } else {
        // Если уже есть, сравниваем timestamp и оставляем более новый
        if (lesson.timestamp > cleaned[courseId].timestamp) {
          cleaned[courseId] = lesson;
        }
      }
    }
    
    return cleaned;
  };

  // Функция для проверки, что уроки действительно уникальны по названиям и ID
  const validateAndCleanLessons = (lessonsMap: Record<string, LastLessonData>): Record<string, LastLessonData> => {
    const validated: Record<string, LastLessonData> = {};
    const seenLessonKeys = new Set<string>();
    
    for (const courseId in lessonsMap) {
      const lesson = lessonsMap[courseId];
      
      // Создаем уникальный ключ урока (курс + название урока + название модуля)
      const lessonKey = `${lesson.courseId}-${lesson.lessonName}-${lesson.moduleName}`;
      
      // Если такой урок уже был, проверяем timestamp
      if (seenLessonKeys.has(lessonKey)) {
        // Ищем существующий урок с таким же ключом
        const existingCourseId = Object.keys(validated).find(
          (id) => `${validated[id].courseId}-${validated[id].lessonName}-${validated[id].moduleName}` === lessonKey
        );
        
        if (existingCourseId) {
          const existingLesson = validated[existingCourseId];
          // Оставляем более новый по времени
          if (lesson.timestamp > existingLesson.timestamp) {
            validated[existingCourseId] = lesson;
          }
        }
      } else {
        seenLessonKeys.add(lessonKey);
        validated[courseId] = lesson;
      }
    }
    
    return validated;
  };

  // Загрузка сохраненных уроков из localStorage
const loadLastLessons = () => {
  try {
    setLessonsLoading(true);
    setLessonsError(false);

    const saved = localStorage.getItem(LAST_LESSON_STORAGE_KEY);
    if (saved) {
      let lessonsMap: Record<string, LastLessonData> = JSON.parse(saved);
      
      // Фильтруем уроки по текущему пользователю
      const currentUserId = auth.user?.userId; // или из useAuth
      if (currentUserId) {
        // Оставляем только уроки текущего пользователя
        lessonsMap = Object.fromEntries(
          Object.entries(lessonsMap).filter(
            ([_, lesson]) => lesson.userId === currentUserId
          )
        );
      } else {
        // Если пользователь не авторизован, очищаем все
        lessonsMap = {};
      }
      
      // Шаг 1: Очищаем дубликаты по курсам (оставляем только последний урок на курс)
      lessonsMap = cleanupDuplicateLessons(lessonsMap);
      
      // Шаг 2: Дополнительная валидация по названиям уроков и модулей
      lessonsMap = validateAndCleanLessons(lessonsMap);
      
      // Сохраняем очищенные данные обратно в localStorage
      localStorage.setItem(LAST_LESSON_STORAGE_KEY, JSON.stringify(lessonsMap));
      
      // Преобразуем объект в массив и сортируем по времени (сначала новые)
      const lessonsArray = Object.values(lessonsMap).sort(
        (a, b) => b.timestamp - a.timestamp
      );
      setLastLessons(lessonsArray);
    } else {
      setLastLessons([]);
    }
  } catch (err) {
    console.error("Failed to load last lessons:", err);
    setLessonsError(true);
  } finally {
    setLessonsLoading(false);
  }
};

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      setCoursesLoading(true);
      setCoursesError(false);

      const response = await courseApi.getCourses(0, 4);
      setCourses(response.items);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCoursesError(true);
    } finally {
      setCoursesLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
    loadLastLessons();
  }, []);

  const handleStartLearning = (courseId: string) => {
    if (auth.isAuth) {
      router.push(`/course/${courseId}?startLearn=true`);
    } else {
      router.push("/login");
    }
  };

  const handleDetails = (courseId: string) => {
    router.push(`/course/${courseId}`);
  };

  const handleRetryCourses = () => {
    fetchCourses();
  };

  const handleRetryLessons = () => {
    loadLastLessons();
  };

  const handleContinueLesson = (lessonUrl: string) => {
    if (auth.isAuth) {
      router.push(lessonUrl);
    } else {
      router.push("/login");
    }
  };

  const hasLastLessons = lastLessons.length > 0 && !lessonsLoading;

  return (
    <Container>
      {/* Hero секция */}
      <div className="relative bg-linear-to-r from-primary mb-10 via-primary/80 to-primary/4 h-100 text-white p-5 rounded-[40px] text-[20px] leading-none flex flex-col items-start justify-between overflow-hidden">
        <div className="flex flex-col gap-5 max-w-1/2 z-10">
          <h1 className="font-semibold text-[40px]">
            Создавай игры, сайты и приложения — а не просто смотри уроки
          </h1>
          <p className="opacity-80">
            Начни путь в IT уже сейчас: программирование, дизайн и разработка —
            через практику и реальные проекты
          </p>
        </div>
        {!auth.isAuth && (
          <Button
            className="text-[20px] bg-white text-primary z-10"
            size="lg"
            onClick={handleStart}
          >
            Начать обучение
          </Button>
        )}

        <img
          src="/zenko.png"
          alt="змея"
          className="absolute right-0 top-0 h-full object-contain z-0"
        />
      </div>

      {/* Блок "Продолжить обучение" - показываем только если есть сохраненные уроки */}
      {(hasLastLessons && auth.isAuth) && (
        <div className="flex flex-col gap-20 mb-20">
          <CoursesWrapper
            title="Продолжите, где остановились"
            loading={lessonsLoading}
            error={lessonsError}
            onRetry={handleRetryLessons}
            emptyMessage="Нет сохраненных уроков"
            errorMessage="Не удалось загрузить сохраненные уроки"
            initialLimit={2}
          >
            {lastLessons.map((lesson) => (
              <LessonCard
                key={`${lesson.courseId}-${lesson.lessonId}`}
                courseId={lesson.courseId}
                courseSlug={lesson.courseSlug}
                courseName={lesson.courseName}
                moduleId={lesson.moduleId}
                moduleSlug={lesson.moduleSlug}
                moduleName={lesson.moduleName}
                lessonId={lesson.lessonId}
                lessonSlug={lesson.lessonSlug}
                lessonName={lesson.lessonName}
                timestamp={lesson.timestamp}
                onContinue={handleContinueLesson}
              />
            ))}
          </CoursesWrapper>
        </div>
      )}

      <div className="mb-20">
        <LeaderboardWidget/>
      </div>

      {/* Курсы */}
      <div className="flex flex-col gap-20">
        <CoursesWrapper
          title="Наши курсы"
          loading={coursesLoading}
          error={coursesError}
          onRetry={handleRetryCourses}
          emptyMessage="Курсы временно недоступны"
          errorMessage="Не удалось загрузить курсы"
          initialLimit={2}
        >
          {courses.map((course) => (
            <CourseCard
              key={course.courseId}
              course={course}
              onStartLearning={handleStartLearning}
              onDetails={handleDetails}
            />
          ))}
        </CoursesWrapper>
      </div>
    </Container>
  );
}
