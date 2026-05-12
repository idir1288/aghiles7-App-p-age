/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { tollingData, generateTimeline, CountryData, TollingTechnology } from './data/tollData';
import { WorldMap } from './components/WorldMap';
import { KpiGauges } from './components/KpiGauges';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { BubbleChart } from './components/BubbleChart';
import { TimelineChart } from './components/TimelineChart';
import { 
  Filter, 
  Search,
  RefreshCcw, 
  Globe, 
  Activity, 
  Info,
  ChevronRight,
  TrendingUp,
  AlertCircle,
  Cpu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [selectedRegion, setSelectedRegion] = useState<string>('Tous');
  const [selectedTech, setSelectedTech] = useState<string>('Toutes');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const regions = ['Tous', ...Array.from(new Set(tollingData.map(d => d.region)))];
  const technologies = [
    'Toutes',
    'ANPR/LPR',
    'RFID/E-TAG',
    'GNSS',
    'DSRC',
    'ETC',
    'FASTag'
  ];

  const filteredData = useMemo(() => {
    return tollingData.filter(d => {
      const regionMatch = selectedRegion === 'Tous' || d.region === selectedRegion;
      const techMatch = selectedTech === 'Toutes' || d.tech.includes(selectedTech as TollingTechnology);
      return regionMatch && techMatch;
    });
  }, [selectedRegion, selectedTech]);

  const globalKpis = useMemo(() => {
    if (filteredData.length === 0) return { automation: 0, precision: 0, fluidity: 0 };
    return {
      automation: Math.round(filteredData.reduce((acc, curr) => acc + curr.automation, 0) / filteredData.length),
      precision: Number((filteredData.reduce((acc, curr) => acc + curr.precision, 0) / filteredData.length).toFixed(1)),
      fluidity: Math.round(filteredData.reduce((acc, curr) => acc + curr.fluidity, 0) / filteredData.length),
    };
  }, [filteredData]);

  const globalAverages = useMemo(() => {
    return {
      automation: Math.round(tollingData.reduce((acc, curr) => acc + curr.automation, 0) / tollingData.length),
      precision: Number((tollingData.reduce((acc, curr) => acc + curr.precision, 0) / tollingData.length).toFixed(1)),
      fluidity: Math.round(tollingData.reduce((acc, curr) => acc + curr.fluidity, 0) / tollingData.length),
    };
  }, []);

  const timelineData = useMemo(() => {
    if (selectedCountry) {
      return generateTimeline(selectedCountry.volume, selectedCountry.revenue);
    }
    const totalVol = filteredData.reduce((acc, curr) => acc + curr.volume, 0);
    const totalRev = filteredData.reduce((acc, curr) => acc + curr.revenue, 0);
    return generateTimeline(totalVol, totalRev);
  }, [selectedCountry, filteredData]);

  const resetFilters = () => {
    setSelectedRegion('Tous');
    setSelectedTech('Toutes');
    setSelectedCountry(null);
    setSearchQuery('');
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return tollingData.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Top Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight uppercase">Cyclope Vision<span className="text-blue-500 font-black">AI</span></h1>
              <p className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                GLOBAL TOLLING INTELLIGENCE DASHBOARD <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> LIVE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                <input
                  type="text"
                  placeholder="Rechercher un pays..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSearchResults(true);
                  }}
                  onFocus={() => setShowSearchResults(true)}
                  onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
                  className="bg-slate-800/50 border border-slate-700 rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 transition-all placeholder:text-slate-600 text-slate-200"
                />
              </div>
              
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full mt-2 w-full bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden z-[60]"
                  >
                    {searchResults.map(country => (
                      <button
                        key={country.id}
                        onClick={() => {
                          setSelectedCountry(country);
                          setSearchQuery(country.name);
                          setShowSearchResults(false);
                        }}
                        className="w-full px-4 py-2 text-left text-xs hover:bg-slate-800 transition-colors flex items-center justify-between group"
                      >
                        <span className="text-slate-300 group-hover:text-white font-medium">{country.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{country.region}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Région</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer text-slate-200"
                >
                  {regions.map(r => <option key={r} value={r} className="bg-slate-900">{r}</option>)}
                </select>
              </div>
              <div className="w-px h-8 bg-slate-800" />
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Technologie</span>
                <select 
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className="bg-transparent text-sm font-medium border-none focus:ring-0 cursor-pointer text-slate-200"
                >
                  {technologies.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                </select>
              </div>
            </div>
            <button 
              onClick={resetFilters}
              className="p-2 hover:bg-slate-800 rounded-lg transition-colors text-slate-400 hover:text-white"
              title="Réinitialiser"
            >
              <RefreshCcw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* KPI Row */}
            <div className="bg-slate-900/10 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
               <KpiGauges 
                automation={globalKpis.automation}
                precision={globalKpis.precision}
                fluidity={globalKpis.fluidity}
                refAutomation={globalAverages.automation}
                refPrecision={globalAverages.precision}
                refFluidity={globalAverages.fluidity}
               />
            </div>

            {/* Visualizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WorldMap 
                data={filteredData} 
                onSelectCountry={setSelectedCountry} 
                selectedCountryId={selectedCountry?.id}
              />
              <BarChart data={filteredData} />
              <BubbleChart data={filteredData} />
              <TimelineChart data={timelineData} />
            </div>

            <DataTable data={filteredData} />
          </div>

          {/* Sidebar / Detail Panel */}
          <aside className="xl:col-span-1 space-y-6">
            <AnimatePresence mode="wait">
              {selectedCountry ? (
                <motion.div
                  key={selectedCountry.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="bg-slate-900/50 border border-slate-700 rounded-2xl p-6 h-full flex flex-col"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                          selectedCountry.precision > 98 && selectedCountry.errors < 2 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : selectedCountry.errors > 5 
                              ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}>
                          Status: {selectedCountry.precision > 98 && selectedCountry.errors < 2 ? 'Optimal' : selectedCountry.errors > 5 ? 'Critical' : 'Warning'}
                        </span>
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight">{selectedCountry.name}</h2>
                      <p className="text-sm text-slate-400 flex items-center gap-1.5">
                        <Globe className="w-3 h-3 text-blue-500" /> {selectedCountry.region}
                      </p>
                    </div>
                    <button 
                      onClick={() => setSelectedCountry(null)}
                      className="p-2 hover:bg-slate-800 rounded-lg transition-colors group"
                    >
                      <RefreshCcw className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Daily Volume</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-mono font-bold text-slate-100">{selectedCountry.volume.toLocaleString()}</span>
                          <span className="text-[10px] text-slate-600">v/j</span>
                        </div>
                      </div>
                      <div className="p-3 bg-slate-800/40 rounded-xl border border-slate-700/50">
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Daily Revenue</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-mono font-bold text-emerald-400">${(selectedCountry.revenue).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Indicators */}
                    <div className="space-y-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Activity className="w-3 h-3 text-blue-500" /> Intelligence Performance
                       </h4>
                       <div className="space-y-4">
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[11px]">
                             <span className="text-slate-400">Reading Accuracy</span>
                             <span className="text-emerald-400 font-bold font-mono">{selectedCountry.precision}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${selectedCountry.precision}%` }}
                               className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                             />
                           </div>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[11px]">
                             <span className="text-slate-400">System Error Rate</span>
                             <span className={cn("font-bold font-mono", selectedCountry.errors > 5 ? 'text-red-400' : 'text-orange-400')}>{selectedCountry.errors}%</span>
                           </div>
                           <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                             <motion.div 
                               initial={{ width: 0 }}
                               animate={{ width: `${selectedCountry.errors * 5}%` }}
                               className={cn("h-full", selectedCountry.errors > 5 ? 'bg-red-500' : 'bg-orange-500')}
                             />
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technologies Deployed</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedCountry.tech.map(t => (
                          <div key={t} className="flex items-center gap-2 bg-slate-800/80 px-2.5 py-1.5 rounded-lg border border-slate-700 hover:border-blue-500/30 transition-colors">
                             <Cpu className="w-3 h-3 text-blue-400" />
                             <span className="text-[10px] font-bold text-slate-200 uppercase tracking-tighter">{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {selectedCountry.errors > 5 && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-400 uppercase tracking-tight">Anomalie Détectée</p>
                          <p className="text-[10px] text-red-300/70 mt-1 leading-relaxed">
                            Intervention requise sur les capteurs {selectedCountry.tech[0]}. Taux de rejet supérieur aux SLAs.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-slate-800">
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group">
                      Générer Rapport IA <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[10px] text-center text-slate-500 mt-4 leading-normal italic">
                      Dernière mise à jour : 12 mai 2026<br/>Source : Cyclope Global Network
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-slate-900/30 border border-dashed border-slate-700 rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-6">
                    <Globe className="text-slate-600 w-8 h-8" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-400 mb-2">Sélectionnez un Pays</h3>
                  <p className="text-sm text-slate-500 max-w-[200px]">
                    Cliquez sur une bulle de la carte pour afficher l'analyse détaillée et les projections.
                  </p>
                  
                  <div className="mt-12 w-full space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Info className="w-4 h-4" />
                      Système mondial scanné : 9 régions
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500">
                      <Activity className="w-4 h-4" />
                      Précision moyenne : {globalKpis.precision}%
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </main>

      <footer className="border-t border-slate-800 bg-slate-900/30 py-8 px-6 mt-12">
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-xs font-mono uppercase tracking-widest">
            <Activity className="w-4 h-4" /> Built for Global Logistics & Smart Cities
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-bold tracking-widest text-slate-600">
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Documentation</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">API Status</span>
            <span className="hover:text-blue-500 cursor-pointer transition-colors">Support</span>
          </div>
          <p className="text-slate-600 text-[10px] font-mono">
            &copy; 2026 CYCLOPE VISION AI. ALL RIGHTS RESERVED.
          </p>
        </div>
      </footer>
    </div>
  );
}
