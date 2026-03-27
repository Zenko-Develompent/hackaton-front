// entities/auth/api/auth.api.ts

import { api } from "@/shared/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshResponse,
  LogoutResponse,
  UserProfile,
} from "../model/types";

export const authApi = {
  // Логин
  login: (data: LoginRequest) =>
    api().post<LoginResponse>("/auth/login", data, {
      auth: false,
    }),

  // Регистрация - теперь возвращает токены
  register: (data: RegisterRequest) =>
    api().post<RegisterResponse>("/auth/register", data, {
      auth: false,
    }),

  // Получение профиля пользователя (требуется токен)
  getProfile: () =>
    api().get<UserProfile>("/auth/profile", {
      auth: true,
    }),

  // Обновление токена
  refresh: () =>
    api().post<RefreshResponse>("/auth/refresh", undefined, {
      auth: true,
    }),

  // Выход
  logout: (refreshToken?: string) =>
    api().post<LogoutResponse>(
      "/auth/logout",
      { refreshToken },
      {
        auth: true,
      }
    ),
};