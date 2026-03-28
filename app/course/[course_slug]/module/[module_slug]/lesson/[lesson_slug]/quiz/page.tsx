// app/course/[course_slug]/module/[module_slug]/lesson/[lesson_slug]/quiz/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";
import { Container } from "@/widgets/container/Container";
import { useAuth } from "@/features/auth/useAuth";
import { 
  QuestionCard, 
  ResultDisplay, 
  ProgressBar 
} from "@/shared/ui";
import { lessonApi } from "@/entities/lesson/api/lesson.api";
import { quizApi } from "@/entities/quiz/api/quiz.api";
import { courseApi } from "@/entities/course/api/course.api";
import { moduleApi } from "@/entities/module/api/module.api";
import type { QuizStartResponse } from "@/entities/quiz/model/types";
import type { LessonQuiz } from "@/entities/lesson/model/types";

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const courseSlug = params.course_slug as string;
  const moduleSlug = params.module_slug as string;
  const lessonSlug = params.lesson_slug as string;

  const [quiz, setQuiz] = useState<LessonQuiz | null>(null);
  const [quizSession, setQuizSession] = useState<QuizStartResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<{
    completed: boolean;
    firstCompletion: boolean;
    xpGranted: number;
    coinGranted: number;
    totalQuestions: number;
    correctAnswers: number;
  } | null>(null);
  
  // Названия для хлебных крошек
  const [courseName, setCourseName] = useState<string>("");
  const [moduleName, setModuleName] = useState<string>("");
  const [lessonName, setLessonName] = useState<string>("");

  const { isAuth } = useAuth();

  // Загрузка данных квиза и названий
  useEffect(() => {
    const fetchQuizData = async () => {
      if (!lessonSlug) return;

      try {
        setLoading(true);
        setError(null);
        
        const quizData = await lessonApi.getQuiz(lessonSlug);
        setQuiz(quizData);
        
        try {
          const courseTree = await courseApi.getTree(courseSlug, isAuth);
          setCourseName(courseTree.name);
          
          const moduleData = await moduleApi.getModule(moduleSlug);
          setModuleName(moduleData.name);
          
          const lessonData = await lessonApi.getLesson(lessonSlug);
          setLessonName(lessonData.name);
        } catch (err) {
          console.error("Error fetching names:", err);
        }
        
        setLoading(false);
      } catch (err) {
        console.error("Error fetching quiz data:", err);
        setError("Не удалось загрузить тест");
        setLoading(false);
      }
    };

    if (isAuth) {
      fetchQuizData();
    } else {
      router.push("/login");
    }
  }, [lessonSlug, moduleSlug, courseSlug, isAuth, router]);

  // Старт квиза
  const startQuiz = async () => {
    if (!quiz) return;

    try {
      setLoading(true);
      const response = await quizApi.start(quiz.quizId);
      setQuizSession(response);
      setLoading(false);
    } catch (err) {
      console.error("Error starting quiz:", err);
      setError("Не удалось начать тест");
      setLoading(false);
    }
  };

  // Отправка ответа
  const submitAnswer = async () => {
    if (!quizSession?.question || !selectedAnswer || !quiz) return;

    setSubmitting(true);
    
    try {
      const response = await quizApi.answer(quiz.quizId, {
        questionId: quizSession.question.questionId,
        answerId: selectedAnswer,
      });
      
      if (response.completed) {
        setResult({
          completed: true,
          firstCompletion: true,
          xpGranted: response.xpGranted,
          coinGranted: response.coinGranted,
          totalQuestions: quizSession.question?.total || 0,
          correctAnswers: quizSession.question?.index || 0,
        });
        setCompleted(true);
        setQuizSession(null);
      } else {
        setQuizSession({
          completed: false,
          question: response.question,
        });
      }
      
      setSelectedAnswer(null);
      setSubmitting(false);
    } catch (err) {
      console.error("Error submitting answer:", err);
      setError("Ошибка при отправке ответа");
      setSubmitting(false);
    }
  };

  // Хлебные крошки
  const breadcrumbItems = [
    { label: "Курсы", href: "/courses" },
    { label: courseName || "Загрузка...", href: `/course/${courseSlug}` },
    { label: moduleName || "Загрузка...", href: `/course/${courseSlug}/module/${moduleSlug}` },
    { label: lessonName || "Загрузка...", href: `/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}` },
    { label: "Тест" },
  ];

  if (!isAuth) {
    return null;
  }

  if (loading) {
    return (
      <Container>
        <div className="w-full">
          <div className="animate-pulse text-center">
            <div className="h-8 bg-gray-200 rounded-[40px] w-1/3 mb-4"></div>
            <div className="h-100 bg-gray-200 rounded-[40px] w-full"></div>
          </div>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-red-500 mb-4">{error}</p>
          <Button size="lg" className="text-base" onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <p className="text-gray-500 mb-4">Тест не найден</p>
          <Button onClick={() => router.back()}>
            Вернуться к уроку
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
          title="Тест пройден!"
          message={result.firstCompletion 
            ? `Вы получили ${result.xpGranted} XP и ${result.coinGranted} монет`
            : "Вы уже проходили этот тест"}
          details={[
            { label: "Вопросов", value: `${result.correctAnswers} / ${result.totalQuestions}` },
            { label: "XP", value: result.xpGranted, highlight: true },
            { label: "Монеты", value: result.coinGranted, highlight: true },
          ]}
          actions={[
            { 
              label: "Вернуться к уроку", 
              onClick: () => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`),
              variant: "primary"
            },
          ]}
        />
      </Container>
    );
  }

  if (!quizSession) {
    return (
      <Container>
        <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
        
        <div className="py-10">
          <div className="">
            <h1 className="text-3xl font-bold mb-4">{quiz.name}</h1>
            <p className="text-gray-600 mb-6">{quiz.description}</p>
            
            <div className="space-y-4 mb-8 p-4 bg-gray-50 rounded-xl">
              <div className="flex justify-between">
                <span className="text-gray-600">Вопросов:</span>
                <span className="font-semibold">{quiz.questionsCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Награда:</span>
                <span className="font-semibold text-green-600">
                  +{quiz.questionsCount * 10} XP
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Условие:</span>
                <span className="font-semibold text-orange-600">Все вопросы обязательны</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`)} 
                className="flex-1 text-base"
              >
                Вернуться к уроку
              </Button>
              <Button onClick={startQuiz} className="flex-1 text-base" size="lg">
                Начать тест
              </Button>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  const currentQuestion = quizSession.question;
  const answeredQuestions = Math.max(0, currentQuestion.index - 1);

  if (!currentQuestion) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center py-40">
          <h2 className="text-2xl font-bold mb-4">Тест завершен!</h2>
          <p className="text-gray-600 mb-8">Вы успешно прошли тест</p>
          <Button onClick={() => router.push(`/course/${courseSlug}/module/${moduleSlug}/lesson/${lessonSlug}`)}>
            Вернуться к уроку
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
      
      <div className="py-10">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-500">
              Вопрос {currentQuestion.index} из {currentQuestion.total}
            </span>
            <span className="text-sm text-gray-500">
              {quiz.name}
            </span>
          </div>
          <ProgressBar 
            current={answeredQuestions} 
            total={currentQuestion.total} 
            showPercentage={true}
          />
        </div>
        
        <QuestionCard
          question={{
            id: currentQuestion.questionId,
            name: currentQuestion.name,
            description: currentQuestion.description,
            index: currentQuestion.index,
            total: currentQuestion.total,
          }}
          options={currentQuestion.options.map(opt => ({
            id: opt.answerId,
            name: opt.name,
            description: opt.description,
          }))}
          selectedAnswer={selectedAnswer || undefined}
          onSelectAnswer={setSelectedAnswer}
          onSubmit={submitAnswer}
          isSubmitting={submitting}
          showSubmit={true}
        />
      </div>
    </Container>
  );
}