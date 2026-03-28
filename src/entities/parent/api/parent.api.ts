// entities/parent/api/parent.api.ts

import { api } from "@/shared/api/client";
import type {
  ParentControlRequestsResponse,
  SendParentControlRequestResponse,
  ParentControlActionResponse,
  ParentChildrenResponse,
  ChildDashboard,
} from "../model/types";

export const parentApi = {
  // Заявки родительского контроля
  sendRequest: (childUserId: string) =>
    api().post<SendParentControlRequestResponse>('/parent/requests', { childUserId }, { auth: true }),

  getOutgoingRequests: (limit?: number) =>
    api().get<ParentControlRequestsResponse>('/parent/requests/outgoing', {
      auth: true,
    }),

  getIncomingRequests: (limit?: number) =>
    api().get<ParentControlRequestsResponse>('/parent/requests/incoming', {
      params: { limit },
      auth: true,
    }),

  acceptRequest: (requestId: string) =>
    api().post<ParentControlActionResponse>(`/parent/requests/${requestId}/accept`, undefined, { auth: true }),

  rejectRequest: (requestId: string) =>
    api().post<ParentControlActionResponse>(`/parent/requests/${requestId}/reject`, undefined, { auth: true }),

  // Дети родителя
  getChildren: () =>
    api().get<ParentChildrenResponse>('/parent/children', { auth: true }),

  // Дашборд ребёнка
  getChildDashboard: (childId: string) =>
    api().get<ChildDashboard>(`/parent/children/${childId}/dashboard`, { auth: true }),
};