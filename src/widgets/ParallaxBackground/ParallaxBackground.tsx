// widgets/ParallaxBackground/ParallaxBackground.tsx
"use client";

import { useRef, useEffect, useState } from "react";

interface ParallaxBackgroundProps {
  children: React.ReactNode;
  imageUrl: string;
  className?: string;
  speed?: number; // скорость движения фона (0-1, по умолчанию 0.05)
  overlay?: boolean; // добавлять ли затемнение
  overlayOpacity?: number; // прозрачность затемнения (0-1)
  overlayColor?: string; // цвет затемнения
  parallaxStrength?: number; // сила параллакса (максимальное смещение в px)
}

export const ParallaxBackground = ({
  children,
  imageUrl,
  className = "",
  speed = 0.05,
  parallaxStrength = 100,
}: ParallaxBackgroundProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const backgroundRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Нормализуем координаты мыши относительно центра контейнера (-1 до 1)
      const x = (e.clientX - centerX) / (rect.width / 2);
      const y = (e.clientY - centerY) / (rect.height / 2);
      
      setMousePosition({ x, y });
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => {
        container.removeEventListener("mousemove", handleMouseMove);
      };
    }
  }, []);

  useEffect(() => {
    if (!backgroundRef.current) return;
    
    // Вычисляем смещение фона
    const offsetX = mousePosition.x * parallaxStrength * speed;
    const offsetY = mousePosition.y * parallaxStrength * speed;
    
    backgroundRef.current.style.transform = `translate(${offsetX}px, ${offsetY}px)`;
  }, [mousePosition, parallaxStrength, speed]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
    >
      {/* Фоновое изображение с параллаксом */}
      <div
        ref={backgroundRef}
        className="absolute inset-0 transition-transform duration-200 ease-out scale-101"
        style={{
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          willChange: "transform",
        }}
      />
      
      
      
      {/* Контент */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
};