// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/task/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { useAuth } from "@/features/auth/useAuth";
import { useAlert } from "@/features/alert/alert-store";
import { courseApi } from "@/entities/course/api/course.api";
import { moduleApi } from "@/entities/module/api/module.api";
import { lessonApi } from "@/entities/lesson/api/lesson.api";
import { taskApi } from "@/entities/task/api/task.api";
import { TaskRunner, ResultDisplay, ProgressBar } from "@/shared/ui";
import type { LessonTask } from "@/entities/lesson/model/types";
import type { CourseTree } from "@/entities/course/model/types";
import type { LessonShort } from "@/entities/module/model/types";

export default function TaskPage() {
  const params = useParams();
  const router = useRouter();
  const showAlert = useAlert();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;
  const lessonSlug = params.lesson_slug as string;

  const [task, setTask] = useState<LessonTask | null>(null);
  const [courseTree, setCourseTree] = useState<CourseTree | null>(null);
  const [moduleLessons, setModuleLessons] = useState<LessonShort[]>([]);
  const [loading, setLoading] = useState(true);
  const [taskStarted, setTaskStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Названия для хлебных крошек
  const [courseName, setCourseName] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [lessonName, setLessonName] = useState<string>("");

  const { isAuth } = useAuth();

  // Находим текущий модуль и проверяем доступность
  const currentModuleIndex = courseTree?.modules.findIndex(
    (module) => module.moduleId === moduleSlug,
  );
  const currentModule =
    currentModuleIndex !== undefined && currentModuleIndex !== -1
      ? courseTree?.modules[currentModuleIndex]
      : null;

  const isModuleUnlocked = currentModule?.unlocked !== false;

  const currentLessonIndex = moduleLessons.findIndex(
    (lesson) => lesson.lessonId === lessonSlug,
  );
  const currentLessonData = moduleLessons[currentLessonIndex];
  const isLessonUnlocked = currentLessonData?.unlocked !== false && isModuleUnlocked;
  const isTaskUnlocked = isLessonUnlocked && !!task?.taskId;

  // Загрузка данных
  useEffect(() => {
    const fetchData = async () => {
      if (!lessonSlug || !moduleSlug || !courseSlug) return;

      try {
        setLoading(true);
        setError(null);
        
        // Загружаем информацию о задании
        const taskData = await lessonApi.getTask(lessonSlug);
        setTask(taskData);
        
        // Загружаем названия для хлебных крошек
        try {
          const courseTreeData = await courseApi.getTree(courseSlug, isAuth);
          setCourseTree(courseTreeData);
          setCourseName(courseTreeData.name);
          
          const moduleData = await moduleApi.getModule(moduleSlug);
          setModuleName(moduleData.name);
          
          const lessonData = await lessonApi.getLesson(lessonSlug);
          setLessonName(lessonData.name);
          
          // Загружаем уроки модуля для проверки доступности
          const lessonsData = await moduleApi.getLessons(moduleSlug, isAuth);
          setModuleLessons(lessonsData.items);
        } catch (err) {
          console.error("Error fetching names:", err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching task data:", err);
        setError("Не удалось загрузить задание");
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchData();
    } else {
      router.push("/login");
    }
  }, [lessonSlug, moduleSlug, courseSlug, isAuth, router]);

  // Старт задания
  const handleStartTask = async () => {
    if (!task?.taskId) return;

    try {
      const response = await taskApi.start(task.taskId);
      if (response.completed) {
        setCompleted(true);
        showAlert({
          variant: "success",
          title: "Задание уже выполнено",
          description: "Вы уже успешно выполнили это задание",
          autoClose: 3000,
        });
      }
      setTaskStarted(true);
    } catch (err) {
      console.error("Error starting task:", err);
      setError("Не удалось начать задание");
    }
  };

  // Завершение задания
  const handleTaskComplete = (completeResult: any) => {
    setCompleted(true);
    setResult(completeResult);
    showAlert({
      variant: "success",
      title: "Задание выполнено!",
      description: `Вы получили ${completeResult.xpGranted} XP и ${completeResult.coinGranted} монет`,
      autoClose: 5000,
    });
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: "Курсы", href: "/courses" },
    { label: courseName || "Загрузка...", href: `/course/${courseSlug}` },
    { label: moduleName || "Загрузка...", href: `/course/${courseSlug}/module/${moduleSlug}` },
    { label: lessonName || "Загрузка...", href: `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}` },
    { label: "Задание" },
  ];

  if (!isAuth) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-40">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded w-64 mb-4"></div>
            <div className="h-32 bg-gray-200 rounded w-96"></div>
          </div>
        </div>
      </Container>
    );
  }

  // Проверка доступа
  if (!isTaskUnlocked) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
        
        <div className="flex flex-col items-center justify-center py-40 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12m-6 0v-4m0 4h4m-4 0H6m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Задание недоступно
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            {!isModuleUnlocked 
              ? "Этот модуль пока недоступен. Пройдите предыдущие модули, чтобы открыть его."
              : !isLessonUnlocked 
                ? "Этот урок пока недоступен. Пройдите предыдущие уроки, чтобы открыть его."
                : "Задание недоступно. Возможно, вы уже выполнили его или оно не найдено."}
          </p>
          <Button
            onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`)}
          >
            Вернуться к уроку
          </Button>
        </div>
      </Container>
    );
  }

  if (error || !task) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 mb-4">{error || "Задание не найдено"}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  if (completed && result) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
        
        <ResultDisplay
          title="Задание выполнено!"
          message={result.firstCompletion 
            ? `Вы получили ${result.xpGranted} XP и ${result.coinGranted} монет`
            : "Вы уже выполняли это задание"}
          details={[
            { label: "XP", value: result.xpGranted, highlight: true },
            { label: "Монеты", value: result.coinGranted, highlight: true },
          ]}
          actions={[
            { 
              label: "Вернуться к уроку", 
              onClick: () => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`),
              variant: "outline"
            },
            { 
              label: "К модулю", 
              onClick: () => router.push(`/course/${courseSlug}/module/${moduleSlug}`),
              variant: "primary"
            },
          ]}
        />
      </Container>
    );
  }

  if (!taskStarted) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
        
        <div className="py-10">
          <div className="">
            <h1 className="text-3xl font-bold mb-4">{task.name}</h1>
            <p className="text-gray-600 mb-6">{task.description}</p>
            
            <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Язык:</span>
                <span className="font-semibold">{task.runnerLanguage || "C#"}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Награда:</span>
                <span className="font-semibold text-green-600">
                  {task.xpReward || 0} XP + {task.coinReward || 0} монет
                </span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`)} 
                className="flex-1"
              >
                Вернуться к уроку
              </Button>
              <Button onClick={handleStartTask} className="flex-1">
                Начать задание
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
      
      <div className="max-w-4xl mx-auto py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{task.name}</h1>
          <p className="text-gray-600 mb-4">{task.description}</p>
          <div className="flex gap-4">
            {task.xpReward && (
              <span className="text-sm text-green-600">+{task.xpReward} XP</span>
            )}
            {task.coinReward && (
              <span className="text-sm text-orange-500">+{task.coinReward} монет</span>
            )}
          </div>
        </div>
        
        <TaskRunner
          taskId={task.taskId}
          language={task.runnerLanguage || "csharp"}
          onComplete={handleTaskComplete}
        />
        
        <div className="mt-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`)}
            className="w-full"
          >
            Вернуться к уроку
          </Button>
        </div>
      </div>
    </Container>
  );
}