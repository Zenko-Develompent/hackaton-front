// app/profile/[profile_slug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/features/auth/useAuth";
import { Container } from "@/widgets/container/Container";
import { Button } from "@/components/ui/button";
import {
  MessageCircle,
  Share2,
  Edit2,
  Award,
  Calendar,
  Star,
  TrendingUp,
  UserPlus,
  Check,
  Clock,
  Users,
  Crown,
  ChevronRight,
} from "lucide-react";
import { authApi, userApi } from "@/entities/auth/api/auth.api";
import { achievementApi } from "@/entities/achievement/api/achievement.api";
import { socialApi } from "@/entities/social/api/social.api";
import { parentApi } from "@/entities/parent/api/parent.api";
import { ScreenLoader } from "@/widgets/ScreenLoader/ScreenLoader";
import { useAlert } from "@/features/alert/alert-store";
import type {
  UserProfile,
  UserPublicProfile,
} from "@/entities/auth/model/types";
import type { Achievement } from "@/entities/achievement/model/types";
import type { FriendStatus } from "@/entities/social/model/types";

type ProfileViewType = "own" | "other" | "parent_child";

interface ChildDashboardData {
  child: {
    userId: string;
    username: string;
    xp: number;
    level: number;
    coins: number;
    lastActivityAt: string;
  };
  courses: Array<any>;
  modules: Array<any>;
  lessons: Array<any>;
  recentActivities: Array<any>;
}

export default function ProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { isAuth, user: currentUser } = useAuth();
  const showAlert = useAlert();

  const profileSlug = params.profile_slug as string;
  const isOwnProfile =
    profileSlug === "me" ||
    (currentUser && profileSlug === currentUser.username);

  const [profile, setProfile] = useState<UserProfile | UserPublicProfile | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [friendStatus, setFriendStatus] = useState<FriendStatus>(null);
  const [isParentView, setIsParentView] = useState(false);
  const [childDashboard, setChildDashboard] = useState<ChildDashboardData | null>(null);
  const [childrenList, setChildrenList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingChildren, setLoadingChildren] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"achievements" | "stats" | "progress" | "children">("achievements");
  const [isSendingRequest, setIsSendingRequest] = useState(false);

  const viewType: ProfileViewType = isOwnProfile ? "own" : isParentView ? "parent_child" : "other";
  const canEdit = viewType === "own";
  const canChat = isAuth && viewType === "other" && currentUser?.role !== "parent";
  const canAddFriend = isAuth && viewType === "other" && friendStatus === null && !isOwnProfile;
  const isFriend = friendStatus === "ACCEPTED";
  const hasPendingRequest = friendStatus === "OUTGOING_REQUEST";
  const isParent = currentUser?.role === "parent";
  const isCurrentUserStudent = currentUser?.role === "student";

  // Проверка, является ли профиль студентом
  const isStudent = (p: any): p is UserProfile => {
    return p?.role === "student";
  };

  // Загрузка списка детей для родителя
  const loadChildren = async () => {
    if (!isParent || isParentView) return;
    
    setLoadingChildren(true);
    try {
      const response = await parentApi.getChildren();
      setChildrenList(response.items);
    } catch (err) {
      console.error("Failed to load children:", err);
    } finally {
      setLoadingChildren(false);
    }
  };

  // Загрузка дашборда ребёнка (только для родителя, просматривающего ребёнка)
  const loadChildDashboard = async (childId: string) => {
    if (!isParent) return;
    
    setLoading(true);
    try {

      const dashboard = await parentApi.getChildDashboard(childId);
      
      setChildDashboard(dashboard);
      
      const childProfile: UserProfile = {
        userId: dashboard.child.userId,
        username: dashboard.child.username,
        xp: dashboard.child.xp,
        level: dashboard.child.level,
        coins: dashboard.child.coins,
        role: "student",
        achievements: [],
      };
      setProfile(childProfile);
      setIsParentView(true);
      setActiveTab("progress");
    } catch (err) {
      console.error("Failed to load child dashboard:", err);
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось загрузить данные ребёнка",
        autoClose: 3000,
      });
    } finally {
      setLoading(false);
    }
  };

  const auth = useAuth();
  // Загрузка профиля
  useEffect(() => {
    const fetchProfile = async () => {
      if (!profileSlug) return;

      try {
        setLoading(true);
        setError(null);

        if (isOwnProfile) {
          // Свой профиль
          const data = await authApi.getProfile();
          setProfile(data);

          const achievementsData = await achievementApi.getAchievements(true);
          setAchievements(
            achievementsData.items.sort(
              (a, b) => Number(b.unlocked) - Number(a.unlocked) || a.order - b.order,
            ),
          );
          
          // Если родитель и это свой профиль, загружаем список детей
          if (isParent) {
            await loadChildren();
          }
        } else {
          // Публичный профиль
          const data = await userApi.getPublicProfileByUsername(profileSlug);
          setProfile(data);

          const achievementsData = await achievementApi.getAchievements(false);
          setAchievements(
            achievementsData.items.sort(
              (a, b) => Number(b.unlocked) - Number(a.unlocked) || a.order - b.order,
            ),
          );

          // Если текущий пользователь родитель и просматривает кого-то
          if (isAuth && isParent && profileSlug === auth.user?.userId) {
            try {
              // Пытаемся загрузить дашборд (если просматриваемый пользователь - ребёнок)
              
              await loadChildDashboard(profileSlug);
            } catch (err) {
              // Если не ребёнок, то просто публичный профиль
              setIsParentView(false);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch profile:", err);
        setError("Профиль не найден");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [profileSlug, isAuth, currentUser, isParent, isOwnProfile]);

  const handleShare = async () => {
    const url = `${window.location.origin}/profile/${profileSlug}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Профиль ${profile?.username}`,
          text: `Посмотрите профиль ${profile?.username} на платформе!`,
          url: url,
        });
      } catch (err) {
        console.log("Share cancelled");
      }
    } else {
      navigator.clipboard.writeText(url);
      showAlert({
        variant: "success",
        title: "Ссылка скопирована",
        description: "Ссылка на профиль скопирована в буфер обмена",
        autoClose: 2000,
      });
    }
  };

  const handleEdit = () => {
    router.push("/profile/edit");
  };

  const handleChat = async () => {
    if (!profile?.username) return;
    router.push(`/messages/new?user=${profileSlug}`);
  };

  const handleSendFriendRequest = async () => {
    if (!profile?.username) return;

    setIsSendingRequest(true);
    try {
      setFriendStatus("OUTGOING_REQUEST");
      showAlert({
        variant: "success",
        title: "Заявка отправлена",
        description: "Заявка в друзья успешно отправлена",
        autoClose: 3000,
      });
    } catch (err) {
      showAlert({
        variant: "destructive",
        title: "Ошибка",
        description: "Не удалось отправить заявку",
        autoClose: 3000,
      });
    } finally {
      setIsSendingRequest(false);
    }
  };

  const handleRemoveFriend = async () => {
    showAlert({
      variant: "default",
      title: "В разработке",
      description: "Функция удаления из друзей скоро появится",
      autoClose: 2000,
    });
  };

  const earnedCount = achievements.filter((a) => a.unlocked).length;
  const totalAchievements = achievements.length;
  const isProfileStudent = profile?.role === "student";
  const isParentViewingChild = isParentView && childDashboard;

  // Определяем, какие вкладки показывать
  const showStatsTab = isProfileStudent && !isParentView && !isParentViewingChild;
  const showChildrenTab = isParent && !isParentView && !isParentViewingChild && isOwnProfile;
  const showProgressTab = isParentViewingChild;

  if (loading) {
    return <ScreenLoader />;
  }

  if (error || !profile) {
    return (
      <Container>
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-20">
          <p className="text-red-500 mb-4">{error || "Профиль не найден"}</p>
          <Button onClick={() => router.push("/")}>На главную</Button>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="py-10">
        {/* Hero секция */}
        <div className="bg-linear-to-r from-primary/10 to-primary/5 rounded-[40px] p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start md:items-center">
            <div className="w-24 h-24 bg-primary/20 rounded-full flex items-center justify-center text-4xl">
              {profile.username.charAt(0).toUpperCase()}
            </div>

            <div className="flex-1">
              <div className="flex items-center flex-wrap gap-3 mb-2">
                <h1 className="text-3xl">@{profile.username}</h1>
                {isParentViewingChild && (
                  <span className="flex items-center gap-1 bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-sm">
                    <Users className="w-4 h-4" />
                    Просмотр ребёнка
                  </span>
                )}
                {isProfileStudent && !isParentViewingChild && (
                  <div className="flex items-center gap-1 bg-primary/10 px-2 py-1 rounded-full">
                    <Star className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">Уровень {profile.level}</span>
                  </div>
                )}
                {isParent && !isParentViewingChild && !isParentView && isOwnProfile && (
                  <div className="flex items-center gap-1 bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-sm">
                    <Crown className="w-4 h-4" />
                    Родитель
                  </div>
                )}
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>В системе с 2024</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" />
                  <span>{earnedCount} из {totalAchievements} ачивок</span>
                </div>
              </div>
            </div>

            {/* Кнопки действий */}
            <div className="flex gap-2 flex-wrap">
              {canChat && (
                <Button variant="outline" size="lg" onClick={handleChat} className="gap-2 text-[16px]">
                  <MessageCircle className="w-4 h-4" />
                  Написать
                </Button>
              )}

              {/* Кнопка "Заявки родителей" - только для ученика в своём профиле */}
              {isCurrentUserStudent && isOwnProfile && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => router.push("/parent/requests")}
                  className="gap-2 text-[16px]"
                >
                  <Users className="w-4 h-4" />
                  Заявки родителей
                </Button>
              )}

              {canAddFriend && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleSendFriendRequest}
                  disabled={isSendingRequest}
                  className="gap-2 text-[16px]"
                >
                  <UserPlus className="w-4 h-4" />
                  Добавить в друзья
                </Button>
              )}

              {hasPendingRequest && (
                <Button variant="outline" size="lg" disabled className="gap-2 text-[16px]">
                  <Clock className="w-4 h-4" />
                  Заявка отправлена
                </Button>
              )}

              {isFriend && (
                <Button variant="outline" size="lg" onClick={handleRemoveFriend} className="gap-2 text-[16px]">
                  <Check className="w-4 h-4" />В друзьях
                </Button>
              )}

              <Button variant="outline" size="lg" onClick={handleShare} className="gap-2 text-[16px]">
                <Share2 className="w-4 h-4" />
                Поделиться
              </Button>

              {canEdit && (
                <Button variant="default" size="lg" onClick={handleEdit} className="gap-2 text-[16px]">
                  <Edit2 className="w-4 h-4" />
                  Редактировать
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Статистика для студента */}
        {isProfileStudent && !isParentViewingChild && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-4 border">
              <p className="text-sm text-gray-500 mb-1">Всего XP</p>
              <p className="text-2xl font-semibold text-primary">{isStudent(profile) ? profile.xp : 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border">
              <p className="text-sm text-gray-500 mb-1">Пройдено уроков</p>
              <p className="text-2xl font-semibold text-primary">{childDashboard?.lessons?.filter(l => l.completed).length || 0}</p>
            </div>
            <div className="bg-white rounded-2xl p-4 border">
              <p className="text-sm text-gray-500 mb-1">Завершено курсов</p>
              <p className="text-2xl font-semibold text-primary">{childDashboard?.courses?.filter(c => c.completed).length || 0}</p>
            </div>
          </div>
        )}

        {/* Вкладки */}
        <div className="flex gap-4 border-b mb-6 overflow-x-auto">
          <button
            className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
              activeTab === "achievements"
                ? "text-primary border-b-2 border-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("achievements")}
          >
            <Award className="w-4 h-4 inline mr-2" />
            Достижения
          </button>

          {showStatsTab && (
            <button
              className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "stats"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("stats")}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Статистика
            </button>
          )}

          {showChildrenTab && (
            <button
              className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "children"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("children")}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Мои дети ({childrenList.length})
            </button>
          )}

          {showProgressTab && (
            <button
              className={`pb-3 px-2 font-medium transition-colors whitespace-nowrap ${
                activeTab === "progress"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab("progress")}
            >
              <TrendingUp className="w-4 h-4 inline mr-2" />
              Прогресс
            </button>
          )}
        </div>

        {/* Контент вкладок */}
        {activeTab === "achievements" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map((achievement) => (
              <div
                key={achievement.code}
                className={`bg-white rounded-xl p-4 border transition-all ${
                  achievement.unlocked
                    ? "border-primary/20 bg-primary/5"
                    : "border-gray-100 opacity-60"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{achievement.name}</h3>
                    <p className="text-sm text-gray-500 mt-1">{achievement.description || "Описание достижения"}</p>
                    {achievement.unlocked ? (
                      <p className="text-xs text-green-600 mt-2">Получено</p>
                    ) : (
                      <p className="text-xs text-gray-400 mt-2">Ещё не получено</p>
                    )}
                  </div>
                  <div className="text-3xl">{achievement.icon}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "stats" && showStatsTab && (
          <div className="space-y-6">
            
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Активность</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">0</p>
                  <p className="text-sm text-gray-500">дней подряд</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{isStudent(profile) ? profile.xp : 0}</p>
                  <p className="text-sm text-gray-500">всего XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{isStudent(profile) ? profile.level : 0}</p>
                  <p className="text-sm text-gray-500">уровень</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "children" && showChildrenTab && (
          <div className="space-y-4">
            {childrenList.length === 0 && !loadingChildren ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <Crown className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">У вас пока нет детей</p>
                <Button
                  variant="link"
                  onClick={() => router.push("/parent/add-child")}
                  className="mt-2"
                >
                  Добавить ребёнка
                </Button>
              </div>
            ) : (
              childrenList.map((child) => (
                <div
                  key={child.childUserId}
                  className="bg-white rounded-2xl p-4 border hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => loadChildDashboard(child.childUserId)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                        <span className="text-xl font-semibold text-primary">
                          {child.childUsername.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold">{child.childUsername}</p>
                        <p className="text-sm text-gray-500">В системе с {new Date(child.since).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "progress" && showProgressTab && childDashboard && (
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Статистика ребёнка</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{childDashboard.child.xp}</p>
                  <p className="text-sm text-gray-500">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{childDashboard.child.level}</p>
                  <p className="text-sm text-gray-500">Уровень</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{childDashboard.child.coins}</p>
                  <p className="text-sm text-gray-500">Монет</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Прогресс по курсам</h3>
              <div className="space-y-4">
                {childDashboard.courses?.slice(0, 5).map((course, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{course.name}</span>
                      <span>{course.percent}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-primary h-2 rounded-full" style={{ width: `${course.percent}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border">
              <h3 className="font-semibold text-lg mb-4">Последняя активность</h3>
              <div className="space-y-3">
                {childDashboard.recentActivities?.slice(0, 5).map((activity, idx) => (
                  <div key={idx} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    {activity.eventType === "quiz_completed" && <Award className="w-5 h-5 text-green-500" />}
                    {activity.eventType === "task_completed" && <Check className="w-5 h-5 text-blue-500" />}
                    {activity.eventType === "exam_completed" && <Star className="w-5 h-5 text-yellow-500" />}
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {activity.eventType === "quiz_completed" && "Прошел тест"}
                        {activity.eventType === "task_completed" && "Выполнил задание"}
                        {activity.eventType === "exam_completed" && "Сдал экзамен"}
                      </p>
                      <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-green-600">+{activity.xpGranted} XP</p>
                      <p className="text-xs text-orange-500">+{activity.coinGranted} монет</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </Container>
  );
}