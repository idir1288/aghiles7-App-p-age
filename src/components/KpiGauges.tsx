/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Gauge, CheckCircle2, Zap } from 'lucide-react';
import { useTheme } from '../lib/themeContext';
import { cn } from '../lib/utils';

interface KpiGaugesProps {
  automation: number;
  precision: number;
  fluidity: number;
  refAutomation?: number;
  refPrecision?: number;
  refFluidity?: number;
}

export const KpiGauges: React.FC<KpiGaugesProps> = ({ 
  automation, 
  precision, 
  fluidity,
  refAutomation,
  refPrecision,
  refFluidity
}) => {
  const { isDarkMode } = useTheme();

  const getStatus = (val: number) => {
    if (val >= 95) return { label: 'Excellent', color: isDarkMode ? 'text-emerald-400' : 'text-emerald-600' };
    if (val >= 85) return { label: 'Bon', color: isDarkMode ? 'text-sky-400' : 'text-sky-600' };
    return { label: 'À améliorer', color: isDarkMode ? 'text-amber-400' : 'text-amber-600' };
  };

  const renderGauge = (title: string, value: number, refValue: number | undefined, icon: React.ReactNode) => {
    const status = getStatus(value);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className={cn(
        "flex flex-col items-center p-4 rounded-xl border transition-colors",
        isDarkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-white border-slate-200"
      )}>
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke={isDarkMode ? "#1e293b" : "#f1f5f9"}
              strokeWidth="8"
            />
            <motion.circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={status.color}
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <span className={cn("text-xl font-bold transition-colors", isDarkMode ? "text-slate-100" : "text-slate-900")}>{value}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className={cn("text-xs font-medium uppercase tracking-tight transition-colors", isDarkMode ? "text-slate-300" : "text-slate-600")}>{title}</span>
        </div>
        <span className={cn("text-[10px] font-bold uppercase mb-2", status.color)}>{status.label}</span>
        
        {refValue !== undefined && (
          <div className={cn("w-full pt-2 border-t mt-1 flex items-center justify-between px-2 transition-colors", isDarkMode ? "border-slate-800/50" : "border-slate-100")}>
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Moy. Global</span>
            <span className={cn("text-[10px] font-mono transition-colors", isDarkMode ? "text-slate-400" : "text-slate-500")}>{refValue}%</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {renderGauge("Automation", automation, refAutomation, <Zap className="w-3 h-3" />)}
      {renderGauge("Précision", precision, refPrecision, <CheckCircle2 className="w-3 h-3" />)}
      {renderGauge("Fluidité", fluidity, refFluidity, <Gauge className="w-3 h-3" />)}
    </div>
  );
};
