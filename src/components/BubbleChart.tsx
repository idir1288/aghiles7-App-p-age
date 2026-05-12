/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CountryData } from '../data/tollData';

interface BubbleChartProps {
  data: CountryData[];
}

export const BubbleChart: React.FC<BubbleChartProps> = ({ data }) => {
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
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
          <p className="text-slate-100 font-bold text-sm mb-1">{data.name}</p>
          <div className="space-y-1 text-xs">
            <p className="text-slate-400">Volume: <span className="text-slate-200">{(data.volume / 1e6).toFixed(1)}M</span></p>
            <p className="text-slate-400">Revenus: <span className="text-slate-200">{(data.revenue / 1e6).toFixed(1)}M$</span></p>
            <p className="text-slate-400">Fluidité: <span className="text-slate-200">{data.fluidity}%</span></p>
            <p className="text-slate-400">Erreurs: <span className="text-red-400">{data.errors}%</span></p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-[350px] w-full bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
      <h3 className="text-slate-200 font-medium text-sm mb-4 uppercase tracking-wider">Volume vs Recettes (Taille = Fluidité)</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis type="number" dataKey="volume" name="Volume" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} label={{ value: 'Volume', position: 'bottom', fill: '#94a3b8', fontSize: 10 }} />
          <YAxis type="number" dataKey="revenue" name="Recettes" stroke="#94a3b8" fontSize={11} tickFormatter={(v) => `${(v / 1e6).toFixed(1)}M`} label={{ value: 'Revenus ($)', angle: -90, position: 'left', fill: '#94a3b8', fontSize: 10 }} />
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
