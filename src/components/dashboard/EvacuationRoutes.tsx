import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Navigation,
  Clock,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  TrendingUp,
  Car,
  PersonStanding,
  CloudRain,
  Sun,
  Mountain,
  Shield,
  Activity,
  Info,
  Route as RouteIcon,
  ArrowRight,
  Home,
  Building2,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  evacuationRoutes,
  safeZones,
  roadBlocks,
  currentWeather,
  generateRouteRecommendations,
  getRouteStatusWithWeather,
  EvacuationRoute,
  SafeZone,
} from '@/data/evacuationRoutes';

interface EvacuationRoutesProps {
  floodProbability?: number;
  affectedVillages?: string[];
  showAll?: boolean;
}

export function EvacuationRoutes({
  floodProbability = 78,
  affectedVillages = ['Hassanabad', 'Aliabad', 'Karimabad', 'Ganish'],
  showAll = true,
}: EvacuationRoutesProps) {
  const [selectedVillage, setSelectedVillage] = useState(affectedVillages[0]);
  const [selectedRoute, setSelectedRoute] = useState<EvacuationRoute | null>(null);

  // Generate recommended routes for selected village
  const recommendedRoutes = generateRouteRecommendations(
    selectedVillage,
    currentWeather,
    floodProbability
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clear':
        return 'text-green-500 bg-green-500/10 border-green-500/30';
      case 'warning':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/30';
      case 'blocked':
        return 'text-red-500 bg-red-500/10 border-red-500/30';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/30';
    }
  };

  const getAccessibilityIcon = (accessibility: string) => {
    switch (accessibility) {
      case 'easy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'moderate':
        return <Activity className="w-4 h-4 text-yellow-500" />;
      case 'difficult':
        return <Mountain className="w-4 h-4 text-orange-500" />;
      default:
        return <Info className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRouteTypeColor = (type: string) => {
    switch (type) {
      case 'primary':
        return 'bg-blue-500';
      case 'alternate':
        return 'bg-purple-500';
      case 'emergency':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Alert */}
      {floodProbability > 70 && (
        <Alert className="border-destructive/50 bg-destructive/10">
          <AlertTriangle className="h-5 w-5 text-destructive" />
          <AlertTitle className="text-destructive font-semibold">
            High Flood Probability Detected ({floodProbability}%)
          </AlertTitle>
          <AlertDescription className="text-destructive/90">
            Evacuation routes have been auto-generated for affected villages. Review and select the
            safest route for your location immediately.
          </AlertDescription>
        </Alert>
      )}

      {/* Weather & Road Conditions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              {currentWeather.condition === 'clear' ? (
                <Sun className="w-8 h-8 text-yellow-500" />
              ) : (
                <CloudRain className="w-8 h-8 text-blue-500" />
              )}
              <div>
                <p className="text-xs text-muted-foreground">Current Weather</p>
                <p className="font-semibold text-foreground capitalize">
                  {currentWeather.condition} - {currentWeather.visibility} visibility
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-8 h-8 text-orange-500" />
              <div>
                <p className="text-xs text-muted-foreground">Road Blocks</p>
                <p className="font-semibold text-foreground">
                  {roadBlocks.length} Active Blockage{roadBlocks.length !== 1 ? 's' : ''}
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
                <p className="font-semibold text-foreground">
                  {safeZones.length} Available Location{safeZones.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs value={selectedVillage} onValueChange={setSelectedVillage}>
        <TabsList className="grid w-full grid-cols-4 glass-card">
          {affectedVillages.map((village) => (
            <TabsTrigger key={village} value={village} className="data-[state=active]:bg-primary/20">
              {village}
            </TabsTrigger>
          ))}
        </TabsList>

        {affectedVillages.map((village) => (
          <TabsContent key={village} value={village} className="space-y-4">
            {/* Village Overview */}
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Home className="w-5 h-5 text-primary" />
                    {village} Evacuation Plan
                  </span>
                  <Badge variant="outline" className="bg-primary/10">
                    {recommendedRoutes.length} Route{recommendedRoutes.length !== 1 ? 's' : ''}
                  </Badge>
                </CardTitle>
              </CardHeader>
            </Card>

            {/* Routes List */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {recommendedRoutes.map((route, index) => {
                const routeStatus = getRouteStatusWithWeather(route, currentWeather);
                const safeZone = safeZones.find((z) => z.name === route.toSafeZone);

                return (
                  <motion.div
                    key={route.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <Card
                      className={`glass-card hover:border-primary/50 transition-all cursor-pointer ${
                        selectedRoute?.id === route.id ? 'border-primary shadow-lg' : ''
                      }`}
                      onClick={() => setSelectedRoute(route)}
                    >
                      <CardContent className="pt-6">
                        {/* Route Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <div className={`w-3 h-3 rounded-full ${getRouteTypeColor(route.routeType)}`} />
                              <h3 className="font-semibold text-foreground">{route.routeName}</h3>
                            </div>
                            <p className="text-sm text-muted-foreground flex items-center gap-1">
                              <Navigation className="w-3 h-3" />
                              {village} → {route.toSafeZone}
                            </p>
                          </div>
                          <Badge
                            className={`capitalize ${getStatusColor(routeStatus.status)}`}
                            variant="outline"
                          >
                            {routeStatus.status}
                          </Badge>
                        </div>

                        {/* Route Stats */}
                        <div className="grid grid-cols-3 gap-3 mb-4">
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground mb-1">Distance</p>
                            <p className="font-semibold text-sm text-foreground flex items-center gap-1">
                              <RouteIcon className="w-3 h-3" />
                              {route.distance} km
                            </p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground mb-1">Time</p>
                            <p className="font-semibold text-sm text-foreground flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {route.estimatedTime} min
                            </p>
                          </div>
                          <div className="bg-background/50 rounded-lg p-2">
                            <p className="text-xs text-muted-foreground mb-1">Safety</p>
                            <p className="font-semibold text-sm text-foreground flex items-center gap-1">
                              <Shield className="w-3 h-3" />
                              {route.safetyRating}/10
                            </p>
                          </div>
                        </div>

                        {/* Route Indicators */}
                        <div className="flex flex-wrap gap-2 mb-3">
                          <Badge variant="secondary" className="text-xs">
                            {getAccessibilityIcon(route.accessibility)}
                            <span className="ml-1 capitalize">{route.accessibility}</span>
                          </Badge>
                          {route.vehicleAccessible && (
                            <Badge variant="secondary" className="text-xs">
                              <Car className="w-3 h-3 mr-1" />
                              Vehicle OK
                            </Badge>
                          )}
                          {!route.vehicleAccessible && (
                            <Badge variant="secondary" className="text-xs">
                              <PersonStanding className="w-3 h-3 mr-1" />
                              Walking Only
                            </Badge>
                          )}
                          <Badge variant="secondary" className="text-xs">
                            <Users className="w-3 h-3 mr-1" />
                            {route.capacity.toLocaleString()}
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            <TrendingUp className="w-3 h-3 mr-1" />
                            {route.elevation}m
                          </Badge>
                        </div>

                        {/* Warning Message */}
                        {routeStatus.warning && (
                          <Alert className="border-yellow-500/50 bg-yellow-500/10 mb-3">
                            <AlertTriangle className="h-4 w-4 text-yellow-500" />
                            <AlertDescription className="text-xs text-yellow-500/90">
                              {routeStatus.warning}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* Safe Zone Info */}
                        {safeZone && (
                          <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                              <Building2 className="w-4 h-4 text-primary" />
                              <p className="text-sm font-semibold text-foreground">
                                {safeZone.name}
                              </p>
                            </div>
                            <div className="flex flex-wrap gap-2 text-xs">
                              {safeZone.hasShelter && (
                                <span className="text-muted-foreground">🏠 Shelter</span>
                              )}
                              {safeZone.hasMedical && (
                                <span className="text-muted-foreground">🏥 Medical</span>
                              )}
                              {safeZone.hasWater && (
                                <span className="text-muted-foreground">💧 Water</span>
                              )}
                              <span className="text-muted-foreground">
                                👥 {safeZone.capacity.toLocaleString()} capacity
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Action Button */}
                        <Button
                          className="w-full mt-4"
                          variant={routeStatus.status === 'clear' ? 'default' : 'outline'}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRoute(route);
                          }}
                        >
                          View Detailed Route Map
                          <ArrowRight className="w-4 h-4 ml-2" />
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* No Routes Warning */}
            {recommendedRoutes.length === 0 && (
              <Alert className="border-orange-500/50 bg-orange-500/10">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                <AlertTitle className="text-orange-500">No Safe Routes Available</AlertTitle>
                <AlertDescription className="text-orange-500/90">
                  All primary evacuation routes are currently blocked or unsafe. Seek immediate
                  shelter at the highest nearby elevation and await rescue assistance.
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Road Blocks Section */}
      {roadBlocks.length > 0 && (
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-destructive" />
              Active Road Blockages
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {roadBlocks.map((block) => (
                <div
                  key={block.id}
                  className="flex items-start justify-between p-3 bg-destructive/5 border border-destructive/20 rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          block.severity === 'high'
                            ? 'border-red-500 text-red-500'
                            : block.severity === 'medium'
                            ? 'border-orange-500 text-orange-500'
                            : 'border-yellow-500 text-yellow-500'
                        }`}
                      >
                        {block.severity} severity
                      </Badge>
                      <span className="text-sm font-medium text-foreground capitalize">
                        {block.type.replace('-', ' ')}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Reported: {new Date(block.reportedAt).toLocaleString()}
                    </p>
                    {block.estimatedClearTime && (
                      <p className="text-xs text-muted-foreground">
                        Est. clear time: {block.estimatedClearTime}
                      </p>
                    )}
                    {block.alternativeAvailable && (
                      <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Alternative route available
                      </p>
                    )}
                  </div>
                  <MapPin className="w-4 h-4 text-destructive" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Selected Route Details Modal/Panel */}
      <AnimatePresence>
        {selectedRoute && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
            onClick={() => setSelectedRoute(null)}
          >
            <Card
              className="w-full max-w-2xl max-h-[80vh] overflow-auto glass-card"
              onClick={(e) => e.stopPropagation()}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <RouteIcon className="w-5 h-5 text-primary" />
                    {selectedRoute.routeName}
                  </span>
                  <Button variant="ghost" size="icon" onClick={() => setSelectedRoute(null)}>
                    <XCircle className="w-5 h-5" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Total Distance</p>
                    <p className="text-2xl font-bold text-primary">{selectedRoute.distance} km</p>
                  </div>
                  <div className="bg-background/50 rounded-lg p-3">
                    <p className="text-xs text-muted-foreground mb-1">Estimated Time</p>
                    <p className="text-2xl font-bold text-primary">
                      {selectedRoute.estimatedTime} min
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Navigation className="w-4 h-4" />
                    Route Details
                  </h4>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Route Type:</span>{' '}
                      <Badge variant="outline" className="capitalize">
                        {selectedRoute.routeType}
                      </Badge>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Accessibility:</span>{' '}
                      <span className="capitalize">{selectedRoute.accessibility}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Road Condition:</span>{' '}
                      <span className="capitalize">{selectedRoute.roadCondition}</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Capacity:</span>{' '}
                      {selectedRoute.capacity.toLocaleString()} people
                    </p>
                    <p>
                      <span className="text-muted-foreground">Safety Rating:</span>{' '}
                      <span className="font-semibold">{selectedRoute.safetyRating}/10</span>
                    </p>
                    <p>
                      <span className="text-muted-foreground">Last Verified:</span>{' '}
                      {new Date(selectedRoute.lastVerified).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Waypoints ({selectedRoute.waypoints.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedRoute.waypoints.map((waypoint, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-2 bg-background/30 rounded-lg"
                      >
                        <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
                          {index + 1}
                        </div>
                        <div className="flex-1 text-sm">
                          <span className="text-muted-foreground">
                            Elevation: {waypoint[2]}m
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Alert className="border-primary/50 bg-primary/5">
                  <Info className="h-4 w-4 text-primary" />
                  <AlertTitle className="text-primary">Important</AlertTitle>
                  <AlertDescription className="text-sm">
                    Follow local emergency guidelines. Stay updated with official communications.
                    Carry essential supplies and identification documents.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
