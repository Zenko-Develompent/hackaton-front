// app/parent/add-child/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { 
  ArrowLeft, 
  UserPlus, 
  Search, 
  Users, 
  Mail,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  Hand
} from "lucide-react";
import { useAuth } from "@/features/auth/useAuth";
import { useAlert } from "@/features/alert/alert-store";
import { parentApi } from "@/entities/parent/api/parent.api";
import { userApi } from "@/entities/auth/api/auth.api";
import { BreadcrumbNavigation } from "@/widgets/BreadcrumbNavigation ";

export default function AddChildPage() {
  const router = useRouter();
  const { user, isAuth } = useAuth();
  const showAlert = useAlert();
  
  const [username, setUsername] = useState("");
  const [searchResult, setSearchResult] = useState<any>(null);
  const [searching, setSearching] = useState(false);
  const [sending, setSending] = useState(false);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Формируем хлебные крошки
  const breadcrumbItems = [
    { label: "Профиль", href: "/profile/" + username },
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
          <Button onClick={() => router.push("/")} size="lg" className="text-base" variant="default">
            На главную
          </Button>
        </div>
      </Container>
    );
  }

  const handleSearch = async () => {
    if (!username.trim()) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Введите имя пользователя",
        autoClose: 3000,
      });
      return;
    }

    if (username === user?.username) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Вы не можете добавить самого себя",
        autoClose: 3000,
      });
      return;
    }

    setSearching(true);
    setError(null);
    setSearched(true);
    setSearchResult(null);

    try {
      const result = await userApi.getPublicProfileByUsername(username);
      setSearchResult(result);
      
      if (result.role !== "student") {
        showAlert({
          variant: "destructive",
          title: "Ошибка",
          description: "Добавлять можно только пользователей с ролью 'Ученик'",
          autoClose: 3000,
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      setError("Пользователь не найден");
      showAlert({
        variant: "destructive",
        title: "Пользователь не найден",
        description: `Пользователь с именем "${username}" не существует`,
        autoClose: 3000,
      });
    } finally {
      setSearching(false);
    }
  };

  const auth = useAuth();

  const handleSendRequest = async () => {
    
    if (!searchResult?.userId) return;

    setSending(true);
    try {
        
      await parentApi.sendRequest(searchResult.userId);
      showAlert({
        variant: "success",
        title: "Заявка отправлена!",
        description: `Заявка на родительский контроль для ${searchResult.username} успешно отправлена. Дождитесь подтверждения.`,
        autoClose: 5000,
      });
      
      // Очищаем форму
      setUsername("");
      setSearchResult(null);
      setSearched(false);
      setSending(false);
      
      // Предлагаем перейти к списку детей
      setTimeout(() => {
    
          router.push("/parent/requests");

      }, 500);
    } catch (err: any) {
      console.error("Send request error:", err);
      let errorMessage = "Не удалось отправить заявку";
      if (err.message?.includes("already exists")) {
        errorMessage = "Заявка уже отправлена или пользователь уже является вашим ребёнком";
      } else if (err.message?.includes("self")) {
        errorMessage = "Вы не можете отправить заявку самому себе";
      }
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: errorMessage,
        autoClose: 3000,
      });
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <Container>
      <BreadcrumbNavigation showHome={true} items={breadcrumbItems} />
      
      <div className="py-10">
        {/* Заголовок */}
        <div className="flex items-center gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-3xl font-semibold">Родительский контроль</h1>
            </div>
            <p className="text-gray-500 mt-1">
              Отправьте заявку на родительский контроль
            </p>
          </div>
        </div>

        {/* Информационная карточка */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 mb-8">
          <div className="flex gap-3">
            <Users className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-800">Как это работает</h3>
              <p className="text-sm text-blue-700 mt-1">
                1. Введите имя пользователя ребёнка<br />
                2. Отправьте заявку на родительский контроль<br />
                3. Ребёнок должен принять заявку<br />
                4. После подтверждения вы сможете видеть прогресс ребёнка
              </p>
            </div>
          </div>
        </div>

        {/* Поиск пользователя */}
        <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8">
          <Field>
            <FieldLabel>Имя пользователя ребёнка</FieldLabel>
            <div className="flex gap-3">
              <Input
                placeholder="Введите имя пользователя"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={searching || sending}
                className="flex-1"
              />
              <Button
                onClick={handleSearch}
                disabled={searching || !username.trim() || sending}
                className="gap-2 text-base h-10"
              >
                {searching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4"  />
                )}
                Найти
              </Button>
            </div>
          </Field>

          {/* Результат поиска */}
          {searched && !searching && (
            <div className="mt-6">
              {error ? (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
                  <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                  <p className="text-red-600">{error}</p>
                  <p className="text-sm text-red-500 mt-1">
                    Проверьте правильность написания имени
                  </p>
                </div>
              ) : searchResult ? (
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center text-2xl">
                      {searchResult.username.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        @{searchResult.username}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-sm text-gray-500">
                          Уровень {searchResult.level}
                        </span>
                        <span className="text-sm text-gray-500">
                          {searchResult.exp || 0} XP
                        </span>
                      </div>
                      {searchResult.role === "student" ? (
                        <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                          <CheckCircle className="w-4 h-4" />
                          <span>Ученик</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 mt-2 text-orange-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>Роль: Родитель</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {searchResult.role === "student" ? (
                    <Button
                      onClick={handleSendRequest}
                      disabled={sending}
                      className="w-full mt-4 gap-2 text-base"
                      size="lg"
                    >
                      {sending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <UserPlus className="w-4 h-4" />
                      )}
                      {sending ? "Отправка..." : "Отправить заявку"}
                    </Button>
                  ) : (
                    <div className="mt-4 p-3 bg-yellow-50 rounded-xl text-center text-sm text-yellow-700">
                      Можно добавлять только учеников
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </div>

        {/* Кнопка перехода к списку детей */}
        <div className="text-center flex justify-center gap-2">
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
            onClick={() => router.push("/profile/" + auth.user?.username)}
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