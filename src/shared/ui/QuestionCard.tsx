// shared/ui/QuestionCard.tsx
"use client";

import { Button } from "@/components/ui/button";
import { ProgressBar } from "./ProgressBar";
import { AnswerOption } from "./AnswerOption";

interface QuestionCardProps {
  question: {
    id: string;
    name: string;
    description: string;
    index: number;
    total: number;
  };
  options: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
  selectedAnswer?: string;
  onSelectAnswer: (answerId: string) => void;
  onSubmit: () => void;
  isSubmitting?: boolean;
  showSubmit?: boolean;
}

export const QuestionCard = ({
  question,
  options,
  selectedAnswer,
  onSelectAnswer,
  onSubmit,
  isSubmitting = false,
  showSubmit = true,
}: QuestionCardProps) => {
  return (
    <div className="">
      <div className="mb-6">
        <ProgressBar 
          current={question.index} 
          total={question.total} 
          label={`Вопрос ${question.index} из ${question.total}`}
        />
      </div>
      
      <h2 className="text-2xl font-bold mb-2">{question.name}</h2>
      <p className="text-gray-600 mb-8">{question.description}</p>
      
      <div className="space-y-3">
        {options.map((option) => (
          <AnswerOption
            key={option.id}
            id={option.id}
            label={option.name}
            description={option.description}
            selected={selectedAnswer === option.id}
            onSelect={() => onSelectAnswer(option.id)}
            disabled={isSubmitting}
          />
        ))}
      </div>
      
      {showSubmit && (
        <div className="mt-8">
          <Button
            onClick={onSubmit}
            disabled={!selectedAnswer || isSubmitting}
            className="w-full"
            size="lg"
          >
            {isSubmitting ? "Отправка..." : "Ответить"}
          </Button>
        </div>
      )}
    </div>
  );
};