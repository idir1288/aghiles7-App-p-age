/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { TimelinePoint } from '../data/tollData';

interface TimelineChartProps {
  data: TimelinePoint[];
}

export const TimelineChart: React.FC<TimelineChartProps> = ({ data }) => {
  const [metric, setMetric] = useState<'volume' | 'revenue'>('revenue');

  return (
    <div className="h-[350px] w-full bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-slate-200 font-medium text-sm uppercase tracking-wider">Projection Croissance 2023-2026</h3>
        <div className="flex bg-slate-800 rounded-lg p-1">
          <button
            onClick={() => setMetric('volume')}
            className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${metric === 'volume' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
          >
            Volume
          </button>
          <button
            onClick={() => setMetric('revenue')}
            className={`px-3 py-1 text-[10px] uppercase font-bold rounded-md transition-all ${metric === 'revenue' ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-400 hover:text-slate-200'}`}
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
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis 
            dataKey="date" 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false}
            interval={6}
          />
          <YAxis 
            stroke="#94a3b8" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`}
          />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: '10px' }}
            labelStyle={{ fontSize: '11px', fontWeight: 'bold', marginBottom: '4px' }}
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
