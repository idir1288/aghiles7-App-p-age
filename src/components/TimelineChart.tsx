/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelinePoint } from '../data/tollData';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';

interface TimelineChartProps {
  data: TimelinePoint[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  const [metric, setMetric] = useState<'volume' | 'revenue'>('revenue');

  return (
    <div className={cn(
      "h-[350px] w-full p-4 rounded-xl border transition-colors",
      isDarkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("font-medium text-sm uppercase tracking-wider transition-colors", isDarkMode ? "text-slate-200" : "text-slate-900")}>Projection Croissance 2023-2026</h3>
        <div className={cn(
          "flex rounded-lg p-1 transition-colors",
          isDarkMode ? "bg-slate-800" : "bg-slate-100"
        )}>
          <button
            onClick={() => setMetric('volume')}
            className={cn(
              "px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all",
              metric === 'volume' 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
            )}
          >
            Volume
          </button>
          <button
            onClick={() => setMetric('revenue')}
            className={cn(
              "px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all",
              metric === 'revenue' 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-500/30' 
                : (isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
            )}
          >
            Recettes
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height="75%">
        <AreaChart data={data}>
          <defs>
            <linearGradient id="colorMetric" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={metric === 'volume' ? '#3b82f6' : '#10b981'} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={metric === 'volume' ? '#3b82f6' : '#10b981'} stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            interval={6}
          />
          <YAxis 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '12px',
              padding: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            labelStyle={{ fontSize: '11px', fontWeight: '900', marginBottom: '4px', textTransform: 'uppercase', color: isDarkMode ? '#94a3b8' : '#64748b' }}
          />
          <Area 
            type="monotone" 
            dataKey={metric} 
            stroke={metric === 'volume' ? '#3b82f6' : '#10b981'} 
            fillOpacity={1} 
            fill="url(#colorMetric)" 
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
