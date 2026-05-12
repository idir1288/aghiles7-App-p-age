/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';
import { Trophy } from 'lucide-react';

interface BarChartProps {
  data: any[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  const sortedData = [...data].sort((a, b) => b.automation - a.automation);

  return (
    <div className={cn(
      "h-[400px] w-full p-6 rounded-2xl border transition-colors",
      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-sm font-bold uppercase tracking-widest flex items-center gap-2", isDarkMode ? "text-slate-200" : "text-slate-800")}>
          Leaders IA (Taux Automatisation)
        </h3>
        <Trophy className="w-5 h-5 text-amber-500" />
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <ReBarChart data={sortedData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} horizontal={true} vertical={false} />
          <XAxis type="number" domain={[0, 100]} hide />
          <YAxis 
            dataKey="name" 
            type="category" 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"} 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            width={70}
          />
          <Tooltip
            cursor={{ fill: isDarkMode ? '#1e293b' : '#f8fafc' }}
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '12px',
              padding: '12px'
            }}
            itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
            labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}
          />
          <Bar dataKey="automation" name="IA %" radius={[0, 4, 4, 0]} barSize={20}>
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={index === 0 ? '#3b82f6' : index === 1 ? '#60a5fa' : isDarkMode ? '#1e293b' : '#e2e8f0'} 
                fillOpacity={0.8}
              />
            ))}
          </Bar>
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};
