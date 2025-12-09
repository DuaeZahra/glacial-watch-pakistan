export interface Infrastructure {
  id: string;
  type: 'village' | 'road' | 'bridge' | 'power' | 'hospital' | 'school';
  name: string;
  coordinates: [number, number, number]; // [x, z, elevation]
  population?: number;
  criticality: 'high' | 'medium' | 'low';
  floodArrivalTime?: string;
  maxFloodDepth?: number;
}

export interface RoadSegment {
  id: string;
  name: string;
  points: [number, number, number][]; // array of [x, z, elevation]
  criticality: 'high' | 'medium' | 'low';
  type: 'highway' | 'main' | 'local';
}

// Villages and settlements in Hunza Valley downstream from Shishper Lake
export const infrastructureData: Infrastructure[] = [
  {
    id: 'hassanabad',
    type: 'village',
    name: 'Hassanabad',
    coordinates: [2, -1.5, 2850],
    population: 2500,
    criticality: 'high',
    floodArrivalTime: '45 min',
    maxFloodDepth: 4.2,
  },
  {
    id: 'aliabad',
    type: 'village',
    name: 'Aliabad',
    coordinates: [4, -1.8, 2680],
    population: 6000,
    criticality: 'high',
    floodArrivalTime: '1h 40m',
    maxFloodDepth: 3.5,
  },
  {
    id: 'karimabad',
    type: 'village',
    name: 'Karimabad',
    coordinates: [7, -2.2, 2450],
    population: 8500,
    criticality: 'high',
    floodArrivalTime: '4h 20m',
    maxFloodDepth: 2.1,
  },
  {
    id: 'ganish',
    type: 'village',
    name: 'Ganish',
    coordinates: [8, -2.5, 2380],
    population: 5000,
    criticality: 'medium',
    floodArrivalTime: '5h 10m',
    maxFloodDepth: 1.8,
  },
  {
    id: 'hospital-hunza',
    type: 'hospital',
    name: 'District Hospital Hunza',
    coordinates: [4.5, -1.9, 2650],
    criticality: 'high',
    floodArrivalTime: '2h 10m',
    maxFloodDepth: 3.2,
  },
  {
    id: 'school-aliabad',
    type: 'school',
    name: 'Aliabad High School',
    coordinates: [3.8, -1.7, 2700],
    population: 800,
    criticality: 'high',
    floodArrivalTime: '1h 50m',
    maxFloodDepth: 3.4,
  },
  {
    id: 'bridge-hunza',
    type: 'bridge',
    name: 'Hunza River Bridge',
    coordinates: [3, -1.6, 2720],
    criticality: 'high',
    floodArrivalTime: '1h 15m',
    maxFloodDepth: 3.8,
  },
  {
    id: 'power-station',
    type: 'power',
    name: 'Hunza Hydropower',
    coordinates: [5, -2.0, 2580],
    criticality: 'medium',
    floodArrivalTime: '2h 45m',
    maxFloodDepth: 2.8,
  },
];

// Road network in the valley
export const roadNetwork: RoadSegment[] = [
  {
    id: 'kkh-main',
    name: 'Karakoram Highway (Main)',
    points: [
      [0, -1.2, 2900],
      [2, -1.5, 2850],
      [4, -1.8, 2680],
      [7, -2.2, 2450],
      [9, -2.6, 2350],
    ],
    criticality: 'high',
    type: 'highway',
  },
  {
    id: 'local-hassanabad',
    name: 'Hassanabad Access Road',
    points: [
      [1.5, -1.4, 2880],
      [2, -1.5, 2850],
      [2.5, -1.6, 2820],
    ],
    criticality: 'medium',
    type: 'local',
  },
  {
    id: 'local-aliabad',
    name: 'Aliabad Link Road',
    points: [
      [3.5, -1.7, 2720],
      [4, -1.8, 2680],
      [4.5, -1.9, 2650],
    ],
    criticality: 'medium',
    type: 'local',
  },
];

// Inundation zones at different time steps
export interface InundationZone {
  timeStep: string; // e.g., "1 hour"
  depth: number;
  area: number;
  boundaries: [number, number][]; // 2D polygon points
  affectedInfrastructure: string[];
}

export const inundationZones: InundationZone[] = [
  {
    timeStep: '1 hour',
    depth: 4.2,
    area: 12.5,
    boundaries: [
      [0, -0.5], [1, -1], [3, -1.5], [3, -2], [2, -2], [0, -1.5], [0, -0.5]
    ],
    affectedInfrastructure: ['hassanabad', 'local-hassanabad'],
  },
  {
    timeStep: '2 hours',
    depth: 3.1,
    area: 28.3,
    boundaries: [
      [0, -0.5], [1, -1], [5, -2], [5, -2.5], [3, -2.5], [0, -1.5], [0, -0.5]
    ],
    affectedInfrastructure: ['hassanabad', 'aliabad', 'bridge-hunza', 'school-aliabad', 'hospital-hunza', 'kkh-main', 'local-hassanabad', 'local-aliabad'],
  },
  {
    timeStep: '5 hours',
    depth: 1.8,
    area: 65.8,
    boundaries: [
      [0, -0.5], [1, -1], [9, -2.8], [9, -3.5], [5, -3], [0, -2], [0, -0.5]
    ],
    affectedInfrastructure: ['hassanabad', 'aliabad', 'karimabad', 'ganish', 'bridge-hunza', 'school-aliabad', 'hospital-hunza', 'power-station', 'kkh-main', 'local-hassanabad', 'local-aliabad'],
  },
];
