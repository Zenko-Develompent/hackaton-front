// app/profile/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import { 
  MessageCircle, 
  Share2, 
  Edit2, 
  Award, 
  Calendar,
  Mail,
  User,
  Star,
  TrendingUp
} from "lucide-react";
import { authApi } from "@/entities/auth/api/auth.api";
import type { UserProfile, Achievement } from "@/entities/auth/model/types";
import { ScreenLoader } from "@/widgets/ScreenLoader/ScreenLoader";

export default function ProfilePage() {
  const router = useRouter();
  const { isAuth, logout } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"achievements" | "stats">("achievements");

  useEffect(() => {
    if (!isAuth) {
      router.push("/login");
      return;
    }

    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await authApi.getProfile();
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Не удалось загрузить профиль");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [isAuth, router]);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Мой профиль",
          text: `Посмотрите мой профиль на платформе!`,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      // Fallback - копируем ссылку
      navigator.clipboard.writeText(window.location.href);
      alert("Ссылка скопирована в буфер обмена");
    }
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  const handleChat = () => {
    router.push("/messages");
  };

  if (loading) {
    return <ScreenLoader />;
  }

  if (error || !profile) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
          <p className="text-red-500 mb-4">{error || "Профиль не найден"}</p>
          <Button onClick={() => window.location.reload()}>
            Попробовать снова
          </Button>
        </div>
      </Container>
    );
  }

  // Демо-данные для ачивок (в реальности будут из API)
  const achievements: Achievement[] = [
    {
      id: "1",
      name: "Первый шаг",
      description: "Завершите первый урок",
      icon: "🎯",
      earnedAt: "2024-01-15",
    },
    {
      id: "2",
      name: "Усердный ученик",
      description: "Пройдите 10 уроков",
      icon: "📚",
      earnedAt: "2024-02-20",
    },
    {
      id: "3",
      name: "Мастер кода",
      description: "Напишите 100 строк кода",
      icon: "💻",
      earnedAt: "2024-03-10",
    },
    {
      id: "4",
      name: "Помощник",
      description: "Помогите другим студентам",
      icon: "🤝",

    },
    {
      id: "5",
      name: "Эксперт",
      description: "Достигните 10 уровня",
      icon: "⭐",

    },
  ];

  const earnedCount = achievements.filter(a => a.earnedAt).length;

  return (
    <Container>
      <div className=" py-10">
        {/* Hero секция */}
        <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-[40px] p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            {/* Аватар */}
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-4xl">
              {profile.username.charAt(0).toUpperCase()}
            </div>
            
            {/* Информация */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl">@{profile.username}</h1>
                <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                  <Star className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium">Уровень {profile.level}</span>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>В системе с 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{earnedCount} из {achievements.length} ачивок</span>
                </div>
              </div>
            </div>
            
            {/* Кнопки действий */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="lg"
                onClick={handleChat}
                className="gap-2 text-[16px]"
              >
                <MessageCircle className="w-4 h-4" />
                Чат
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
                className="gap-2 text-[16px]"
              >
                <Share2 className="w-4 h-4" />
                Поделиться
              </Button>
              <Button
                variant="default"
                size="lg"
                onClick={handleEdit}
                className="gap-2 text-[16px]"
              >
                <Edit2 className="w-4 h-4" />
                Редактировать
              </Button>
            </div>
          </div>
        </div>

        {/* Статистика */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">Всего XP</p>
            <p className="text-2xl font-semibold text-primary">1,250</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">Пройдено уроков</p>
            <p className="text-2xl font-semibold text-primary">12</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border">
            <p className="text-sm text-gray-500 mb-1">Завершено курсов</p>
            <p className="text-2xl font-semibold text-primary">2</p>
          </div>
        </div>

        {/* Вкладки */}
        <div className="flex gap-4 border-b mb-6">
          <button
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === "achievements"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4" />
              Достижения
            </div>
          </button>
          <button
            className={`pb-3 px-2 font-medium transition-colors ${
              activeTab === "stats"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("stats")}
          >
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Статистика
            </div>
          </button>
        </div>

        {/* Контент вкладок */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  achievement.earnedAt
                    ? "border-primary/20 bg-primary/5"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {achievement.name}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {achievement.description}
                    </p>
                    {achievement.earnedAt && (
                      <p className="text-xs text-green-600 mt-2">
                        Получено {new Date(achievement.earnedAt).toLocaleDateString("ru-RU")}
                      </p>
                    )}
                    {!achievement.earnedAt && (
                      <p className="text-xs text-gray-400 mt-2">
                        Ещё не получено
                      </p>
                    )}
                  </div>
                  <div className="text-3xl">{achievement.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Прогресс по курсам</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Создай свою первую игру</span>
                    <span>75%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "75%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>React для начинающих</span>
                    <span>40%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "40%" }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Python для анализа данных</span>
                    <span>20%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: "20%" }} />
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Активность</h3>
              <div className="flex items-center justify-between">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">15</p>
                  <p className="text-sm text-gray-500">дней подряд</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">48</p>
                  <p className="text-sm text-gray-500">часов обучения</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">89%</p>
                  <p className="text-sm text-gray-500">посещаемость</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}