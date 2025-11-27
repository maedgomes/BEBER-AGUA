import React from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DailyStats } from '../types';

interface HistoryChartProps {
  data: DailyStats[];
}

export const HistoryChart: React.FC<HistoryChartProps> = ({ data }) => {
  // Take last 7 days
  const chartData = data.slice(-7).map(d => ({
    ...d,
    day: new Date(d.date).toLocaleDateString('pt-BR', { weekday: 'short' }).slice(0, 3)
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="w-full max-w-md mx-auto px-4 mt-8 pb-4">
      <h3 className="text-lg font-bold text-blue-900 mb-4 px-2">Histórico (Últimos 7 dias)</h3>
      <div className="h-48 w-full bg-white rounded-2xl p-4 shadow-sm border border-blue-50">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis 
                dataKey="day" 
                tick={{ fontSize: 12, fill: '#94a3b8' }} 
                axisLine={false} 
                tickLine={false} 
            />
            <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${index}`} 
                    fill={entry.total >= entry.goal ? '#3b82f6' : '#93c5fd'} 
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};