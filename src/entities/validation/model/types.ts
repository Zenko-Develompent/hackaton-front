export interface ValidateEmailResponse {
  format: boolean;
  mx: boolean;
  available: boolean;
}

export interface ValidateUsernameResponse {
  valid: boolean;
  available: boolean;
  reason?: string;
}
