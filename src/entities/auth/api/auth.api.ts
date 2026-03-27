// entities/auth/api/auth.api.ts

import { api } from "@/shared/api/client";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  RefreshRequest,
  RefreshResponse,
  LogoutRequest,
  LogoutResponse,
  ProfileResponse,
  PublicProfileResponse,
} from "../model/types";

export const authApi = {
  // Регистрация
  register: (data: RegisterRequest) =>
    api().post<RegisterResponse>("/auth/register", data, {
      auth: false,
    }),

  // Логин
  login: (data: LoginRequest) =>
    api().post<LoginResponse>("/auth/login", data, {
      auth: false,
    }),

  // Обновление токена
  refresh: (data?: RefreshRequest) =>
    api().post<RefreshResponse>("/auth/refresh", data, {
      auth: false,
    }),

  // Выход
  logout: (data?: LogoutRequest) =>
    api().post<LogoutResponse>("/auth/logout", data, {
      auth: true,
    }),

  // Получение приватного профиля текущего пользователя
  getProfile: () =>
    api().get<ProfileResponse>("/auth/profile", {
      auth: true,
    }),
};



export const userApi = {
  // Получение публичного профиля пользователя по ID
  getPublicProfile: (userId: string) =>
    api().get<PublicProfileResponse>(`/users/${userId}/profile`),

  // Получение публичного профиля пользователя по username
  getPublicProfileByUsername: (username: string) =>
    api().get<PublicProfileResponse>(`/users/by-username/${username}/profile`),
};