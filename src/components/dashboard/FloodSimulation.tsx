import { useState, Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Environment, useTexture, Html, Float } from '@react-three/drei';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Users, Home, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { floodSimulationData } from '@/data/lakes';
import * as THREE from 'three';

function Terrain() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Create terrain geometry
  const geometry = new THREE.PlaneGeometry(20, 20, 64, 64);
  const positions = geometry.attributes.position;
  
  for (let i = 0; i < positions.count; i++) {
    const x = positions.getX(i);
    const y = positions.getY(i);
    
    // Create mountain-like terrain
    let z = Math.sin(x * 0.3) * Math.cos(y * 0.3) * 2;
    z += Math.sin(x * 0.5 + 1) * Math.cos(y * 0.4) * 1.5;
    z += (Math.random() - 0.5) * 0.3;
    
    // Create a valley in the center
    const distFromCenter = Math.sqrt(x * x + y * y);
    z -= Math.max(0, 2 - distFromCenter * 0.3);
    
    positions.setZ(i, z);
  }
  
  geometry.computeVertexNormals();

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <primitive object={geometry} />
      <meshStandardMaterial
        color="hsl(220, 20%, 12%)"
        roughness={0.9}
        metalness={0.1}
        flatShading
      />
    </mesh>
  );
}

function FloodWater({ progress }: { progress: number }) {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.position.y = -2 + progress * 0.5;
      const material = meshRef.current.material as THREE.MeshStandardMaterial;
      material.opacity = 0.4 + progress * 0.3;
    }
  });

  const scale = 0.5 + progress * 3;

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]}>
      <circleGeometry args={[scale, 64]} />
      <meshStandardMaterial
        color="hsl(200, 85%, 50%)"
        transparent
        opacity={0.6}
        roughness={0.1}
        metalness={0.8}
      />
    </mesh>
  );
}

function GlacierLake() {
  return (
    <Float speed={0.5} rotationIntensity={0} floatIntensity={0.2}>
      <mesh position={[0, 0.5, 0]}>
        <sphereGeometry args={[1.5, 32, 32]} />
        <meshStandardMaterial
          color="hsl(185, 85%, 45%)"
          transparent
          opacity={0.8}
          roughness={0.1}
          metalness={0.5}
          emissive="hsl(185, 85%, 30%)"
          emissiveIntensity={0.5}
        />
      </mesh>
    </Float>
  );
}

function Scene({ progress }: { progress: number }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
      <pointLight position={[0, 5, 0]} intensity={0.5} color="hsl(185, 85%, 45%)" />
      
      <Terrain />
      <GlacierLake />
      <FloodWater progress={progress} />
      
      <OrbitControls
        enablePan={false}
        minDistance={8}
        maxDistance={25}
        maxPolarAngle={Math.PI / 2.2}
      />
      <Environment preset="night" />
    </>
  );
}

export function FloodSimulation() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeIndex, setTimeIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  const scenarios = floodSimulationData.scenarios;
  const currentScenario = scenarios[timeIndex];

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 1) {
            setTimeIndex(i => (i + 1) % scenarios.length);
            return 0;
          }
          return prev + 0.02;
        });
      }, 50);
      
      setTimeout(() => clearInterval(interval), 5000);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setTimeIndex(0);
    setProgress(0);
  };

  const handleTimeChange = (value: number[]) => {
    setTimeIndex(value[0]);
    setProgress(value[0] / (scenarios.length - 1));
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="font-display text-xl font-semibold text-foreground tracking-wide">
            Flood Path Simulation
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            {floodSimulationData.lakeName} - Breach Scenario
          </p>
        </div>
      </div>

      {/* 3D View */}
      <div className="flex-1 rounded-xl overflow-hidden glass-card relative">
        <Canvas
          camera={{ position: [12, 8, 12], fov: 50 }}
          shadows
          className="bg-background"
        >
          <Suspense fallback={null}>
            <Scene progress={timeIndex / 2 + progress / 2} />
          </Suspense>
        </Canvas>

        {/* Overlay info */}
        <div className="absolute top-4 left-4 glass-card p-3">
          <p className="text-xs text-muted-foreground mb-1">Simulation Time</p>
          <p className="font-display text-2xl font-bold text-primary">
            {currentScenario.time}
          </p>
        </div>

        <div className="absolute top-4 right-4 space-y-2">
          <div className="glass-card p-3 flex items-center gap-2">
            <Home className="w-4 h-4 text-warning" />
            <span className="text-sm font-medium text-foreground">
              {currentScenario.affectedSettlements.length} Settlements
            </span>
          </div>
          <div className="glass-card p-3 flex items-center gap-2">
            <Users className="w-4 h-4 text-destructive" />
            <span className="text-sm font-medium text-foreground">
              {currentScenario.affectedPopulation.toLocaleString()} at risk
            </span>
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
              {scenarios.map((s, i) => (
                <span key={i} className={i === timeIndex ? 'text-primary font-medium' : ''}>
                  {s.time}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/30">
          <div>
            <p className="text-xs text-muted-foreground">Affected Area</p>
            <p className="font-display text-lg font-bold text-primary">
              {currentScenario.affectedArea} km²
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Flood Depth</p>
            <p className="font-display text-lg font-bold text-water">
              {currentScenario.floodDepth} m
            </p>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Settlements</p>
            <p className="font-display text-lg font-bold text-warning">
              {currentScenario.affectedSettlements.join(', ')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
