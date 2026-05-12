/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { tollingFacts, countriesData, TollingFact, TollingTechnology } from './data/tollData';
import { WorldMap } from './components/WorldMap';
import { KpiGauges } from './components/KpiGauges';
import { BarChart } from './components/BarChart';
import { DataTable } from './components/DataTable';
import { TimelineChart } from './components/TimelineChart';
import { Heatmap } from './components/Heatmap';
import { ScatterChart } from './components/ScatterChart';
import { SankeyChart } from './components/SankeyChart';
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
  Cpu,
  Moon,
  Sun,
  Brain,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';
import { ThemeProvider, useTheme } from './lib/themeContext';

function DashboardContent() {
  const { isDarkMode, toggleTheme } = useTheme();
  const [selectedRegion, setSelectedRegion] = useState<string>('Tous');
  const [selectedTech, setSelectedTech] = useState<string>('Toutes');
  const [selectedLLM, setSelectedLLM] = useState<string>('Tous');
  const [selectedDate, setSelectedDate] = useState<string>('Toutes');
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchResults, setShowSearchResults] = useState(false);

  const regions = ['Tous', ...Array.from(new Set(countriesData.map(d => d.region)))];
  const technologies = [
    'Toutes',
    'ANPR/LPR',
    'RFID/E-TAG',
    'GNSS',
    'RFID',
    'E-TAG',
    'GNSS/ANPR',
    'RFID/ANPR',
  ];
  const dates = ['Toutes', ...Array.from(new Set(tollingFacts.map(f => f.date)))].sort();

  const filteredData = useMemo(() => {
    return tollingFacts.filter(f => {
      const regionMatch = selectedRegion === 'Tous' || f.region === selectedRegion;
      const techMatch = selectedTech === 'Toutes' || f.tech === selectedTech;
      const llmMatch = selectedLLM === 'Tous' || f.llmStatus === selectedLLM;
      const dateMatch = selectedDate === 'Toutes' || f.date === selectedDate;
      const countryMatch = !selectedCountry || f.country === selectedCountry;
      return regionMatch && techMatch && llmMatch && dateMatch && countryMatch;
    });
  }, [selectedRegion, selectedTech, selectedLLM, selectedDate, selectedCountry]);

  // For components that expect country summaries
  const summaries = useMemo(() => {
    return countriesData.map(c => {
      const countryFacts = filteredData.filter(f => f.country === c.name);
      if (countryFacts.length === 0) return null;
      
      const totalVehicles = countryFacts.reduce((acc, curr) => acc + curr.vehiclesDay, 0);
      const totalReadings = countryFacts.reduce((acc, curr) => acc + curr.readingsOk, 0);
      
      return {
        id: c.id,
        name: c.name,
        region: c.region,
        automation: countryFacts.reduce((acc, curr) => acc + curr.automationRate, 0) / countryFacts.length,
        precision: (totalReadings / totalVehicles) * 100,
        fluidity: countryFacts.reduce((acc, curr) => acc + curr.avgTimeSec, 0) / countryFacts.length,
        volume: totalVehicles / countryFacts.length, // Average daily for the period
        revenue: countryFacts.reduce((acc, curr) => acc + curr.revenueUsd, 0) / countryFacts.length,
        errors: countryFacts.reduce((acc, curr) => acc + curr.errorRate, 0) / countryFacts.length,
        tech: [c.tech] as TollingTechnology[],
        iaLevel: c.iaLevel,
        electronicAdoption: c.adoption,
        coordinates: c.coords as [number, number]
      };
    }).filter(Boolean);
  }, [filteredData]);

  const globalKpis = useMemo(() => {
    if (filteredData.length === 0) return { automation: 0, precision: 0, fluidity: 0, revenue: 0, errors: 0 };
    const totalVehicles = filteredData.reduce((acc, curr) => acc + curr.vehiclesDay, 0);
    const totalReadings = filteredData.reduce((acc, curr) => acc + curr.readingsOk, 0);
    
    return {
      automation: Math.round(filteredData.reduce((acc, curr) => acc + curr.automationRate, 0) / filteredData.length),
      precision: Number(((totalReadings / totalVehicles) * 100).toFixed(2)),
      fluidity: Number((filteredData.reduce((acc, curr) => acc + curr.avgTimeSec, 0) / filteredData.length).toFixed(2)),
      revenue: Math.round(filteredData.reduce((acc, curr) => acc + curr.revenueUsd, 0) / Array.from(new Set(filteredData.map(f => f.date))).length), // Daily average
      errors: Number((filteredData.reduce((acc, curr) => acc + curr.errorRate, 0) / filteredData.length).toFixed(2)),
    };
  }, [filteredData]);

  const currentCountryDetail = useMemo(() => {
    if (!selectedCountry) return null;
    return summaries.find(c => c?.name === selectedCountry) || null;
  }, [selectedCountry, summaries]);

  const timelineData = useMemo(() => {
    const dailyData = Array.from(new Set(filteredData.map(f => f.date))).sort().map(date => {
      const dayFacts = filteredData.filter(f => f.date === date);
      return {
        date,
        volume: dayFacts.reduce((acc, curr) => acc + curr.vehiclesDay, 0),
        revenue: dayFacts.reduce((acc, curr) => acc + curr.revenueUsd, 0)
      };
    });
    return dailyData;
  }, [filteredData]);

  const resetFilters = () => {
    setSelectedRegion('Tous');
    setSelectedTech('Toutes');
    setSelectedLLM('Tous');
    setSelectedDate('Toutes');
    setSelectedCountry(null);
    setSearchQuery('');
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return countriesData.filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className={cn(
      "min-h-screen transition-colors duration-300 font-sans selection:bg-blue-500/30",
      isDarkMode ? "bg-[#020617] text-slate-100" : "bg-slate-50 text-slate-900"
    )}>
      {/* Top Header */}
      <header className={cn(
        "border-b backdrop-blur-md sticky top-0 z-50 transition-colors",
        isDarkMode ? "border-slate-800 bg-slate-900/50" : "border-slate-200 bg-white/80"
      )}>
        <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Activity className="text-white w-6 h-6" />
            </div>
            <div>
              <h1 className={cn(
                "text-lg font-bold tracking-tight uppercase",
                isDarkMode ? "text-slate-100" : "text-slate-900"
              )}>Cyclope Vision<span className="text-blue-600 font-black">AI</span></h1>
              <p className={cn(
                "text-[10px] font-mono flex items-center gap-2",
                isDarkMode ? "text-slate-400" : "text-slate-500"
              )}>
                GLOBAL TOLLING INTELLIGENCE DASHBOARD <span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> LIVE
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            {/* Search Bar */}
            <div className="relative hidden lg:block">
              <div className="relative group">
                <Search className={cn(
                  "absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 transition-colors",
                  isDarkMode ? "text-slate-500 group-focus-within:text-blue-500" : "text-slate-400 group-focus-within:text-blue-600"
                )} />
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
                  className={cn(
                    "rounded-full py-1.5 pl-10 pr-4 text-sm w-64 focus:outline-none focus:ring-1 transition-all placeholder:text-slate-500",
                    isDarkMode 
                      ? "bg-slate-800/50 border border-slate-700 text-slate-200 focus:border-blue-500/50 focus:ring-blue-500/20" 
                      : "bg-slate-100 border border-slate-200 text-slate-800 focus:border-blue-400 focus:ring-blue-200"
                  )}
                />
              </div>
              
              <AnimatePresence>
                {showSearchResults && searchResults.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className={cn(
                      "absolute top-full mt-2 w-full border rounded-xl shadow-2xl overflow-hidden z-[60]",
                      isDarkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"
                    )}
                  >
                    {searchResults.map(country => (
                      <button
                        key={country.id}
                        onClick={() => {
                          setSelectedCountry(country.name);
                          setSearchQuery(country.name);
                          setShowSearchResults(false);
                        }}
                        className={cn(
                          "w-full px-4 py-2 text-left text-xs transition-colors flex items-center justify-between group",
                          isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-50"
                        )}
                      >
                        <span className={cn(
                          "font-medium",
                          isDarkMode ? "text-slate-300 group-hover:text-white" : "text-slate-600 group-hover:text-blue-600"
                        )}>{country.name}</span>
                        <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{country.region}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="hidden xl:flex items-center gap-4">
              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date</span>
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" />
                  <select 
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className={cn(
                      "bg-transparent text-[11px] font-medium border-none focus:ring-0 cursor-pointer transition-colors max-w-[100px]",
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    )}
                  >
                    {dates.map(d => <option key={d} value={d} className={isDarkMode ? "bg-slate-900" : "bg-white"}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className={cn("w-px h-8", isDarkMode ? "bg-slate-800" : "bg-slate-200")} />

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">IA (LLM)</span>
                <div className="flex items-center gap-1">
                  <Brain className="w-3 h-3 text-blue-400" />
                  <select 
                    value={selectedLLM}
                    onChange={(e) => setSelectedLLM(e.target.value)}
                    className={cn(
                      "bg-transparent text-[11px] font-medium border-none focus:ring-0 cursor-pointer transition-colors",
                      isDarkMode ? "text-slate-200" : "text-slate-700"
                    )}
                  >
                    <option value="Tous" className={isDarkMode ? "bg-slate-900" : "bg-white"}>Tous</option>
                    <option value="Oui" className={isDarkMode ? "bg-slate-900" : "bg-white"}>Oui</option>
                    <option value="Non" className={isDarkMode ? "bg-slate-900" : "bg-white"}>Non</option>
                  </select>
                </div>
              </div>

              <div className={cn("w-px h-8", isDarkMode ? "bg-slate-800" : "bg-slate-200")} />

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Région</span>
                <select 
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className={cn(
                    "bg-transparent text-[11px] font-medium border-none focus:ring-0 cursor-pointer transition-colors",
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  )}
                >
                  {regions.map(r => <option key={r} value={r} className={isDarkMode ? "bg-slate-900" : "bg-white"}>{r}</option>)}
                </select>
              </div>

              <div className={cn("w-px h-8", isDarkMode ? "bg-slate-800" : "bg-slate-200")} />

              <div className="flex flex-col">
                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Technologie</span>
                <select 
                  value={selectedTech}
                  onChange={(e) => setSelectedTech(e.target.value)}
                  className={cn(
                    "bg-transparent text-[11px] font-medium border-none focus:ring-0 cursor-pointer transition-colors",
                    isDarkMode ? "text-slate-200" : "text-slate-700"
                  )}
                >
                  {technologies.map(t => <option key={t} value={t} className={isDarkMode ? "bg-slate-900" : "bg-white"}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={toggleTheme}
                className={cn(
                  "p-2 rounded-lg transition-all active:scale-95",
                  isDarkMode ? "bg-slate-800 text-amber-400 hover:bg-slate-700" : "bg-slate-100 text-blue-600 hover:bg-slate-200"
                )}
                title={isDarkMode ? "Passer en mode clair" : "Passer en mode sombre"}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              
              <button 
                onClick={resetFilters}
                className={cn(
                  "p-2 rounded-lg transition-colors",
                  isDarkMode ? "text-slate-400 hover:text-white" : "text-slate-500 hover:text-slate-900"
                )}
                title="Réinitialiser"
              >
                <RefreshCcw className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          
          {/* Main Content Area */}
          <div className="xl:col-span-3 space-y-6">
            
            {/* KPI Row */}
            <div className={cn(
              "p-4 rounded-2xl border backdrop-blur-sm transition-colors",
              isDarkMode ? "bg-slate-900/10 border-slate-800/50" : "bg-white/50 border-slate-200 shadow-sm"
            )}>
               <KpiGauges 
                automation={globalKpis.automation}
                precision={globalKpis.precision}
                fluidity={globalKpis.fluidity}
                revenue={globalKpis.revenue}
                errors={globalKpis.errors}
               />
            </div>

            {/* Visualizer Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <WorldMap 
                data={summaries as any[]} 
                onSelectCountry={(c: any) => setSelectedCountry(c.name)} 
                selectedCountryId={currentCountryDetail?.id}
                colorBy="automation"
              />
              <BarChart data={summaries as any[]} />
              <ScatterChart data={summaries as any[]} />
              <SankeyChart data={summaries as any[]} />
              <TimelineChart data={timelineData} />
              <Heatmap data={filteredData} />
            </div>

            <DataTable data={summaries as any[]} />
          </div>

          {/* Sidebar / Detail Panel */}
          <aside className="xl:col-span-1 space-y-6">
            <AnimatePresence mode="wait">
              {currentCountryDetail ? (
                <motion.div
                  key={currentCountryDetail.id}
                  initial={{ x: 20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className={cn(
                    "border rounded-2xl p-6 h-full flex flex-col transition-colors",
                    isDarkMode ? "bg-slate-900/50 border-slate-700" : "bg-white border-slate-200 shadow-lg"
                  )}
                >
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest border",
                          currentCountryDetail.precision > 98 && currentCountryDetail.errors < 2 
                            ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                            : currentCountryDetail.errors > 5 
                              ? "bg-red-500/10 text-red-400 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]" 
                              : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        )}>
                          Status: {currentCountryDetail.precision > 98 && currentCountryDetail.errors < 2 ? 'Optimal' : currentCountryDetail.errors > 5 ? 'Critical' : 'Warning'}
                        </span>
                      </div>
                      <h2 className={cn("text-2xl font-bold tracking-tight", isDarkMode ? "text-white" : "text-slate-900")}>{currentCountryDetail.name}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={cn(
                          "px-2 py-0.5 rounded text-[10px] font-bold uppercase border",
                          currentCountryDetail.iaLevel === 'Extrême' ? "bg-purple-500/10 text-purple-400 border-purple-500/20 shadow-[0_0_10px_rgba(168,85,247,0.3)]" :
                          "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        )}>
                          IA: {currentCountryDetail.iaLevel}
                        </span>
                        <p className={cn("text-sm flex items-center gap-1.5", isDarkMode ? "text-slate-400" : "text-slate-500")}>
                          <Globe className="w-3 h-3 text-blue-500" /> {currentCountryDetail.region}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setSelectedCountry(null)}
                      className={cn("p-2 rounded-lg transition-colors group", isDarkMode ? "hover:bg-slate-800" : "hover:bg-slate-100")}
                    >
                      <RefreshCcw className={cn("w-4 h-4 text-slate-500 group-hover:text-white transition-colors", isDarkMode ? "" : "text-slate-400 group-hover:text-blue-600")} />
                    </button>
                  </div>

                  <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
                    {/* Core Metrics Grid */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className={cn("p-3 rounded-xl border", isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50 border-slate-200")}>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Daily Volume</p>
                        <div className="flex items-baseline gap-1">
                          <span className={cn("text-lg font-mono font-bold", isDarkMode ? "text-slate-100" : "text-slate-900")}>{Math.round(currentCountryDetail.volume).toLocaleString()}</span>
                          <span className="text-[10px] text-slate-600">v/j</span>
                        </div>
                      </div>
                      <div className={cn("p-3 rounded-xl border", isDarkMode ? "bg-slate-800/40 border-slate-700/50" : "bg-slate-50 border-slate-200")}>
                        <p className="text-[9px] text-slate-500 uppercase font-black tracking-widest mb-1">Daily Revenue</p>
                        <div className="flex items-baseline gap-1">
                          <span className="text-lg font-mono font-bold text-emerald-500">${Math.round(currentCountryDetail.revenue).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Quality Indicators */}
                    <div className={cn("space-y-4 p-4 rounded-xl border", isDarkMode ? "bg-slate-900/60 border-slate-800" : "bg-slate-50/50 border-slate-200")}>
                       <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                         <Activity className="w-3 h-3 text-blue-500" /> Performance IA
                       </h4>
                       <div className="space-y-4">
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[11px]">
                             <span className="text-slate-400">Taux de Lecture</span>
                             <span className="text-emerald-500 font-bold font-mono">{currentCountryDetail.precision.toFixed(2)}%</span>
                           </div>
                           <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-200")}>
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${currentCountryDetail.precision}%` }}
                                className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                             />
                           </div>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[11px]">
                             <span className="text-slate-400">Fluidité (sec/véh)</span>
                             <span className="text-blue-500 font-bold font-mono">{currentCountryDetail.fluidity.toFixed(2)}s</span>
                           </div>
                           <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-200")}>
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${(currentCountryDetail.fluidity / 2) * 100}%` }}
                                className="h-full bg-blue-500"
                             />
                           </div>
                         </div>
                         <div className="space-y-1.5">
                           <div className="flex justify-between items-center text-[11px]">
                             <span className="text-slate-400">Taux d'Erreur</span>
                             <span className={cn("font-bold font-mono", currentCountryDetail.errors > 5 ? 'text-red-500' : 'text-orange-500')}>{currentCountryDetail.errors}%</span>
                           </div>
                           <div className={cn("w-full h-1.5 rounded-full overflow-hidden", isDarkMode ? "bg-slate-800" : "bg-slate-200")}>
                             <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${currentCountryDetail.errors * 5}%` }}
                                className={cn("h-full", currentCountryDetail.errors > 5 ? 'bg-red-500' : 'bg-orange-500')}
                             />
                           </div>
                         </div>
                       </div>
                    </div>

                    {/* Technologies */}
                    <div className="space-y-3">
                      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Technologies Déployées</h4>
                      <div className="flex flex-wrap gap-2">
                        {currentCountryDetail.tech.map(t => (
                          <div key={t} className={cn(
                            "flex items-center gap-2 px-2.5 py-1.5 rounded-lg border transition-colors",
                            isDarkMode ? "bg-slate-800/80 border-slate-700 hover:border-blue-500/30" : "bg-white border-slate-200 hover:border-blue-400"
                          )}>
                             <Cpu className={cn("w-3 h-3", isDarkMode ? "text-blue-400" : "text-blue-600")} />
                             <span className={cn("text-[10px] font-bold uppercase tracking-tighter", isDarkMode ? "text-slate-200" : "text-slate-700")}>{t}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {currentCountryDetail.errors > 5 && (
                      <motion.div 
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-3"
                      >
                        <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-bold text-red-500 uppercase tracking-tight">Anomalie Détectée</p>
                          <p className={cn("text-[10px] mt-1 leading-relaxed", isDarkMode ? "text-red-300/70" : "text-red-600")}>
                            Intervention requise sur les capteurs {currentCountryDetail.tech[0]}. Taux de rejet supérieur aux SLAs.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <div className={cn("mt-8 pt-6 border-t font-mono transition-colors", isDarkMode ? "border-slate-800" : "border-slate-100")}>
                    <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 group uppercase tracking-widest text-xs shadow-lg shadow-blue-500/30">
                      Générer Rapport IA <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <p className="text-[9px] text-center text-slate-500 mt-4 leading-normal italic uppercase font-bold">
                      Dernière mise à jour : 12 mai 2026<br/>Source : Cyclope Global Network
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div 
                  className={cn(
                    "border border-dashed rounded-2xl p-8 h-full flex flex-col items-center justify-center text-center transition-colors",
                    isDarkMode ? "bg-slate-900/30 border-slate-700" : "bg-slate-50 border-slate-300"
                  )}
                  style={{ marginLeft: '0px', marginTop: '270px' }}
                >
                  <div className={cn("w-16 h-16 rounded-full flex items-center justify-center mb-6 transition-colors", isDarkMode ? "bg-slate-800" : "bg-white shadow-sm")}>
                    <Globe className={cn("w-8 h-8", isDarkMode ? "text-slate-600" : "text-slate-300")} />
                  </div>
                  <h3 className={cn("text-lg font-bold mb-2", isDarkMode ? "text-slate-400" : "text-slate-600")}>Sélectionnez un Pays</h3>
                  <p className={cn("text-sm max-w-[200px]", isDarkMode ? "text-slate-500" : "text-slate-400")}>
                    Cliquez sur une bulle de la carte pour afficher l'analyse détaillée et les projections.
                  </p>
                  
                  <div className="mt-12 w-full space-y-4">
                    <div className="flex items-center gap-3 text-xs text-slate-500 uppercase font-bold tracking-widest">
                      <Info className="w-4 h-4 text-blue-500" />
                      Régions Scannées : {new Set(summaries.map(s => s?.region)).size}
                    </div>
                    <div className="flex items-center gap-3 text-xs text-slate-500 uppercase font-bold tracking-widest">
                      <Activity className="w-4 h-4 text-emerald-500" />
                      Précision Moyenne : {globalKpis.precision}%
                    </div>
                  </div>
                </div>
              )}
            </AnimatePresence>
          </aside>
        </div>
      </main>

      <footer className={cn("border-t py-8 px-6 mt-12 transition-colors", isDarkMode ? "border-slate-800 bg-slate-900/30" : "border-slate-200 bg-slate-100/50")}>
        <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] font-black underline decoration-blue-500/50 underline-offset-4">
            <Activity className="w-4 h-4 text-blue-500" /> Global Smart Tolling Dashboard
          </div>
          <div className="flex gap-8 text-[10px] uppercase font-black tracking-[0.2em] text-slate-500">
            <span className="hover:text-blue-500 cursor-pointer transition-all">Documentation</span>
            <span className="hover:text-blue-500 cursor-pointer transition-all">API Status</span>
            <span className="hover:text-blue-500 cursor-pointer transition-all">Support</span>
          </div>
          <p className="text-slate-500 text-[10px] font-mono font-black border-l-2 border-blue-500 pl-4">
            &copy; 2026 CYCLOPE VISION AI.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <DashboardContent />
    </ThemeProvider>
  );
}
