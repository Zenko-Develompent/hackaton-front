"use client";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { useRouter } from "next/navigation"; // 👈 правильный импорт
import CoinIcon from "@/shared/assets/icons/CoinVertical.svg";

import UserIcon from "@/shared/assets/icons/User.svg";

export const Header = () => {
  const auth = useAuth();
  const router = useRouter(); 

  const handleLogin = () => {
    router.push("/login"); 
  };

  return (
    <header className="fixed w-full max-w-300 h-16 flex items-center justify-between top-0 left-1/2 -translate-x-1/2 px-5   z-1000 bg-white/92 backdrop-blur-sm">
      <a href="/">
        <img src="/Logo.svg" alt="" />
      </a>

      {!auth.isAuth ? (
        <Button size="lg" className="text-[20px]" onClick={handleLogin}>
          Войти
        </Button>
      ) : (
        <div className="flex gap-2">
          <button className=" flex border-2 border-[#FF841D] rounded-[200px] items-center justify-center pl-3 font-medium text-[20px] text-[#FF841D] cursor-pointer">
            120
            <CoinIcon />
          </button>
          <button className="h-12 w-12 overflow-hidden aspect-square rounded-[200px] bg-[#EBF1FF] flex items-center justify-center cursor-pointer">
            <UserIcon />
          </button>
        </div>
      )}
    </header>
  );
};
