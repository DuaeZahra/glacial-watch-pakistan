export interface GlacialLake {
  id: string;
  name: string;
  region: string;
  coordinates: [number, number]; // [lng, lat]
  surfaceArea: number; // sq km
  volume: number; // million m³
  breachProbability: number; // 0-100
  riskLevel: 'low' | 'moderate' | 'high' | 'critical';
  elevation: number; // meters
  lastUpdated: string;
  expansionData: { month: string; area: number }[];
  downstreamPopulation: number;
  nearestSettlement: string;
}

export const glacialLakes: GlacialLake[] = [
  {
    id: 'shishper',
    name: 'Shishper Glacier Lake',
    region: 'Hunza Valley, Gilgit-Baltistan',
    coordinates: [74.5561, 36.4033],
    surfaceArea: 0.45,
    volume: 12.8,
    breachProbability: 78,
    riskLevel: 'critical',
    elevation: 2850,
    lastUpdated: '2024-12-08',
    expansionData: [
      { month: 'Jan', area: 0.28 },
      { month: 'Feb', area: 0.29 },
      { month: 'Mar', area: 0.31 },
      { month: 'Apr', area: 0.34 },
      { month: 'May', area: 0.38 },
      { month: 'Jun', area: 0.42 },
      { month: 'Jul', area: 0.44 },
      { month: 'Aug', area: 0.45 },
      { month: 'Sep', area: 0.44 },
      { month: 'Oct', area: 0.43 },
      { month: 'Nov', area: 0.42 },
      { month: 'Dec', area: 0.45 },
    ],
    downstreamPopulation: 35000,
    nearestSettlement: 'Hassanabad',
  },
  {
    id: 'passu',
    name: 'Passu Glacier Lake',
    region: 'Upper Hunza, Gilgit-Baltistan',
    coordinates: [74.8729, 36.4831],
    surfaceArea: 0.32,
    volume: 8.5,
    breachProbability: 62,
    riskLevel: 'high',
    elevation: 2720,
    lastUpdated: '2024-12-07',
    expansionData: [
      { month: 'Jan', area: 0.22 },
      { month: 'Feb', area: 0.23 },
      { month: 'Mar', area: 0.24 },
      { month: 'Apr', area: 0.26 },
      { month: 'May', area: 0.28 },
      { month: 'Jun', area: 0.30 },
      { month: 'Jul', area: 0.31 },
      { month: 'Aug', area: 0.32 },
      { month: 'Sep', area: 0.31 },
      { month: 'Oct', area: 0.30 },
      { month: 'Nov', area: 0.29 },
      { month: 'Dec', area: 0.32 },
    ],
    downstreamPopulation: 28000,
    nearestSettlement: 'Passu Village',
  },
  {
    id: 'hoper',
    name: 'Hoper Glacier Lake',
    region: 'Nagar Valley, Gilgit-Baltistan',
    coordinates: [74.7891, 36.2156],
    surfaceArea: 0.28,
    volume: 6.2,
    breachProbability: 45,
    riskLevel: 'moderate',
    elevation: 2980,
    lastUpdated: '2024-12-06',
    expansionData: [
      { month: 'Jan', area: 0.20 },
      { month: 'Feb', area: 0.20 },
      { month: 'Mar', area: 0.21 },
      { month: 'Apr', area: 0.23 },
      { month: 'May', area: 0.25 },
      { month: 'Jun', area: 0.27 },
      { month: 'Jul', area: 0.28 },
      { month: 'Aug', area: 0.28 },
      { month: 'Sep', area: 0.27 },
      { month: 'Oct', area: 0.26 },
      { month: 'Nov', area: 0.25 },
      { month: 'Dec', area: 0.28 },
    ],
    downstreamPopulation: 15000,
    nearestSettlement: 'Hoper Village',
  },
  {
    id: 'chitral',
    name: 'Chitral Gol Lake',
    region: 'Chitral, Khyber Pakhtunkhwa',
    coordinates: [71.8310, 35.8520],
    surfaceArea: 0.18,
    volume: 4.1,
    breachProbability: 35,
    riskLevel: 'moderate',
    elevation: 3200,
    lastUpdated: '2024-12-05',
    expansionData: [
      { month: 'Jan', area: 0.14 },
      { month: 'Feb', area: 0.14 },
      { month: 'Mar', area: 0.15 },
      { month: 'Apr', area: 0.16 },
      { month: 'May', area: 0.17 },
      { month: 'Jun', area: 0.18 },
      { month: 'Jul', area: 0.18 },
      { month: 'Aug', area: 0.18 },
      { month: 'Sep', area: 0.17 },
      { month: 'Oct', area: 0.16 },
      { month: 'Nov', area: 0.15 },
      { month: 'Dec', area: 0.18 },
    ],
    downstreamPopulation: 22000,
    nearestSettlement: 'Chitral Town',
  },
  {
    id: 'skardu',
    name: 'Skardu Basin Lake',
    region: 'Skardu, Gilgit-Baltistan',
    coordinates: [75.6328, 35.2973],
    surfaceArea: 0.52,
    volume: 15.3,
    breachProbability: 55,
    riskLevel: 'high',
    elevation: 2438,
    lastUpdated: '2024-12-08',
    expansionData: [
      { month: 'Jan', area: 0.38 },
      { month: 'Feb', area: 0.39 },
      { month: 'Mar', area: 0.41 },
      { month: 'Apr', area: 0.44 },
      { month: 'May', area: 0.48 },
      { month: 'Jun', area: 0.50 },
      { month: 'Jul', area: 0.52 },
      { month: 'Aug', area: 0.52 },
      { month: 'Sep', area: 0.50 },
      { month: 'Oct', area: 0.48 },
      { month: 'Nov', area: 0.45 },
      { month: 'Dec', area: 0.52 },
    ],
    downstreamPopulation: 45000,
    nearestSettlement: 'Skardu City',
  },
  {
    id: 'batura',
    name: 'Batura Glacier Lake',
    region: 'Gojal, Gilgit-Baltistan',
    coordinates: [74.3892, 36.5289],
    surfaceArea: 0.38,
    volume: 9.8,
    breachProbability: 25,
    riskLevel: 'low',
    elevation: 3100,
    lastUpdated: '2024-12-04',
    expansionData: [
      { month: 'Jan', area: 0.32 },
      { month: 'Feb', area: 0.32 },
      { month: 'Mar', area: 0.33 },
      { month: 'Apr', area: 0.34 },
      { month: 'May', area: 0.36 },
      { month: 'Jun', area: 0.37 },
      { month: 'Jul', area: 0.38 },
      { month: 'Aug', area: 0.38 },
      { month: 'Sep', area: 0.37 },
      { month: 'Oct', area: 0.36 },
      { month: 'Nov', area: 0.35 },
      { month: 'Dec', area: 0.38 },
    ],
    downstreamPopulation: 12000,
    nearestSettlement: 'Gulmit',
  },
  {
    id: 'baltoro',
    name: 'Baltoro Glacier Lake',
    region: 'Shigar, Gilgit-Baltistan',
    coordinates: [76.3156, 35.7389],
    surfaceArea: 0.65,
    volume: 18.5,
    breachProbability: 42,
    riskLevel: 'moderate',
    elevation: 3650,
    lastUpdated: '2024-12-03',
    expansionData: [
      { month: 'Jan', area: 0.52 },
      { month: 'Feb', area: 0.53 },
      { month: 'Mar', area: 0.55 },
      { month: 'Apr', area: 0.58 },
      { month: 'May', area: 0.61 },
      { month: 'Jun', area: 0.63 },
      { month: 'Jul', area: 0.65 },
      { month: 'Aug', area: 0.65 },
      { month: 'Sep', area: 0.63 },
      { month: 'Oct', area: 0.60 },
      { month: 'Nov', area: 0.57 },
      { month: 'Dec', area: 0.65 },
    ],
    downstreamPopulation: 8000,
    nearestSettlement: 'Askole',
  },
];

export interface Alert {
  id: string;
  lakeId: string;
  lakeName: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
}

export const recentAlerts: Alert[] = [
  {
    id: 'alert-1',
    lakeId: 'shishper',
    lakeName: 'Shishper Glacier Lake',
    type: 'critical',
    title: 'Critical Breach Risk',
    message: 'Lake level has risen 15cm in 24 hours. Breach probability now at 78%. Immediate action required.',
    timestamp: '2024-12-08T14:30:00Z',
    isRead: false,
  },
  {
    id: 'alert-2',
    lakeId: 'passu',
    lakeName: 'Passu Glacier Lake',
    type: 'warning',
    title: 'Rapid Expansion Detected',
    message: 'Surface area increased by 8% in the past week due to accelerated glacier melt.',
    timestamp: '2024-12-08T10:15:00Z',
    isRead: false,
  },
  {
    id: 'alert-3',
    lakeId: 'skardu',
    lakeName: 'Skardu Basin Lake',
    type: 'warning',
    title: 'Weather Warning',
    message: 'Heavy rainfall forecast for next 48 hours. Monitor water levels closely.',
    timestamp: '2024-12-07T18:45:00Z',
    isRead: true,
  },
  {
    id: 'alert-4',
    lakeId: 'hoper',
    lakeName: 'Hoper Glacier Lake',
    type: 'info',
    title: 'Satellite Update',
    message: 'New Sentinel-2 imagery processed. Lake boundaries updated in database.',
    timestamp: '2024-12-07T09:00:00Z',
    isRead: true,
  },
  {
    id: 'alert-5',
    lakeId: 'shishper',
    lakeName: 'Shishper Glacier Lake',
    type: 'critical',
    title: 'Moraine Instability',
    message: 'Seismic sensors detect micro-tremors near the natural dam. Ground survey recommended.',
    timestamp: '2024-12-06T22:30:00Z',
    isRead: true,
  },
];

// Flow path data for DEM-based routing
export interface FlowPathSegment {
  start: [number, number, number]; // [x, y, elevation]
  end: [number, number, number];
  velocity: number; // m/s
  volume: number; // m³/s
}

// Breach model parameters
export interface BreachModel {
  breachWidth: number; // meters
  breachDepth: number; // meters
  breachTime: number; // minutes to full breach
  peakDischarge: number; // m³/s
  breachFormation: string;
}

// Enhanced simulation scenario with DEM routing
export interface FloodScenario {
  time: string;
  timeMinutes: number;
  affectedArea: number; // km²
  floodDepth: number; // max depth in meters
  affectedSettlements: string[];
  affectedPopulation: number;
  affectedInfrastructure: {
    villages: number;
    roads: number;
    bridges: number;
    hospitals: number;
    schools: number;
  };
  flowPath: FlowPathSegment[];
  inundationZone: {
    boundaries: [number, number][];
    depth: number;
  };
  breachProgress: number; // 0-100%
}

export const floodSimulationData = {
  lakeId: 'shishper',
  lakeName: 'Shishper Glacier Lake',
  breachModel: {
    breachWidth: 45,
    breachDepth: 25,
    breachTime: 30,
    peakDischarge: 8500,
    breachFormation: 'Progressive overtopping and erosion of moraine dam',
  } as BreachModel,
  totalVolume: 12.8, // million m³
  valleySlope: 0.035, // 3.5% average slope
  scenarios: [
    {
      time: 'T+0m (Breach initiation)',
      timeMinutes: 0,
      affectedArea: 0.5,
      floodDepth: 2.8,
      affectedSettlements: [],
      affectedPopulation: 0,
      affectedInfrastructure: {
        villages: 0,
        roads: 0,
        bridges: 0,
        hospitals: 0,
        schools: 0,
      },
      flowPath: [
        { start: [0, 0.5, 2850], end: [1, -0.5, 2820], velocity: 8.5, volume: 1200 },
      ],
      inundationZone: {
        boundaries: [[0, 0], [0.5, -0.3], [0.5, -0.8], [0, -0.5]],
        depth: 2.8,
      },
      breachProgress: 15,
    },
    {
      time: 'T+15m (Partial breach)',
      timeMinutes: 15,
      affectedArea: 3.2,
      floodDepth: 3.5,
      affectedSettlements: [],
      affectedPopulation: 0,
      affectedInfrastructure: {
        villages: 0,
        roads: 1,
        bridges: 0,
        hospitals: 0,
        schools: 0,
      },
      flowPath: [
        { start: [0, 0.5, 2850], end: [1, -0.5, 2820], velocity: 12.2, volume: 3500 },
        { start: [1, -0.5, 2820], end: [2, -1.2, 2780], velocity: 14.5, volume: 3500 },
      ],
      inundationZone: {
        boundaries: [[0, 0], [1.5, -0.8], [1.5, -1.5], [0, -0.8]],
        depth: 3.5,
      },
      breachProgress: 45,
    },
    {
      time: 'T+45m (Full breach)',
      timeMinutes: 45,
      affectedArea: 12.5,
      floodDepth: 4.2,
      affectedSettlements: ['Hassanabad'],
      affectedPopulation: 2500,
      affectedInfrastructure: {
        villages: 1,
        roads: 2,
        bridges: 0,
        hospitals: 0,
        schools: 0,
      },
      flowPath: [
        { start: [0, 0.5, 2850], end: [1, -0.5, 2820], velocity: 18.5, volume: 8500 },
        { start: [1, -0.5, 2820], end: [2, -1.2, 2780], velocity: 19.2, volume: 8500 },
        { start: [2, -1.2, 2780], end: [3, -1.5, 2730], velocity: 16.8, volume: 8000 },
      ],
      inundationZone: {
        boundaries: [[0, 0], [3, -1], [3, -2], [1, -1.8], [0, -1]],
        depth: 4.2,
      },
      breachProgress: 100,
    },
    {
      time: 'T+2h (Peak flow)',
      timeMinutes: 120,
      affectedArea: 28.3,
      floodDepth: 3.8,
      affectedSettlements: ['Hassanabad', 'Aliabad'],
      affectedPopulation: 8500,
      affectedInfrastructure: {
        villages: 2,
        roads: 3,
        bridges: 1,
        hospitals: 1,
        schools: 1,
      },
      flowPath: [
        { start: [0, 0.5, 2850], end: [1, -0.5, 2820], velocity: 15.2, volume: 6500 },
        { start: [1, -0.5, 2820], end: [2, -1.2, 2780], velocity: 16.8, volume: 6500 },
        { start: [2, -1.2, 2780], end: [3, -1.5, 2730], velocity: 14.5, volume: 6200 },
        { start: [3, -1.5, 2730], end: [5, -2.0, 2640], velocity: 12.8, volume: 5800 },
      ],
      inundationZone: {
        boundaries: [[0, 0], [5, -1.5], [5, -2.5], [2, -2.5], [0, -1.5]],
        depth: 3.8,
      },
      breachProgress: 100,
    },
    {
      time: 'T+5h (Extended flow)',
      timeMinutes: 300,
      affectedArea: 65.8,
      floodDepth: 2.4,
      affectedSettlements: ['Hassanabad', 'Aliabad', 'Karimabad', 'Ganish'],
      affectedPopulation: 22000,
      affectedInfrastructure: {
        villages: 4,
        roads: 5,
        bridges: 1,
        hospitals: 1,
        schools: 1,
      },
      flowPath: [
        { start: [0, 0.5, 2850], end: [2, -1.2, 2780], velocity: 8.5, volume: 3200 },
        { start: [2, -1.2, 2780], end: [4, -1.8, 2680], velocity: 9.2, volume: 3100 },
        { start: [4, -1.8, 2680], end: [6, -2.2, 2520], velocity: 8.8, volume: 2900 },
        { start: [6, -2.2, 2520], end: [8, -2.6, 2420], velocity: 7.5, volume: 2700 },
      ],
      inundationZone: {
        boundaries: [[0, 0], [8.5, -2], [8.5, -3.2], [4, -3], [0, -2]],
        depth: 2.4,
      },
      breachProgress: 100,
    },
    {
      time: 'T+8h (Recession)',
      timeMinutes: 480,
      affectedArea: 45.2,
      floodDepth: 1.5,
      affectedSettlements: ['Hassanabad', 'Aliabad', 'Karimabad'],
      affectedPopulation: 17000,
      affectedInfrastructure: {
        villages: 3,
        roads: 4,
        bridges: 1,
        hospitals: 1,
        schools: 1,
      },
      flowPath: [
        { start: [2, -1.2, 2780], end: [4, -1.8, 2680], velocity: 5.2, volume: 1500 },
        { start: [4, -1.8, 2680], end: [6, -2.2, 2520], velocity: 5.8, volume: 1400 },
        { start: [6, -2.2, 2520], end: [8, -2.6, 2420], velocity: 4.5, volume: 1200 },
      ],
      inundationZone: {
        boundaries: [[1, -0.5], [7.5, -2], [7.5, -2.8], [3, -2.5], [1, -1.5]],
        depth: 1.5,
      },
      breachProgress: 100,
    },
  ] as FloodScenario[],
};
