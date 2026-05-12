/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CountryData } from '../data/tollData';
import { ArrowUpDown, AlertCircle, Database, Cpu, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';
import { useTheme } from '../lib/themeContext';

interface DataTableProps {
  data: CountryData[];
}

type TableView = 'master' | 'tech' | 'volume' | 'quality' | 'finance';

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
  const { isDarkMode } = useTheme();
  const [view, setView] = useState<TableView>('master');
  const [sortKey, setSortKey] = useState<keyof CountryData>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const sortedData = [...data].sort((a, b) => {
    const valA = a[sortKey];
    const valB = b[sortKey];
    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortOrder === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const handleSort = (key: keyof CountryData) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const tabs = [
    { id: 'master', label: 'Master', icon: <Database className="w-3 h-3" /> },
    { id: 'tech', label: 'Tech', icon: <Cpu className="w-3 h-3" /> },
    { id: 'volume', label: 'Véhicules', icon: <TrendingUp className="w-3 h-3" /> },
    { id: 'quality', label: 'Erreurs', icon: <CheckCircle className="w-3 h-3" /> },
    { id: 'finance', label: 'Recettes', icon: <DollarSign className="w-3 h-3" /> },
  ] as const;

  return (
    <div className={cn(
      "rounded-xl border overflow-hidden h-[500px] flex flex-col transition-colors",
      isDarkMode ? "bg-slate-900/40 border-slate-700/50" : "bg-white border-slate-200 shadow-sm"
    )}>
      <div className={cn(
        "p-4 border-b flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors",
        isDarkMode ? "border-slate-700 bg-slate-800/20" : "border-slate-100 bg-slate-50/50"
      )}>
        <h3 className={cn(
          "font-medium text-sm lg:text-base uppercase tracking-wider flex items-center gap-2 transition-colors",
          isDarkMode ? "text-slate-200" : "text-slate-900"
        )}>
          Explorateur de Données
        </h3>
        
        <div className={cn(
          "flex p-1 rounded-lg border transition-colors",
          isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-100 border-slate-200"
        )}>
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all whitespace-nowrap",
                view === tab.id 
                  ? (isDarkMode ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" : "bg-white text-blue-600 border border-blue-200 shadow-sm")
                  : (isDarkMode ? "text-slate-500 hover:text-slate-300 hover:bg-slate-800" : "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50")
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-auto flex-1 custom-scrollbar">
        <table className="w-full text-sm text-left">
          <thead className={cn(
            "sticky top-0 z-10 font-mono text-[10px] uppercase tracking-wider transition-colors",
            isDarkMode ? "bg-slate-800/80 text-slate-400" : "bg-slate-50/90 text-slate-500"
          )}>
            <tr>
              <th className={cn("px-6 py-4 cursor-pointer transition-colors", isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100")} onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Pays <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
              </th>
              
              {(view === 'master' || view === 'volume' || view === 'finance') && (
                <th className={cn("px-6 py-4 cursor-pointer transition-colors", isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100")} onClick={() => handleSort('volume')}>
                  <div className="flex items-center gap-1">Véhicules/J <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'finance') && (
                <th className={cn("px-6 py-4 cursor-pointer transition-colors", isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100")} onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1">Recettes/J <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}
              
              {(view === 'master' || view === 'quality') && (
                <th className={cn("px-6 py-4 cursor-pointer transition-colors", isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100")} onClick={() => handleSort('precision')}>
                  <div className="flex items-center gap-1">Précision <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'quality' || view === 'master') && (
                <th className={cn("px-6 py-4 cursor-pointer transition-colors", isDarkMode ? "hover:bg-slate-700/50" : "hover:bg-slate-100")} onClick={() => handleSort('errors')}>
                  <div className="flex items-center gap-1">Erreurs <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'tech') && (
                <th className="px-6 py-4">Technologies</th>
              )}
            </tr>
          </thead>
          <tbody className={cn("divide-y transition-colors", isDarkMode ? "divide-slate-800/50" : "divide-slate-100")}>
            {sortedData.map((country) => (
              <tr key={country.id} className={cn("transition-colors group", isDarkMode ? "hover:bg-blue-500/5" : "hover:bg-slate-50")}>
                <td className={cn("px-6 py-4 font-medium transition-colors", isDarkMode ? "text-slate-200" : "text-slate-900")}>
                  <div className="flex items-center gap-2">
                    <div className={cn("w-1.5 h-1.5 rounded-full", isDarkMode ? "bg-blue-500/50" : "bg-blue-600")} />
                    {country.name}
                  </div>
                </td>

                {(view === 'master' || view === 'volume' || view === 'finance') && (
                  <td className={cn("px-6 py-4 font-mono transition-colors", isDarkMode ? "text-slate-400" : "text-slate-600")}>
                    {country.volume.toLocaleString()}
                  </td>
                )}

                {(view === 'master' || view === 'finance') && (
                  <td className={cn("px-6 py-4 font-mono transition-colors", isDarkMode ? "text-emerald-400" : "text-emerald-600 font-bold")}>
                    ${country.revenue.toLocaleString()}
                  </td>
                )}
                
                {(view === 'master' || view === 'quality') && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={cn("w-12 h-1 rounded-full overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-200")}>
                        <div className="h-full bg-blue-500" style={{ width: `${country.precision}%` }} />
                      </div>
                      <span className={cn("text-[10px] font-mono", isDarkMode ? "text-slate-300" : "text-slate-600")}>{country.precision}%</span>
                    </div>
                  </td>
                )}

                {(view === 'master' || view === 'quality' || view === 'master') && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold font-mono border",
                        country.errors > 5 
                          ? (isDarkMode ? 'bg-red-500/10 text-red-400 border-red-500/20' : 'bg-red-50 text-red-600 border-red-100') 
                          : (isDarkMode ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-emerald-50 text-emerald-600 border-emerald-100')
                      )}>
                        {country.errors}%
                      </span>
                      {country.errors > 5 && <AlertCircle className="w-3 h-3 text-red-500 animate-pulse" />}
                    </div>
                  </td>
                )}

                {(view === 'master' || view === 'tech') && (
                  <td className="px-6 py-4">
                    <div className="flex gap-1.5 flex-wrap">
                      {country.tech.map((t, i) => (
                        <span key={i} className={cn(
                          "text-[9px] border px-2 py-0.5 rounded-md uppercase tracking-tighter transition-colors",
                          isDarkMode ? "bg-slate-800 text-slate-400 border-slate-700" : "bg-white text-slate-600 border-slate-200"
                        )}>
                          {t}
                        </span>
                      ))}
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

