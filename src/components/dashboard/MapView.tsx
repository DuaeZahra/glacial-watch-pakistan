import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { glacialLakes, GlacialLake } from '@/data/lakes';
import { LakeDetailPanel } from './LakeDetailPanel';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN;

export function MapView() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [selectedLake, setSelectedLake] = useState<GlacialLake | null>(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  useEffect(() => {
    if (!mapContainer.current || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/dark-v11',
      center: [74.5, 35.8],
      zoom: 6.5,
      pitch: 45,
      bearing: -10,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    map.current.on('load', () => {
      setMapLoaded(true);

      // Add 3D terrain
      map.current?.addSource('mapbox-dem', {
        type: 'raster-dem',
        url: 'mapbox://mapbox.mapbox-terrain-dem-v1',
        tileSize: 512,
        maxzoom: 14,
      });
      
      map.current?.setTerrain({ source: 'mapbox-dem', exaggeration: 1.5 });

      // Add atmosphere
      map.current?.setFog({
        color: 'hsl(220, 25%, 10%)',
        'high-color': 'hsl(220, 25%, 15%)',
        'horizon-blend': 0.1,
        'space-color': 'hsl(220, 25%, 5%)',
        'star-intensity': 0.3,
      });

      // Add lake markers
      glacialLakes.forEach((lake) => {
        const markerEl = document.createElement('div');
        markerEl.className = `lake-marker ${lake.riskLevel === 'critical' ? 'critical' : lake.riskLevel === 'high' ? 'warning' : ''}`;
        
        const popup = new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          className: 'lake-popup',
        }).setHTML(`
          <div style="background: hsl(220, 20%, 10%); padding: 12px; border-radius: 8px; min-width: 180px;">
            <h3 style="color: hsl(185, 85%, 45%); font-family: 'Orbitron', sans-serif; font-size: 12px; margin-bottom: 8px; font-weight: 600;">${lake.name}</h3>
            <p style="color: hsl(210, 40%, 70%); font-size: 11px; margin-bottom: 6px;">${lake.region}</p>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="color: hsl(210, 40%, 55%); font-size: 10px;">Breach Risk</span>
              <span style="color: ${lake.riskLevel === 'critical' ? 'hsl(0, 85%, 55%)' : lake.riskLevel === 'high' ? 'hsl(35, 95%, 55%)' : 'hsl(185, 85%, 45%)'}; font-weight: 700; font-size: 14px;">${lake.breachProbability}%</span>
            </div>
          </div>
        `);

        const marker = new mapboxgl.Marker({ element: markerEl })
          .setLngLat(lake.coordinates)
          .setPopup(popup)
          .addTo(map.current!);

        markerEl.addEventListener('click', () => {
          setSelectedLake(lake);
        });
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  if (!MAPBOX_TOKEN) {
    return (
      <div className="flex-1 flex items-center justify-center bg-card">
        <div className="text-center p-8 glass-card max-w-md">
          <h3 className="font-display text-lg text-primary mb-2">Mapbox Token Required</h3>
          <p className="text-sm text-muted-foreground">
            Please add your MAPBOX_PUBLIC_TOKEN in the project secrets to enable the interactive map.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 relative">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Map overlay stats */}
      <div className="absolute top-4 left-4 z-10 flex gap-3">
        <div className="glass-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-destructive rounded-full animate-pulse" />
            <span className="text-xs text-muted-foreground">Critical</span>
            <span className="font-display font-bold text-destructive">
              {glacialLakes.filter(l => l.riskLevel === 'critical').length}
            </span>
          </div>
        </div>
        <div className="glass-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-warning rounded-full" />
            <span className="text-xs text-muted-foreground">High</span>
            <span className="font-display font-bold text-warning">
              {glacialLakes.filter(l => l.riskLevel === 'high').length}
            </span>
          </div>
        </div>
        <div className="glass-card px-4 py-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-primary rounded-full" />
            <span className="text-xs text-muted-foreground">Monitored</span>
            <span className="font-display font-bold text-primary">{glacialLakes.length}</span>
          </div>
        </div>
      </div>

      {/* Lake detail panel */}
      <LakeDetailPanel
        lake={selectedLake}
        onClose={() => setSelectedLake(null)}
      />
    </div>
  );
}
