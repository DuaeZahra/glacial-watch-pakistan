import { useState, Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, Line, Html, Text } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, RotateCcw, Users, Home, AlertTriangle, Activity, Gauge, Droplets, Navigation, Building2, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { floodSimulationData, FloodScenario } from '@/data/lakes';
import * as THREE from 'three';

// Enhanced Terrain with better detail
function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create detailed terrain geometry
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(20, 20, 96, 96);
    const positions = geo.attributes.position;
    
    for (let i = 0; i < positions.count; i++) {
      const x = positions.getX(i);
      const y = positions.getY(i);
      
      // Create realistic valley terrain with elevation
      let z = Math.sin(x * 0.25) * Math.cos(y * 0.25) * 2.5;
      z += Math.sin(x * 0.4 + 1) * Math.cos(y * 0.35) * 1.8;
      
      // Create valley floor - water flows through here
      const distFromValley = Math.abs(y + x * 0.15);
      z -= distFromValley * 0.4;
      
      // Add some natural variation
      z += (Math.random() - 0.5) * 0.2;
      
      positions.setZ(i, z);
    }
    
    geo.computeVertexNormals();
    return geo;
  }, []);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial
        color="#2c2c2e"
        roughness={0.95}
        metalness={0.05}
        flatShading={false}
      />
    </mesh>
  );
}

// Flow path visualization showing water route
function FlowPath({ scenario }: { scenario: FloodScenario }) {
  return (
    <>
      {scenario.flowPath.map((segment, idx) => {
        const points = [
          new THREE.Vector3(segment.start[0], segment.start[1], segment.start[2] / 1000),
          new THREE.Vector3(segment.end[0], segment.end[1], segment.end[2] / 1000),
        ];
        
        // Color based on velocity - faster = more dangerous (red), slower = orange
        const velocityRatio = segment.velocity / 20;
        const color = new THREE.Color().setHSL(0.08 - velocityRatio * 0.08, 0.95, 0.5);
        
        return (
          <group key={idx}>
            <Line
              points={points}
              color={color}
              lineWidth={3}
              transparent
              opacity={0.9}
            />
            {/* Flow direction arrows */}
            <mesh position={[segment.end[0], segment.end[1], segment.end[2] / 1000 + 0.1]}>
              <coneGeometry args={[0.15, 0.3, 8]} />
              <meshStandardMaterial
                color={color}
                emissive={color}
                emissiveIntensity={0.5}
                transparent
                opacity={0.9}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}

// Inundation zone visualization
function InundationZone({ scenario }: { scenario: FloodScenario }) {
  const shape = useMemo(() => {
    const s = new THREE.Shape();
    const boundaries = scenario.inundationZone.boundaries;
    
    if (boundaries.length > 0) {
      s.moveTo(boundaries[0][0], boundaries[0][1]);
      for (let i = 1; i < boundaries.length; i++) {
        s.lineTo(boundaries[i][0], boundaries[i][1]);
      }
      s.lineTo(boundaries[0][0], boundaries[0][1]);
    }
    
    return s;
  }, [scenario]);

  const geometry = useMemo(() => {
    return new THREE.ShapeGeometry(shape);
  }, [shape]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.8, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial
        color="#0ea5e9"
        transparent
        opacity={0.45}
        emissive="#0ea5e9"
        emissiveIntensity={0.3}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

// Dynamic flood water with animation
function FloodWater({ scenario }: { scenario: FloodScenario }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      const time = state.clock.getElapsedTime();
      meshRef.current.position.y = -1.8 + Math.sin(time * 2) * 0.05;
      meshRef.current.rotation.z = time * 0.1;
    }
  });

  const depth = scenario.floodDepth;
  const scale = Math.max(3, scenario.affectedArea / 8);

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[scale, 64]} />
      <meshStandardMaterial
        color="#06b6d4"
        transparent
        opacity={0.5}
        roughness={0.1}
        metalness={0.7}
        emissive="#0891b2"
        emissiveIntensity={0.3}
      />
    </mesh>
  );
}

// Glacier lake at origin
function GlacierLake({ breachProgress }: { breachProgress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame(() => {
    if (meshRef.current) {
      // Lake gets smaller as breach progresses
      const scale = 1 - (breachProgress / 100) * 0.3;
      meshRef.current.scale.setScalar(scale);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0.3, 0]}>
      <sphereGeometry args={[1.2, 32, 32]} />
      <meshStandardMaterial
        color="#0ea5e9"
        transparent
        opacity={0.85}
        roughness={0.1}
        metalness={0.6}
        emissive="#0284c7"
        emissiveIntensity={0.4}
      />
    </mesh>
  );
}

// Infrastructure markers
function InfrastructureMarkers({ scenario }: { scenario: FloodScenario }) {
  const markers = useMemo(() => {
    const m: Array<{ pos: [number, number, number]; type: string; label: string }> = [];
    
    // Add village markers based on affected settlements
    scenario.affectedSettlements.forEach((settlement, idx) => {
      const pos: [number, number, number] = [
        2 + idx * 2.5,
        -1.5 - idx * 0.3,
        0.5
      ];
      m.push({ pos, type: 'village', label: settlement });
    });
    
    return m;
  }, [scenario]);

  return (
    <>
      {markers.map((marker, idx) => (
        <mesh key={idx} position={marker.pos}>
          <cylinderGeometry args={[0.1, 0.1, 0.5]} />
          <meshStandardMaterial
            color="#ef4444"
            emissive="#dc2626"
            emissiveIntensity={0.5}
          />
          <Html distanceFactor={10} position={[0, 0.5, 0]}>
            <div className="bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {marker.label}
            </div>
          </Html>
        </mesh>
      ))}
    </>
  );
}

// Main 3D Scene
function Scene({ scenario }: { scenario: FloodScenario }) {
  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.6} color="#0ea5e9" />
      <spotLight position={[-5, 8, 5]} intensity={0.5} angle={0.3} penumbra={0.5} color="#06b6d4" />
      
      <Terrain />
      <GlacierLake breachProgress={scenario.breachProgress} />
      <FloodWater scenario={scenario} />
      <InundationZone scenario={scenario} />
      <FlowPath scenario={scenario} />
      <InfrastructureMarkers scenario={scenario} />
      
      {/* Coordinate grid for reference */}
      <gridHelper args={[20, 20, '#334155', '#1e293b']} position={[0, -2, 0]} />
      
      <OrbitControls
        enablePan={true}
        minDistance={10}
        maxDistance={30}
        maxPolarAngle={Math.PI / 2.1}
        target={[3, -1, 0]}
      />
      <Environment preset="night" />
    </>
  );
}

export function FloodSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [showInfo, setShowInfo] = useState(false);

  const scenarios = floodSimulationData.scenarios;
  const currentScenario = scenarios[timeIndex];
  const breachModel = floodSimulationData.breachModel;

  const handlePlayPause = () => {
    if (!isPlaying) {
      setIsPlaying(true);
      const interval = setInterval(() => {
        setTimeIndex(prev => {
          if (prev >= scenarios.length - 1) {
            setIsPlaying(false);
            clearInterval(interval);
            return prev;
          }
          return prev + 1;
        });
      }, 2000);
    } else {
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeIndex(0);
  };

  const handleTimeChange = (value: number[]) => {
    setIsPlaying(false);
    setTimeIndex(value[0]);
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground tracking-wide flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Flood Path Simulation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {floodSimulationData.lakeName} - DEM-Based Flow Routing & Breach Model
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInfo(!showInfo)}
          className="gap-2"
        >
          <Info className="w-4 h-4" />
          {showInfo ? 'Hide' : 'Show'} Details
        </Button>
      </div>

      {/* Breach Model Info Panel */}
      <AnimatePresence>
        {showInfo && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-4 overflow-hidden"
          >
            <Card className="p-4 glass-card border-primary/20">
              <h3 className="font-semibold text-sm text-primary mb-3 flex items-center gap-2">
                <Gauge className="w-4 h-4" />
                Breach Model Parameters
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                <div>
                  <p className="text-muted-foreground mb-1">Breach Width</p>
                  <p className="font-bold text-foreground">{breachModel.breachWidth}m</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Breach Depth</p>
                  <p className="font-bold text-foreground">{breachModel.breachDepth}m</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Formation Time</p>
                  <p className="font-bold text-foreground">{breachModel.breachTime} min</p>
                </div>
                <div>
                  <p className="text-muted-foreground mb-1">Peak Discharge</p>
                  <p className="font-bold text-primary">{breachModel.peakDischarge.toLocaleString()} m³/s</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-border/30">
                <p className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">Formation:</span> {breachModel.breachFormation}
                </p>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3D Visualization */}
      <div className="flex-1 rounded-xl overflow-hidden glass-card relative min-h-[400px]">
        <Canvas
          camera={{ position: [15, 10, 15], fov: 50 }}
          shadows
          className="bg-background"
        >
          <Suspense fallback={null}>
            <Scene scenario={currentScenario} />
          </Suspense>
        </Canvas>

        {/* Overlay - Time & Breach Status */}
        <div className="absolute top-4 left-4 space-y-2">
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground mb-1">Simulation Time</p>
            <p className="font-display text-2xl font-bold text-primary">
              {currentScenario.time}
            </p>
          </div>
          <div className="glass-card p-3">
            <p className="text-xs text-muted-foreground mb-2">Breach Progress</p>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 bg-border rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-warning to-destructive"
                  initial={{ width: 0 }}
                  animate={{ width: `${currentScenario.breachProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">
                {currentScenario.breachProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Overlay - Critical Stats */}
        <div className="absolute top-4 right-4 space-y-2">
          <div className="glass-card p-3 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            <div>
              <p className="text-xs text-muted-foreground">Max Flood Depth</p>
              <p className="font-bold text-lg text-destructive">{currentScenario.floodDepth}m</p>
            </div>
          </div>
          <div className="glass-card p-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-warning" />
            <div>
              <p className="text-xs text-muted-foreground">Affected Area</p>
              <p className="font-bold text-lg text-warning">{currentScenario.affectedArea} km²</p>
            </div>
          </div>
          <div className="glass-card p-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-primary" />
            <div>
              <p className="text-xs text-muted-foreground">Population at Risk</p>
              <p className="font-bold text-lg text-primary">
                {currentScenario.affectedPopulation.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="absolute bottom-4 left-4 glass-card p-3">
          <p className="text-xs font-semibold text-foreground mb-2">Flow Path Legend</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-red-500 to-orange-500 rounded"></div>
              <span className="text-muted-foreground">High Velocity (15-20 m/s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-orange-500 to-yellow-500 rounded"></div>
              <span className="text-muted-foreground">Medium Velocity (8-15 m/s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-1 bg-gradient-to-r from-yellow-500 to-blue-400 rounded"></div>
              <span className="text-muted-foreground">Low Velocity (&lt;8 m/s)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-4 bg-cyan-500/40 border border-cyan-400 rounded"></div>
              <span className="text-muted-foreground">Inundation Zone</span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-4 glass-card p-4">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePlayPause}
            className="border-primary/30 hover:bg-primary/10"
          >
            {isPlaying ? (
              <Pause className="w-4 h-4 text-primary" />
            ) : (
              <Play className="w-4 h-4 text-primary" />
            )}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleReset}
            className="border-border/50"
          >
            <RotateCcw className="w-4 h-4 text-muted-foreground" />
          </Button>
          
          <div className="flex-1 px-4">
            <Slider
              value={[timeIndex]}
              max={scenarios.length - 1}
              step={1}
              onValueChange={handleTimeChange}
              className="w-full"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span className={timeIndex === 0 ? 'text-primary font-medium' : ''}>Start</span>
              <span className={timeIndex === Math.floor(scenarios.length / 2) ? 'text-primary font-medium' : ''}>Peak</span>
              <span className={timeIndex === scenarios.length - 1 ? 'text-primary font-medium' : ''}>Recession</span>
            </div>
          </div>
        </div>

        {/* Infrastructure Impact Stats */}
        <div className="mt-4 pt-4 border-t border-border/30">
          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-warning" />
            Infrastructure Impact Analysis
          </h4>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="glass-card p-3">
              <div className="flex items-center justify-between mb-1">
                <Home className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant="destructive" className="text-xs">
                  {currentScenario.affectedInfrastructure.villages}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Villages</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between mb-1">
                <Navigation className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant="destructive" className="text-xs">
                  {currentScenario.affectedInfrastructure.roads}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Roads</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between mb-1">
                <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant="destructive" className="text-xs">
                  {currentScenario.affectedInfrastructure.bridges}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Bridges</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between mb-1">
                <AlertTriangle className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant="destructive" className="text-xs">
                  {currentScenario.affectedInfrastructure.hospitals}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Hospitals</p>
            </div>
            <div className="glass-card p-3">
              <div className="flex items-center justify-between mb-1">
                <Building2 className="w-3.5 h-3.5 text-muted-foreground" />
                <Badge variant="destructive" className="text-xs">
                  {currentScenario.affectedInfrastructure.schools}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">Schools</p>
            </div>
          </div>
        </div>

        {/* Flow Path Details */}
        {currentScenario.flowPath.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-primary" />
              DEM-Based Flow Routing
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              {currentScenario.flowPath.slice(0, 3).map((segment, idx) => (
                <div key={idx} className="glass-card p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold text-foreground">Segment {idx + 1}</span>
                    <Badge variant="outline" className="text-xs">
                      {segment.end[2]} m
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-muted-foreground">Velocity</p>
                      <p className="font-bold text-primary">{segment.velocity} m/s</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">Discharge</p>
                      <p className="font-bold text-water">{segment.volume.toLocaleString()} m³/s</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Affected Settlements */}
        {currentScenario.affectedSettlements.length > 0 && (
          <div className="mt-4 pt-4 border-t border-border/30">
            <h4 className="text-sm font-semibold text-foreground mb-2">Affected Settlements</h4>
            <div className="flex flex-wrap gap-2">
              {currentScenario.affectedSettlements.map((settlement, idx) => (
                <Badge key={idx} variant="destructive" className="text-xs">
                  {settlement}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
