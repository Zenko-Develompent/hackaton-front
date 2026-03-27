"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton"; // предположим, что у вас есть компонент Skeleton

interface CoursesWrapperProps {
  children: React.ReactNode;
  initialLimit?: number;
  title?: string;
  loading?: boolean;
  error?: boolean;
  onRetry?: () => void;
  emptyMessage?: string;
  errorMessage?: string;
}

export const CoursesWrapper = ({
  children,
  initialLimit = 2,
  title = "Заголовок",
  loading = false,
  error = false,
  onRetry,
  emptyMessage = "Курсы не найдены",
  errorMessage = "Не удалось загрузить курсы",
}: CoursesWrapperProps) => {
  const [showAll, setShowAll] = useState(false);

  // Преобразуем children в массив
  const coursesArray = Array.isArray(children) ? children : [children];
  const totalCourses = coursesArray.length;

  // Определяем, какие курсы показывать
  const displayedCourses = showAll
    ? coursesArray
    : coursesArray.slice(0, initialLimit);

  const hasMoreCourses = totalCourses > initialLimit;

  // Состояние загрузки
  if (loading) {
    return (
      <div className="flex flex-col gap-10">
        <h2 className="font-semibold text-[32px]">{title}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
          {Array.from({ length: initialLimit }).map((_, index) => (
            <div key={index} className="flex flex-col gap-4">
              <Skeleton className="h-[200px] w-full rounded-xl" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Состояние ошибки
  if (error) {
    return (
      <div className="flex flex-col gap-10">
        <h2 className="font-semibold text-[32px]">{title}</h2>
        <div className="flex flex-col items-center justify-center py-40 bg-primary/4 rounded-[40px] gap-4">
          <div className="text-center">
            <p className="text-red-500 mb-12">{errorMessage}</p>
            {onRetry && (
              <Button
                type="button"
                variant="outline"
                onClick={onRetry}
                size="lg"
                className="text-[16px]"
              >
                Попробовать снова
              </Button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Состояние, когда курсов нет
  if (totalCourses === 0) {
    return (
      <div className="flex flex-col gap-10">
        <h2 className="font-semibold text-[32px]">{title}</h2>
        <div className="flex flex-col items-center justify-center py-40 bg-primary/4 rounded-[40px]">
          <p className="text-gray-500 text-center">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <h2 className="font-semibold text-[32px]">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5">
        {displayedCourses}
      </div>

      {hasMoreCourses && !showAll && (
        <Button
          type="button"
          variant="outline"
          onClick={() => setShowAll(true)}
          size="lg"
          className="w-fit mx-auto text-[16px]"
        >
          Показать ещё
        </Button>
      )}

      {showAll && hasMoreCourses && (
        <Button
          type="button"
          variant="ghost"
          onClick={() => setShowAll(false)}
          size="lg"
          className="w-fit mx-auto text-[16px]"
        >
          Свернуть
        </Button>
      )}
    </div>
  );
};