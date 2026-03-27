// components/MenuModal.tsx
"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/features/auth/useAuth";
import { User, ShoppingBag, LogOut } from "lucide-react";

interface MenuModalProps {
  isOpen: boolean;
  onClose: () => void;
  anchorEl: HTMLElement | null;
}

export const MenuModal = ({ isOpen, onClose, anchorEl }: MenuModalProps) => {
  const router = useRouter();
  const { logout } = useAuth();
  const modalRef = useRef<HTMLDivElement>(null);

  const handleNavigation = (path: string) => {
    router.push(path);
    onClose();
  };

  const handleLogout = async () => {
    await logout();
    onClose();
    router.push("/login");
  };

  // Закрытие при клике вне модалки
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node) &&
        anchorEl &&
        !anchorEl.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen || !anchorEl) return null;

  // Получаем позицию кнопки
  const rect = anchorEl.getBoundingClientRect();
  
  return (
    <div
      ref={modalRef}
      className="fixed z-50 bg-white rounded-[20px] shadow-lg border border-gray-100 overflow-hidden"
      style={{
        top: rect.bottom + 8,
        right: window.innerWidth - rect.right,
        minWidth: "240px",
      }}
    >
      <div className="p-2 flex flex-col gap-1">
        <Button
          variant="ghost"
          className="w-full gap-3 text-base px-3 py-5 flex justify-between rounded-[12px] hover:bg-gray-100"
          onClick={() => handleNavigation("/profile")}
        >
          Профиль
          <User className="w-4 h-4" />
        </Button>
        
        <Button
          variant="default"
          className="w-full gap-3 text-base bg-transparent px-3 py-5 text-[#FF841D] flex justify-between rounded-[12px] hover:bg-gray-100"
          onClick={() => handleNavigation("/shop")}
        >
          Магазин
          <ShoppingBag className="w-4 h-4" />
        </Button>
        
        <div className="border-t  opacity-40" />
        
        <Button
          variant="default"
          className="w-full gap-3 text-base px-3 py-5 text-[#FF3636] bg-[#FFEBEB] rounded-[12px] flex justify-between hover:bg-[#FFDDDD]"
          onClick={handleLogout}
        >
          Выйти
          <LogOut className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};