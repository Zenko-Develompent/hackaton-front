// features/alert/AlertTop.tsx
import { Alert, AlertAction, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, InfoIcon, X } from "lucide-react";
import { ReactNode, useEffect, useState } from "react";

type Position = "top" | "top-left" | "top-right";

export interface AlertTopProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  variant?: "default" | "destructive" | "success";
  onClose?: () => void;
  autoClose?: number | false;
  showCloseButton?: boolean;
  className?: string;
  position?: Position;
  offset?: number;
  children?: ReactNode;
}

export const AlertTop = ({
  title,
  description,
  icon,
  variant = "default",
  onClose,
  autoClose = 3000,
  showCloseButton = true,
  className,
  position = "top",
  offset = 16,
  children,
}: AlertTopProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLeaving, setIsLeaving] = useState(false);

  // Закрытие с анимацией
  const handleClose = () => {
    setIsLeaving(true);
  };

  // Авто-закрытие через таймер
  useEffect(() => {
    if (!autoClose) return;

    const timer = setTimeout(() => {
      handleClose();
    }, autoClose);

    return () => clearTimeout(timer);
  }, [autoClose]);

  // Завершаем анимацию и скрываем компонент
  const handleAnimationEnd = () => {
    if (isLeaving) {
      setIsVisible(false);
      onClose?.();
    }
  };

  const positionClasses = {
    top: "left-1/2 -translate-x-1/2",
    "top-left": "left-4",
    "top-right": "right-4",
  };

  if (!isVisible) return null;

  const getDefaultIcon = () => {
    if (icon) return icon;
    switch (variant) {
      case "destructive":
        return <AlertCircle className="h-4 w-4" />;
      case "success":
        return <CheckCircle2 className="h-4 w-4" />;
      default:
        return <InfoIcon className="h-4 w-4" />;
    }
  };

  return (
    <div
      className={cn(
        "fixed w-full max-w-md z-100000",
        positionClasses[position],
        !isLeaving
          ? "animate-in fade-in slide-in-from-top-2 duration-300"
          : "animate-out fade-out slide-out-to-top-2 duration-300"
      )}
      style={{ top: offset }}
      onAnimationEnd={handleAnimationEnd} // отслеживаем конец анимации
    >
      <Alert variant={variant === "success" ? "default" : variant} className={className}>
        {getDefaultIcon()}

        {title && <AlertTitle>{title}</AlertTitle>}
        {description && <AlertDescription>{description}</AlertDescription>}
        {children}

        {showCloseButton && (
          <AlertAction onClick={handleClose}>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <X className="h-4 w-4" />
            </Button>
          </AlertAction>
        )}
      </Alert>
    </div>
  );
};
