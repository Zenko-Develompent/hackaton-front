"use client";

import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

interface ProgressBarProps {
  progress: number;
  height?: number;
  className?: string;
}

export const ProgressBar = ({ 
  progress, 
  height = 40,
  className 
}: ProgressBarProps) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));
  const [currentProgress, setCurrentProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentProgress(clampedProgress);
    }, 100);
    return () => clearTimeout(timer);
  }, [clampedProgress]);

  return (
    <div 
      className={cn("relative w-full bg-gray-200 rounded-full overflow-hidden", className)}
      style={{ height: `${height}px` }}
    >
      <div
        className="absolute left-0 top-0 h-full bg-[#3572FF]  transition-all duration-1000 ease-out"
        style={{ width: `${currentProgress}%` }}
      >
        {/* Анимированная извивающаяся волна с выходом за края */}
        <div className="absolute right-[-20px] rotate-[-9deg] top-1/2 -translate-y-1/2">
          <svg
            className="animate-wave"
            style={{ 
              width: "30px", 
              height: `${height + 20}px`,
              overflow: "visible"
            }}
            viewBox="0 0 30 60"
            preserveAspectRatio="none"
          >
            <path
              fill="url(#gradient)"
              d="M30,0 L0,0 L0,60 L30,60 C25,52 20,48 25,42 C30,36 20,32 25,26 C30,20 20,16 25,10 C30,4 25,0 30,0 Z"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#3572FF" />
                <stop offset="100%" stopColor="#3572FF" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
      
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-sm font-bold text-white drop-shadow-md z-10">
          {Math.round(currentProgress)}%
        </span>
      </div>

      <style jsx>{`
        @keyframes wave {
          0%, 100% {
            transform:translateY(0);
          }
          50% {
            transform:translateY(-8px);
          }
        }
        .animate-wave {
          animation: wave 8s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};