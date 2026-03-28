"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { ApiError } from "@/shared/api/types";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from "@/components/ui/button-group";
import { ParallaxBackground } from "../ParallaxBackground/ParallaxBackground";
import { useAlert } from "@/features/alert/alert-store";

export const RegisterForm = () => {
  const router = useRouter();
  const showAlert = useAlert();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [userType, setUserType] = useState<"student" | "parent" | null>(null);
  const [loading, setLoading] = useState(false);

  const REGISTER_ERROR_MESSAGES: Record<string, string> = {
    weak_password: "Слабый пароль: минимум 8 символов, хотя бы 1 буква и 1 цифра.",
    conflict: "Пользователь с таким именем уже существует.",
    invalid_username: "Некорректный логин. Разрешены 3-16 символов: латиница, цифры, _.",
    username_invalid: "Некорректный логин. Разрешены 3-16 символов: латиница, цифры, _.",
    invalid_age: "Некорректный возраст. Допустимый диапазон: 1-120.",
    age_invalid: "Некорректный возраст. Допустимый диапазон: 1-120.",
    invalid_role: "Некорректный тип пользователя.",
    role_invalid: "Некорректный тип пользователя.",
    password_invalid: "Слабый пароль: минимум 8 символов, хотя бы 1 буква и 1 цифра.",
    bad_request: "Проверьте корректность данных формы.",
  };

  const resolveRegisterErrorMessage = (err: unknown): string => {
    if (ApiError.isApiError(err)) {
      const code = String(err.data?.error || err.data?.code || err.code || "")
        .toLowerCase()
        .trim();

      if (code && REGISTER_ERROR_MESSAGES[code]) return REGISTER_ERROR_MESSAGES[code];
      if (err.status === 409) return REGISTER_ERROR_MESSAGES.conflict;
      if (err.status === 429) return "Слишком много попыток. Попробуйте чуть позже.";
      if (err.status >= 500) return "Ошибка сервера. Попробуйте позже.";

      const backendMessage = err.data?.message;
      if (typeof backendMessage === "string" && backendMessage.trim()) return backendMessage;

      return "Не удалось создать аккаунт. Попробуйте позже.";
    }

    if (err instanceof Error) {
      const message = err.message.toLowerCase();
      if (
        message.includes("network error") ||
        message.includes("failed to fetch") ||
        message.includes("load failed")
      ) {
        return "Нет соединения с сервером. Проверьте URL API и доступность бэка.";
      }
      if (message.includes("weak_password")) return REGISTER_ERROR_MESSAGES.weak_password;
      if (message.includes("conflict")) return REGISTER_ERROR_MESSAGES.conflict;
    }

    return "Не удалось создать аккаунт. Попробуйте позже.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Валидация
    if (!username.trim()) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите имя пользователя",
        autoClose: 3000,
      });
      return;
    }

    if (!password) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите пароль",
        autoClose: 3000,
      });
      return;
    }

    if (password !== confirmPassword) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароли не совпадают",
        autoClose: 3000,
      });
      return;
    }

    if (password.length < 8 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Слабый пароль: минимум 8 символов, буквы и цифры",
        autoClose: 3000,
      });
      return;
    }

    if (!age) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите возраст",
        autoClose: 3000,
      });
      return;
    }

    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum <= 0 || ageNum > 120) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите корректный возраст (1-120)",
        autoClose: 3000,
      });
      return;
    }

    if (!userType) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Выберите тип пользователя",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      await register({
        username: username.trim(),
        password: password,
        age: age,
        role: userType,
      });

      showAlert({
        variant: "success",
        title: "Регистрация успешна!",
        description: "Добро пожаловать в платформу",
        autoClose: 3000,
      });

      router.push("/");
    } catch (err: unknown) {
      showAlert({
        variant: "destructive",
        title: "Ошибка регистрации",
        description: resolveRegisterErrorMessage(err),
        autoClose: 5000,
      });
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxBackground imageUrl="/bg.png">
      <div className="h-screen flex flex-col justify-center items-center text-[16px]">
        <form
          onSubmit={handleSubmit}
          className="border border-[#E5E5E5] p-5 rounded-[40px] w-100 flex flex-col gap-4 bg-white shadow-xl"
        >
          <h1 className="font-semibold text-[28px]">Создайте аккаунт</h1>
          <p className="text-gray-600">Заполните данные для регистрации</p>

          <Field>
            <ButtonGroup className="w-full">
              <Button
                className="flex-1 text-[16px] rounded-[16px]"
                type="button"
                size="lg"
                variant={userType === "student" ? "default" : "outline"}
                onClick={() => setUserType("student")}
              >
                Ребенок
              </Button>
              <ButtonGroupSeparator />
              <Button
                className="flex-1 text-[16px] rounded-[16px]"
                type="button"
                size="lg"
                variant={userType === "parent" ? "default" : "outline"}
                onClick={() => setUserType("parent")}
              >
                Родитель
              </Button>
            </ButtonGroup>
            <FieldLabel>Логин</FieldLabel>
            <Input
              placeholder="Введите логин"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel>Возраст</FieldLabel>
            <Input
              type="number"
              placeholder="Введите возраст"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              min="1"
              max="120"
              required
            />
          </Field>

          <Field>
            <FieldLabel>Пароль</FieldLabel>
            <Input
              type="password"
              placeholder="Введите пароль (минимум 8 символов, буквы и цифры)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Field>

          <Field>
            <FieldLabel>Подтверждение пароля</FieldLabel>
            <Input
              type="password"
              placeholder="Повторите пароль"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </Field>

          <Button
            type="submit"
            className="w-full text-[16px]"
            disabled={loading}
            size="lg"
          >
            {loading ? "Регистрация..." : "Зарегистрироваться"}
          </Button>
        </form>

        <a
          href="/login"
          className="font-medium  text-black/60 text-center mt-3 "
        >
          Уже есть аккаунт?{" "}
          <span className="text-black hover:underline">Войти</span>
        </a>
      </div>
    </ParallaxBackground>
  );
};
