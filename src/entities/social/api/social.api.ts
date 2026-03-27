// entities/social/api/social.api.ts

import { api } from "@/shared/api/client";
import type {
  FriendRequestsResponse,
  FriendsResponse,
  UserSearchResponse,
  SendFriendRequestResponse,
  FriendRequestActionResponse,
  ChatsResponse,
  ChatMessagesResponse,
  CreateChatResponse,
  SendMessageRequest,
  SendMessageResponse,
  EditMessageRequest,
  EditMessageResponse,
  DeleteMessageResponse,
  MarkReadResponse,
} from "../model/types";

export const socialApi = {
  // Друзья
  sendFriendRequest: (userId: string) =>
    api().post<SendFriendRequestResponse>('/social/friends/requests', { userId }, { auth: true }),

  getIncomingRequests: (limit?: number) =>
    api().get<FriendRequestsResponse>('/social/friends/requests/incoming', {
      params: { limit },
      auth: true,
    }),

  getOutgoingRequests: (limit?: number) =>
    api().get<FriendRequestsResponse>('/social/friends/requests/outgoing', {
      params: { limit },
      auth: true,
    }),

  acceptFriendRequest: (requestId: string) =>
    api().post<FriendRequestActionResponse>(`/social/friends/requests/${requestId}/accept`, undefined, { auth: true }),

  rejectFriendRequest: (requestId: string) =>
    api().post<FriendRequestActionResponse>(`/social/friends/requests/${requestId}/reject`, undefined, { auth: true }),

  getFriends: (limit?: number) =>
    api().get<FriendsResponse>('/social/friends', {
      params: { limit },
      auth: true,
    }),

  removeFriend: (friendUserId: string) =>
    api().del<void>(`/social/friends/${friendUserId}`, { auth: true }),

  searchUsers: (query: string, limit?: number) =>
    api().get<UserSearchResponse>('/social/users/search', {
      params: { q: query, limit },
      auth: true,
    }),

  // Чаты
  createPrivateChat: (otherUserId: string) =>
    api().post<CreateChatResponse>(`/social/chats/private/${otherUserId}`, undefined, { auth: true }),

  getChats: (limit?: number) =>
    api().get<ChatsResponse>('/social/chats', {
      params: { limit },
      auth: true,
    }),

  getChatMessages: (chatId: string, beforeMessageId?: number, limit?: number) =>
    api().get<ChatMessagesResponse>(`/social/chats/${chatId}/messages`, {
      params: { beforeMessageId, limit },
      auth: true,
    }),

  sendMessage: (chatId: string, data: SendMessageRequest) =>
    api().post<SendMessageResponse>(`/social/chats/${chatId}/messages`, data, { auth: true }),

  editMessage: (chatId: string, messageId: number, data: EditMessageRequest) =>
    api().put<EditMessageResponse>(`/social/chats/${chatId}/messages/${messageId}`, data, { auth: true }),

  deleteMessage: (chatId: string, messageId: number) =>
    api().del<DeleteMessageResponse>(`/social/chats/${chatId}/messages/${messageId}`, { auth: true }),

  markChatRead: (chatId: string, lastReadMessageId?: number) =>
    api().post<MarkReadResponse>(`/social/chats/${chatId}/read`, { lastReadMessageId }, { auth: true }),
};