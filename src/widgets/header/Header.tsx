"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { useRouter } from "next/navigation";
import CoinIcon from "@/shared/assets/icons/CoinVertical.svg";
import UserIcon from "@/shared/assets/icons/User.svg";
import { MenuModal } from "../Modal/MenuModal";

export const Header = () => {
  const auth = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const userButtonRef = useRef<HTMLButtonElement>(null);
  
  // Состояния для баланса и уровня (можно брать из auth или отдельного API)
  const [balance, setBalance] = useState(0);
  const [level, setLevel] = useState(0);
  const [xp, setXp] = useState(0);
  const [nextLevelXp, setNextLevelXp] = useState(100);

  const handleLogin = () => {
    router.push("/login");
  };

  // Загрузка данных пользователя (баланс, уровень)
  useEffect(() => {
    if (auth.isAuth && auth.user) {
      // Если данные есть в auth.user
      setBalance(auth.user.coins || 0);
      setLevel(auth.user.level || 0);
      setXp(auth.user.xp || 0);
      
      // Можно также загрузить из отдельного API
      // const fetchUserStats = async () => {
      //   try {
      //     const response = await userApi.getStats();
      //     setBalance(response.coins);
      //     setLevel(response.level);
      //     setXp(response.xp);
      //   } catch (error) {
      //     console.error("Failed to fetch user stats:", error);
      //   }
      // };
      // fetchUserStats();
    }
  }, [auth.isAuth, auth.user]);

  // Процент прогресса до следующего уровня
  const progressPercent = nextLevelXp > 0 ? (xp / nextLevelXp) * 100 : 0;

  return (
    <>
      <header className="absolute w-full max-w-300 h-16 flex items-center justify-between top-0 left-1/2 -translate-x-1/2 px-5 z-1000 bg-white/92 backdrop-blur-sm">
        <a href="/">
          <img src="/Logo.svg" alt="Logo" />
        </a>

        {!auth.isAuth ? (
          <Button size="lg" className="text-[20px]" onClick={handleLogin}>
            Войти
          </Button>
        ) : (
          <div className="flex gap-2 items-center">
            {/* Уровень */}
            <div className="relative flex items-center gap-2">
              <div className="flex items-center gap-1 bg-gray-100 rounded-full px-3 py-2.5">
                <span className="text-sm font-medium text-gray-700">LVL {level}</span>
                <div className="w-12 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <span className="text-xs text-gray-500">{xp}/{nextLevelXp}</span>
              </div>
            </div>
            
            {/* Монеты */}
            <button className="flex border-2 border-[#FF841D] rounded-[200px] items-center justify-center gap-1 pl-3 font-medium text-[16px] text-[#FF841D] cursor-pointer hover:bg-orange-50 transition-colors">
              {balance}
              <CoinIcon />
            </button>
            
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
      />
    </>
  );
};