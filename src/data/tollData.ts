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
    id: 'germany',
    name: 'Allemagne',
    region: 'Europe',
    tech: ['GNSS'],
    automation: 95,
    precision: 97.5,
    fluidity: 90,
    volume: 2900000,
    revenue: 12300000,
    errors: 2.5,
    coordinates: [51.1657, 10.4515]
  },
  {
    id: 'poland',
    name: 'Pologne',
    region: 'Europe',
    tech: ['GNSS'],
    automation: 85,
    precision: 96,
    fluidity: 82,
    volume: 1200000,
    revenue: 4800000,
    errors: 4,
    coordinates: [51.9194, 19.1451]
  },
  {
    id: 'spain',
    name: 'Espagne',
    region: 'Europe',
    tech: ['RFID/E-TAG', 'ANPR/LPR'],
    automation: 88,
    precision: 96.5,
    fluidity: 88,
    volume: 1800000,
    revenue: 18000000,
    errors: 3.5,
    coordinates: [40.4168, -3.7038]
  },
  {
    id: 'france',
    name: 'France',
    region: 'France',
    tech: ['ANPR/LPR'],
    automation: 75,
    precision: 95.5,
    fluidity: 85,
    volume: 1100000,
    revenue: 32600000,
    errors: 4.5,
    coordinates: [46.2276, 2.2137]
  },
  {
    id: 'india',
    name: 'Inde',
    region: 'Asie',
    tech: ['RFID/E-TAG'],
    automation: 99.97,
    precision: 99.97,
    fluidity: 92,
    volume: 1560000,
    revenue: 2470000,
    errors: 0.03,
    coordinates: [20.5937, 78.9629]
  },
  {
    id: 'singapore',
    name: 'Singapour',
    region: 'Singapour',
    tech: ['GNSS'],
    automation: 100,
    precision: 99,
    fluidity: 98,
    volume: 450000,
    revenue: 8000000,
    errors: 1,
    coordinates: [1.3521, 103.8198]
  },
  {
    id: 'usa',
    name: 'USA',
    region: 'Amérique',
    tech: ['RFID/E-TAG', 'ANPR/LPR'],
    automation: 92,
    precision: 97,
    fluidity: 92,
    volume: 2800000,
    revenue: 13800000,
    errors: 3,
    coordinates: [37.0902, -95.7129]
  },
  {
    id: 'australia',
    name: 'Australie',
    region: 'Australie',
    tech: ['RFID/E-TAG'],
    automation: 100,
    precision: 98,
    fluidity: 95,
    volume: 950000,
    revenue: 11900000,
    errors: 2,
    coordinates: [-25.2744, 133.7751]
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
