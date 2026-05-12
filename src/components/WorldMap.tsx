/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { CountryData } from '../data/tollData';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize, MousePointer2, RefreshCcw } from 'lucide-react';
import { cn } from '../lib/utils';

interface WorldMapProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData) => void;
  selectedCountryId?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ data, onSelectCountry, selectedCountryId }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-focus on selection
  React.useEffect(() => {
    if (selectedCountryId) {
      const country = data.find(c => c.id === selectedCountryId);
      if (country) {
        const { x, y } = getXY(country.coordinates[0], country.coordinates[1]);
        const targetScale = 2.5;
        setScale(targetScale);
        setPosition({
          x: (400 - x * targetScale),
          y: (200 - y * targetScale)
        });
      }
    }
  }, [selectedCountryId, data]);

  // Fix wheel zoom with non-passive listener
  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.85 : 1.15;
      setScale(prev => Math.min(Math.max(prev * delta, 0.5), 8));
    };

    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, []);

  // Projection helpers (approximate)
  const getXY = (lat: number, lng: number) => {
    const x = ((lng + 180) * 800) / 360;
    const y = ((90 - lat) * 400) / 180;
    return { x, y };
  };

  const bubbles = useMemo(() => {
    const maxVolume = Math.max(...data.map(d => d.volume));
    return data.map(country => {
      const { x, y } = getXY(country.coordinates[0], country.coordinates[1]);
      const radius = 5 + (country.volume / maxVolume) * 25;
      
      let color = '#22c55e'; // green
      if (country.automation < 80) color = '#f59e0b'; // orange
      if (country.automation < 65) color = '#ef4444'; // red

      return {
        ...country,
        x,
        y,
        radius,
        color
      };
    });
  }, [data]);

  const [lastPointerPos, setLastPointerPos] = useState({ x: 0, y: 0 });
  const [hasMoved, setHasMoved] = useState(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    setIsDragging(true);
    setHasMoved(false);
    setLastPointerPos({ x: e.clientX, y: e.clientY });
    if (containerRef.current) {
      containerRef.current.setPointerCapture(e.pointerId);
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    
    const dx = e.clientX - lastPointerPos.x;
    const dy = e.clientY - lastPointerPos.y;
    
    if (Math.abs(dx) > 2 || Math.abs(dy) > 2) {
      setHasMoved(true);
    }

    setPosition(prev => ({
      x: prev.x + dx,
      y: prev.y + dy
    }));
    setLastPointerPos({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    if (containerRef.current) {
      containerRef.current.releasePointerCapture(e.pointerId);
    }
  };

  const onBubbleClick = (e: React.MouseEvent, country: CountryData) => {
    e.stopPropagation();
    if (!hasMoved) {
      onSelectCountry(country);
    }
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className={cn(
        "relative bg-[#0f172a] rounded-xl border border-slate-700 overflow-hidden group select-none touch-none transition-all duration-300",
        isExpanded ? "fixed inset-4 z-[100] shadow-2xl" : "w-full h-[400px]"
      )}
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* SVG Filters */}
      <svg className="absolute w-0 h-0">
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>

      {/* Overlay UI */}
      <div className="absolute top-4 left-4 z-10 pointer-events-none group-hover:opacity-100 transition-opacity">
        <h3 className="text-slate-200 font-bold text-sm uppercase tracking-[0.2em]">Map Explorer</h3>
        <p className="text-blue-500 text-[10px] font-black mt-1">SENSORS STATUS: ACTIVE</p>
      </div>

      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        <button 
          onPointerDown={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev * 1.3, 8)); }}
          className="p-2 bg-slate-800/90 hover:bg-blue-600 rounded-lg border border-slate-700 text-slate-300 transition-all hover:scale-110 active:scale-95"
        >
          <ZoomIn className="w-5 h-5" />
        </button>
        <button 
          onPointerDown={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev / 1.3, 0.4)); }}
          className="p-2 bg-slate-800/90 hover:bg-blue-600 rounded-lg border border-slate-700 text-slate-300 transition-all hover:scale-110 active:scale-95"
        >
          <ZoomOut className="w-5 h-5" />
        </button>
        <button 
          onPointerDown={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
          className={cn(
            "p-2 rounded-lg border transition-all hover:scale-110 active:scale-95",
            isExpanded ? "bg-red-600 text-white border-red-500" : "bg-slate-800/90 text-slate-300 border-slate-700 hover:bg-blue-600"
          )}
        >
          <Maximize className="w-5 h-5" />
        </button>
        <button 
          onPointerDown={e => e.stopPropagation()}
          onClick={(e) => { e.stopPropagation(); resetView(); }}
          className="p-2 bg-slate-800/90 hover:bg-slate-700 rounded-lg border border-slate-700 text-slate-400 transition-all"
          title="Reset View"
        >
          <RefreshCcw className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-3 text-[9px] text-slate-500 font-black uppercase tracking-widest bg-slate-900/40 p-2 rounded-md backdrop-blur-sm border border-slate-800">
        <div className="flex items-center gap-1.5"><MousePointer2 className="w-3 h-3 text-blue-500" /> Pan & Zoom Active</div>
        <div className="w-px h-3 bg-slate-800" />
        <div>Scale: {scale.toFixed(1)}x</div>
      </div>
      
      <svg 
        viewBox="0 0 800 400" 
        style={{ width: isExpanded ? '100%' : '893px' }}
        className="h-full w-full"
      >
        <g style={{ 
          transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, 
          transformOrigin: '0 0',
          transition: isDragging ? 'none' : 'transform 0.3s cubic-bezier(0.2, 0, 0, 1)' 
        }}>
          {/* Simple World Outline (Abstract) */}
          <path
            d="M150,100 Q200,80 250,110 T350,100 T500,120 T700,90 T750,200 T600,350 T400,380 T200,350 T100,250 Z"
            fill="none"
            stroke="#334155"
            strokeWidth={1 / scale}
            strokeDasharray={`${4 / scale} ${4 / scale}`}
            className="opacity-30"
          />
          
          {bubbles.map((b) => (
            <motion.g
              key={b.id}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileHover={{ scale: 1.1 }}
              onClick={(e) => onBubbleClick(e, b)}
              className="cursor-pointer"
            >
              <circle
                cx={b.x}
                cy={b.y}
                r={b.radius}
                fill={b.color}
                fillOpacity={0.6}
                stroke={b.color}
                strokeWidth={selectedCountryId === b.id ? 4 / scale : 1 / scale}
                filter={selectedCountryId === b.id ? "url(#glow)" : "none"}
                className="transition-all duration-300"
              />
              
              <AnimatePresence>
                {selectedCountryId === b.id && (
                  <motion.g>
                    <motion.circle
                      cx={b.x}
                      cy={b.y}
                      r={b.radius + 15}
                      fill="none"
                      stroke={b.color}
                      strokeWidth={1 / scale}
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1.5, opacity: 0.4 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 2,
                        ease: "linear"
                      }}
                    />
                    <motion.circle
                      cx={b.x}
                      cy={b.y}
                      r={b.radius + 10}
                      fill="none"
                      stroke={b.color}
                      strokeWidth={2 / scale}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      transition={{ 
                        repeat: Infinity, 
                        duration: 1.5,
                        ease: "easeOut"
                      }}
                    />
                  </motion.g>
                )}
              </AnimatePresence>

              <text
                x={b.x}
                y={b.y - b.radius - 10 / scale}
                textAnchor="middle"
                style={{ fontSize: `${selectedCountryId === b.id ? 14 / scale : 10 / scale}px` }}
                className={`font-mono pointer-events-none transition-all ${selectedCountryId === b.id ? 'fill-white font-black drop-shadow-lg' : 'fill-slate-400 group-hover:fill-slate-200'}`}
              >
                {b.name}
              </text>
            </motion.g>
          ))}
        </g>
      </svg>
    </div>
  );
};
