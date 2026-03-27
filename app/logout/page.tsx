// app/logout/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const router = useRouter();
  const { logout, isAuth } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        await logout();
        // Небольшая задержка перед редиректом для плавности
        setTimeout(() => {
          router.push("/login");
        }, 1500);
      } catch (err) {
        console.error("Logout error:", err);
        setError("Не удалось выйти из системы");
        setIsLoggingOut(false);
      }
    };

    if (isAuth) {
      performLogout();
    } else {
      // Если пользователь не авторизован, сразу редиректим
      router.push("/login");
    }
  }, [logout, isAuth, router]);

  const handleManualRedirect = () => {
    router.push("/login");
  };

  return (
    <Container>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md w-full p-8 bg-white rounded-[40px] shadow-lg">
          {isLoggingOut ? (
            <>
              <Loader2 className="w-12 h-12 animate-spin text-primary mx-auto mb-4" />
              <h1 className="text-2xl font-semibold mb-2">Выход из системы</h1>
              <p className="text-gray-600">
                Пожалуйста, подождите, выполняется выход...
              </p>
            </>
          ) : error ? (
            <>
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold mb-2">Ошибка</h1>
              <p className="text-gray-600 mb-6">{error}</p>
              <Button onClick={handleManualRedirect} className="w-full">
                Вернуться на главную
              </Button>
            </>
          ) : (
            <>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-semibold mb-2">До свидания!</h1>
              <p className="text-gray-600 mb-6">
                Вы успешно вышли из системы. Перенаправляем на страницу входа...
              </p>
              <Button onClick={handleManualRedirect} variant="outline" className="w-full">
                Перейти сейчас
              </Button>
            </>
          )}
        </div>
      </div>
    </Container>
  );
}