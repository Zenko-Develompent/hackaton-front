import { api } from '@/shared/api/client';
import type { UserProfile, UpdateProfileRequest } from "../model/types";

export const userApi = {
  getProfile: () =>
    api().get<UserProfile>('/profile', {
      auth: true,
    }),

  updateProfile: (data: UpdateProfileRequest) =>
    api().put<void>('/profile', data, {
      auth: true,
    }),

  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    return api().post<{ avatarUrl: string }>(
      '/profile/avatar',
      formData,
      { auth: true }
    );
  },
};