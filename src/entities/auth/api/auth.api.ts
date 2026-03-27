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
    api().post<RegisterResponse>("/auth/register", data, ),

  // Логин - уведомления будут показаны в AuthProvider, но можно добавить и здесь
  login: (data: LoginRequest) =>
    api().post<LoginResponse>("/auth/login", data, ),
      

  // Обновление токена - скрываем уведомления, чтобы не беспокоить пользователя
  refresh: () =>
    api().post<RefreshResponse>("/auth/refresh", undefined, {
      auth: true,
    }),

  // Выход - уведомления покажет AuthProvider
  logout: (refreshToken?: string) =>
    api().post<LogoutResponse>(
      "/auth/logout",
      { refreshToken },
      {
        auth: true
      },
    ),
};