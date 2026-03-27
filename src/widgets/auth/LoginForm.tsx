"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/entities/auth/api/auth.api";
import { useAuth } from "@/features/auth/useAuth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAlert } from "@/features/alert/alert-store";
import { Field, FieldLabel } from "@/components/ui/field";
import { ParallaxBackground } from "../ParallaxBackground/ParallaxBackground";

export const LoginForm = () => {
  const showAlert = useAlert();
  const router = useRouter();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Заполните все поля",
        autoClose: 3000,
      });
      return;
    }

    setLoading(true);

    try {
      const response = await authApi.login({
        username: username.trim(),
        password,
      });

      // Используем login из AuthProvider, который принимает токены
      await login({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      router.push("/profile");
    } catch (e) {
      showAlert({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Неверное имя пользователя или пароль",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <ParallaxBackground imageUrl="/bg.png">
      <div className="h-screen flex flex-col justify-center items-center text-[16px]">
        <form
          onSubmit={handleSubmit}
          className="border border-[#E5E5E5] p-5 rounded-[40px] w-100 flex flex-col gap-4 bg-white"
        >
          <h1 className="font-semibold text-[28px]">С возвращением!</h1>
          <p className="text-gray-600">Войдите, чтобы продолжить</p>
          
          <Field>
            <FieldLabel>Имя пользователя</FieldLabel>
            <Input
              placeholder="Введите имя пользователя"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
              required
            />
          </Field>
          
          <Field>
            <FieldLabel>Пароль</FieldLabel>
            <Input
              type="password"
              placeholder="Введите пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              required
            />
          </Field>
          
          <a href="/forgot-password" className="font-medium hover:underline w-fit text-sm text-gray-500">
            Забыли пароль?
          </a>

          <Button
            type="submit"
            className="w-full text-[16px]"
            disabled={loading}
            size="lg"
          >
            {loading ? "Загрузка..." : "Войти"}
          </Button>
        </form>
        
        <a
          href="/register"
          className="font-medium text-black/60 text-center mt-3 hover:text-black"
        >
          Еще нет аккаунта?{" "}
          <span className="text-black hover:underline">Регистрация</span>
        </a>
      </div>
    </ParallaxBackground>
  );
};