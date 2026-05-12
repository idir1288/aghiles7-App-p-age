/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScatterChart as ReScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';
import { Target } from 'lucide-react';

interface ScatterChartProps {
  data: any[];
}

export const ScatterChart: React.FC<ScatterChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  return (
    <div className={cn(
      "h-[400px] w-full p-6 rounded-2xl border transition-colors",
      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-sm font-bold uppercase tracking-widest flex items-center gap-2", isDarkMode ? "text-slate-200" : "text-slate-800")}>
          Corrélation: Revenus vs Précision
        </h3>
        <Target className="w-5 h-5 text-blue-500" />
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <ReScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={isDarkMode ? "#1e293b" : "#f1f5f9"} />
          <XAxis 
            type="number" 
            dataKey="precision" 
            name="Précision" 
            unit="%" 
            domain={[95, 100]}
            stroke={isDarkMode ? "#94a3b8" : "#64748b"}
            fontSize={10}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            type="number" 
            dataKey="revenue" 
            name="Revenus" 
            unit="$" 
            stroke={isDarkMode ? "#94a3b8" : "#64748b"}
            fontSize={10}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
          />
          <ZAxis type="number" dataKey="volume" range={[60, 400]} />
          <Tooltip 
             cursor={{ strokeDasharray: '3 3' }}
             contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '12px',
              padding: '12px'
            }}
             itemStyle={{ fontSize: '11px', fontWeight: 'bold' }}
             labelStyle={{ color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '4px', fontWeight: 'bold', fontSize: '12px' }}
             formatter={(value: any, name: string) => {
               if (name === "Revenus") return [`$${(value / 1000000).toFixed(1)}M`, name];
               if (name === "Précision") return [`${value.toFixed(2)}%`, name];
               return [value, name];
             }}
          />
          <Scatter name="Pays" data={data} fill="#3b82f6">
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={entry.precision > 98 ? '#10b981' : entry.errors > 4 ? '#ef4444' : '#3b82f6'} 
                fillOpacity={0.6}
              />
            ))}
          </Scatter>
        </ReScatterChart>
      </ResponsiveContainer>
    </div>
  );
};
