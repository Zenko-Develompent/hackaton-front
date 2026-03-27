// app/course/[course_slug]/module/[module_slug]/exam/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { useAuth } from "@/features/auth/useAuth";
import { useAlert } from "@/features/alert/alert-store";
import {
  QuestionCard,
  ResultDisplay,
  TaskRunner,
  ProgressBar,
} from "@/shared/ui";
import { courseApi } from "@/entities/course/api/course.api";
import { moduleApi } from "@/entities/module/api/module.api";
import { examApi } from "@/entities/exam/api/exam.api";
import { questApi } from "@/entities/quest/api/quest.api";
import { taskApi } from "@/entities/task/api/task.api";
import { Frown } from "lucide-react";
import type { ModuleExamResponse } from "@/entities/module/model/types";
import type { Exam, ExamQuestion, ExamTask } from "@/entities/exam/model/types";

export default function ExamPage() {
  const params = useParams();
  const router = useRouter();
  const showAlert = useAlert();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;

  const [exam, setExam] = useState<ModuleExamResponse | null>(null);
  const [examDetails, setExamDetails] = useState<Exam | null>(null);
  const [questions, setQuestions] = useState<ExamQuestion[]>([]);
  const [tasks, setTasks] = useState<ExamTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExamUnlocked, setIsExamUnlocked] = useState<boolean>(false);
  
  // Названия для хлебных крошек
  const [courseName, setCourseName] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");

  // Состояния для прохождения экзамена
  const [examStarted, setExamStarted] = useState(false);
  const [currentSection, setCurrentSection] = useState<"questions" | "tasks">(
    "questions",
  );
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<
    Record<string, { answerId: string; isCorrect: boolean }>
  >({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [showRetryDialog, setShowRetryDialog] = useState(false);

  // Состояния для заданий
  const [taskResults, setTaskResults] = useState<
    Record<string, { completed: boolean; code?: string }>
  >({});
  const [questionAnswers, setQuestionAnswers] = useState<Record<string, any[]>>(
    {},
  );

  const { isAuth } = useAuth();

  // Загрузка данных экзамена
  useEffect(() => {
    const fetchExamData = async () => {
      if (!moduleSlug) return;

      try {
        setLoading(true);
        setError(null);

        // Получаем информацию об экзамене модуля (содержит unlocked)
        const examInfo = await moduleApi.getExam(moduleSlug);
        console.log("Exam info:", examInfo); // Для отладки
        
        setExam(examInfo);
        setIsExamUnlocked(examInfo.unlocked === true);

        if (examInfo && examInfo.examId) {
          // Получаем детальную информацию об экзамене
          const examDetailsData = await examApi.getExam(examInfo.examId);
          setExamDetails(examDetailsData);

          // Получаем вопросы экзамена
          const questionsData = await examApi.getQuestions(examInfo.examId);
          setQuestions(questionsData.items);

          // Получаем задания экзамена
          const tasksData = await examApi.getTasks(examInfo.examId);
          setTasks(tasksData.items);

          // Загружаем варианты ответов для всех вопросов
          const answersMap: Record<string, any[]> = {};
          for (const question of questionsData.items) {
            try {
              const answersData = await questApi.getAnswers(question.questId);
              answersMap[question.questId] = answersData.items;
            } catch (err) {
              console.error(
                `Failed to fetch answers for question ${question.questId}:`,
                err,
              );
              answersMap[question.questId] = [];
            }
          }
          setQuestionAnswers(answersMap);
        }

        // Получаем названия курса и модуля
        try {
          const courseTree = await courseApi.getTree(courseSlug, isAuth);
          setCourseName(courseTree.name);
          const moduleData = await moduleApi.getModule(moduleSlug);
          setModuleName(moduleData.name);
        } catch (err) {
          console.error("Error fetching course/module names:", err);
        }

        setLoading(false);
      } catch (err) {
        console.error("Error fetching exam data:", err);
        setError("Не удалось загрузить экзамен");
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchExamData();
    } else {
      router.push("/login");
    }
  }, [moduleSlug, courseSlug, isAuth, router]);

  // Проверка ответа на вопрос через API
  const checkAnswer = async (
    questionId: string,
    answerId: string,
  ): Promise<boolean> => {
    try {
      const response = await questApi.check(questionId, { answerId }, true);
      return response.correct;
    } catch (err) {
      console.error("Error checking answer:", err);
      return false;
    }
  };

  // Обработка ответа на вопрос
  const handleAnswerSubmit = async () => {
    if (!selectedAnswer || !questions[currentQuestionIndex]) return;

    setSubmitting(true);

    const currentQuestion = questions[currentQuestionIndex];
    const isCorrect = await checkAnswer(
      currentQuestion.questId,
      selectedAnswer,
    );

    const updatedAnswers = {
      ...answers,
      [currentQuestion.questId]: {
        answerId: selectedAnswer,
        isCorrect: isCorrect,
      },
    };
    setAnswers(updatedAnswers);
    setSelectedAnswer(null);

    const hasIncorrect = Object.values(updatedAnswers).some(
      (a) => !a.isCorrect,
    );

    if (hasIncorrect) {
      setShowRetryDialog(true);
      setSubmitting(false);
      return;
    }

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setCurrentSection("tasks");
    }

    setSubmitting(false);
  };

  // Обработка завершения задания
  const handleTaskComplete = (taskId: string) => {
    setTaskResults((prev) => ({
      ...prev,
      [taskId]: { completed: true },
    }));
  };

  // Пересдача экзамена
  const handleRetry = () => {
    setAnswers({});
    setSelectedAnswer(null);
    setCurrentQuestionIndex(0);
    setCurrentSection("questions");
    setTaskResults({});
    setShowRetryDialog(false);
    setError(null);
  };

  // Завершение экзамена
  const completeExam = async () => {
    if (!exam) return;

    const allTasksCompleted = tasks.every(
      (task) => taskResults[task.taskId]?.completed,
    );
    if (!allTasksCompleted) {
      setError("Выполните все задания перед завершением экзамена");
      return;
    }

    try {
      setSubmitting(true);

      const response = await examApi.complete(exam.examId);
      setResult({
        completed: response.completed,
        firstCompletion: response.firstCompletion,
        xpGranted: response.xpGranted,
        coinGranted: response.coinGranted,
        questionsDone: response.questionsDone,
        questionsTotal: response.questionsTotal,
        tasksDone: response.tasksDone,
        tasksTotal: response.tasksTotal,
      });
      setCompleted(true);
      setSubmitting(false);
    } catch (err) {
      console.error("Error completing exam:", err);
      setError("Не удалось завершить экзамен");
      setSubmitting(false);
    }
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: courseName || "Загрузка...", href: `/course/${courseSlug}` },
    {
      label: moduleName || "Загрузка...",
      href: `/course/${courseSlug}/module/${moduleSlug}`,
    },
    { label: "Экзамен" },
  ];

  if (!isAuth) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <div className="w-full py-10">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded-[40px] w-1/2 mb-4"></div>
            <div className="h-100 bg-gray-200 rounded-[40px] w-full"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center py-40">
          <p className="text-red-500 mb-8">{error}</p>
          <Button
            size="lg"
            className="text-base"
            onClick={() =>
              router.push(`/course/${courseSlug}/module/${moduleSlug}`)
            }
          >
            Вернуться к модулю
          </Button>
        </div>
      </Container>
    );
  }

  // Проверка доступа к экзамену
  if (!isExamUnlocked && exam) {
    let accessMessage = "";
    if (!exam) {
      accessMessage = "Экзамен не найден";
    } else {
      accessMessage =
        "Экзамен недоступен. Пройдите все уроки модуля, чтобы открыть экзамен.";
    }

    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

        <div className="flex flex-col justify-center items-center text-center mt-24">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <Frown size={40} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Экзамен недоступен
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">{accessMessage}</p>
          <Button
            size="lg"
            className="text-base"
            onClick={() =>
              router.push(`/course/${courseSlug}/module/${moduleSlug}`)
            }
          >
            Вернуться к модулю
          </Button>
        </div>
      </Container>
    );
  }

  if (!exam) {
    return (
      <Container>
        <div className="flex flex-col justify-center items-center py-40">
          <p className="text-gray-500 mb-8">Экзамен не найден</p>
          <Button
            size="lg"
            className="text-base"
            onClick={() =>
              router.push(`/course/${courseSlug}/module/${moduleSlug}`)
            }
          >
            Вернуться к модулю
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
          title="Экзамен пройден!"
          message={
            result.firstCompletion
              ? `Вы получили ${result.xpGranted} XP и ${result.coinGranted} монет`
              : "Вы уже проходили этот экзамен"
          }
          details={[
            {
              label: "Вопросы",
              value: `${result.questionsDone} / ${result.questionsTotal}`,
            },
            {
              label: "Задания",
              value: `${result.tasksDone} / ${result.tasksTotal}`,
            },
            { label: "XP", value: result.xpGranted, highlight: true },
            { label: "Монеты", value: result.coinGranted, highlight: true },
          ]}
          actions={[
            {
              label: "Вернуться к модулю",
              onClick: () =>
                router.push(`/course/${courseSlug}/module/${moduleSlug}`),
              variant: "outline",
            },
            {
              label: "К курсу",
              onClick: () => router.push(`/course/${courseSlug}`),
              variant: "primary",
            },
          ]}
        />
      </Container>
    );
  }

  if (showRetryDialog) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

        <div className="py-20">
          <div className="text-center">
            <div className="mb-6">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-red-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h1 className="text-3xl font-bold mb-2">Ошибка в ответе</h1>
              <p className="text-gray-600 mb-6">
                Вы допустили ошибку при ответе на вопрос. Для успешной сдачи
                экзамена все вопросы должны быть отвечены правильно.
              </p>
              <p className="text-gray-500 mb-8">
                Вы можете начать экзамен заново и попробовать снова.
              </p>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/course/${courseSlug}/module/${moduleSlug}`)
                }
                className="flex-1"
              >
                Вернуться к модулю
              </Button>
              <Button onClick={handleRetry} className="flex-1">
                Начать заново
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!examStarted) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

        <div className="py-10">
          <div className="rounded-[40px]">
            <h1 className="text-3xl font-bold mb-4">{exam.name}</h1>
            <p className="text-gray-600 mb-6">{exam.description}</p>

            <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Вопросов:</span>
                <span className="font-semibold">{exam.questionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Заданий:</span>
                <span className="font-semibold">{exam.tasksCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Награда:</span>
                <span className="font-semibold text-green-600">
                  {examDetails?.xpReward || 0} XP +{" "}
                  {examDetails?.coinReward || 0} монет
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Условие:</span>
                <span className="font-semibold text-orange-600">
                  Все вопросы должны быть отвечены правильно
                </span>
              </div>
            </div>

            <div className="flex gap-4">
              <Button
                variant="outline"
                onClick={() =>
                  router.push(`/course/${courseSlug}/module/${moduleSlug}`)
                }
                className="flex-1"
              >
                Вернуться к модулю
              </Button>
              <Button onClick={() => setExamStarted(true)} className="flex-1">
                Начать экзамен
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  // Рендер вопросов
  if (currentSection === "questions" && questions.length > 0) {
    const currentQuestion = questions[currentQuestionIndex];
    const currentAnswers = questionAnswers[currentQuestion?.questId] || [];

    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

        <div className="py-10">
          <QuestionCard
            question={{
              id: currentQuestion.questId,
              name: currentQuestion.name,
              description: currentQuestion.description,
              index: currentQuestionIndex + 1,
              total: questions.length,
            }}
            options={currentAnswers.map((answer: any) => ({
              id: answer.answerId,
              name: answer.name,
              description: answer.description,
            }))}
            selectedAnswer={selectedAnswer || undefined}
            onSelectAnswer={setSelectedAnswer}
            onSubmit={handleAnswerSubmit}
            isSubmitting={submitting}
            showSubmit={true}
          />

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-500">
              {Object.keys(answers).length} из {questions.length} вопросов
              отвечено
            </div>
            <Button
              variant="ghost"
              onClick={() => setCurrentSection("tasks")}
              className="text-gray-500"
            >
              Пропустить вопросы →
            </Button>
          </div>
        </div>
      </Container>
    );
  }

  // Рендер заданий
  const allTasksCompleted = tasks.every(
    (task) => taskResults[task.taskId]?.completed,
  );
  const completedCount = tasks.filter(
    (task) => taskResults[task.taskId]?.completed,
  ).length;

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

      <div className="py-10">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Практические задания</h1>
            <span className="text-sm text-gray-500">
              {completedCount} / {tasks.length} выполнено
            </span>
          </div>
          <ProgressBar
            current={completedCount}
            total={tasks.length}
            showPercentage={false}
          />
          <p className="text-gray-600 mt-4">
            Выполните все задания, чтобы завершить экзамен
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {tasks.map((task, index) => (
            <div key={task.taskId} className="">
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">
                  Задание {index + 1}. {task.name}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                {task.xpReward && task.coinReward && (
                  <div className="flex gap-4 mt-2 text-sm text-gray-500">
                    <span>+{task.xpReward} XP</span>
                    <span>+{task.coinReward} монет</span>
                  </div>
                )}
              </div>

              {!taskResults[task.taskId]?.completed ? (
                <TaskRunner
                  taskId={task.taskId}
                  language={task.runnerLanguage}
                  initialCode={taskResults[task.taskId]?.code || ""}
                  onComplete={() => handleTaskComplete(task.taskId)}
                />
              ) : (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-700 flex items-center gap-2">
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Задание выполнено успешно
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-4">
          {questions.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setCurrentSection("questions")}
              className="flex-1"
            >
              ← К вопросам
            </Button>
          )}
          <Button
            onClick={completeExam}
            disabled={submitting || !allTasksCompleted}
            className="flex-1"
          >
            {submitting ? "Завершение..." : "Завершить экзамен"}
          </Button>
        </div>

        {!allTasksCompleted && (
          <p className="text-center text-sm text-gray-500 mt-4">
            Выполните все задания ({tasks.length - completedCount} осталось),
            чтобы завершить экзамен
          </p>
        )}
      </div>
    </Container>
  );
}