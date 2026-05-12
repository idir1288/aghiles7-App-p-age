/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useMemo } from 'react';
import { TollingFact, TollingTechnology } from '../data/tollData';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

interface HeatmapProps {
  data: TollingFact[];
}

export const Heatmap = ({ data }: HeatmapProps) => {
  const { isDarkMode } = useTheme();

  const heatmapData = useMemo(() => {
    const techs: TollingTechnology[] = Array.from(new Set(data.map(f => f.tech)));
    const precisions = ['95-97%', '97-99%', '99%+'];
    
    const grid = techs.map(tech => {
      const techFacts = data.filter(f => f.tech === tech);
      return {
        tech,
        values: precisions.map((p, idx) => {
          const count = techFacts.filter(f => {
            const prec = (f.readingsOk / f.vehiclesDay) * 100;
            if (idx === 0) return prec < 97;
            if (idx === 1) return prec >= 97 && prec < 99;
            return prec >= 99;
          }).length;
          return { label: p, count };
        })
      };
    });

    return { techs, precisions, grid };
  }, [data]);

  const maxCount = Math.max(...heatmapData.grid.flatMap(g => g.values.map(v => v.count)), 1);

  return (
    <div className={cn(
      "p-6 rounded-2xl border transition-colors",
      isDarkMode ? "bg-slate-900/50 border-slate-800" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className="flex justify-between items-center mb-6">
        <h3 className={cn("text-sm font-bold uppercase tracking-widest", isDarkMode ? "text-slate-200" : "text-slate-800")}>
          Heatmap: Tech vs Précision
        </h3>
      </div>
      
      <div className="relative overflow-x-auto custom-scrollbar">
        <div className="min-w-[400px]">
          <div className="flex mb-2">
            <div className="w-24 shrink-0" />
            {heatmapData.precisions.map(p => (
              <div key={p} className="flex-1 text-[10px] font-bold text-center text-slate-500 uppercase tracking-tighter">
                {p}
              </div>
            ))}
          </div>

          <div className="space-y-1">
            {heatmapData.grid.map((row, i) => (
              <div key={row.tech} className="flex items-center gap-1">
                <div className="w-24 shrink-0 text-[10px] font-bold text-slate-400 uppercase truncate pr-2" title={row.tech}>
                  {row.tech}
                </div>
                {row.values.map((v, j) => {
                  const intensity = v.count / maxCount;
                  return (
                    <motion.div
                      key={j}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: (i * 0.05) + (j * 0.02) }}
                      className={cn(
                        "flex-1 h-12 rounded-lg relative group transition-all cursor-crosshair",
                        isDarkMode ? "bg-blue-500/5" : "bg-blue-50"
                      )}
                    >
                      <div 
                        className="absolute inset-0 rounded-lg bg-blue-600 transition-all"
                        style={{ opacity: intensity * 0.8 }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className={cn(
                          "text-[10px] font-mono font-bold",
                          intensity > 0.5 ? "text-white" : isDarkMode ? "text-slate-400" : "text-slate-600"
                        )}>
                          {v.count}
                        </span>
                      </div>
                      
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-slate-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none z-50 whitespace-nowrap">
                        {row.tech}: {v.count} entrées à {v.label}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-end gap-2">
        <span className="text-[10px] text-slate-500 uppercase font-bold tracking-tighter">Fréquence</span>
        <div className="flex gap-0.5 h-1.5 w-24 rounded-full overflow-hidden">
          <div className="flex-1 bg-blue-600/10" />
          <div className="flex-1 bg-blue-600/30" />
          <div className="flex-1 bg-blue-600/60" />
          <div className="flex-1 bg-blue-600" />
        </div>
      </div>
    </div>
  );
};
