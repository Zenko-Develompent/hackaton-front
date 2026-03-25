// entities/auth/api/auth.api.ts
import { api } from "@/shared/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshResponse,
  LogoutResponse,
} from "../model/types";

export const authApi = {
  // Регистрация - показываем уведомления
  register: (data: RegisterRequest) =>
    api().post<RegisterResponse>("/auth/register", data, {
      showNotification: {
        onSuccess: (message, data) => ({
          title: "Регистрация",
          message: data?.needVerify 
            ? "Регистрация успешна! Проверьте вашу почту для подтверждения."
            : "Регистрация успешна! Теперь вы можете войти."
        }),
        onError: (message) => ({
          title: "Ошибка регистрации",
          message: message.includes("username already exists") 
            ? "Пользователь с таким именем уже существует"
            : message.includes("email already exists")
            ? "Пользователь с таким email уже существует"
            : "Не удалось зарегистрироваться. Попробуйте позже."
        }),
      },
    }),

  // Логин - уведомления будут показаны в AuthProvider, но можно добавить и здесь
  login: (data: LoginRequest) =>
    api().post<LoginResponse>("/auth/login", data, {
      showNotification: {
        onSuccess: (message, data) => ({
          title: "Успешный вход",
          message: `Добро пожаловать, ${data?.user?.username || data?.user?.email || 'пользователь'}!`,
        }),
        onError: (message) => ({
          title: "Ошибка входа",
          message: "Неверный email/username или пароль",
        }),
      },
    }),

  // Обновление токена - скрываем уведомления, чтобы не беспокоить пользователя
  refresh: () =>
    api().post<RefreshResponse>("/auth/refresh", undefined, {
      auth: true,
      showNotification: false, // Не показываем уведомления для фоновых операций
    }),

  // Выход - уведомления покажет AuthProvider
  logout: (refreshToken?: string) =>
    api().post<LogoutResponse>(
      "/auth/logout",
      { refreshToken },
      {
        auth: true,
        showNotification: {
          onSuccess: () => ({
            title: "Выход",
            message: "Вы успешно вышли из системы",
          }),
          onError: (message) => ({
            title: "Ошибка",
            message: "Не удалось выйти из системы, но данные очищены",
          }),
        },
      },
    ),
};