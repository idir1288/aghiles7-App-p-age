/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BarChart as ReBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CountryData } from '../data/tollData';

interface BarChartProps {
  data: CountryData[];
}

export const BarChart: React.FC<BarChartProps> = ({ data }) => {
  return (
    <div className="h-[350px] w-full bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
      <h3 className="text-slate-200 font-medium text-sm mb-4 uppercase tracking-wider">Précision vs Automatisation par Pays</h3>
      <ResponsiveContainer width="100%" height="90%">
        <ReBarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} unit="%" />
          <Tooltip
            contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
            itemStyle={{ fontSize: '12px' }}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
          <Bar dataKey="precision" name="Précision" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="automation" name="Automatisation" fill="#10b981" radius={[4, 4, 0, 0]} />
        </ReBarChart>
      </ResponsiveContainer>
    </div>
  );
};
