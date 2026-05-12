/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CountryData } from '../data/tollData';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';

interface BarChartProps {
  data: CountryData[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "h-[350px] w-full p-4 rounded-xl border transition-colors",
      isDarkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"
    )}>
      <h3 className={cn("font-medium text-sm mb-4 uppercase tracking-wider transition-colors", isDarkMode ? "text-slate-200" : "text-slate-900")}>
        Précision vs Automatisation par Pays
      </h3>
      <ResponsiveContainer width="100%" height="90%">
        <ReBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#334155" : "#e2e8f0"} vertical={false} />
          <XAxis dataKey="name" stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke={isDarkMode ? "#94a3b8" : "#64748b"} fontSize={10} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '12px',
              boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: '600' }}
            labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 'bold' }}
          />
          <Legend wrapperStyle={{ fontSize: '10px', paddingTop: '10px', fontWeight: 'bold', textTransform: 'uppercase' }} />
          <Bar dataKey="precision" name="Précision" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="automation" name="Automatisation" fill="#10b981" radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};
