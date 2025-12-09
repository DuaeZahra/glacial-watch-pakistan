import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/layouts/DashboardLayout';
import { MapContainer, TileLayer, Polyline, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Slider } from '@/components/ui/slider';
import {
  evacuationRoutes,
  safeZones,
  roadBlocks,
  currentWeather,
  generateRouteRecommendations,
  getRouteStatusWithWeather,
  EvacuationRoute,
} from '@/data/evacuationRoutes';
import { infrastructureData } from '@/data/infrastructure';
import { floodSimulationData } from '@/data/lakes';
import {
  Navigation2,
  MapPin,
  AlertTriangle,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  Play,
  Pause,
  Home,
  Building2,
  CloudRain,
  Sun,
  Shield,
} from 'lucide-react';

// Fix for default marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Custom icons
const createVillageIcon = (isAffected: boolean) => {
  const color = isAffected ? '#ef4444' : '#3b82f6';
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px;
      height: 32px;
      background: ${color};
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 16px;
    ">🏘️</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

const createSafeZoneIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 40px;
      height: 40px;
      background: #10b981;
      border: 4px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 12px rgba(16, 185, 129, 0.6);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 20px;
      animation: pulse 2s infinite;
    ">🏕️</div>`,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

const createBlockageIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 28px;
      height: 28px;
      background: #f59e0b;
      border: 3px solid white;
      border-radius: 50%;
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
    ">⚠️</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
  });
};

// Convert 3D coordinates to lat/lng (simplified mapping)
const coordsToLatLng = (x: number, z: number): [number, number] => {
  // Map 3D coordinates to approximate lat/lng in Hunza Valley region
  const baseLat = 36.32;
  const baseLng = 74.65;
  const lat = baseLat + (z * 0.015);
  const lng = baseLng + (x * 0.012);
  return [lat, lng];
};

const EvacuationPlanner = () => {
  const [timeIndex, setTimeIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedVillage, setSelectedVillage] = useState<string>('Hassanabad');
  const [showRoutes, setShowRoutes] = useState(true);
  const [showSafeZones, setShowSafeZones] = useState(true);
  const [showBlockages, setShowBlockages] = useState(true);

  const scenarios = floodSimulationData.scenarios;
  const currentScenario = scenarios[timeIndex];
  const affectedVillages = currentScenario.affectedSettlements;

  // Auto-play simulation
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setTimeIndex((prev) => (prev + 1) % scenarios.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, scenarios.length]);

  // Get routes for selected village
  const villageRoutes = generateRouteRecommendations(
    selectedVillage,
    currentWeather,
    78
  );

  // Check if village is affected at current time
  const isVillageAffected = affectedVillages.includes(selectedVillage);

  // Get route colors based on status
  const getRouteColor = (route: EvacuationRoute) => {
    if (route.status === 'blocked') return '#ef4444';
    if (route.status === 'warning') return '#f59e0b';
    if (route.routeType === 'primary') return '#3b82f6';
    if (route.routeType === 'alternate') return '#8b5cf6';
    return '#6b7280';
  };

  // Map center (Hunza Valley)
  const mapCenter: [number, number] = [36.32, 74.65];

  return (
    <DashboardLayout
      title="Evacuation Route Planner"
      subtitle="Real-time evacuation route planning with flood progression"
    >
      <div className="space-y-6">
        {/* High Risk Alert */}
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive font-semibold">
            High Flood Probability Detected - Simulation Time: {currentScenario.time}
          </AlertTitle>
          <AlertDescription className="text-destructive/90">
            {currentScenario.affectedPopulation.toLocaleString()} people at risk in{' '}
            {currentScenario.affectedSettlements.length} settlements. Evacuation routes updated automatically.
          </AlertDescription>
        </Alert>

        {/* Control Panel */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Clock className="w-8 h-8 text-primary" />
                <div>
                  <p className="text-xs text-muted-foreground">Simulation Time</p>
                  <p className="font-semibold text-foreground">{currentScenario.time}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                {currentWeather.condition === 'clear' ? (
                  <Sun className="w-8 h-8 text-yellow-500" />
                ) : (
                  <CloudRain className="w-8 h-8 text-blue-500" />
                )}
                <div>
                  <p className="text-xs text-muted-foreground">Weather</p>
                  <p className="font-semibold text-foreground capitalize">
                    {currentWeather.condition}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="w-8 h-8 text-destructive" />
                <div>
                  <p className="text-xs text-muted-foreground">At Risk</p>
                  <p className="font-semibold text-foreground">
                    {currentScenario.affectedPopulation.toLocaleString()}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Shield className="w-8 h-8 text-green-500" />
                <div>
                  <p className="text-xs text-muted-foreground">Safe Zones</p>
                  <p className="font-semibold text-foreground">{safeZones.length} Active</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Map and Controls */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2">
            <Card className="glass-card h-[600px]">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-primary" />
                    Live Evacuation Map
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? (
                        <Pause className="w-4 h-4 mr-2" />
                      ) : (
                        <Play className="w-4 h-4 mr-2" />
                      )}
                      {isPlaying ? 'Pause' : 'Play'} Simulation
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="h-[500px] relative">
                <MapContainer
                  center={mapCenter}
                  zoom={11}
                  style={{ height: '100%', width: '100%', borderRadius: '0.5rem' }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* Safe Zones */}
                  {showSafeZones &&
                    safeZones.map((zone) => {
                      const latLng = coordsToLatLng(zone.coordinates[0], zone.coordinates[1]);
                      return (
                        <Marker key={zone.id} position={latLng} icon={createSafeZoneIcon()}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-green-600 mb-1">{zone.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">
                                Elevation: {zone.elevation}m
                              </p>
                              <p className="text-xs mb-1">
                                <strong>Capacity:</strong> {zone.capacity.toLocaleString()} people
                              </p>
                              <div className="text-xs space-y-1">
                                {zone.hasShelter && <p>✓ Shelter Available</p>}
                                {zone.hasMedical && <p>✓ Medical Facilities</p>}
                                {zone.hasWater && <p>✓ Water Supply</p>}
                              </div>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}

                  {/* Villages */}
                  {infrastructureData
                    .filter((i) => i.type === 'village')
                    .map((village) => {
                      const latLng = coordsToLatLng(village.coordinates[0], village.coordinates[1]);
                      const isAffected = affectedVillages.includes(village.name);
                      return (
                        <Marker
                          key={village.id}
                          position={latLng}
                          icon={createVillageIcon(isAffected)}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold mb-1">{village.name}</h3>
                              <p className="text-xs mb-1">
                                Population: {village.population?.toLocaleString()}
                              </p>
                              {isAffected && village.floodArrivalTime && (
                                <p className="text-xs text-red-600 font-semibold">
                                  ⚠️ Flood ETA: {village.floodArrivalTime}
                                </p>
                              )}
                              <Badge
                                variant={isAffected ? 'destructive' : 'default'}
                                className="mt-2"
                              >
                                {isAffected ? 'At Risk' : 'Safe'}
                              </Badge>
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}

                  {/* Road Blockages */}
                  {showBlockages &&
                    roadBlocks.map((block) => {
                      const latLng = coordsToLatLng(block.location[0], block.location[1]);
                      return (
                        <Marker key={block.id} position={latLng} icon={createBlockageIcon()}>
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold text-orange-600 mb-1 capitalize">
                                {block.type.replace('-', ' ')}
                              </h3>
                              <p className="text-xs mb-1">
                                <strong>Severity:</strong> {block.severity}
                              </p>
                              {block.estimatedClearTime && (
                                <p className="text-xs">
                                  <strong>Clear in:</strong> {block.estimatedClearTime}
                                </p>
                              )}
                            </div>
                          </Popup>
                        </Marker>
                      );
                    })}

                  {/* Evacuation Routes */}
                  {showRoutes &&
                    villageRoutes.map((route) => {
                      const positions = route.waypoints.map(([x, z]) =>
                        coordsToLatLng(x, z)
                      ) as [number, number][];
                      return (
                        <Polyline
                          key={route.id}
                          positions={positions}
                          pathOptions={{
                            color: getRouteColor(route),
                            weight: route.routeType === 'primary' ? 5 : 4,
                            opacity: route.status === 'clear' ? 0.8 : 0.5,
                            dashArray: route.routeType === 'alternate' ? '10, 10' : undefined,
                          }}
                        >
                          <Popup>
                            <div className="p-2">
                              <h3 className="font-semibold mb-1">{route.routeName}</h3>
                              <p className="text-xs mb-1">
                                <strong>Type:</strong> {route.routeType}
                              </p>
                              <p className="text-xs mb-1">
                                <strong>Distance:</strong> {route.distance} km
                              </p>
                              <p className="text-xs mb-1">
                                <strong>Time:</strong> {route.estimatedTime} min
                              </p>
                              <Badge
                                variant={
                                  route.status === 'clear'
                                    ? 'default'
                                    : route.status === 'blocked'
                                    ? 'destructive'
                                    : 'secondary'
                                }
                                className="mt-2"
                              >
                                {route.status}
                              </Badge>
                            </div>
                          </Popup>
                        </Polyline>
                      );
                    })}
                </MapContainer>

                {/* Map Legend */}
                <div className="absolute bottom-4 right-4 glass-card p-3 text-xs space-y-2 z-[1000]">
                  <p className="font-semibold mb-2">Legend</p>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-blue-500 rounded"></div>
                    <span>Primary Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-purple-500 rounded"></div>
                    <span>Alternate Route</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Safe Zone</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>At Risk</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline Slider */}
            <Card className="glass-card mt-4">
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">Flood Progression Timeline</p>
                    <Badge>{currentScenario.time}</Badge>
                  </div>
                  <Slider
                    value={[timeIndex]}
                    max={scenarios.length - 1}
                    step={1}
                    onValueChange={(value) => setTimeIndex(value[0])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    {scenarios.map((s, i) => (
                      <span key={i} className={i === timeIndex ? 'text-primary font-medium' : ''}>
                        {s.time}
                      </span>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Routes Panel */}
          <div className="space-y-4">
            {/* Village Selector */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Select Village</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {['Hassanabad', 'Aliabad', 'Karimabad', 'Ganish'].map((village) => {
                  const isAffected = affectedVillages.includes(village);
                  return (
                    <Button
                      key={village}
                      variant={selectedVillage === village ? 'default' : 'outline'}
                      className="w-full justify-start"
                      onClick={() => setSelectedVillage(village)}
                    >
                      <Home className="w-4 h-4 mr-2" />
                      {village}
                      {isAffected && (
                        <AlertTriangle className="w-4 h-4 ml-auto text-destructive" />
                      )}
                    </Button>
                  );
                })}
              </CardContent>
            </Card>

            {/* Routes for Selected Village */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Navigation2 className="w-5 h-5" />
                  Routes for {selectedVillage}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {villageRoutes.map((route) => {
                  const routeStatus = getRouteStatusWithWeather(route, currentWeather);
                  return (
                    <div
                      key={route.id}
                      className={`p-3 rounded-lg border ${
                        route.status === 'clear'
                          ? 'border-green-500/30 bg-green-500/5'
                          : route.status === 'blocked'
                          ? 'border-red-500/30 bg-red-500/5'
                          : 'border-yellow-500/30 bg-yellow-500/5'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{route.routeName}</p>
                          <p className="text-xs text-muted-foreground">{route.toSafeZone}</p>
                        </div>
                        {route.status === 'clear' ? (
                          <CheckCircle className="w-4 h-4 text-green-500" />
                        ) : (
                          <XCircle className="w-4 h-4 text-red-500" />
                        )}
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Distance:</span>{' '}
                          <span className="font-medium">{route.distance} km</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Time:</span>{' '}
                          <span className="font-medium">{route.estimatedTime} min</span>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className="mt-2 text-xs capitalize"
                        style={{
                          borderColor: getRouteColor(route),
                          color: getRouteColor(route),
                        }}
                      >
                        {route.routeType}
                      </Badge>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Display Options */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-base">Display Options</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Routes</span>
                  <input
                    type="checkbox"
                    checked={showRoutes}
                    onChange={(e) => setShowRoutes(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Safe Zones</span>
                  <input
                    type="checkbox"
                    checked={showSafeZones}
                    onChange={(e) => setShowSafeZones(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Show Blockages</span>
                  <input
                    type="checkbox"
                    checked={showBlockages}
                    onChange={(e) => setShowBlockages(e.target.checked)}
                    className="w-4 h-4"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default EvacuationPlanner;
