import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, AlertTriangle, Mountain, Droplets, ThermometerSun } from 'lucide-react';
import { glacialLakes } from '@/data/lakes';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';

const riskDistribution = [
  { name: 'Critical', value: glacialLakes.filter(l => l.riskLevel === 'critical').length, color: 'hsl(0, 85%, 55%)' },
  { name: 'High', value: glacialLakes.filter(l => l.riskLevel === 'high').length, color: 'hsl(35, 95%, 55%)' },
  { name: 'Moderate', value: glacialLakes.filter(l => l.riskLevel === 'moderate').length, color: 'hsl(45, 95%, 55%)' },
  { name: 'Low', value: glacialLakes.filter(l => l.riskLevel === 'low').length, color: 'hsl(155, 75%, 45%)' },
];

const volumeData = glacialLakes.map(lake => ({
  name: lake.name.split(' ')[0],
  volume: lake.volume,
  area: lake.surfaceArea * 100,
}));

const monthlyAlerts = [
  { month: 'Jul', alerts: 12 },
  { month: 'Aug', alerts: 28 },
  { month: 'Sep', alerts: 35 },
  { month: 'Oct', alerts: 18 },
  { month: 'Nov', alerts: 8 },
  { month: 'Dec', alerts: 15 },
];

export function AnalyticsDashboard() {
  const totalVolume = glacialLakes.reduce((sum, lake) => sum + lake.volume, 0);
  const avgBreachProb = glacialLakes.reduce((sum, lake) => sum + lake.breachProbability, 0) / glacialLakes.length;
  const totalPopAtRisk = glacialLakes.reduce((sum, lake) => sum + lake.downstreamPopulation, 0);

  return (
    <div className="space-y-6">
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Lakes Monitored"
          value={glacialLakes.length.toString()}
          subtitle="Active surveillance"
          icon={Mountain}
          trend="+3 this month"
          trendUp={true}
          color="primary"
        />
        <StatCard
          title="Total Water Volume"
          value={`${totalVolume.toFixed(1)}M`}
          subtitle="Cubic meters"
          icon={Droplets}
          trend="+8.2% from last year"
          trendUp={true}
          color="water"
        />
        <StatCard
          title="Avg Breach Risk"
          value={`${avgBreachProb.toFixed(0)}%`}
          subtitle="Across all lakes"
          icon={AlertTriangle}
          trend="-2.1% from last month"
          trendUp={false}
          color="warning"
        />
        <StatCard
          title="Population at Risk"
          value={`${(totalPopAtRisk / 1000).toFixed(0)}K`}
          subtitle="Downstream residents"
          icon={ThermometerSun}
          trend="5 districts"
          trendUp={null}
          color="destructive"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Risk Distribution */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-6"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
            Risk Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={riskDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {riskDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 20%, 10%)',
                    border: '1px solid hsl(220, 20%, 18%)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(210, 40%, 96%)' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-4">
            {riskDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ background: item.color }} />
                <span className="text-xs text-muted-foreground">{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Volume Comparison */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
            Lake Volume Comparison
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={volumeData} layout="vertical">
                <XAxis type="number" hide />
                <YAxis
                  type="category"
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                  width={70}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 20%, 10%)',
                    border: '1px solid hsl(220, 20%, 18%)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(210, 40%, 96%)' }}
                  formatter={(value: number) => [`${value}M m³`, 'Volume']}
                />
                <Bar dataKey="volume" fill="hsl(185, 85%, 45%)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Alert Trend */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6"
        >
          <h3 className="font-display text-sm font-semibold text-foreground mb-4 tracking-wide">
            Alert Frequency
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyAlerts}>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: 'hsl(215, 20%, 55%)', fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    background: 'hsl(220, 20%, 10%)',
                    border: '1px solid hsl(220, 20%, 18%)',
                    borderRadius: '8px',
                  }}
                  itemStyle={{ color: 'hsl(210, 40%, 96%)' }}
                />
                <Line
                  type="monotone"
                  dataKey="alerts"
                  stroke="hsl(35, 95%, 55%)"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(35, 95%, 55%)', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Lakes Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass-card overflow-hidden"
      >
        <div className="p-6 border-b border-border/30">
          <h3 className="font-display text-sm font-semibold text-foreground tracking-wide">
            All Monitored Lakes
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-secondary/30">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Lake</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Region</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Area</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Volume</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Risk</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {glacialLakes.map((lake) => (
                <tr key={lake.id} className="hover:bg-secondary/20 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-foreground">{lake.name}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-muted-foreground">{lake.region}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-foreground">{lake.surfaceArea} km²</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className="text-sm text-foreground">{lake.volume}M m³</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <span className={`text-sm font-bold ${
                      lake.breachProbability >= 70 ? 'text-destructive' :
                      lake.breachProbability >= 50 ? 'text-warning' : 'text-primary'
                    }`}>
                      {lake.breachProbability}%
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      lake.riskLevel === 'critical' ? 'bg-destructive/20 text-destructive' :
                      lake.riskLevel === 'high' ? 'bg-warning/20 text-warning' :
                      lake.riskLevel === 'moderate' ? 'bg-primary/20 text-primary' :
                      'bg-success/20 text-success'
                    }`}>
                      {lake.riskLevel.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ElementType;
  trend: string;
  trendUp: boolean | null;
  color: 'primary' | 'water' | 'warning' | 'destructive';
}

function StatCard({ title, value, subtitle, icon: Icon, trend, trendUp, color }: StatCardProps) {
  const colorClasses = {
    primary: 'text-primary bg-primary/10 border-primary/30',
    water: 'text-water bg-water/10 border-water/30',
    warning: 'text-warning bg-warning/10 border-warning/30',
    destructive: 'text-destructive bg-destructive/10 border-destructive/30',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-5"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">{title}</p>
          <p className={`font-display text-3xl font-bold mt-2 ${colorClasses[color].split(' ')[0]}`}>
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        </div>
        <div className={`p-3 rounded-lg border ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1">
        {trendUp !== null && (
          trendUp ? (
            <TrendingUp className="w-4 h-4 text-success" />
          ) : (
            <TrendingDown className="w-4 h-4 text-destructive" />
          )
        )}
        <span className="text-xs text-muted-foreground">{trend}</span>
      </div>
    </motion.div>
  );
}
