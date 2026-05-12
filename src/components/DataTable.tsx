/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { CountryData } from '../data/tollData';
import { ArrowUpDown, AlertCircle, Database, Cpu, TrendingUp, CheckCircle, DollarSign } from 'lucide-react';
import { cn } from '../lib/utils';

interface DataTableProps {
  data: CountryData[];
}

type TableView = 'master' | 'tech' | 'volume' | 'quality' | 'finance';

export const DataTable: React.FC<DataTableProps> = ({ data }) => {
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
    <div className="bg-slate-900/40 rounded-xl border border-slate-700/50 overflow-hidden h-[500px] flex flex-col">
      <div className="p-4 border-b border-slate-700 bg-slate-800/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h3 className="text-slate-200 font-medium text-sm lg:text-base uppercase tracking-wider flex items-center gap-2">
          Explorateur de Données
        </h3>
        
        <div className="flex bg-slate-900/60 p-1 rounded-lg border border-slate-800">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] uppercase font-bold transition-all whitespace-nowrap",
                view === tab.id 
                  ? "bg-blue-600/20 text-blue-400 border border-blue-500/30" 
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
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
          <thead className="bg-slate-800/50 sticky top-0 z-10 text-slate-400 font-mono text-[10px] uppercase tracking-wider shadow-sm">
            <tr>
              <th className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => handleSort('name')}>
                <div className="flex items-center gap-1">Pays <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
              </th>
              
              {(view === 'master' || view === 'volume' || view === 'finance') && (
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => handleSort('volume')}>
                  <div className="flex items-center gap-1">Véhicules/J <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'finance') && (
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => handleSort('revenue')}>
                  <div className="flex items-center gap-1">Recettes/J <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}
              
              {(view === 'master' || view === 'quality') && (
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => handleSort('precision')}>
                  <div className="flex items-center gap-1">Précision <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'quality' || view === 'master') && (
                <th className="px-6 py-4 cursor-pointer hover:bg-slate-700/50 transition-colors" onClick={() => handleSort('errors')}>
                  <div className="flex items-center gap-1">Erreurs <ArrowUpDown className="w-3 h-3 opacity-50" /></div>
                </th>
              )}

              {(view === 'master' || view === 'tech') && (
                <th className="px-6 py-4">Technologies</th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {sortedData.map((country) => (
              <tr key={country.id} className="hover:bg-blue-500/5 transition-colors group">
                <td className="px-6 py-4 font-medium text-slate-200">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-blue-500/50" />
                    {country.name}
                  </div>
                </td>

                {(view === 'master' || view === 'volume' || view === 'finance') && (
                  <td className="px-6 py-4 text-slate-400 font-mono">
                    {country.volume.toLocaleString()}
                  </td>
                )}

                {(view === 'master' || view === 'finance') && (
                  <td className="px-6 py-4 text-emerald-400 font-mono">
                    ${country.revenue.toLocaleString()}
                  </td>
                )}
                
                {(view === 'master' || view === 'quality') && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="w-12 h-1 bg-slate-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: `${country.precision}%` }} />
                      </div>
                      <span className="text-[10px] text-slate-300 font-mono">{country.precision}%</span>
                    </div>
                  </td>
                )}

                {(view === 'master' || view === 'quality' || view === 'master') && (
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold font-mono",
                        country.errors > 5 ? 'bg-red-500/10 text-red-400 border border-red-500/20' : 'bg-green-500/10 text-green-400 border border-green-500/20'
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
                        <span key={i} className="text-[9px] bg-slate-800 text-slate-400 border border-slate-700 px-2 py-0.5 rounded-md uppercase tracking-tighter">
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

