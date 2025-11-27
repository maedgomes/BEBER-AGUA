import React from 'react';

interface ProgressCircleProps {
  current: number;
  goal: number;
}

export const ProgressCircle: React.FC<ProgressCircleProps> = ({ current, goal }) => {
  const percentage = Math.min(100, Math.max(0, (current / goal) * 100));
  const radius = 120;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center py-6">
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-72 h-72">
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke="currentColor"
          strokeWidth="20"
          fill="transparent"
          className="text-blue-100"
        />
        {/* Progress Circle */}
        <circle
          cx="144"
          cy="144"
          r={radius}
          stroke="currentColor"
          strokeWidth="20"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="text-blue-500 transition-all duration-1000 ease-out"
        />
      </svg>
      
      {/* Center Text */}
      <div className="absolute flex flex-col items-center justify-center text-blue-900">
        <span className="text-5xl font-bold">{Math.round(percentage)}%</span>
        <span className="text-sm font-medium text-blue-400 mt-1">{current} / {goal} ml</span>
      </div>

      {/* Bubbles Animation Effect (Visual Flourish) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full opacity-20">
        {percentage > 0 && (
            <div className={`absolute bottom-0 w-full bg-blue-400 transition-all duration-1000 ease-out`} style={{ height: `${percentage}%`, opacity: 0.1 }}></div>
        )}
      </div>
    </div>
  );
};