import { motion, AnimatePresence } from 'framer-motion';
import { X, Droplets, Mountain, AlertTriangle, Users, MapPin, Calendar } from 'lucide-react';
import { GlacialLake } from '@/data/lakes';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { RiskGauge } from './RiskGauge';

interface LakeDetailPanelProps {
  lake: GlacialLake | null;
  onClose: () => void;
}

export function LakeDetailPanel({ lake, onClose }: LakeDetailPanelProps) {
  if (!lake) return null;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'critical': return 'text-destructive';
      case 'high': return 'text-warning';
      case 'moderate': return 'text-primary';
      default: return 'text-success';
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: '100%', opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: '100%', opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="absolute top-0 right-0 h-full w-96 glass-card border-l border-border/50 overflow-y-auto scrollbar-thin z-20"
      >
        {/* Header */}
        <div className="sticky top-0 p-4 border-b border-border/30 bg-card/90 backdrop-blur-xl z-10">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="font-display text-lg font-semibold text-primary tracking-wide">
                {lake.name}
              </h2>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <MapPin className="w-3 h-3" />
                {lake.region}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>
        </div>

        <div className="p-4 space-y-6">
          {/* Risk Gauge */}
          <div className="flex flex-col items-center py-4">
            <p className="text-xs text-muted-foreground mb-3 uppercase tracking-widest">Breach Probability</p>
            <RiskGauge value={lake.breachProbability} />
            <p className={`mt-3 font-display text-sm font-bold uppercase tracking-wider ${getRiskColor(lake.riskLevel)}`}>
              {lake.riskLevel} Risk
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              icon={Droplets}
              label="Surface Area"
              value={`${lake.surfaceArea}`}
              unit="km²"
              color="text-water"
            />
            <StatCard
              icon={Mountain}
              label="Volume"
              value={`${lake.volume}`}
              unit="M m³"
              color="text-glacier"
            />
            <StatCard
              icon={AlertTriangle}
              label="Elevation"
              value={`${lake.elevation}`}
              unit="m"
              color="text-primary"
            />
            <StatCard
              icon={Users}
              label="At Risk"
              value={`${(lake.downstreamPopulation / 1000).toFixed(1)}k`}
              unit="people"
              color="text-warning"
            />
          </div>

          {/* Expansion Chart */}
          <div className="glass-panel p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-medium text-foreground">Expansion Rate</h3>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                Last 12 months
              </span>
            </div>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={lake.expansionData}>
                  <defs>
                    <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(185, 85%, 45%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(185, 85%, 45%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 10 }}
                    domain={['dataMin - 0.05', 'dataMax + 0.05']}
                    tickFormatter={(v) => `${v}`}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'hsl(220, 20%, 10%)',
                      border: '1px solid hsl(220, 20%, 18%)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
                    }}
                    labelStyle={{ color: 'hsl(185, 85%, 45%)', fontFamily: 'Orbitron', fontSize: 11 }}
                    itemStyle={{ color: 'hsl(210, 40%, 96%)' }}
                    formatter={(value: number) => [`${value} km²`, 'Area']}
                  />
                  <Area
                    type="monotone"
                    dataKey="area"
                    stroke="hsl(185, 85%, 45%)"
                    strokeWidth={2}
                    fill="url(#areaGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Nearest Settlement */}
          <div className="glass-panel p-4">
            <h3 className="text-sm font-medium text-foreground mb-3">Downstream Impact</h3>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground">Nearest Settlement</p>
                <p className="text-sm font-medium text-foreground">{lake.nearestSettlement}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Population at Risk</p>
                <p className="font-display text-lg font-bold text-warning">
                  {lake.downstreamPopulation.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Last Updated */}
          <div className="text-center py-2">
            <p className="text-xs text-muted-foreground">
              Last satellite update: {new Date(lake.lastUpdated).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  unit: string;
  color: string;
}

function StatCard({ icon: Icon, label, value, unit, color }: StatCardProps) {
  return (
    <div className="glass-panel p-3">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className={`font-display text-xl font-bold ${color}`}>{value}</span>
        <span className="text-xs text-muted-foreground">{unit}</span>
      </div>
    </div>
  );
}
