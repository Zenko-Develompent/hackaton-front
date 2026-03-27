import { Button } from "@/components/ui/button";
import { ProgressBar } from "@/shared/ui/ProgressBar";
import Link from "next/link";
import type { Course } from "../model/types";

interface CourseCardProps {
  course: Course;
  onStartLearning?: (courseId: string) => void;
  onDetails?: (courseId: string) => void;
}

export const CourseCard = ({ 
  course, 
  onStartLearning, 
  onDetails 
}: CourseCardProps) => {
  const handleStartLearning = () => {
    onStartLearning?.(course.courseId);
  };

  const handleDetails = () => {
    onDetails?.(course.courseId);
  };

  return (
    <div className="flex gap-10 flex-col p-5 justify-center w-full transition-colors bg-primary/4 hover:bg-primary/8 rounded-[40px] cursor-pointer">
      <div className="flex justify-between gap-6">
        <div className="flex flex-col gap-3 flex-3">
          <h3 className="font-semibold text-2xl line-clamp-2">
            {course.name}
          </h3>
          <p className="opacity-60 line-clamp-2">
            {course.description}
          </p>
          <div className="flex gap-4 mt-2">
            <span className="text-sm opacity-60">
              📚 {course.moduleCount} модулей
            </span>
            <span className="text-sm opacity-60">
              📖 {course.lessonCount} уроков
            </span>
            <span className="text-sm opacity-60">
              🏷️ {course.category}
            </span>
          </div>
        </div>
        
        {course.imageUrl && (
          <img
            className="flex-1 aspect-square rounded-[20px] bg-primary/4 object-cover max-w-[200px]"
            src={course.imageUrl}
            alt={course.name}
          />
        )}
      </div>

      <div className="flex flex-col gap-4">
        {/* ProgressBar скрыт */}
        {/* <ProgressBar progress={40} /> */}
        
        <div className="flex gap-2">
          <Button
            size="lg"
            variant="outline"
            className="flex-1 text-[16px] bg-primary/8 text-primary hover:bg-primary/16"
            onClick={handleDetails}
          >
            Подробнее
          </Button>
          <Button 
            size="lg" 
            className="flex-1 text-[16px]"
            onClick={handleStartLearning}
          >
            Начать обучение
          </Button>
        </div>
      </div>
    </div>
  );
};