"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { useRouter } from "next/navigation";
import { courseApi } from "@/entities/course/api/course.api";
import type { Course } from "@/entities/course/model/types";
import { mockCourses } from "@/entities/mockData";



export default function Home() {

  document.title="Доки Доки | Главная"
  const auth = useAuth();
  const router = useRouter();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const handleStart = () => {
    if (auth.isAuth) {
      router.push("/courses");
    } else {
      router.replace("/login");
    }
  };

  // Загрузка курсов
  const fetchCourses = async () => {
    try {
      setLoading(true);
      setError(false);
      

      const response = await courseApi.getCourses(0, 4);
      console.log(response)
      setCourses(response.items);
      
      
    } catch (err) {
      console.error("Error fetching courses:", err);
      setError(true);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleStartLearning = (courseId: string) => {
    console.log("Start learning course:", courseId);
    if (auth.isAuth) {
      router.push(`/course/${courseId}?start=true`);
    } else {
      router.push("/login");
    }
  };

  const handleDetails = (courseId: string) => {
    console.log("Show details for course:", courseId);
    router.push(`/course/${courseId}`);
  };

  const handleRetry = () => {
    fetchCourses();
  };

  return (
    <Container>
      {/* Hero секция */}
      <div className="relative bg-linear-to-r from-primary mb-10 via-primary/80 to-primary/4 h-100 text-white p-5 rounded-[40px] text-[20px] leading-none flex flex-col items-start justify-between overflow-hidden">
        <div className="flex flex-col gap-5 max-w-1/2 z-10">
          <h1 className="font-semibold text-[40px]">
            Создавай игры, сайты и приложения — а не просто смотри уроки
          </h1>
          <p className="opacity-80 ">
            Начни путь в IT уже сейчас: программирование, дизайн и разработка —
            через практику и реальные проекты
          </p>
        </div>
        <Button
          className="text-[20px] bg-white text-primary z-10"
          size="lg"
          onClick={() => handleStart()}
        >
          Начать обучение
        </Button>

        <img
          src="/zenko.png"
          alt="змея"
          className="absolute right-0 top-0 h-full object-contain z-0"
        />
      </div>

      {/* Курсы */}
      <div className="flex flex-col gap-20">
        <CoursesWrapper
          title="Наши курсы"
          loading={loading}
          error={error}
          onRetry={handleRetry}
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