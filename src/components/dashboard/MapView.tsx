import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { glacialLakes, GlacialLake } from '@/data/lakes';
import { LakeDetailPanel } from './LakeDetailPanel';

// Fix for default marker icons in Leaflet with bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Create custom icons for different risk levels
const createCustomIcon = (riskLevel: string) => {
  const color = riskLevel === 'critical' ? '#ef4444' : riskLevel === 'high' ? '#f97316' : '#06b6d4';
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        animation: ${riskLevel === 'critical' ? 'pulse 2s infinite' : 'none'};
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
  });
};

export function MapView() {
  const [selectedLake, setSelectedLake] = useState<GlacialLake | null>(null);

  return (
    <div className="w-full h-full relative">
      <MapContainer
        center={[35.8, 74.5]}
        zoom={7}
        style={{ height: '100%', width: '100%', position: 'absolute', top: 0, left: 0 }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {glacialLakes.map((lake) => (
          <Marker
            key={lake.id}
            position={[lake.coordinates[1], lake.coordinates[0]]}
            icon={createCustomIcon(lake.riskLevel)}
            eventHandlers={{
              click: () => setSelectedLake(lake),
            }}
          >
            <Popup>
              <div style={{ 
                background: 'hsl(220, 20%, 10%)', 
                padding: '12px', 
                borderRadius: '8px', 
                minWidth: '180px',
                color: 'white'
              }}>
                <h3 style={{ 
                  color: 'hsl(185, 85%, 45%)', 
                  fontFamily: "'Orbitron', sans-serif", 
                  fontSize: '12px', 
                  marginBottom: '8px', 
                  fontWeight: 600 
                }}>
                  {lake.name}
                </h3>
                <p style={{ 
                  color: 'hsl(210, 40%, 70%)', 
                  fontSize: '11px', 
                  marginBottom: '6px' 
                }}>
                  {lake.region}
                </p>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center' 
                }}>
                  <span style={{ color: 'hsl(210, 40%, 55%)', fontSize: '10px' }}>
                    Breach Risk
                  </span>
                  <span style={{ 
                    color: lake.riskLevel === 'critical' 
                      ? 'hsl(0, 85%, 55%)' 
                      : lake.riskLevel === 'high' 
                      ? 'hsl(35, 95%, 55%)' 
                      : 'hsl(185, 85%, 45%)', 
                    fontWeight: 700, 
                    fontSize: '14px' 
                  }}>
                    {lake.breachProbability}%
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
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
