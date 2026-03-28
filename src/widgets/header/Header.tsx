"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { useRouter } from "next/navigation";
import CoinIcon from "@/shared/assets/icons/CoinVertical.svg";
import UserIcon from "@/shared/assets/icons/User.svg";
import { MenuModal } from "../Modal/MenuModal";
import { Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const Header = () => {
  const auth = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);

  // Флаг для предотвращения анимации при первом рендере
  const [isInitialized, setIsInitialized] = useState(false);

  // Состояния для баланса и уровня
  const [balance, setBalance] = useState(0);
  const [prevBalance, setPrevBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const [prevLevel, setPrevLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);

  const handleLogin = () => {
    router.push("/login");
  };

  // Анимированный уровень с эффектом вспышки (без анимации при инициализации)
  const AnimatedLevel = ({
    level,
    prevLevel,
  }: {
    level: number;
    prevLevel: number;
  }) => {
    const [showFlash, setShowFlash] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
      // Анимируем только если:
      // 1. Компонент инициализирован
      // 2. Уровень изменился и не равен начальному (0)
      // 3. Предыдущий уровень не равен 0 (не первый рендер)
      if (isInitialized && level !== prevLevel && prevLevel !== 0) {
        setShowFlash(true);
        setShouldAnimate(true);
        const timer = setTimeout(() => {
          setShowFlash(false);
          setShouldAnimate(false);
        }, 500);
        return () => clearTimeout(timer);
      }
    }, [level, prevLevel, isInitialized]);

    return (
      <div className="relative flex items-center gap-1 bg-primary/10 rounded-full px-4 py-2.5">
        <motion.div
          animate={
            shouldAnimate
              ? {
                  scale: [1, 1.2, 1],
                  transition: { duration: 0.3 },
                }
              : {}
          }
        >
          <Star className="w-4 h-4 text-primary" />
        </motion.div>
        <button
          onClick={() => router.replace(`/profile/${auth.user?.username ?? "me"}`)}
          className="relative overflow-hidden min-w-[60px] text-center"
        >
          <span className="text-sm font-medium inline-block">
            Уровень {level}
          </span>
        </button>
        {showFlash && (
          <motion.div
            initial={{ scale: 0, opacity: 0.5 }}
            animate={{ scale: 2, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-primary/20 rounded-full"
          />
        )}
      </div>
    );
  };

  // Загрузка данных пользователя
  useEffect(() => {
    if (auth.isAuth && auth.user) {
      // Сохраняем предыдущие значения
      setPrevBalance(balance);
      setPrevLevel(level);

      // Устанавливаем новые значения
      setBalance(auth.user.coins || 0);
      setLevel(auth.user.level || 0);
      setXp(auth.user.xp || 0);

      // Устанавливаем флаг инициализации после загрузки первых данных
      if (!isInitialized) {
        setIsInitialized(true);
      }
    }
  }, [auth.isAuth, auth.user]);

  // Прогресс XP
  const progressPercent = nextLevelXp > 0 ? (xp / nextLevelXp) * 100 : 0;

  // Определяем, нужно ли анимировать монеты
  const shouldAnimateCoins =
    isInitialized && balance !== prevBalance && prevBalance !== 0;

  return (
    <>
      <header className="absolute w-full max-w-300 h-16 flex items-center justify-between top-0 left-1/2 -translate-x-1/2 px-5 z-1000 bg-white/92 backdrop-blur-sm">
        <a href="/">
          <img src="/Logo.svg" alt="Logo" />
        </a>

        {!auth.isAuth ? (
          <Button size="lg" className="text-[16px]" onClick={handleLogin}>
            Войти
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            {/* Уровень с анимацией */}
            <AnimatedLevel level={level} prevLevel={prevLevel} />

            {/* Монеты с анимацией */}
            <motion.button className="flex border-2 border-[#FF841D] rounded-[200px] items-center justify-center gap-1 pl-3 font-medium text-[16px] text-[#FF841D] cursor-pointer hover:bg-orange-50 transition-colors">
              <div className="relative overflow-hidden min-w-[40px] text-center">
                {shouldAnimateCoins ? (
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={balance}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -20, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="inline-block"
                    >
                      {balance}
                    </motion.span>
                  </AnimatePresence>
                ) : (
                  <span className="inline-block">{balance}</span>
                )}
              </div>
              <CoinIcon />
            </motion.button>

            {/* Кнопка пользователя */}
            <button
              ref={userButtonRef}
              className="h-12 w-12 overflow-hidden aspect-square rounded-[200px] bg-[#EBF1FF] flex items-center justify-center cursor-pointer hover:bg-[#E0E8FF] transition-colors"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <UserIcon />
            </button>
          </div>
        )}
      </header>

      <MenuModal
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        anchorEl={userButtonRef.current}
        userId={auth.user?.username}
      />
    </>
  );
};
