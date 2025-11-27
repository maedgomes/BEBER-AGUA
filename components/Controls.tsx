import React from 'react';
import { Plus, Coffee, GlassWater } from 'lucide-react';
import { ContainerSize } from '../types';

interface ControlsProps {
  onAdd: (amount: number) => void;
}

export const Controls: React.FC<ControlsProps> = ({ onAdd }) => {
  return (
    <div className="grid grid-cols-2 gap-4 w-full max-w-md mx-auto px-4">
      <button
        onClick={() => onAdd(ContainerSize.SMALL)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
      >
        <div className="bg-blue-100 p-2 rounded-full mb-2">
            <Coffee className="w-6 h-6 text-blue-600" />
        </div>
        <span className="font-semibold text-blue-900">Copo P</span>
        <span className="text-xs text-blue-400">{ContainerSize.SMALL}ml</span>
      </button>

      <button
        onClick={() => onAdd(ContainerSize.MEDIUM)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
      >
        <div className="bg-blue-100 p-2 rounded-full mb-2">
             <GlassWater className="w-6 h-6 text-blue-600" />
        </div>
        <span className="font-semibold text-blue-900">Copo M</span>
        <span className="text-xs text-blue-400">{ContainerSize.MEDIUM}ml</span>
      </button>
      
      <button
        onClick={() => onAdd(ContainerSize.LARGE)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
      >
        <div className="bg-blue-100 p-2 rounded-full mb-2">
             <GlassWater className="w-8 h-8 text-blue-600" />
        </div>
        <span className="font-semibold text-blue-900">Grande</span>
        <span className="text-xs text-blue-400">{ContainerSize.LARGE}ml</span>
      </button>

      <button
        onClick={() => onAdd(ContainerSize.BOTTLE)}
        className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-sm border border-blue-100 hover:bg-blue-50 active:scale-95 transition-all"
      >
        <div className="bg-blue-100 p-2 rounded-full mb-2">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600"><path d="M15 2H9a1 1 0 0 0-1 1v2c0 .6.4 1 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/><path d="M8 8c0-1.1.9-2 2-2h4a2 2 0 0 1 2 2v2a2 2 0 0 0 2 2v9a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-9a2 2 0 0 0 2-2V8Z"/><path d="M12 2v21"/></svg>
        </div>
        <span className="font-semibold text-blue-900">Garrafa</span>
        <span className="text-xs text-blue-400">{ContainerSize.BOTTLE}ml</span>
      </button>
    </div>
  );
};