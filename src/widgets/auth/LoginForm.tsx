"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "@/entities/auth/api/auth.api";
import { useAuth } from "@/features/auth/useAuth";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { useAlert } from "@/features/alert/alert-store";
import { Field, FieldLabel } from "@/components/ui/field";

export const LoginForm = () => {
  const showAlert = useAlert();
  const router = useRouter();
  const { login } = useAuth();

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault(); // 👈 добавил preventDefault
    
    if (!identifier.trim() || !password.trim()) {
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
      const data = await authApi.login({
        email: identifier.includes("@") ? identifier : undefined,
        username: !identifier.includes("@") ? identifier : undefined,
        password,
      });

      await login({
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
      });

      router.push("/profile");
    } catch (e) {
      showAlert({
        variant: "destructive",
        title: "Ошибка входа",
        description: "Неверный email/username или пароль",
        autoClose: 5000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center text-[16px]">
      <form
        onSubmit={handleSubmit}
        className="border border-[#E5E5E5] p-5 rounded-[40px] w-100 flex flex-col gap-4"
      >
        <h1 className="font-semibold text-[28px]">С возвращением!</h1>
        <p>Войдите, чтобы продолжить</p>
        <Field>
          <FieldLabel>Логин/Пароль</FieldLabel>
          <Input
            required={true}
            placeholder="Email или username"
            value={identifier}
            onChange={(e) => setIdentifier(e.target.value)}
            disabled={loading}
          />
        </Field>
        <Field>
          <FieldLabel>Пароль</FieldLabel>
          <Input
            type="password"
            placeholder="Пароль"
            value={password}
            required={true}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </Field>
        <a href="/" className="font-medium hover:underline w-fit">
          Забыли пароль?
        </a>

        <Button type="submit" className="w-full text-[16px]" disabled={loading} size="lg">
          {loading ? "Загрузка..." : "Войти"}
        </Button>
      </form>
      <a
        href="/register"
        className="font-medium text-black/60 text-center mt-3"
      >
        Еще нет аккаунта? <span className="text-black hover:underline">Регистрация</span>
      </a>
    </div>
  );
};