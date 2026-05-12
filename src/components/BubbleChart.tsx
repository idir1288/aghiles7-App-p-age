/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountryData } from '../data/tollData';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';

interface BubbleChartProps {
  data: CountryData[];
}

export const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  const chartData = data.map(d => ({
    name: d.name,
    volume: d.volume,
    revenue: d.revenue,
    fluidity: d.fluidity,
    errors: d.errors
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className={cn(
          "border p-3 rounded-xl shadow-xl transition-colors",
          isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
        )}>
          <p className={cn("font-bold text-sm mb-1", isDarkMode ? "text-slate-100" : "text-slate-900")}>{data.name}</p>
          <div className="space-y-1 text-xs">
            <p className="text-slate-500">Volume: <span className={isDarkMode ? "text-slate-200" : "text-slate-700"}>{(data.volume / 1e6).toFixed(1)}M</span></p>
            <p className="text-slate-500">Revenus: <span className={isDarkMode ? "text-slate-200" : "text-slate-700"}>{(data.revenue / 1e6).toFixed(1)}M$</span></p>
            <p className="text-slate-500">Fluidité: <span className={isDarkMode ? "text-slate-200" : "text-slate-700"}>{data.fluidity}%</span></p>
            <p className="text-slate-500">Erreurs: <span className="text-red-500 font-bold">{data.errors}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn(
      "h-[350px] w-full p-4 rounded-xl border transition-colors",
      isDarkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"
    )}>
      <h3 className={cn("font-medium text-sm mb-4 uppercase tracking-wider transition-colors", isDarkMode ? "text-slate-200" : "text-slate-900")}>
        Volume vs Recettes (Taille = Fluidité)
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} />
          <XAxis 
            type="number" 
            dataKey="volume" 
            name="Volume" 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
            fontSize={10} 
            tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} 
            label={{ value: 'VOLUME', position: 'insideBottom', offset: -10, fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 9, fontWeight: 'bold' }} 
          />
          <YAxis 
            type="number" 
            dataKey="revenue" 
            name="Recettes" 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
            fontSize={10} 
            tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} 
            label={{ value: 'REVENUS ($)', angle: -90, position: 'insideLeft', fill: isDarkMode ? '#64748b' : '#94a3b8', fontSize: 9, fontWeight: 'bold' }} 
          />
          <ZAxis type="number" dataKey="fluidity" range={[50, 400]} />
          <Tooltip content={<CustomTooltip />} />
          <Scatter name="Pays" data={chartData}>
            {chartData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.errors > 5 ? '#ef4444' : entry.errors > 2 ? '#f59e0b' : '#3b82f6'} 
                fillOpacity={0.6}
              />
            ))}
          </Scatter>
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
