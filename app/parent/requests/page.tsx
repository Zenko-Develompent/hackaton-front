// app/parent/requests/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  Check,
  X,
  Clock,
  UserPlus,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useAlert } from "@/features/alert/alert-store";
import { parentApi } from "@/entities/parent/api/parent.api";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";

interface ParentRequest {
  requestId: string;
  parentUserId: string;
  parentUsername: string;
  childUserId: string;
  childUsername: string;
  status: "PENDING" | "ACCEPTED" | "REJECTED";
  createdAt: string;
  respondedAt: string | null;
}

export default function ParentRequestsPage() {
  const router = useRouter();
  const { user, isAuth } = useAuth();
  const showAlert = useAlert();

  const [incomingRequests, setIncomingRequests] = useState<ParentRequest[]>([]);
  const [outgoingRequests, setOutgoingRequests] = useState<ParentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"incoming" | "outgoing">(
    "incoming",
  );

  // Загрузка заявок
  const loadRequests = async () => {
    try {
      if (user?.role === "student") {
        const [incoming] = await Promise.all([parentApi.getIncomingRequests()]);
        setIncomingRequests(incoming.items);
      } else {
        const [outgoing] = await Promise.all([parentApi.getOutgoingRequests()]);
        setOutgoingRequests(outgoing.items);
      }
    } catch (err) {
      console.error("Failed to load requests:", err);
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить заявки",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuth) {
      loadRequests();
    }
  }, [isAuth]);

  // Принятие заявки
  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await parentApi.acceptRequest(requestId);
      showAlert({
        variant: "success",
        title: "Заявка принята",
        description: "Теперь родитель может видеть ваш прогресс",
        autoClose: 3000,
      });
      loadRequests();
    } catch (err) {
      console.error("Failed to accept request:", err);
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось принять заявку",
        autoClose: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Отклонение заявки
  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await parentApi.rejectRequest(requestId);
      showAlert({
        variant: "default",
        title: "Заявка отклонена",
        description: "Заявка на родительский контроль отклонена",
        autoClose: 3000,
      });
      loadRequests();
    } catch (err) {
      console.error("Failed to reject request:", err);
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отклонить заявку",
        autoClose: 3000,
      });
    } finally {
      setProcessingId(null);
    }
  };

  // Проверка роли
  if (!isAuth && user?.role !== "student") {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ ограничен
          </h1>
          <p className="text-gray-600 mb-8">
            Эта страница доступна только для учеников
          </p>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="text-base"
          >
            На главную
          </Button>
        </div>
      </Container>
    );
  }

  const breadcrumbItems = [
    { label: "Мой профиль", href: `/profile/${user?.username}` },
    { label: "Заявки родителей" },
  ];

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />

      <div className="py-10">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold">Заявки родителей</h1>
              </div>
              <p className="text-gray-500 mt-1">
                Управление запросами на родительский контроль
              </p>
            </div>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex gap-4 border-b mb-6">
          {user?.role === "student" && (
            <button
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === "incoming"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("incoming")}
            >
              <div className="flex items-center gap-2">
                <UserPlus className="w-4 h-4" />
                Входящие заявки ({incomingRequests.length})
              </div>
            </button>
          )}
          {user?.role === "parent" && (
            <button
              className={`pb-3 px-2 font-medium transition-colors ${
                activeTab === "outgoing"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("outgoing")}
            >
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Исходящие заявки ({outgoingRequests.length})
              </div>
            </button>
          )}
        </div>

        {/* Входящие заявки */}
        {activeTab === "incoming" && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : incomingRequests.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Нет входящих заявок
                </h3>
                <p className="text-gray-500">
                  Когда родители отправят вам заявку, она появится здесь
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {incomingRequests.map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white rounded-2xl border border-gray-100 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-xl font-semibold text-primary">
                            {request.parentUsername.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg">
                            {request.parentUsername}
                          </h3>
                          <p className="text-sm text-gray-500">
                            Хочет получать информацию о вашем прогрессе
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Заявка от{" "}
                            {new Date(request.createdAt).toLocaleDateString(
                              "ru-RU",
                            )}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleReject(request.requestId)}
                          disabled={processingId === request.requestId}
                          className="gap-1 text-red-600 hover:text-red-700"
                        >
                          {processingId === request.requestId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <X className="w-4 h-4" />
                          )}
                          Отклонить
                        </Button>
                        <Button
                          size="sm"
                          onClick={() => handleAccept(request.requestId)}
                          disabled={processingId === request.requestId}
                          className="gap-1"
                        >
                          {processingId === request.requestId ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          Принять
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {/* Исходящие заявки */}
        {activeTab === "outgoing" && (
          <>
            {loading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
              </div>
            ) : outgoingRequests.length === 0 ? (
              <div className="text-center py-16 bg-gray-50 rounded-2xl">
                <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-10 h-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Нет исходящих заявок
                </h3>
                <p className="text-gray-500">
                  Вы еще не отправляли заявки родителям
                </p>
                <Button
                  variant="link"
                  onClick={() => router.push("/parent/add-child")}
                  className="mt-2"
                >
                  Отправить заявку
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {outgoingRequests.map((request) => (
                  <div
                    key={request.requestId}
                    className="bg-white rounded-2xl border border-gray-100 p-5 opacity-70"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-gray-500">
                          {request.childUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">
                          {request.childUsername}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-sm text-yellow-600 flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            Ожидает подтверждения
                          </span>
                          <span className="text-xs text-gray-400">
                            Отправлено{" "}
                            {new Date(request.createdAt).toLocaleDateString(
                              "ru-RU",
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </Container>
  );
}
