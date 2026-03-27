// entities/auth/model/types.ts

export type User = {
  id: string;
  username: string;
  birthDate?: string;
  age?: number;
  role: 'student' | 'parent' | 'admin';
  xp?: number;
  level?: number;
};

export type UserProfile = {
  username: string;
  level: number;
  achievements: Achievement[];
};

export type Achievement = {
  id: string;
  name: string;
  description: string;
  icon?: string;
  earnedAt?: string;
};

export type AuthTokens = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

export type LoginRequest = {
  username: string;
  password: string;
};

export type LoginResponse = AuthTokens & {
  user: User;
};

export type RegisterRequest = {
  username: string;
  password: string;
  age: string;
  role: 'student' | 'parent';
};

// Обновляем тип ответа регистрации - теперь он такой же как LoginResponse
export type RegisterResponse = AuthTokens & {
  user: User;
};

export type RefreshResponse = AuthTokens;

export type LogoutResponse = {
  ok: boolean;
};