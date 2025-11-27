import React, { useState, useEffect } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { getHydrationAdvice } from '../services/geminiService';

interface AICoachProps {
  current: number;
  goal: number;
}

export const AICoach: React.FC<AICoachProps> = ({ current, goal }) => {
  const [advice, setAdvice] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const fetchAdvice = async () => {
    setLoading(true);
    const text = await getHydrationAdvice(current, goal);
    setAdvice(text);
    setLoading(false);
  };

  useEffect(() => {
    // Fetch initial advice on mount
    fetchAdvice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  // Allow manual refresh or refresh when significant progress happens? 
  // For now, let's keep it simple with a manual refresh button.

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-6 mb-24">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl p-4 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-2 opacity-10">
          <Sparkles size={60} />
        </div>
        
        <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold flex items-center gap-2">
                <Sparkles size={18} />
                HidraCoach IA
            </h3>
            <button 
                onClick={fetchAdvice} 
                disabled={loading}
                className="text-white/80 hover:text-white transition-colors"
                aria-label="Nova dica"
            >
                <RefreshCw size={16} className={`${loading ? 'animate-spin' : ''}`} />
            </button>
        </div>
        
        <p className="text-sm md:text-base leading-relaxed font-medium min-h-[3rem]">
          {loading ? "Pensando em uma dica refrescante..." : advice}
        </p>
      </div>
    </div>
  );
};