export interface EvacuationRoute {
  id: string;
  fromVillage: string;
  toSafeZone: string;
  routeName: string;
  distance: number; // in km
  estimatedTime: number; // in minutes
  elevation: number; // in meters
  routeType: 'primary' | 'alternate' | 'emergency';
  accessibility: 'easy' | 'moderate' | 'difficult';
  roadCondition: 'good' | 'fair' | 'poor';
  waypoints: [number, number, number][]; // [x, z, elevation]
  capacity: number; // number of people
  vehicleAccessible: boolean;
  weatherDependent: boolean;
  status: 'clear' | 'blocked' | 'warning' | 'unknown';
  blockageReason?: string;
  safetyRating: number; // 1-10
  lastVerified: string;
}

export interface SafeZone {
  id: string;
  name: string;
  coordinates: [number, number, number]; // [x, z, elevation]
  capacity: number;
  facilities: string[];
  elevation: number;
  hasWater: boolean;
  hasShelter: boolean;
  hasMedical: boolean;
  accessibility: 'easy' | 'moderate' | 'difficult';
}

export interface RoadBlock {
  id: string;
  location: [number, number, number];
  type: 'landslide' | 'flood' | 'bridge-collapse' | 'debris' | 'weather';
  severity: 'low' | 'medium' | 'high';
  affectedRoutes: string[];
  reportedAt: string;
  estimatedClearTime?: string;
  alternativeAvailable: boolean;
}

export interface WeatherCondition {
  condition: 'clear' | 'rain' | 'heavy-rain' | 'snow' | 'storm';
  visibility: 'good' | 'moderate' | 'poor';
  recommendedRouteType: 'primary' | 'alternate' | 'emergency';
  restrictions: string[];
}

// Safe zones at higher elevation
export const safeZones: SafeZone[] = [
  {
    id: 'safe-karimabad-high',
    name: 'Karimabad High Ground',
    coordinates: [7.5, -1.5, 2680],
    capacity: 15000,
    facilities: ['shelter', 'medical', 'food', 'water', 'communication'],
    elevation: 2680,
    hasWater: true,
    hasShelter: true,
    hasMedical: true,
    accessibility: 'easy',
  },
  {
    id: 'safe-altit-fort',
    name: 'Altit Fort Complex',
    coordinates: [6, -1.2, 2850],
    capacity: 8000,
    facilities: ['shelter', 'water', 'communication'],
    elevation: 2850,
    hasWater: true,
    hasShelter: true,
    hasMedical: false,
    accessibility: 'moderate',
  },
  {
    id: 'safe-duikar',
    name: 'Duikar Plateau',
    coordinates: [5, -0.8, 2950],
    capacity: 5000,
    facilities: ['shelter', 'water'],
    elevation: 2950,
    hasWater: true,
    hasShelter: true,
    hasMedical: false,
    accessibility: 'moderate',
  },
  {
    id: 'safe-ultar-meadow',
    name: 'Ultar Meadow',
    coordinates: [8, -1.0, 2780],
    capacity: 3000,
    facilities: ['shelter', 'water'],
    elevation: 2780,
    hasWater: true,
    hasShelter: false,
    hasMedical: false,
    accessibility: 'difficult',
  },
];

// Current road blocks
export const roadBlocks: RoadBlock[] = [
  {
    id: 'block-1',
    location: [2.5, -1.6, 2820],
    type: 'landslide',
    severity: 'medium',
    affectedRoutes: ['hassanabad-primary'],
    reportedAt: '2024-12-08T10:00:00Z',
    estimatedClearTime: '4 hours',
    alternativeAvailable: true,
  },
  {
    id: 'block-2',
    location: [4.2, -1.85, 2670],
    type: 'debris',
    severity: 'low',
    affectedRoutes: ['aliabad-alternate-1'],
    reportedAt: '2024-12-08T08:30:00Z',
    estimatedClearTime: '2 hours',
    alternativeAvailable: true,
  },
];

// Evacuation routes for each village
export const evacuationRoutes: EvacuationRoute[] = [
  // Hassanabad evacuation routes
  {
    id: 'hassanabad-primary',
    fromVillage: 'Hassanabad',
    toSafeZone: 'Duikar Plateau',
    routeName: 'Hassanabad North Route',
    distance: 4.2,
    estimatedTime: 35,
    elevation: 2950,
    routeType: 'primary',
    accessibility: 'moderate',
    roadCondition: 'fair',
    waypoints: [
      [2, -1.5, 2850],
      [2.5, -1.3, 2880],
      [3.5, -1.0, 2920],
      [5, -0.8, 2950],
    ],
    capacity: 3000,
    vehicleAccessible: true,
    weatherDependent: true,
    status: 'blocked',
    blockageReason: 'Landslide at 2.5km mark',
    safetyRating: 6,
    lastVerified: '2024-12-08T10:00:00Z',
  },
  {
    id: 'hassanabad-alternate-1',
    fromVillage: 'Hassanabad',
    toSafeZone: 'Altit Fort Complex',
    routeName: 'Hassanabad East Route',
    distance: 5.8,
    estimatedTime: 45,
    elevation: 2850,
    routeType: 'alternate',
    accessibility: 'easy',
    roadCondition: 'good',
    waypoints: [
      [2, -1.5, 2850],
      [3, -1.4, 2860],
      [4.5, -1.3, 2870],
      [6, -1.2, 2850],
    ],
    capacity: 5000,
    vehicleAccessible: true,
    weatherDependent: false,
    status: 'clear',
    safetyRating: 9,
    lastVerified: '2024-12-08T12:00:00Z',
  },
  {
    id: 'hassanabad-emergency',
    fromVillage: 'Hassanabad',
    toSafeZone: 'Karimabad High Ground',
    routeName: 'Hassanabad Mountain Trail',
    distance: 7.5,
    estimatedTime: 90,
    elevation: 2680,
    routeType: 'emergency',
    accessibility: 'difficult',
    roadCondition: 'poor',
    waypoints: [
      [2, -1.5, 2850],
      [3.2, -1.6, 2820],
      [5, -1.8, 2750],
      [7.5, -1.5, 2680],
    ],
    capacity: 1000,
    vehicleAccessible: false,
    weatherDependent: true,
    status: 'warning',
    blockageReason: 'Narrow path, difficult terrain',
    safetyRating: 5,
    lastVerified: '2024-12-07T14:00:00Z',
  },
  // Aliabad evacuation routes
  {
    id: 'aliabad-primary',
    fromVillage: 'Aliabad',
    toSafeZone: 'Karimabad High Ground',
    routeName: 'Aliabad Direct Route',
    distance: 3.8,
    estimatedTime: 25,
    elevation: 2680,
    routeType: 'primary',
    accessibility: 'easy',
    roadCondition: 'good',
    waypoints: [
      [4, -1.8, 2680],
      [5.5, -1.7, 2685],
      [7.5, -1.5, 2680],
    ],
    capacity: 8000,
    vehicleAccessible: true,
    weatherDependent: false,
    status: 'clear',
    safetyRating: 10,
    lastVerified: '2024-12-08T13:00:00Z',
  },
  {
    id: 'aliabad-alternate-1',
    fromVillage: 'Aliabad',
    toSafeZone: 'Altit Fort Complex',
    routeName: 'Aliabad North Route',
    distance: 3.2,
    estimatedTime: 30,
    elevation: 2850,
    routeType: 'alternate',
    accessibility: 'moderate',
    roadCondition: 'fair',
    waypoints: [
      [4, -1.8, 2680],
      [4.5, -1.5, 2750],
      [5.5, -1.3, 2820],
      [6, -1.2, 2850],
    ],
    capacity: 4000,
    vehicleAccessible: true,
    weatherDependent: true,
    status: 'blocked',
    blockageReason: 'Debris on road',
    safetyRating: 7,
    lastVerified: '2024-12-08T08:30:00Z',
  },
  {
    id: 'aliabad-alternate-2',
    fromVillage: 'Aliabad',
    toSafeZone: 'Duikar Plateau',
    routeName: 'Aliabad West Route',
    distance: 2.5,
    estimatedTime: 28,
    elevation: 2950,
    routeType: 'alternate',
    accessibility: 'moderate',
    roadCondition: 'good',
    waypoints: [
      [4, -1.8, 2680],
      [4.2, -1.2, 2820],
      [4.8, -0.9, 2900],
      [5, -0.8, 2950],
    ],
    capacity: 3000,
    vehicleAccessible: true,
    weatherDependent: false,
    status: 'clear',
    safetyRating: 8,
    lastVerified: '2024-12-08T11:00:00Z',
  },
  // Karimabad evacuation routes
  {
    id: 'karimabad-primary',
    fromVillage: 'Karimabad',
    toSafeZone: 'Karimabad High Ground',
    routeName: 'Karimabad Internal Route',
    distance: 0.8,
    estimatedTime: 10,
    elevation: 2680,
    routeType: 'primary',
    accessibility: 'easy',
    roadCondition: 'good',
    waypoints: [
      [7, -2.2, 2450],
      [7.5, -1.5, 2680],
    ],
    capacity: 10000,
    vehicleAccessible: true,
    weatherDependent: false,
    status: 'clear',
    safetyRating: 10,
    lastVerified: '2024-12-08T14:00:00Z',
  },
  {
    id: 'karimabad-alternate-1',
    fromVillage: 'Karimabad',
    toSafeZone: 'Ultar Meadow',
    routeName: 'Karimabad Ultar Trail',
    distance: 2.5,
    estimatedTime: 35,
    elevation: 2780,
    routeType: 'alternate',
    accessibility: 'difficult',
    roadCondition: 'poor',
    waypoints: [
      [7, -2.2, 2450],
      [7.3, -1.8, 2550],
      [7.7, -1.3, 2680],
      [8, -1.0, 2780],
    ],
    capacity: 2000,
    vehicleAccessible: false,
    weatherDependent: true,
    status: 'clear',
    safetyRating: 6,
    lastVerified: '2024-12-08T09:00:00Z',
  },
  // Ganish evacuation routes
  {
    id: 'ganish-primary',
    fromVillage: 'Ganish',
    toSafeZone: 'Karimabad High Ground',
    routeName: 'Ganish East Route',
    distance: 1.5,
    estimatedTime: 15,
    elevation: 2680,
    routeType: 'primary',
    accessibility: 'easy',
    roadCondition: 'good',
    waypoints: [
      [8, -2.5, 2380],
      [7.5, -1.5, 2680],
    ],
    capacity: 6000,
    vehicleAccessible: true,
    weatherDependent: false,
    status: 'clear',
    safetyRating: 9,
    lastVerified: '2024-12-08T13:30:00Z',
  },
  {
    id: 'ganish-alternate-1',
    fromVillage: 'Ganish',
    toSafeZone: 'Ultar Meadow',
    routeName: 'Ganish North Route',
    distance: 1.8,
    estimatedTime: 20,
    elevation: 2780,
    routeType: 'alternate',
    accessibility: 'moderate',
    roadCondition: 'fair',
    waypoints: [
      [8, -2.5, 2380],
      [8.2, -1.8, 2520],
      [8.1, -1.2, 2680],
      [8, -1.0, 2780],
    ],
    capacity: 2500,
    vehicleAccessible: true,
    weatherDependent: true,
    status: 'clear',
    safetyRating: 7,
    lastVerified: '2024-12-08T10:30:00Z',
  },
];

// AI-generated route recommendations based on conditions
export const generateRouteRecommendations = (
  village: string,
  weatherCondition: WeatherCondition,
  floodProbability: number
): EvacuationRoute[] => {
  const villageRoutes = evacuationRoutes.filter(r => r.fromVillage === village);
  
  // Sort by priority based on conditions
  return villageRoutes
    .filter(route => {
      // Filter out blocked routes for high flood probability
      if (floodProbability > 70 && route.status === 'blocked') return false;
      
      // Filter weather-dependent routes in bad weather
      if (weatherCondition.condition === 'heavy-rain' && route.weatherDependent) return false;
      
      return true;
    })
    .sort((a, b) => {
      // Prioritize clear routes
      if (a.status === 'clear' && b.status !== 'clear') return -1;
      if (b.status === 'clear' && a.status !== 'clear') return 1;
      
      // Then by safety rating
      if (a.safetyRating !== b.safetyRating) return b.safetyRating - a.safetyRating;
      
      // Then by route type (primary > alternate > emergency)
      const typeOrder = { primary: 0, alternate: 1, emergency: 2 };
      return typeOrder[a.routeType] - typeOrder[b.routeType];
    });
};

// Get route status with weather impact
export const getRouteStatusWithWeather = (
  route: EvacuationRoute,
  weather: WeatherCondition
): { status: string; warning: string | null } => {
  if (route.status === 'blocked') {
    return { status: 'blocked', warning: route.blockageReason || 'Route blocked' };
  }
  
  if (weather.condition === 'heavy-rain' && route.weatherDependent) {
    return { status: 'warning', warning: 'Not recommended in heavy rain' };
  }
  
  if (weather.visibility === 'poor' && !route.vehicleAccessible) {
    return { status: 'warning', warning: 'Poor visibility affects this trail' };
  }
  
  if (route.status === 'warning') {
    return { status: 'warning', warning: route.blockageReason || 'Caution advised' };
  }
  
  return { status: 'clear', warning: null };
};

// Current weather condition (would be fetched from API in production)
export const currentWeather: WeatherCondition = {
  condition: 'clear',
  visibility: 'good',
  recommendedRouteType: 'primary',
  restrictions: [],
};
