/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo } from 'react';
import { Sankey, Tooltip, ResponsiveContainer } from 'recharts';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';
import { Share2 } from 'lucide-react';

interface SankeyChartProps {
  data: any[];
}

export const SankeyChart: React.FC<SankeyChartProps> = ({ data }) => {
  const { isDarkMode } = useTheme();

  const sankeyData = useMemo(() => {
    const nodes: { name: string }[] = [];
    const links: { source: number, target: number, value: number }[] = [];

    const techs = Array.from(new Set(data.flatMap(d => d.tech)));
    const iaLevels = Array.from(new Set(data.map(d => d.iaLevel)));

    techs.forEach(t => nodes.push({ name: t }));
    iaLevels.forEach(ia => nodes.push({ name: ia }));

    const techOffset = 0;
    const iaOffset = techs.length;

    techs.forEach((t, tIdx) => {
      iaLevels.forEach((ia, iaIdx) => {
        const count = data.filter(d => d.tech.includes(t) && d.iaLevel === ia).length;
        if (count > 0) {
          links.push({
            source: techOffset + tIdx,
            target: iaOffset + iaIdx,
            value: count
          });
        }
      });
    });

    return { nodes, links };
  }, [data]);

  if (sankeyData.links.length === 0) return null;

  return (
    <div className={cn(
      "h-[400px] w-full p-6 rounded-2xl border transition-colors",
      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-sm font-bold uppercase tracking-widest flex items-center gap-2", isDarkMode ? "text-slate-200" : "text-slate-800")}>
          Flux: Technologie → Niveau IA
        </h3>
        <Share2 className="w-5 h-5 text-purple-500" />
      </div>
      
      <ResponsiveContainer width="100%" height="85%">
        <Sankey
          data={sankeyData}
          node={{ stroke: isDarkMode ? '#334155' : '#e2e8f0', strokeWidth: 1 }}
          link={{ stroke: isDarkMode ? '#1e293b' : '#f1f5f9' }}
          nodePadding={50}
        >
          <Tooltip 
            contentStyle={{ 
              backgroundColor: isDarkMode ? '#0f172a' : '#ffffff', 
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0', 
              borderRadius: '12px'
            }}
          />
        </Sankey>
      </ResponsiveContainer>
    </div>
  );
};
