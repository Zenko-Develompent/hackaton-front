import { api } from '@/shared/api/client';
import type {
  ValidateEmailResponse,
  ValidateUsernameResponse,
} from '../model/types';

export const validationApi = {
  checkEmail: (email: string) =>
    api().get<ValidateEmailResponse>(
      `/validate/email?email=${encodeURIComponent(email)}`
    ),

  checkUsername: (username: string) =>
    api().get<ValidateUsernameResponse>(
      `/validate/username?username=${encodeURIComponent(username)}`
    ),
};
