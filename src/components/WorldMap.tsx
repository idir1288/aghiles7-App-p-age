/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useMemo, useState, useRef, useCallback } from 'react';
import { CountryData } from '../data/tollData';
import { motion, AnimatePresence } from 'motion/react';
import { ZoomIn, ZoomOut, Maximize, MousePointer2 } from 'lucide-react';

interface WorldMapProps {
  data: CountryData[];
  onSelectCountry: (country: CountryData) => void;
  selectedCountryId?: string;
}

export const WorldMap: React.FC<WorldMapProps> = ({ data, onSelectCountry, selectedCountryId }) => {
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
        // Center the bubble in the 800x400 view
        // targetPos = center - (bubblePos * scale)
        const targetScale = 2;
        setScale(targetScale);
        setPosition({
          x: (400 - x * targetScale),
          y: (200 - y * targetScale)
        });
      }
    }
  }, [selectedCountryId, data]);

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

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * delta, 0.5), 5));
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return; // Only left click
    setIsDragging(true);
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    e.currentTarget.releasePointerCapture(e.pointerId);
  };

  const resetView = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div 
      className="relative w-full h-[400px] bg-slate-900/50 rounded-xl border border-slate-700 overflow-hidden group select-none touch-none"
      ref={containerRef}
      onWheel={handleWheel}
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
      <div className="absolute top-4 left-4 z-10 pointer-events-none">
        <h3 className="text-slate-200 font-medium text-sm uppercase tracking-wider">Carte Mondiale des Flux</h3>
        <p className="text-slate-400 text-xs mt-1">Taille = Volume | Couleur = Automatisation</p>
      </div>

      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2">
        <button 
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.min(prev * 1.2, 5)); }}
          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 text-slate-300 transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); setScale(prev => Math.max(prev / 1.2, 0.5)); }}
          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 text-slate-300 transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); resetView(); }}
          className="p-1.5 bg-slate-800/80 hover:bg-slate-700 rounded-md border border-slate-700 text-slate-300 transition-colors"
        >
          <Maximize className="w-4 h-4" />
        </button>
      </div>

      <div className="absolute bottom-4 left-4 z-10 flex items-center gap-2 text-[10px] text-slate-500 font-mono">
        <MousePointer2 className="w-3 h-3" /> SCROLL POUR ZOOMER | GLISSER POUR NAVIGUER
      </div>
      
      <svg 
        viewBox="0 0 800 400" 
        style={{ width: '893px' }}
        className="h-full"
      >
        <g style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`, transformOrigin: 'center', transition: isDragging ? 'none' : 'transform 0.1s ease-out' }}>
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
              onClick={(e) => {
                e.stopPropagation();
                if (!isDragging) onSelectCountry(b);
              }}
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
