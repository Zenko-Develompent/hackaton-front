// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/components/LessonContent.tsx
'use client';

import { useParams } from 'next/navigation';

export default function LessonContent() {
  const params = useParams();
  

  const course_slug = params.course_slug;
  const module_slug = params.module_slug;
  const lesson_slug = params.lesson_slug;
  
  console.log('Params from useParams:', params);
  
  return (
    <div>
      <p>Course: {course_slug}</p>
      <p>Module: {module_slug}</p>
      <p>Lesson: {lesson_slug}</p>
    </div>
  );
}