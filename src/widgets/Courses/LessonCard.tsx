// widgets/Courses/LessonCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Play, BookOpen, Clock } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface LessonCardProps {
  courseId: string;
  courseSlug: string;
  courseName: string;
  moduleId: string;
  moduleSlug: string;
  moduleName: string;
  lessonId: string;
  lessonSlug: string;
  lessonName: string;
  timestamp?: number;
  progress?: number; // прогресс урока в процентах (опционально)
  onContinue?: (lessonUrl: string) => void;
}

export const LessonCard = ({
  courseId,
  courseSlug,
  courseName,
  moduleId,
  moduleSlug,
  moduleName,
  lessonId,
  lessonSlug,
  lessonName,
  timestamp,
  progress,
  onContinue,
}: LessonCardProps) => {
  const router = useRouter();
  
  const lessonUrl = `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`;
  
  const handleContinue = () => {
    if (onContinue) {
      onContinue(lessonUrl);
    } else {
      router.push(lessonUrl);
    }
  };
  
  // Форматирование даты последнего открытия
  const formattedDate = timestamp
    ? new Date(timestamp).toLocaleDateString("ru-RU", {
        day: "numeric",
        month: "long",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="flex flex-col gap-8 p-5 w-full transition-colors bg-primary/4 hover:bg-primary/8 rounded-[40px] cursor-pointer border border-[#6737FF]/0 hover:border-[#6737FF]/80">
      <div className="flex justify-between gap-4">
        <div className="flex-1">
          {/* Заголовок курса */}
          <Link 
            href={`/course/${courseSlug}`}
            className="text-sm text-primary hover:underline mb-2 inline-block"
          >
            {courseName}
          </Link>
          
          {/* Название урока */}
          <h3 className="font-semibold text-xl line-clamp-2 mb-2">
            {lessonName}
          </h3>
          
          {/* Модуль */}
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">

            <span>{moduleName}</span>
          </div>
          
          {/* Дополнительная информация */}
          <div className="flex flex-wrap gap-2 mt-2">
            {progress !== undefined && (
              <div className="flex items-center gap-2">
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{progress}%</span>
              </div>
            )}

          </div>
        </div>

      </div>
      
      {/* Кнопка продолжения */}
      <Button
        size="lg"
        className="w-full text-[16px] bg-[#6737FF] hover:bg-[#6737FF]/90 gap-2"
        onClick={handleContinue}
      >
        Продолжить обучение
      </Button>
    </div>
  );
};