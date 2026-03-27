"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

interface CoursesWrapperProps {
  children: React.ReactNode;
  initialLimit?: number; // количество курсов для отображения по умолчанию
  title?: string;
}

export const CoursesWrapper = ({
  children,
  initialLimit = 2,
  title = "Заголовок",
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
          Показать все ({totalCourses})
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
