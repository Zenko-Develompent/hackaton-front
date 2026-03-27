"use client";

import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { CourseCard } from "@/widgets/Courses/CourseCard";
import { CoursesWrapper } from "@/widgets/Courses/CoursesWrapper";
import { useRouter } from "next/navigation";

export default function Home() {
  const auth = useAuth();
  const router = useRouter();
  const handleStart = () => {
    if (auth.isAuth) {
    } else {
      router.replace("/login");
    }
  };

  return (
    <Container>
      <div className="relative bg-linear-to-r from-primary mb-10 via-primary/80 to-primary/4 h-100 text-white p-5 rounded-[40px] text-[20px] leading-none flex flex-col items-start justify-between ">
        <div className="flex flex-col gap-5 max-w-1/2">
          <h1 className="font-semibold text-[40px]">
            Создавай игры, сайты и приложения — а не просто смотри уроки
          </h1>
          <p className="opacity-80">
            Начни путь в IT уже сейчас: программирование, дизайн и разработка —
            через практику и реальные проекты
          </p>
        </div>
        <Button
          className="text-[20px] bg-white text-primary"
          size="lg"
          onClick={() => handleStart()}
        >
          Начать обучение
        </Button>

        <img
          src="/zenko.png"
          alt="змея"
          className="absolute right-0 top-0 h-full"
        />
      </div>

      <div className="flex flex-col gap-10">
        <CoursesWrapper>
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </CoursesWrapper>
        <CoursesWrapper>
          <CourseCard />
          <CourseCard />
          <CourseCard />
          <CourseCard />
        </CoursesWrapper>
      </div>
    </Container>
  );
}
