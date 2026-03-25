export interface UserShort {
  id: string;
  username: string;
  email?: string;
}

export interface LoginRequest {
  id?: string;
  email?: string;
  username?: string;
  password: string;
}

export interface AuthTokens {
  accessToken: string;
  accessExpiresAt: string;
  refreshToken: string;
  refreshExpiresAt: string;
}

export interface LoginResponse extends AuthTokens {
  deviceId: string;
  sessionId: string;
  sessionKey: string;
  sessionKeyIv: string;
  user: UserShort;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface RegisterResponse {
  needVerify: boolean;
  ticket: string;
  email: string;
  resendAfterSec: number;
}

export interface RefreshResponse extends AuthTokens {
  sessionId?: string;
  deviceId?: string;
}

export interface LogoutResponse {
  ok: boolean;
}
