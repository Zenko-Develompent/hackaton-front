// entities/auth/model/types.ts

export type User = {
  id: string;
  username: string;
  birthDate?: string;
  age?: number;
  role: 'student' | 'parent';
  xp: number;
  level: number;
  coins: number;
};

export type UserProfile = {
  userId: string;
  role: 'student' | 'parent';
  username: string;
  xp: number;
  level: number;
  coins: number;
  achievements: UserAchievement[];
};

export type UserPublicProfile = {
  userId?: string;
  username: string;
  level: number;
  exp: number;
  achievements: UserAchievement[];
  role: 'student' | 'parent';
};

export type UserAchievement = {
  achievementId: string;
  name: string;
};

export type AuthTokens = {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
};

export type LoginRequest = {
  id: string; // может быть username
  password: string;
};

export type LoginResponse = AuthTokens & {
  user: User;
};

export type RegisterRequest = {
  username: string;
  password: string;
  age: number;
  role: 'student' | 'parent';
};

export type RegisterResponse = AuthTokens & {
  
  user: User;
};

export type RefreshRequest = {
  refreshToken?: string;
};

export type RefreshResponse = AuthTokens & {
  user: User;
};

export type LogoutRequest = {
  refreshToken?: string;
};

export type LogoutResponse = Record<string, never>; // пустой ответ

export type ProfileResponse = UserProfile;

export type PublicProfileResponse = UserPublicProfile;