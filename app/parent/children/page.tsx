// app/parent/children/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Users,
  UserPlus,
  ChevronRight,
  Calendar,
  Star,
  Loader2,
  AlertCircle,
  Hand,
  User,
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useAlert } from "@/features/alert/alert-store";
import { parentApi } from "@/entities/parent/api/parent.api";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";

export default function ChildrenPage() {
   document.title="Доки Доки | Родительский контроль"
  const router = useRouter();
  const { user, isAuth } = useAuth();
  const showAlert = useAlert();

  const [children, setChildren] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChildren = async () => {
      try {
        const response = await parentApi.getChildren();
        setChildren(response.items);
      } catch (err) {
        console.error("Failed to fetch children:", err);
        showAlert({
          variant: "destructive",
          title: "Ошибка",
          description: "Не удалось загрузить список детей",
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    if (isAuth && user?.role === "parent") {
      fetchChildren();
    }
  }, [isAuth, user, showAlert]);

  const breadcrumbItems = [
    { label: "Профиль", href: "/profile/" + user?.username },
    { label: "Родительский контроль", href: "/parent/children" },
    { label: "Добавить ребёнка" },
  ];

  // Проверка, что пользователь - родитель
  if (!isAuth && user?.role !== "parent") {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20 text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Доступ ограничен
          </h1>
          <p className="text-gray-600 mb-8 max-w-md">
            Эта страница доступна только для пользователей с ролью "Родитель".
          </p>
          <Button
            onClick={() => router.push("/")}
            size="lg"
            className="text-base"
            variant="default"
          >
            На главную
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
      <div className="py-10 ">
        {/* Заголовок */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-3xl font-semibold">Мои дети</h1>
              </div>
              <p className="text-gray-500 mt-1">
                Управление родительским контролем
              </p>
            </div>
          </div>
        </div>

        {/* Список детей */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl border border-gray-100 p-4 animate-pulse"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-24" />
                  </div>
                  <div className="w-5 h-5 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-16 bg-gray-50 rounded-2xl">
            <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Нет детей</h3>
            <p className="text-gray-500 mb-6">
              У вас пока нет добавленных детей
            </p>
            <Button onClick={() => router.push("/parent/add-child")}>
              Добавить ребёнка
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => (
              <div
                key={child.childUserId}
                className="bg-white rounded-2xl border border-gray-100 p-4  transition-shadow cursor-pointer"
                onClick={() =>
                  router.push(`/profile/${user?.username}`)
                }
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                    <span className="text-xl font-semibold text-primary">
                      {child.childUsername.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg">
                      {child.childUsername}
                    </h3>
                    <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />с{" "}
                        {new Date(child.since).toLocaleDateString("ru-RU")}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Кнопка перехода к списку детей */}
        <div className="text-center flex justify-center gap-2 mt-10">
          <Button
            variant="outline"
            onClick={() => router.push("/parent/children")}
            className="gap-2"
          >
            <Users className="w-4 h-4" />
            Мои дети
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/parent/requests")}
            className="gap-2"
          >
            <Hand className="w-4 h-4" />
            Мои запросы
          </Button>
          <Button
            variant="outline"
            onClick={() => router.push("/profile/" + user?.userId)}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            Личный кабинет
          </Button>
        </div>
      </div>
    </Container>
  );
}
