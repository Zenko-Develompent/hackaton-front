// entities/social/model/types.ts

export type FriendStatus = 'ACCEPTED' | 'OUTGOING_REQUEST' | 'INCOMING_REQUEST' | null;

export type FriendRequest = {
  requestId: string;
  requesterUserId: string;
  requesterUsername: string;
  receiverUserId: string;
  receiverUsername: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
  createdAt: string;
  respondedAt: string | null;
};

export type Friend = {
  userId: string;
  username: string;
  since: string;
};

export type FriendRequestsResponse = {
  items: FriendRequest[];
};

export type FriendsResponse = {
  items: Friend[];
};

export type UserSearchResult = {
  userId: string;
  username: string;
  friendStatus: FriendStatus;
};

export type UserSearchResponse = {
  users: UserSearchResult[];
};

export type SendFriendRequestResponse = {
  requestId: string;
  status: string;
};

export type FriendRequestActionResponse = {
  requestId: string;
  status: string;
};

export type Chat = {
  chatId: string;
  otherUserId: string;
  otherUsername: string;
  lastMessage: ChatMessage | null;
  unreadCount: number;
  updatedAt: string;
};

export type ChatsResponse = {
  items: Chat[];
};

export type ChatMessage = {
  messageId: number;
  chatId: string;
  senderUserId: string;
  text: string;
  replyToMessageId: number | null;
  createdAt: string;
};

export type ChatMessagesResponse = {
  items: ChatMessage[];
};

export type CreateChatResponse = {
  chatId: string;
  otherUserId: string;
  created: boolean;
};

export type SendMessageRequest = {
  text: string;
  replyToMessageId?: number | null;
};

export type SendMessageResponse = {
  message: ChatMessage;
};

export type EditMessageRequest = {
  text: string;
};

export type EditMessageResponse = {
  message: ChatMessage;
};

export type DeleteMessageResponse = {
  deleted: boolean;
  messageId: number;
};

export type MarkReadResponse = {
  ok: boolean;
  lastReadMessageId: number;
};