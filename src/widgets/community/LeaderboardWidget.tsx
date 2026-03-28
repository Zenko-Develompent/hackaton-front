// widgets/Leaderboard/LeaderboardWidget.tsx
"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Medal,
  TrendingUp,
  Activity,
  Calendar,
  RefreshCw,
  ChevronDown,
} from "lucide-react";
import { communityApi } from "@/entities/community/api/community.api";
import { useAuth } from "@/features/auth/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  LeaderboardPeriod,
  LeaderboardMetric,
} from "@/entities/community/model/types";

interface LeaderboardWidgetProps {
  limit?: number;
  showViewAll?: boolean;
  className?: string;
}

interface LeaderboardItem {
  rank: number;
  userId: string;
  username: string;
  score: number;
}

const INITIAL_LIMIT = 5;
const LOAD_MORE_LIMIT = 10;

export const LeaderboardWidget = ({
  showViewAll = false,
  className = "",
}: LeaderboardWidgetProps) => {
  const router = useRouter();
  const { isAuth, user } = useAuth();

  const [period, setPeriod] = useState<LeaderboardPeriod>("week");
  const [metric, setMetric] = useState<LeaderboardMetric>("activity");
  const [leaderboard, setLeaderboard] = useState<{
    items: LeaderboardItem[];
    period: LeaderboardPeriod;
    metric: LeaderboardMetric;
    fromInclusive: string;
    toInclusive: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(INITIAL_LIMIT);
  const [error, setError] = useState<string | null>(null);

  // Мемоизированные данные для отображения
  const displayedItems = useMemo(() => {
    if (!leaderboard?.items) return [];
    return leaderboard.items.slice(0, displayLimit);
  }, [leaderboard, displayLimit]);

  // Получение позиции пользователя
  const userRankInfo = useMemo(() => {
    if (!isAuth || !user?.username || !leaderboard?.items) return null;
    const foundUser = leaderboard.items.find(
      (item) => item.username === user.username,
    );
    return foundUser ? { rank: foundUser.rank, score: foundUser.score } : null;
  }, [isAuth, user, leaderboard]);

  // Проверка, есть ли пользователь в топе (чтобы не дублировать)
  const isUserInTop = useMemo(() => {
    if (!userRankInfo) return false;
    return displayedItems.some((item) => item.username === user?.username);
  }, [userRankInfo, displayedItems, user]);

  // Проверка, есть ли еще элементы для загрузки
  const hasMore = useMemo(() => {
    if (!leaderboard?.items) return false;
    return displayLimit < leaderboard.items.length;
  }, [leaderboard, displayLimit]);

  const fetchLeaderboard = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await communityApi.getLeaderboard(period, metric, 100);
      setLeaderboard(response);
      setDisplayLimit(INITIAL_LIMIT);
    } catch (err) {
      console.error("Failed to fetch leaderboard:", err);
      setError("Не удалось загрузить рейтинг");
    } finally {
      setLoading(false);
    }
  }, [period, metric]);

  const loadMore = useCallback(async () => {
    if (loadingMore || !hasMore) return;

    setLoadingMore(true);
    // Имитируем загрузку для плавности
    await new Promise((resolve) => setTimeout(resolve, 300));
    setDisplayLimit((prev) =>
      Math.min(prev + LOAD_MORE_LIMIT, leaderboard?.items.length || prev),
    );
    setLoadingMore(false);
  }, [loadingMore, hasMore, leaderboard]);

  useEffect(() => {
    fetchLeaderboard();
  }, [fetchLeaderboard]);

  const getPeriodLabel = () => {
    switch (period) {
      case "day":
        return "За день";
      case "week":
        return "За неделю";
      case "month":
        return "За месяц";
      default:
        return "За неделю";
    }
  };

  const getMetricIcon = () => {
    switch (metric) {
      case "activity":
        return <Activity className="w-4 h-4" />;
      case "xp":
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getMedalColor = (rank: number) => {
    switch (rank) {
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-gray-400";
      case 3:
        return "text-amber-600";
      default:
        return "text-gray-500";
    }
  };

  const handleUserClick = (username: string) => {
    router.push(`/profile/${username}`);
  };

  const handleRefresh = () => {
    fetchLeaderboard();
  };

  const handleViewAll = () => {
    router.push("/leaderboard");
  };

  // Рендер элемента лидерборда
  const LeaderboardItemComponent = ({
    item,
    isCurrentUser,
    index,
  }: {
    item: LeaderboardItem;
    isCurrentUser?: boolean;
    index: number;
  }) => (
    <div
      key={`${item.userId}-${item.rank}-${index}`}
      className={`p-4 hover:bg-gray-50 transition-colors cursor-pointer ${
        isCurrentUser ? "bg-primary/5" : ""
      }`}
      onClick={() => handleUserClick(item.username)}
    >
      <div className="flex items-center gap-4">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            item.rank <= 3
              ? "bg-linear-to-br from-yellow-100 to-yellow-50"
              : "bg-gray-100"
          }`}
        >
          <span className={`text-xl font-bold ${getMedalColor(item.rank)}`}>
            {item.rank}
          </span>
        </div>

        <div className="flex-1">
          <p className="font-semibold text-gray-900 flex items-center gap-2">
            {item.username}
            {isCurrentUser && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Вы
              </span>
            )}
          </p>
          <p className="text-sm text-gray-500 flex items-center gap-1">
            {getMetricIcon()}
            <span>
              {item.score} {metric === "activity" ? "баллов" : "XP"}
            </span>
          </p>
        </div>

        <div className="text-right">
          <div
            className={`
                    font-semibold text-primary
                    ${item.rank === 1 && "text-[32px]"}
                    ${item.rank === 2 && "text-[28px]"}
                    ${item.rank === 3 && "text-[24px]"}
                    ${item.rank > 3 && "text-[20px] text-gray-600"}
                `}
          >
            {item.score}
          </div>
          <div className="text-xs text-gray-400">{metric === "activity" ? "баллов" : "XP"}</div>
        </div>
      </div>
    </div>
  );

  // Компонент скелетона для загрузки
  const SkeletonItem = () => (
    <div className="p-4 flex items-center gap-4">
      <Skeleton className="w-10 h-10 rounded-full" />
      <div className="flex-1">
        <Skeleton className="h-5 w-32 mb-1" />
        <Skeleton className="h-3 w-20" />
      </div>
      <Skeleton className="h-8 w-16" />
    </div>
  );

  return (
    <div
      className={`bg-white rounded-[40px] border border-gray-100 overflow-hidden ${className}`}
    >
      {/* Заголовок */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <h2 className="text-[32px] font-semibold">Рейтинг</h2>
          </div>
        </div>

        {/* Фильтры */}
        <div className="flex flex-wrap gap-3">
          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["day", "week", "month"] as LeaderboardPeriod[]).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {p === "day" ? "День" : p === "week" ? "Неделя" : "Месяц"}
              </button>
            ))}
          </div>

          <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
            {(["activity", "xp"] as LeaderboardMetric[]).map((m) => (
              <button
                key={m}
                onClick={() => setMetric(m)}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${
                  metric === m
                    ? "bg-white text-primary shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {m === "activity" ? (
                  <Activity className="w-3 h-3" />
                ) : (
                  <TrendingUp className="w-3 h-3" />
                )}
                {m === "activity" ? "Активность" : "Опыт"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Список лидеров */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          Array.from({ length: INITIAL_LIMIT }).map((_, i) => (
            <SkeletonItem key={i} />
          ))
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-500 mb-3">{error}</p>
            <Button variant="outline" size="sm" onClick={handleRefresh}>
              Попробовать снова
            </Button>
          </div>
        ) : displayedItems.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Пока нет данных для отображения</p>
          </div>
        ) : (
          <>
            {displayedItems.map((item, idx) => (
              <LeaderboardItemComponent
                key={`${item.userId}-${idx}`}
                item={item}
                isCurrentUser={user?.username === item.username}
                index={idx}
              />
            ))}

            {/* Кнопка "Показать еще" */}
            {hasMore && !loading && (
              <div className="p-4 border-t border-gray-100">
                <Button
                  variant="ghost"
                  className="w-full gap-2 text-primary hover:text-primary/80"
                  onClick={loadMore}
                  disabled={loadingMore}
                >
                  {loadingMore ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      Загрузка...
                    </>
                  ) : (
                    <>
                      <ChevronDown className="w-4 h-4" />
                      Показать еще
                    </>
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Позиция текущего пользователя (если он не в топе) */}
      {isAuth && userRankInfo && !isUserInTop && !loading && leaderboard && (
        <div className="p-4 bg-primary/5 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">
                  #{userRankInfo.rank}
                </span>
              </div>
              <div>
                <p className="font-medium text-gray-900">Ваше место</p>
                <p className="text-sm text-gray-500">@{user?.username}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-primary">{userRankInfo.score}</p>
              <p className="text-xs text-gray-400">
                {metric === "activity" ? "баллов" : "XP"}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Кнопка "Смотреть полный рейтинг" */}
      {showViewAll &&
        !loading &&
        leaderboard &&
        leaderboard.items.length > 0 && (
          <div className="p-4 border-t border-gray-100">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleViewAll}
            >
              Смотреть полный рейтинг
            </Button>
          </div>
        )}
    </div>
  );
};
