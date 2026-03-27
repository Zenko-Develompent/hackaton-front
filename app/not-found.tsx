// app/not-found.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Container } from "@/widgets/container/Container";
import { useRouter } from "next/navigation";

export default function NotFound() {
  const router = useRouter();

  return (
    <Container>
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          404
        </h1>
        
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Страница не найдена
        </h2>
        
        <p className="text-gray-500 mb-8 max-w-md">
          Извините, страница, которую вы ищете, не существует или была перемещена.
        </p>
        
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="lg"
            onClick={() => router.back()}
            className="text-base"
          >
            Вернуться назад
          </Button>
          <Button
            onClick={() => router.push("/")}
            className="text-base"
            size="lg"
          >
            На главную
          </Button>
        </div>
      </div>
    </Container>
  );
}