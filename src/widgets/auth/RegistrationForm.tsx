"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/entities/auth/api/auth.api";
import { useAuth } from "@/features/auth/useAuth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { cn } from "@/lib/utils";

export const RegisterForm = () => {
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(0);

  const handleSubmit = async () => {
    // Валидация
    if (!username.trim()) {
      setError("Введите username");
      return;
    }

    if (!email.trim()) {
      setError("Введите email");
      return;
    }

    if (!password) {
      setError("Введите пароль");
      return;
    }

    if (password !== confirmPassword) {
      setError("Пароли не совпадают");
      return;
    }

    if (password.length < 6) {
      setError("Пароль должен содержать минимум 6 символов");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await authApi.register({
        username: username.trim(),
        email: email.trim(),
        password,
      });

      if (data.needVerify) {
        // Требуется подтверждение email
        setResendTimer(data.resendAfterSec);

        // Запускаем таймер для повторной отправки
        if (data.resendAfterSec > 0) {
          let timer = data.resendAfterSec;
          const interval = setInterval(() => {
            timer--;
            setResendTimer(timer);
            if (timer <= 0) {
              clearInterval(interval);
            }
          }, 1000);
        }
      } else {
        // Если верификация не требуется, сразу логиним
        // В реальном приложении здесь может быть автоматический вход
        // или перенаправление на страницу входа
        router.push("/login?registered=true");
      }
    } catch (err: any) {
      if (err.message?.includes("username already exists")) {
        setError("Пользователь с таким username уже существует");
      } else if (err.message?.includes("email already exists")) {
        setError("Пользователь с таким email уже существует");
      } else {
        setError("Ошибка регистрации. Попробуйте позже.");
        console.log("Registration error:", err);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (resendTimer > 0) return;

    setLoading(true);
    try {
      // Здесь должен быть API запрос на повторную отправку письма
      // const response = await authApi.resendVerification({ ticket: verificationTicket });
      // setResendTimer(response.resendAfterSec);

      // Заглушка:
      setResendTimer(60);
      let timer = 60;
      const interval = setInterval(() => {
        timer--;
        setResendTimer(timer);
        if (timer <= 0) {
          clearInterval(interval);
        }
      }, 1000);
    } catch (err) {
      setError("Не удалось отправить письмо повторно");
    } finally {
      setLoading(false);
    }
  };

  const [userType, setUserType] = useState<"child" | "parent" | null>(null);

  return (
    <div className="h-screen flex flex-col justify-center items-center text-[16px]">
      <form
        onSubmit={handleSubmit}
        action=""
        className="border border-[#E5E5E5]  p-5 rounded-[40px] w-100 flex flex-col gap-4"
      >
        <h1 className="font-semibold text-[28px]">Создайте аккаунт</h1>
        <p>Заполните данные для регистрации</p>
        <Field>
          <FieldLabel>Логин</FieldLabel>
          <Input required={true} placeholder="Email или username" />
        </Field>
        <Field>
          <FieldLabel>Почта</FieldLabel>
          <Input required={true} placeholder="Email или username" />
        </Field>
        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input
            type="password"
            placeholder="Повторите пароль"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>

        <ButtonGroup className="w-full">
          <Button
            className="flex-1 text-[16px]"
            
            type="button"
            size="lg"
            variant={userType === "child" ? "default" : "outline"}
            onClick={() => setUserType("child")}
          >
            Ребенок
          </Button>
          <ButtonGroupSeparator />
          <Button
            className="flex-1 text-[16px]"
            type="button"
            size="lg"
            variant={userType === "parent" ? "default" : "outline"}
            onClick={() => setUserType("parent")}
          >
            Родитель
          </Button>
        </ButtonGroup>

        <Button type="submit" className="w-full" disabled={loading} size="lg">
          {loading ? "Загрузка..." : "Войти"}
        </Button>
      </form>
      <a
        href="/register"
        className="font-medium text-black/60 text-center mt-3"
      >
        Уже есть аккаунт?{" "}
        <span className="text-black hover:underline">Войти</span>
      </a>
    </div>
  );
};
