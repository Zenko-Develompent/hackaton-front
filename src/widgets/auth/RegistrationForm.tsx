"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";

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

    if (password.length < 6) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Пароль должен содержать минимум 6 символов",
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
    } catch (err: any) {
      if (err.message?.includes("username already exists")) {
        showAlert({
          variant: "destructive",
          title: "Ошибка регистрации",
          description: "Пользователь с таким именем уже существует",
          autoClose: 5000,
        });
      } else {
        showAlert({
          variant: "destructive",
          title: "Ошибка регистрации",
          description: "Не удалось создать аккаунт. Попробуйте позже.",
          autoClose: 5000,
        });
      }
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
            <FieldLabel>Имя пользователя</FieldLabel>
            <Input
              placeholder="Введите имя пользователя"
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
              placeholder="Введите пароль (минимум 6 символов)"
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
