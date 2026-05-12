/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type TollingTechnology = 'ANPR/LPR' | 'RFID/E-TAG' | 'GNSS' | 'DSRC' | 'IA Caméras' | 'ETC' | 'FASTag';

export interface CountryData {
  id: string;
  name: string;
  region: 'Europe' | 'Amérique' | 'Asie' | 'Australie' | 'Singapour' | 'France';
  tech: TollingTechnology[];
  automation: number; // 0-100
  precision: number; // 0-100
  fluidity: number; // 0-100
  volume: number; // vehicles per day
  revenue: number; // daily revenue in USD
  errors: number; // error rate percentage
  coordinates: [number, number]; // [lat, lng] for map
}

export const tollingData: CountryData[] = [
  {
    id: 'france',
    name: 'France',
    region: 'France',
    tech: ['ANPR/LPR', 'RFID/E-TAG'],
    automation: 70,
    precision: 95,
    fluidity: 85,
    volume: 1200000,
    revenue: 4500000,
    errors: 5,
    coordinates: [46.2276, 2.2137]
  },
  {
    id: 'germany',
    name: 'Allemagne',
    region: 'Europe',
    tech: ['GNSS'],
    automation: 90,
    precision: 98,
    fluidity: 92,
    volume: 3000000,
    revenue: 12000000,
    errors: 2,
    coordinates: [51.1657, 10.4515]
  },
  {
    id: 'usa',
    name: 'États-Unis',
    region: 'Amérique',
    tech: ['RFID/E-TAG', 'ANPR/LPR'],
    automation: 90,
    precision: 99,
    fluidity: 88,
    volume: 3500000,
    revenue: 15000000,
    errors: 1,
    coordinates: [37.0902, -95.7129]
  },
  {
    id: 'china',
    name: 'Chine',
    region: 'Asie',
    tech: ['ETC', 'ANPR/LPR'],
    automation: 85,
    precision: 92,
    fluidity: 85,
    volume: 5000000,
    revenue: 20000000,
    errors: 8,
    coordinates: [35.8617, 104.1954]
  },
  {
    id: 'india',
    name: 'Inde',
    region: 'Asie',
    tech: ['FASTag', 'RFID/E-TAG'],
    automation: 80,
    precision: 90,
    fluidity: 80,
    volume: 4000000,
    revenue: 8000000,
    errors: 10,
    coordinates: [20.5937, 78.9629]
  },
  {
    id: 'australia',
    name: 'Australie',
    region: 'Australie',
    tech: ['RFID/E-TAG', 'ANPR/LPR'],
    automation: 100,
    precision: 99,
    fluidity: 95,
    volume: 1500000,
    revenue: 6000000,
    errors: 0.5,
    coordinates: [-25.2744, 133.7751]
  },
  {
    id: 'singapore',
    name: 'Singapour',
    region: 'Singapour',
    tech: ['GNSS'],
    automation: 100,
    precision: 99.5,
    fluidity: 98,
    volume: 800000,
    revenue: 3500000,
    errors: 0.2,
    coordinates: [1.3521, 103.8198]
  },
  {
    id: 'poland',
    name: 'Pologne',
    region: 'Europe',
    tech: ['GNSS', 'DSRC'],
    automation: 60,
    precision: 95,
    fluidity: 82,
    volume: 1000000,
    revenue: 3000000,
    errors: 4,
    coordinates: [51.9194, 19.1451]
  },
  {
    id: 'japan',
    name: 'Japon',
    region: 'Asie',
    tech: ['ETC', 'DSRC'],
    automation: 95,
    precision: 99.5,
    fluidity: 94,
    volume: 2500000,
    revenue: 10000000,
    errors: 0.5,
    coordinates: [36.2048, 138.2529]
  }
];

export interface TimelinePoint {
  date: string;
  volume: number;
  revenue: number;
}

export const generateTimeline = (baseVolume: number, baseRevenue: number): TimelinePoint[] => {
  const points: TimelinePoint[] = [];
  const startDate = new Date(2023, 0, 1);
  for (let i = 0; i < 40; i++) {
    const date = new Date(startDate);
    date.setMonth(startDate.getMonth() + i);
    const growth = 1 + (i * 0.02) + (Math.random() * 0.05 - 0.025);
    points.push({
      date: date.toISOString().substring(0, 7),
      volume: Math.floor(baseVolume * growth),
      revenue: Math.floor(baseRevenue * growth)
    });
  }
  return points;
};
