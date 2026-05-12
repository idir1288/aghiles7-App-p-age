/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Gauge, CheckCircle2, Zap, ArrowRight } from 'lucide-react';

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
  const getStatus = (val: number) => {
    if (val >= 95) return { label: 'Excellent', color: 'text-emerald-400' };
    if (val >= 85) return { label: 'Bon', color: 'text-sky-400' };
    return { label: 'À améliorer', color: 'text-amber-400' };
  };

  const renderGauge = (title: string, value: number, refValue: number | undefined, icon: React.ReactNode) => {
    const status = getStatus(value);
    const circumference = 2 * Math.PI * 40;
    const offset = circumference - (value / 100) * circumference;

    return (
      <div className="flex flex-col items-center bg-slate-900/40 p-4 rounded-xl border border-slate-700/50">
        <div className="relative w-24 h-24 mb-3">
          <svg className="w-full h-full -rotate-90">
            <circle
              cx="48"
              cy="48"
              r="40"
              fill="none"
              stroke="#1e293b"
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
            <span className="text-xl font-bold text-slate-100">{value}%</span>
          </div>
        </div>
        <div className="flex items-center gap-2 mb-1">
          {icon}
          <span className="text-xs font-medium text-slate-300 uppercase tracking-tight">{title}</span>
        </div>
        <span className={`text-[10px] font-bold uppercase mb-2 ${status.color}`}>{status.label}</span>
        
        {refValue !== undefined && (
          <div className="w-full pt-2 border-t border-slate-800/50 mt-1 flex items-center justify-between px-2">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Réf. Mond.</span>
            <span className="text-[10px] font-mono text-slate-400">{refValue}%</span>
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
